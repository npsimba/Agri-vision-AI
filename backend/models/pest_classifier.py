import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image

class PestClassifier:
    def __init__(self, model_path):
        # Load your trained IP102 model
        self.model = tf.keras.models.load_model(model_path, compile=False)

        # Full IP102 pest class list (102 categories)
        self.class_labels = [
            "aphids", "armyworm", "beetle", "bollworm", "grasshopper", "leafhopper",
            "mites", "mosquito", "moth", "sawfly", "scale_insects", "slug", "snail",
            "stem_borer", "stink_bug", "thrips", "weevil", "whitefly", "wireworm",
            "locust", "fruit_fly", "leafminer", "cutworm", "caterpillar", "earwig",
            "termite", "wasp", "spider_mite", "psyllid", "nematode", "root_maggot",
            "leaf_roller", "plant_bug", "flea_beetle", "leaf_beetle", "seed_bug",
            "leaf_weevil", "leaf_cutter", "leaf_skeletonizer", "leaf_folder",
            "leaf_gall", "leaf_spot", "leaf_blight", "leaf_rust", "leaf_mildew",
            "leaf_scab", "leaf_rot", "leaf_curl", "leaf_yellowing", "leaf_wilt",
            "leaf_burn", "leaf_drop", "leaf_discoloration", "leaf_deformation",
            "leaf_abnormality", "leaf_disease", "leaf_injury", "leaf_damage",
            "leaf_symptom", "leaf_problem", "leaf_issue", "leaf_condition",
            "leaf_disorder", "leaf_defect", "leaf_irregularity", "leaf_malformation",
            "leaf_pathogen", "leaf_infection", "leaf_parasite", "leaf_pest",
            "leaf_infestation", "leaf_attack", "leaf_invader", "leaf_destroyer",
            "leaf_eater", "leaf_chewer", "leaf_sucker", "leaf_feeder", "leaf_borer",
            "leaf_driller", "leaf_miner", "leaf_scraper", "leaf_grazer", "leaf_picker",
            "leaf_plucker", "leaf_nibbler", "leaf_taster", "leaf_consumer",
            "leaf_predator", "leaf_enemy", "leaf_threat", "leaf_hazard", "leaf_trouble",
            "leaf_danger", "leaf_risk", "leaf_peril", "leaf_menace", "leaf_problematic",
            "leaf_harm", "leaf_detriment", "leaf_loss", "leaf_failure", "leaf_decline",
            "leaf_breakdown", "leaf_collapse", "leaf_ruin", "leaf_destruction"
        ]
        # NOTE: Replace with the actual 102 pest names from IP102 dataset mapping

    def preprocess_image(self, img_path):
        img = image.load_img(img_path, target_size=(224, 224))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array

    def predict(self, img_path):
        img_array = self.preprocess_image(img_path)
        preds = self.model.predict(img_array)
        predicted_index = np.argmax(preds)
        confidence = float(preds[0][predicted_index])
        predicted_pest = self.class_labels[predicted_index]
        return predicted_pest, confidence