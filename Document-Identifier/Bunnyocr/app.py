import streamlit as st
from PIL import Image
from io import BytesIO
from helpers.llm_helper import analyze_image_file, stream_parser
from config import Config

# Configuring the page settings
st.set_page_config(page_title="OCR", 
                   page_icon="📸",
                   layout="centered",
                   initial_sidebar_state='collapsed')

st.header("OCR From Image")

# Use the camera input instead of file uploader
captured_image = st.camera_input("Capture Image")

# Sidebar for selecting the model
with st.sidebar:
    image_model = st.selectbox('Which image model would you like to use?', Config.OLLAMA_MODELS)

if captured_image is not None:
    # Convert captured image to a file-like object (BytesIO) and open it
    image_bytes = BytesIO(captured_image.getvalue())
    image = Image.open(image_bytes)
    
    st.image(image, caption='Captured Image', use_column_width=True)
    bytes_data = captured_image.getvalue()

    # OCR button
    generate = st.button("OCR!")

    if generate:
        # Display status while processing the image
        with st.status(":red[Processing image file. DON'T LEAVE THIS PAGE WHILE IMAGE FILE IS BEING ANALYZED...]", expanded=True) as status:
            st.write(":orange[Analyzing Image File...]")

            # Analyze the image using the selected model
            stream = analyze_image_file(image_bytes, model=image_model, user_prompt="OCR and extract the handwritten text from this image.")
            
            # Stream output from the analysis
            stream_output = st.write_stream(stream_parser(stream))

            st.write(":green[Done analyzing image file]")
else:
    st.warning("Please capture an image to analyze.")
