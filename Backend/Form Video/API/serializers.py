# api/serializers.py
from rest_framework import serializers
from .models import VideoSubmission, Transcription, FormData

class VideoSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoSubmission
        fields = ['id', 'video_file', 'created_at']
        read_only_fields = ['id', 'created_at']

class TranscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transcription
        fields = ['id', 'video', 'text', 'language', 'created_at']
        read_only_fields = ['id', 'created_at']

class FormDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormData
        fields = ['id', 'video', 'json_data', 'created_at']
        read_only_fields = ['id', 'created_at']

class VideoSubmissionResponseSerializer(serializers.ModelSerializer):
    transcription = TranscriptionSerializer(read_only=True)
    form_data = FormDataSerializer(read_only=True)
    
    class Meta:
        model = VideoSubmission
        fields = ['id', 'video_file', 'status', 'created_at', 'transcription', 'form_data']
        read_only_fields = ['id', 'created_at', 'status', 'transcription', 'form_data']
