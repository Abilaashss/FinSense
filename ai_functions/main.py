import cv2
import face_recognition
import numpy as np
import csv
from datetime import datetime
import os

def load_face_encodings_from_csv(csv_filename):
    known_faces = []
    known_names = []
    
    with open(csv_filename, 'r') as csvfile:
        reader = csv.reader(csvfile)
        header = next(reader)  # Skip header row if present
        
        for row in reader:
            if row:
                name = row[0]
                # Convert the remaining columns to a numpy array of floats
                encoding = np.array([float(value) for value in row[1:]])
                known_faces.append(encoding)
                known_names.append(name)
                
    print(f"Loaded {len(known_faces)} face encodings from {csv_filename}")
    return known_faces, known_names

# Capture a frame from the camera
def capture_frame():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open camera.")
        return None
    cv2.waitKey(2000)
    ret, frame = cap.read()
    cap.release()
    if not ret:
        print("Error: Could not capture frame.")
        return None
    
    cv2.imshow('Captured Frame', frame)
    cv2.waitKey(2000)  # Wait for 2 seconds (2000 milliseconds)
    cv2.destroyAllWindows()
    
    print(f"Captured frame shape: {frame.shape}")
    return frame

def recognize_faces(frame, known_faces, known_names):
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    print(f"RGB frame shape: {rgb_frame.shape}")
    
    face_locations = face_recognition.face_locations(rgb_frame)
    print(f"Detected {len(face_locations)} faces")
    
    if not face_locations:
        print("No faces detected in the frame.")
        return []

    try:
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
        print(f"Generated {len(face_encodings)} face encodings")
    except Exception as e:
        print(f"Error during face encoding: {e}")
        print(f"Face locations: {face_locations}")
        return []

    recognized_names = []

    for face_encoding in face_encodings:
        try:
            matches = face_recognition.compare_faces(known_faces, face_encoding)
            print(f"Face comparison results: {matches}")
            
            face_distances = face_recognition.face_distance(known_faces, face_encoding)
            best_match_index = np.argmin(face_distances)
            
            if matches[best_match_index]:
                name = known_names[best_match_index]
                print(f"Best match: {name} (distance: {face_distances[best_match_index]})")
                if name not in recognized_names:
                    recognized_names.append(name)
            else:
                print(f"No match found. Closest distance: {face_distances[best_match_index]}")
        except Exception as e:
            print(f"Error during face comparison: {e}")
    
    return recognized_names

# Mark attendance in a CSV file
def mark_attendance(names):
    now = datetime.now()
    date_string = now.strftime("%Y-%m-%d")
    time_string = now.strftime("%H:%M:%S")
    
    filename = f"{date_string}.csv"

    for name in names:
        attendance_exists = False

        if os.path.isfile(filename):
            with open(filename, 'r') as file:
                reader = csv.reader(file)
                for row in reader:
                    if row and row[0] == name:
                        attendance_exists = True
                        print(f"Attendance for {name} already marked today.")
                        break
        
        if not attendance_exists:
            with open(filename, 'a', newline='') as file:
                writer = csv.writer(file)
                if os.stat(filename).st_size == 0:
                    writer.writerow(["Name", "Time"])
                writer.writerow([name, time_string])
            print(f"Marked attendance for {name} at {time_string}")

# Main function to run the program
def main():
    known_faces_file = "face_encodings.csv"
    
    if not os.path.exists(known_faces_file):
        print(f"Error: File '{known_faces_file}' does not exist.")
        return
    
    # Load known faces from CSV
    known_faces, known_names = load_face_encodings_from_csv(known_faces_file)
    
    if not known_faces:
        print("Error: No known faces loaded. Please check the 'face_encodings.csv' file.")
        return
    
    # Capture a single frame and perform detection
    frame = capture_frame()
    
    if frame is None:
        print("Error: Failed to capture frame from camera.")
        return

    recognized_names = recognize_faces(frame, known_faces, known_names)
    
    if recognized_names:
        print(f"Recognized: {', '.join(recognized_names)}")
        mark_attendance(recognized_names)
    else:
        print("No faces recognized during recognition.")

if __name__ == "__main__":
    main()
    
