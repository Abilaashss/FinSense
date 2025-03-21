# api/tasks.py
import os
from celery import shared_task
from django.conf import settings
from .models import VideoSubmission, Transcription, FormData
from .services.audio_extractor import AudioExtractor
from .services.transcription import WhisperTranscriptionService
from .services.translation import IndicTranslationService
from .services.text_analysis import LlamaAnalysisService
from .forms_schema import get_form_schema

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def process_video_submission(self, video_id, form_type='personal_info'):
    """
    Process a video submission asynchronously with status tracking
    """
    try:
        # Get the video submission
        video_submission = VideoSubmission.objects.get(id=video_id)
        
        # Update status to processing
        video_submission.status = VideoSubmission.STATUS_PROCESSING
        video_submission.save(update_fields=['status'])
        
        # Get the video file path
        video_path = os.path.join(settings.MEDIA_ROOT, video_submission.video_file.name)
        
        # 1. Extract audio from video
        audio_extractor = AudioExtractor()
        audio_path = audio_extractor.extract_audio(video_path)
        
        # Update the video submission with the audio path
        video_submission.audio_file = audio_path
        video_submission.save(update_fields=['audio_file'])
        
        # 2. Transcribe the audio
        transcription_service = WhisperTranscriptionService()
        transcript_text, detected_language = transcription_service.transcribe(audio_path)
        
        # Save the transcription
        transcription = Transcription.objects.create(
            video=video_submission,
            text=transcript_text,
            language=detected_language
        )
        
        # 3. Translate if needed (if not in English)
        if detected_language != 'en':
            translation_service = IndicTranslationService()
            translated_text = translation_service.translate(
                transcript_text, 
                source_lang=detected_language,
                target_lang='en'
            )
        else:
            translated_text = transcript_text
        
        # 4. Get the appropriate form schema
        form_schema = get_form_schema(form_type)
        
        # 5. Extract form data using Llama
        analysis_service = LlamaAnalysisService()
        form_data_json = analysis_service.extract_form_data(
            translated_text,
            form_schema=form_schema
        )
        
        # Add metadata to the form data
        form_data_json['form_type'] = form_type
        form_data_json['original_language'] = detected_language
        
        # 6. Save the form data
        form_data = FormData.objects.create(
            video=video_submission,
            json_data=form_data_json
        )
        
        # Update status to completed
        video_submission.status = VideoSubmission.STATUS_COMPLETED
        video_submission.save(update_fields=['status'])
        
        return str(video_submission.id)
        
    except Exception as e:
        # Log the error
        error_message = f"Error processing video: {str(e)}"
        print(error_message)
        
        # Update video status to failed if this is the final retry
        if self.request.retries >= self.max_retries:
            VideoSubmission.objects.filter(id=video_id).update(
                status=VideoSubmission.STATUS_FAILED,
                error_message=error_message
            )
        
        # Retry the task
        raise self.retry(exc=e)
