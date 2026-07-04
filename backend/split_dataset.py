import os, shutil, random

dataset_dir = r"C:\Users\admin\Major\AgroVision-AI\backend\dataset"
train_dir = os.path.join(dataset_dir, "train")
val_dir = os.path.join(dataset_dir, "val")

os.makedirs(train_dir, exist_ok=True)
os.makedirs(val_dir, exist_ok=True)

for pest in os.listdir(dataset_dir):
    pest_path = os.path.join(dataset_dir, pest)
    if not os.path.isdir(pest_path) or pest in ["train", "val"]:
        continue

    images = os.listdir(pest_path)
    random.shuffle(images)
    split = int(0.8 * len(images))  # 80% train, 20% val

    os.makedirs(os.path.join(train_dir, pest), exist_ok=True)
    os.makedirs(os.path.join(val_dir, pest), exist_ok=True)

    for img in images[:split]:
        shutil.move(os.path.join(pest_path, img), os.path.join(train_dir, pest, img))
    for img in images[split:]:
        shutil.move(os.path.join(pest_path, img), os.path.join(val_dir, pest, img))

print("Done! Dataset split into train and val folders.")
