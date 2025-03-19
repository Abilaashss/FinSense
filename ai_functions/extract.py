import cv2
import numpy as np
import pytesseract
from pytesseract import Output
import re
import json
import os
import time
import shutil
from datetime import datetime

class DocumentVerifier:
    def __init__(self):

        tesseract_path = shutil.which('tesseract')
        if tesseract_path:
            pytesseract.pytesseract.tesseract_cmd = tesseract_path
        else:

            if os.path.exists('/usr/bin/tesseract'):
                pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract'
            elif os.path.exists('/usr/local/bin/tesseract'):
                pytesseract.pytesseract.tesseract_cmd = r'/usr/local/bin/tesseract'
            elif os.path.exists('C:\\Program Files\\Tesseract-OCR\\tesseract.exe'):
                pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
            else:
                print("Tesseract not found. Please install it or specify the path manually.")

        self.card_types = {
            'aadhaar': {
                'patterns': [
                    r'\d{4}\s?\d{4}\s?\d{4}',  # Aadhaar number pattern (e.g., 1234 5678 9012 or 123456789012)
                    r'(?i)government of india',
                    r'(?i)aadhaar',
                    r'(?i)unique identification',
                    r'(?i)uid'
                ],
                'extract_fields': {
                    'aadhaar_number': r'\d{4}\s?\d{4}\s?\d{4}',
                    'name': r'(?i)name\s*:?\s*([^\n]+)',
                    'dob': r'(?i)dob\s*:?\s*([^\n]+)|(?i)date of birth\s*:?\s*([^\n]+)|(?i)year of birth\s*:?\s*([^\n]+)',
                    'gender': r'(?i)gender\s*:?\s*([^\n]+)|(?i)male|(?i)female',
                }
            },
            'pan': {
                'patterns': [
                    r'[A-Z]{5}[0-9]{4}[A-Z]{1}',  # PAN card pattern (e.g., ABCDE1234F)
                    r'(?i)income tax',
                    r'(?i)permanent account',
                    r'(?i)PAN'
                ],
                'extract_fields': {
                    'pan_number': r'[A-Z]{5}[0-9]{4}[A-Z]{1}',
                    'name': r'(?i)name\s*:?\s*([^\n]+)',
                    'father_name': r'(?i)father[\']?s name\s*:?\s*([^\n]+)',
                    'dob': r'(?i)date of birth\s*:?\s*([^\n]+)|(?i)dob\s*:?\s*([^\n]+)',
                }
            }
        }
        self.output_dir = 'extracted_documents'
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Debug directory
        self.debug_dir = 'debug_images'
        os.makedirs(self.debug_dir, exist_ok=True)

    def detect_document_type(self, text):
        """Detect the type of document based on the text content with looser matching"""
        # First check for Aadhaar card
        aadhaar_score = 0
        for pattern in self.card_types['aadhaar']['patterns']:
            if re.search(pattern, text, re.IGNORECASE):
                aadhaar_score += 1
        
        # Then check for PAN card
        pan_score = 0
        for pattern in self.card_types['pan']['patterns']:
            if re.search(pattern, text, re.IGNORECASE):
                pan_score += 1
        
        # Return the document type with the highest score
        if aadhaar_score > 0 and aadhaar_score >= pan_score:
            return 'aadhaar'
        elif pan_score > 0:
            return 'pan'
        
        return None

    def extract_information(self, text, doc_type):
        """Extract relevant information based on document type"""
        if doc_type not in self.card_types:
            return None
        
        extraction_patterns = self.card_types[doc_type]['extract_fields']
        extracted_info = {}
        
        for field, pattern in extraction_patterns.items():
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                if match.groups():
                    # Get the first non-None group
                    group_value = next((g for g in match.groups() if g is not None), "")
                    extracted_info[field] = group_value.strip()
                else:
                    extracted_info[field] = match.group(0).strip()
        
        return extracted_info

    def preprocess_image(self, image):
        """Enhanced preprocessing for better OCR results"""
        # Original image for debugging
        debug_original = image.copy()
        
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Save grayscale for debugging
        debug_gray = gray.copy()
        
        # Apply adaptive thresholding instead of global
        binary = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                      cv2.THRESH_BINARY, 11, 2)
        
        # Save binary image for debugging
        debug_binary = binary.copy()
        
        # Noise removal
        kernel = np.ones((1, 1), np.uint8)
        processed = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel, iterations=1)
        
        # Add contrast enhancement
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        contrast_enhanced = clahe.apply(gray)
        
        # Save all debug images
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        cv2.imwrite(f"{self.debug_dir}/original_{timestamp}.jpg", debug_original)
        cv2.imwrite(f"{self.debug_dir}/gray_{timestamp}.jpg", debug_gray)
        cv2.imwrite(f"{self.debug_dir}/binary_{timestamp}.jpg", debug_binary)
        cv2.imwrite(f"{self.debug_dir}/processed_{timestamp}.jpg", processed)
        cv2.imwrite(f"{self.debug_dir}/contrast_{timestamp}.jpg", contrast_enhanced)
        
        return processed, contrast_enhanced

    def save_to_file(self, data, doc_type):
        """Save extracted information to a file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{self.output_dir}/{doc_type}_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(data, f, indent=4)
        
        return filename

    def run_verification(self):
        """Main function to run the document verification system"""
        cap = cv2.VideoCapture(0)
        
        if not cap.isOpened():
            print("Error: Could not open webcam")
            return
        
        print("Document Verification System")
        print("---------------------------")
        print("Instructions:")
        print("1. Hold your Aadhaar or PAN card in front of the camera")
        print("2. Press 'c' to capture the image")
        print("3. Press 'd' to toggle debug mode")
        print("4. Press 'q' to quit")
        
        debug_mode = False
        
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Failed to grab frame")
                break
            
            # Display the frame
            display_frame = frame.copy()
            
            # Add instructions to the display
            cv2.putText(display_frame, "Press 'c' to capture", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            
            if debug_mode:
                cv2.putText(display_frame, "DEBUG MODE ON", (display_frame.shape[1] - 180, 30), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            
            cv2.imshow('Document Verification', display_frame)
            
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                break
            elif key == ord('d'):
                debug_mode = not debug_mode
                print(f"Debug mode {'enabled' if debug_mode else 'disabled'}")
            elif key == ord('c'):
                # Capture and process the image
                print("\nProcessing document...")
                
                # Add visual feedback
                cv2.putText(display_frame, "CAPTURING...", (display_frame.shape[1]//2 - 80, display_frame.shape[0]//2), 
                           cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                cv2.imshow('Document Verification', display_frame)
                cv2.waitKey(500)  # Show capturing message
                
                # Preprocess the image
                processed_image, contrast_image = self.preprocess_image(frame)
                
                # Try multiple preprocessing methods for OCR
                texts = []
                
                # Try with processed image
                text1 = pytesseract.image_to_string(
                    processed_image,
                    config='--psm 11 --oem 3'
                )
                texts.append(text1)
                
                # Try with contrast enhanced image
                text2 = pytesseract.image_to_string(
                    contrast_image,
                    config='--psm 3 --oem 3'
                )
                texts.append(text2)
                
                # Combine texts
                text = "\n".join(texts)
                
                # Print the extracted text for debugging
                if debug_mode:
                    print("Extracted text:")
                    print(text)
                
                # Detect document type
                doc_type = self.detect_document_type(text)
                
                if doc_type:
                    print(f"Detected document type: {doc_type.upper()}")
                    
                    # Draw a green rectangle around the frame for visual feedback
                    cv2.rectangle(display_frame, (10, 10), (display_frame.shape[1]-10, display_frame.shape[0]-10), (0, 255, 0), 3)
                    cv2.putText(display_frame, f"Detected: {doc_type.upper()}", (20, 60), 
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                    cv2.imshow('Document Verification', display_frame)
                    cv2.waitKey(1000)  # Show detection feedback
                    
                    # Extract information
                    extracted_info = self.extract_information(text, doc_type)
                    
                    if extracted_info:
                        # Save to file
                        filename = self.save_to_file(extracted_info, doc_type)
                        print(f"Information extracted and saved to {filename}")
                        print("Extracted information:")
                        for key, value in extracted_info.items():
                            print(f"  {key}: {value}")
                    else:
                        print("Could not extract information from the document.")
                        print("Try holding the document closer to the camera or ensure better lighting.")
                else:
                    print("Could not identify the document type. Please try again.")
                    print("Try holding the document closer to the camera or ensure better lighting.")
                    
                    # Save failed detection image for debugging
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    cv2.imwrite(f"{self.debug_dir}/failed_detection_{timestamp}.jpg", frame)
                    
                    # Display red feedback for failed detection
                    cv2.rectangle(display_frame, (10, 10), (display_frame.shape[1]-10, display_frame.shape[0]-10), (0, 0, 255), 3)
                    cv2.putText(display_frame, "Not Detected", (20, 60), 
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                    cv2.imshow('Document Verification', display_frame)
                    cv2.waitKey(1000)  # Show the failed detection for 1 second
                
                print("\nReady for next capture. Press 'c' to capture or 'q' to quit.")
        
        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    verifier = DocumentVerifier()
    verifier.run_verification()