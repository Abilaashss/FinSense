from craft_module import craftseg

def process_single_image(image_path):
    trained_model = 'weights/craft_mlt_25k.pth'
    cuda = True  # or False if you do not want to use CUDA

    craftseg(image_path, trained_model, cuda)
# Example usage
if __name__ == '__main__':
    image_path = '10.jpg'
    process_single_image(image_path)
