import os
import time
import torch
from torch.autograd import Variable
import cv2
from skimage import io
import numpy as np
from PIL import Image
from collections import OrderedDict
import gdown
import craft_utils
import imgproc
import file_utils
from craft import CRAFT

weights = {
    'craft_ic15_20k.pth': '1i2R7UIUqmkUtF0jv_3MXTqmQ_9wuAnLf',
    'craft_mlt_25k.pth': '1Jk4eGD7crsqCCg9C9VjCLkMN3ze8kutZ',
    'craft_refiner_CTW1500.pth': '1XSaFwBkOaFOdtk4Ane3DFyJGPRw6v5bO'
}

os.makedirs('weights', exist_ok=True)

# Check if the specified trained model exists, if not, download it
model_file = "weights/craft_mlt_25k.pth"
if model_file in weights and not os.path.isfile(args.trained_model):
    print(f"{model_file} not found. Downloading...")
    url = f"https://drive.google.com/uc?id={weights[model_file]}"
    gdown.download(url, args.trained_model, quiet=False)


def copyStateDict(state_dict):
    if list(state_dict.keys())[0].startswith("module"):
        start_idx = 1
    else:
        start_idx = 0
    new_state_dict = OrderedDict()
    for k, v in state_dict.items():
        name = ".".join(k.split(".")[start_idx:])
        new_state_dict[name] = v
    return new_state_dict

def load_model(trained_model, cuda):
    net = CRAFT()  # initialize
    if cuda:
        net.load_state_dict(copyStateDict(torch.load(trained_model)))
        net = net.cuda()
        net = torch.nn.DataParallel(net)
        torch.backends.cudnn.benchmark = False
    else:
        net.load_state_dict(copyStateDict(torch.load(trained_model, map_location='cpu')))
    net.eval()
    return net

def process_image(net, image, text_threshold, link_threshold, low_text, cuda, poly, refine_net=None):
    # resize
    img_resized, target_ratio, size_heatmap = imgproc.resize_aspect_ratio(image, 1280, interpolation=cv2.INTER_LINEAR, mag_ratio=1.5)
    ratio_h = ratio_w = 1 / target_ratio

    # preprocessing
    x = imgproc.normalizeMeanVariance(img_resized)
    x = torch.from_numpy(x).permute(2, 0, 1)  # [h, w, c] to [c, h, w]
    x = Variable(x.unsqueeze(0))  # [c, h, w] to [b, c, h, w]
    if cuda:
        x = x.cuda()

    # forward pass
    with torch.no_grad():
        y, feature = net(x)

    # make score and link map
    score_text = y[0, :, :, 0].cpu().data.numpy()
    score_link = y[0, :, :, 1].cpu().data.numpy()

    # refine link
    if refine_net is not None:
        with torch.no_grad():
            y_refiner = refine_net(y, feature)
        score_link = y_refiner[0, :, :, 0].cpu().data.numpy()

    # Post-processing
    boxes, polys = craft_utils.getDetBoxes(score_text, score_link, text_threshold, link_threshold, low_text, poly)

    # coordinate adjustment
    boxes = craft_utils.adjustResultCoordinates(boxes, ratio_w, ratio_h)
    polys = craft_utils.adjustResultCoordinates(polys, ratio_w, ratio_h)
    for k in range(len(polys)):
        if polys[k] is None:
            polys[k] = boxes[k]

    # render results (optional)
    render_img = score_text.copy()
    render_img = np.hstack((render_img, score_link))
    ret_score_text = imgproc.cvt2HeatmapImg(render_img)

    return boxes, polys, ret_score_text

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
    os.makedirs('out', exist_ok=True)
    
    for i, coords in enumerate(coordinates):
        # Extract region from the image
        box = (coords[0], coords[1], coords[4], coords[5])
        region = img.crop(box)
        
        # Save as a separate image
        output_path = f"{output_folder}/segment_{i}.png"
        region.save(output_path)
        print(f"Segmented image saved: {output_path}")

def craftseg(image_path, trained_model='weights/craft_mlt_25k.pth', cuda=True):
    # Load model
    net = load_model(trained_model, cuda)

    # Load image
    image = imgproc.loadImage(image_path)

    # Process image
    bboxes, polys, score_text = process_image(net, image, 0.7, 0.4, 0.4, cuda, False)

    # Save results
    result_folder = './result/'
    if not os.path.isdir(result_folder):
        os.mkdir(result_folder)

    filename, file_ext = os.path.splitext(os.path.basename(image_path))
    mask_file = result_folder + "/res_" + filename + '_mask.jpg'
    cv2.imwrite(mask_file, score_text)
    file_utils.saveResult(image_path, image[:, :, ::-1], polys, dirname=result_folder)
    
    # Use the saved result coordinates file directly
    coordinates_file = result_folder + "/res_" + filename + '.txt'
    
    # Pass image_path, coordinates_file, and output_folder to your extraction function
    extract_and_save_images(image_path, coordinates_file, result_folder)

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='CRAFT Text Detection')
    parser.add_argument('--trained_model', default='weights/craft_mlt_25k.pth', type=str, help='pretrained model')
    parser.add_argument('--image_path', required=True, type=str, help='path to a single input image')
    parser.add_argument('--cuda', default=True, type=bool, help='Use cuda for inference')
    args = parser.parse_args()

    craftseg(args.image_path, args.trained_model, args.cuda)