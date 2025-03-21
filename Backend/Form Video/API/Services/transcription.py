# api/services/transcription.py
import os
import openai
from django.conf import settings

class WhisperTranscriptionService:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
    
    def transcribe(self, audio_path, language=None):
        """
        Transcribe audio using OpenAI Whisper API
        
        Parameters:
        audio_path (str): Path to the audio file
        language (str, optional): ISO language code
        
        Returns:
        tuple: (text, detected_language)
        """
        try:
            full_path = os.path.join(settings.MEDIA_ROOT, audio_path)
            
            with open(full_path, "rb") as audio_file:
                params = {
                    "file": audio_file,
                    "model": "whisper-1",
                    "response_format": "json"
                }
                
                if language:
                    params["language"] = language
                
                response = openai.Audio.transcribe(**params)
            
            # Extract text and language
            transcription_text = response.get('text', '')
            detected_language = response.get('language', 'unknown')
            
            return transcription_text, detected_language
            
        except Exception as e:
            print(f"Error during transcription: {e}")
            raise
