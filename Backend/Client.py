import requests
import time

def upload_video_and_get_form_data(video_path, form_type='personal_info'):
    # Upload video
    files = {'video_file': open(video_path, 'rb')}
    data = {'form_type': form_type}
    response = requests.post('http://localhost:8000/api/videos/', files=files, data=data)
    
    if response.status_code != 202:
        print(f"Upload failed: {response.text}")
        return None
    
    video_id = response.json()['id']
    print(f"Video uploaded successfully. ID: {video_id}")
    
    # Poll for processing completion
    while True:
        status_response = requests.get(f'http://localhost:8000/api/videos/{video_id}/status/')
        status_data = status_response.json()
        
        if status_data['status'] == 'completed':
            print("Processing completed!")
            break
        elif status_data['status'] == 'failed':
            print(f"Processing failed: {status_data['error_message']}")
            return None
        
        print(f"Current status: {status_data['status']}. Waiting...")
        time.sleep(5)  # Wait for 5 seconds before checking again
    
    # Get the form data
    if status_data['form_data_available']:
        return status_data['form_data']
    else:
        print("Form data not available")
        return None

# Example usage
form_data = upload_video_and_get_form_data('path/to/your/video.mp4', 'job_application')
print("Extracted form data:", form_data)
