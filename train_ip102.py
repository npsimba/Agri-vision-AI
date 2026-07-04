import os
import tensorflow as tf
from tensorflow.keras import layers, models

DATA_DIR = r"C:\Users\admin\Major\AgroVision-AI\data\ip102_v1.1"

# Helper to load dataset
def load_image_paths(txt_

    file, images_dir):
    with open(txt_file, "r") as f:
        lines = f.readlines()
    image_paths, labels = [], []
    for line in lines:
        img_name, label = line.strip().split()
        image_paths.append(os.path.join(images_dir, img_name))
        labels.append(int(label))
    return image_paths, labels

train_images, train_labels = load_image_paths(os.path.join(DATA_DIR, "train.txt"), os.path.join(DATA_DIR, "images"))
val_images, val_labels = load_image_paths(os.path.join(DATA_DIR, "val.txt"), os.path.join(DATA_DIR, "images"))

# Convert to tf.data.Dataset
IMG_SIZE = (224, 224)
BATCH_S
IZE = 32

def preprocess(img_path, label):
    img = tf.io.read_file(img_path)
    img = tf.image.decode_jpeg(img, channels=3)
    img = tf.image.resize(img, IMG_SIZE)
    img = img / 255.0
    return img, label

train_ds = tf.data.Dataset.from_tensor_slices((train_images, train_labels))
train_ds = train_ds.map(preprocess).shuffle(1000).batch(BATCH_SIZE)

val_ds = tf.data.Dataset.from_tensor_slices((val_images, val_labels))
val_ds = val_ds.map(preprocess).batch(BATCH_SIZE)

# Build model with MobileNetV2
base_model = tf.keras.applications.MobileNetV2(input_shape=(224,224,3),
                                               include_top=False,
                                               weights="imagenet")
base_model.trainable = False

model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(102, activation="softmax")  # 102 pest classes
])

model.compile(optimizer="adam",
              loss="sparse_categorical_crossentropy",
              metrics=["accuracy"])

# Train
model.fit(train_ds, validation_data=val_ds, epochs=5)

# Save model
model.save("pest_model.h5")
