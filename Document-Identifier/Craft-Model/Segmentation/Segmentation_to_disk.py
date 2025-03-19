from PIL import Image

def read_coordinates_from_file(filename):
    coordinates = []
    with open(filename, 'r') as f:
        for line in f:
            coords = list(map(int, line.strip().split(',')))
            coordinates.append(coords)
    return coordinates

def extract_and_save_images(image_path, coordinates_file, output_folder):
    img = Image.open(image_path)
    coordinates = read_coordinates_from_file(coordinates_file)
    
    for i, coords in enumerate(coordinates):
        # Extract region from the image
        box = (coords[0], coords[1], coords[4], coords[5])
        region = img.crop(box)
        
        # Save as a separate image
        output_path = f"{output_folder}/segment_{i}.png"
        region.save(output_path)
        print(f"Segmented image saved: {output_path}")

if __name__ == "__main__":
    image_path = 'res_test4.jpg'  
    coordinates_file = 'res_test4.txt' 
    output_folder = 'out'     
    
    extract_and_save_images(image_path, coordinates_file, output_folder)
