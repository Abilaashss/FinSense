from PIL import Image

def read_coordinates_from_file(filename):
    coordinates = []
    with open(filename, 'r') as f:
        for line in f:
            coords = list(map(int, line.strip().split(',')))
            coordinates.append(coords)
    return coordinates

def extract_images(image_path, coordinates_file):
    img = Image.open(image_path)
    
    coordinates = read_coordinates_from_file(coordinates_file)
    
    segmented_images = []
    
    for coords in coordinates:
        box = (coords[0], coords[1], coords[4], coords[5])
        region = img.crop(box)
        
        segmented_images.append(region)
    
    return segmented_images

if __name__ == "__main__":
    image_path = 'res_test4.jpg'
    coordinates_file = 'res_test4.txt'  
    
    #save in this segmented_images so need to pass this segmented_images to llama
    segmented_images = extract_images(image_path, coordinates_file)
    
    for i, image in enumerate(segmented_images):
        
        print(f"Segmented image {i} size: {image.size}")
