import streamlit as st
import time
from PIL import Image
import json
import datetime

# Dummy JSON and intermediate OCR text for demonstration
intermediate_text = {
    '<OCR>': 'भारती संस्कीर-GOVERNMENT OF INDIA-मिलेस रहिNilesh SinghSAMPLEजनम शिूरी / DOB : 01/08/1985पुकर Male4444 3333 2222आधाय - आप अादमी | का अधि को'
}
final_json_output = {
    "document_type": "Aadhar",
    "document_id": "4444 3333 2222",
    "name": "Nilesh Singh",
    "dob": "01/08/1985",
    "gender": "M",
    "address": None,
    "mobile": None,
    "doi": None,
    "doe": None,
    "place_of_issue": None
}

# Function to simulate and track time for each step with print statements for networking/processing
def time_step(step_name, duration=2):
    print(f"Starting: {step_name}")
    with st.spinner(f"{step_name}..."):
        start_time = time.time()
        time.sleep(duration)  # Simulating the step processing time
        end_time = time.time()
        elapsed_time = round(end_time - start_time, 2)
        print(f"{step_name} took {elapsed_time} seconds")
        st.success(f"{step_name} completed in {elapsed_time} seconds")
    print(f"Finished: {step_name}")
    return elapsed_time

# Streamlit App layout
print("App started...")
st.title("📄 OCR Processing Demonstration")

# Step 1: Upload Image
uploaded_file = st.file_uploader("Upload Document Image", type=["png", "jpg", "jpeg"])

if uploaded_file is not None:
    print("Image uploaded by user")
    # Display uploaded image
    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded Image", use_column_width=True)

    # Display processing step with timer
    step_1_time = time_step("Step 1: Image Uploaded", 2.5)
    print(f"Step 1 (Image Uploaded) completed in {step_1_time} seconds")

    # Progress bar after each step
    st.progress(20)

    # Step 2: Display intermediate output image (dummy image)
    st.subheader("🔍 Step 2: Intermediate Output Image")
    dummy_image = Image.open('/Users/admin63/Python-Programs/OCR-Document-Classifier/images/inference-output.png')
    st.image(dummy_image, caption="Intermediate Processed Image", use_column_width=True)
    print("Intermediate output image displayed")

    # Show timer for this step
    step_2_time = time_step("Intermediate Image Processed", 0.6)
    print(f"Step 2 (Intermediate Image Processed) completed in {step_2_time} seconds")
    
    # Progress bar for tracking
    st.progress(40)

    # Step 3: Display intermediate OCR text
    st.subheader("📝 Step 3: Intermediate Text Processed")
    st.write(intermediate_text)
    print("Intermediate OCR text displayed")

    # Show timer for this step
    step_3_time = time_step("Intermediate Text Processed", 0.4)
    print(f"Step 3 (Intermediate Text Processed) completed in {step_3_time} seconds")
    
    # Progress bar for tracking
    st.progress(60)

    # Step 4: Display final JSON output
    st.subheader("📋 Step 4: Final JSON Output")
    st.json(final_json_output)
    print("Final JSON output displayed")

    # Show timer for this step
    step_4_time = time_step("Final JSON Generated", 1.1)
    print(f"Step 4 (Final JSON Generated) completed in {step_4_time} seconds")
    
    # Progress bar for tracking
    st.progress(80)

    # Step 5: Add field to update the schema
    st.subheader("🛠 Step 5: Update the JSON Schema")
    updated_json = st.text_area("Update JSON Schema", value=json.dumps(final_json_output, indent=4))
    print("Waiting for user to update the schema...")

    # Allow user to save updated schema
    if st.button("Save Updated Schema"):
        print("Save Updated Schema button clicked")
        try:
            updated_schema = json.loads(updated_json)
            st.success("Schema updated successfully!")
            st.write(updated_schema)  # Display the updated JSON
            print("Updated schema displayed successfully")
        except json.JSONDecodeError:
            st.error("Invalid JSON format! Please correct the JSON schema.")
            print("Error: Invalid JSON format")

    # Final Progress bar
    st.progress(100)

    # Show total time taken for all steps
    total_time = step_1_time + step_2_time + step_3_time + step_4_time
    st.subheader(f"🏁 Total Processing Time: {total_time} seconds")
    print(f"Total processing time: {total_time} seconds")
    
    # Display timestamp when processing finishes
    finish_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    st.write(f"Process finished at: {finish_time}")
    print(f"Process finished at {finish_time}")
