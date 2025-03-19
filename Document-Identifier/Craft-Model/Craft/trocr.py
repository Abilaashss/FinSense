from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image
import os
import re
import time
import torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

printed_processor = TrOCRProcessor.from_pretrained('microsoft/trocr-base-printed')
printed_model = VisionEncoderDecoderModel.from_pretrained('microsoft/trocr-base-printed').to(device)

def ocr_printed_image(src_img):
    pixel_values = printed_processor(images=src_img, return_tensors="pt").pixel_values.to(device)
    generated_ids = printed_model.generate(pixel_values)
    return printed_processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

result_dir = "result"
segmented_images = [f for f in os.listdir(result_dir) if re.match(r'segment_\d+\.png', f)]
segmented_images.sort(key=lambda x: int(re.search(r'\d+', x).group()))

total_time = 0

for img_file in segmented_images:
    image_path = os.path.join(result_dir, img_file)
    image = Image.open(image_path)
    
    start_time = time.time()
    ocr_output = ocr_printed_image(image)
    end_time = time.time()
    
    elapsed_time = end_time - start_time
    total_time += elapsed_time
    
    print(f"OCR Output for {img_file}: {ocr_output}")
    # print(f"Time taken for {img_file}: {elapsed_time:.2f} seconds")

average_time = total_time / len(segmented_images)
print(f"Average time taken per image: {average_time:.2f} seconds")
