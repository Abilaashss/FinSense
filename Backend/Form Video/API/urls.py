# api/urls.py
from django.urls import path
from .views import (
    VideoSubmissionView, 
    VideoSubmissionDetailView, 
    VideoProcessingStatusView
)

urlpatterns = [
    path('videos/', VideoSubmissionView.as_view(), name='video-upload'),
    path('videos/<uuid:pk>/', VideoSubmissionDetailView.as_view(), name='video-detail'),
    path('videos/<uuid:pk>/status/', VideoProcessingStatusView.as_view(), name='video-status'),
]
