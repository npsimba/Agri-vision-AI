import os
import tensorflow as tf

# Path to dataset
DATA_DIR = r"C:\Users\admin\Major\AgroVision-AI\data\ip102_v1.1"

# Helper function to read txt files
def load_image_paths(txt_file, images_dir):
    with open(txt_file, "r") as f:
        lines = f.readlines()
    image_paths = []
    labels = []
    for line in lines:
        img_name, label = line.strip().split()
        image_paths.append(os.path.join(images_dir, img_name))
        labels.append(int(label))
    return image_paths, labels

# Load train/val/test
train_images, train_labels = load_image_paths(os.path.join(DATA_DIR, "train.txt"), os.path.join(DATA_DIR, "images"))
val_images, val_labels = load_image_paths(os.path.join(DATA_DIR, "val.txt"), os.path.join(DATA_DIR, "images"))
test_images, test_labels = load_image_paths(os.path.join(DATA_DIR, "test.txt"), os.path.join(DATA_DIR, "images"))

print("Train samples:", len(train_images))
print("Val samples:", len(val_images))
print("Test samples:", len(test_images))
