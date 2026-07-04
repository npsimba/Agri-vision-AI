
import os

# Flask configuration
class Config:
    UPLOAD_FOLDER = 'uploads'
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    MODEL_PATH = "models/pest_model.h5"
    CSV_PATH = "Pesticides_lowercase.csv"
    
    # Ensure upload directory exists
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
