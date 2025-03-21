# api/views.py
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import VideoSubmission
from .serializers import VideoSubmissionSerializer, VideoSubmissionResponseSerializer
from .tasks import process_video_submission

class VideoSubmissionView(generics.CreateAPIView):
    queryset = VideoSubmission.objects.all()
    serializer_class = VideoSubmissionSerializer
    
    def create(self, request, *args, **kwargs):
        # Get form type from request data (default to personal_info)
        form_type = request.data.get('form_type', 'personal_info')
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Save the video submission
        video_submission = serializer.save()
        
        # Process the video in the background
        process_video_submission.delay(str(video_submission.id), form_type)
        
        # Return a response immediately
        return Response({
            'id': video_submission.id,
            'message': 'Video submitted successfully. Processing has started.',
            'status': 'processing'
        }, status=status.HTTP_202_ACCEPTED)

class VideoSubmissionDetailView(generics.RetrieveAPIView):
    queryset = VideoSubmission.objects.all()
    serializer_class = VideoSubmissionResponseSerializer

class VideoProcessingStatusView(APIView):
    def get(self, request, pk, format=None):
        try:
            video = VideoSubmission.objects.get(pk=pk)
            
            # Check if form data is available
            form_data = None
            if hasattr(video, 'form_data'):
                form_data = video.form_data.json_data
            
            # Return status information
            return Response({
                'id': video.id,
                'status': video.status,
                'created_at': video.created_at,
                'updated_at': video.updated_at,
                'error_message': video.error_message,
                'form_data_available': form_data is not None,
                'form_data': form_data
            })
            
        except VideoSubmission.DoesNotExist:
            return Response(
                {'error': 'Video submission not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
