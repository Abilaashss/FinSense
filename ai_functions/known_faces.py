import face_recognition
import os
import csv
import numpy as np

def save_face_encodings_to_csv(directory, csv_filename):
    known_faces = []
    known_names = []
    
    with open(csv_filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['Name'] + [f'Feature_{i}' for i in range(128)])  # Assuming 128-dimensional encoding
        
        for filename in os.listdir(directory):
            if filename.endswith((".jpg", ".jpeg", ".png")):
                try:
                    image = face_recognition.load_image_file(os.path.join(directory, filename))
                    encodings = face_recognition.face_encodings(image)
                    
                    if encodings:
                        # Use the first encoding (assuming one face per image)
                        encoding = encodings[0]
                        name = os.path.splitext(filename)[0]
                        
                        # Write name and encoding to CSV
                        writer.writerow([name] + encoding.tolist())
                        
                        known_faces.append(encoding)
                        known_names.append(name)
                        print(f"Processed and saved encoding for: {filename}")
                    else:
                        print(f"No faces found in image: {filename}")
                
                except Exception as e:
                    print(f"Error processing {filename}: {e}")

    print(f"Saved {len(known_faces)} face encodings to {csv_filename}")
    return known_faces, known_names

# Example usage
directory = 'known_faces'  # Directory with images
csv_filename = 'face_encodings.csv'  # Output CSV file
save_face_encodings_to_csv(directory, csv_filename)
