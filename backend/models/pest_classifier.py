
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image

class PestClassifier:
    def __init__(self, model_path):
        self.model = tf.keras.models.load_model(model_path)
        self.class_labels = [
            "adristyrannus", "aleurocanthus spiniferus", "alfalfa plant bug", "alfalfa seed chalcid", "alfalfa weevil",
            "ampelophaga", "aphids", "aphis citricola vander goot", "apolygus lucorum", "army worm",
            "asiatic rice borer", "bactrocera tsuneonis", "beet army worm", "beet fly", "beet spot flies",
            "beet weevil", "beetle", "bird cherry-oataphid", "black cutworm", "black hairy",
            "blister beetle", "bollworm", "brevipoalpus lewisi mcgregor", "brown plant hopper", "cabbage army worm",
            "cerodonta denticornis", "ceroplastes rubens", "chlumetia transversa", "chrysomphalus aonidum", "cicadella viridis",
            "cicadellidae", "colomerus vitis", "corn borer", "corn earworm", "cutworm",
            "dacus dorsalis(hendel)", "dasineura sp", "deporaus marginatus pascoe", "english grain aphid", "erythroneura apicalis",
            "fall armyworm", "field cricket", "flax budworm", "flea beetle", "fruit piercing moth",
            "gall fly", "grain spreader thrips", "grasshopper", "green bug", "grub",
            "icerya purchasi maskell", "indigo caterpillar", "jute aphid", "jute hairy", "jute red mite",
            "jute semilooper", "jute stem girdler", "jute stem weevil", "jute stick insect", "large cutworm",
            "lawana imitata melichar", "leaf beetle", "legume blister beetle", "limacodidae", "locust",
            "locustoidea", "longlegged spider mite", "lycorma delicatula", "lytta polita", "mango flat beak leafhopper",
            "meadow moth", "mealybug", "miridae", "mites", "mole cricket",
            "nipaecoccus vastalor", "odontothrips loti", "oides decempunctata", "paddy stem maggot", "panonchus citri mcgregor",
            "papilio xuthus", "parathrene regalis", "parlatoria zizyphus lucus", "peach borer", "penthaleus major",
            "phyllocnistis citrella stainton", "phyllocoptes oleiverus ashmead", "pieris canidia", "pod borer", "polyphagotars onemus latus",
            "potosiabre vitarsis", "prodenia litura", "pseudococcus comstocki kuwana", "red spider", "rhytidodera bowrinii white",
            "rice gall midge", "rice leaf caterpillar", "rice leaf roller", "rice leafhopper", "rice shell pest",
            "rice stemfly", "rice water weevil", "salurnis marginella guerr", "sawfly", "scirtothrips dorsalis hood",
            "sericaorient alismots chulsky", "small brown plant hopper", "spilosoma obliqua", "stem borer", "sternochetus frigidus",
            "tarnished plant bug", "termite", "termite odontotermes (rambur)", "tetradacus c bactrocera minax", "therioaphis maculata buckton",
            "thrips", "toxoptera aurantii", "toxoptera citricidus", "trialeurodes vaporariorum", "unaspis yanonensis",
            "viteus vitifoliae", "wheat blossom midge", "wheat phloeothrips", "wheat sawfly", "white backed plant hopper",
            "white margined moth", "whitefly", "wireworm", "xylotrechus", "yellow cutworm",
            "yellow mite", "yellow rice borer"
        ]

    def preprocess_image(self, img_path):
        img = image.load_img(img_path, target_size=(224, 224))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array

    def predict(self, img_path):
        img_array = self.preprocess_image(img_path)
        pest_pred = self.model.predict(img_array)
        predicted_pest_index = np.argmax(pest_pred)
        confidence = float(pest_pred[0][predicted_pest_index])
        
        predicted_pest = self.class_labels[predicted_pest_index] if predicted_pest_index < len(self.class_labels) else "Unknown Pest"
        return predicted_pest, confidence
