# api/services/audio_extractor.py
import os
import uuid
import ffmpeg
from django.conf import settings

class AudioExtractor:
    @staticmethod
    def extract_audio(video_path):
        """Extract audio from video file and save it"""
        
        # Get the filename without extension
        filename = os.path.basename(video_path).split('.')[0]
        
        # Create audio output path
        output_dir = os.path.join(settings.MEDIA_ROOT, 'audio', 'extracted')
        os.makedirs(output_dir, exist_ok=True)
        
        # Generate unique output file path
        output_path = os.path.join(output_dir, f"{filename}_{uuid.uuid4().hex}.mp3")
        
        try:
            # Use ffmpeg to extract audio
            (
                ffmpeg
                .input(video_path)
                .output(output_path, acodec='libmp3lame', ac=1, ar='16000')
                .run(quiet=True, overwrite_output=True)
            )
            
            # Return the relative path from MEDIA_ROOT
            rel_path = os.path.relpath(output_path, settings.MEDIA_ROOT)
            return rel_path
        
        except ffmpeg.Error as e:
            print(f"Error extracting audio: {e.stderr.decode() if e.stderr else str(e)}")
            raise
