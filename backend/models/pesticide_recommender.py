import pandas as pd

class PesticideRecommender:
    def __init__(self, csv_path):
        self.pesticide_df = pd.read_csv(csv_path)
        self.pest_to_pesticide = dict(zip(
            self.pesticide_df["Pest Name"].str.strip().str.lower(),
            self.pesticide_df["Most Commonly Used Pesticides"]
        ))

        # Map your trained classes to closest CSV pest names
        self.class_to_csv_name = {
            "ants": "aphids",
            "bees": "beet army worm",
            "beetle": "beetle",
            "caterpillar": "indigo caterpillar",
            "earthworms": "grub",
            "earwigs": "earwig" if "earwig" in self.pest_to_pesticide else "beetle",
            "grasshoppers": "grasshopper",
            "moths": "fruit piercing moth",
            "slugs": "limacodidae",
            "snails": "snail" if "snail" in self.pest_to_pesticide else "beetle",
            "wasps": "wasp" if "wasp" in self.pest_to_pesticide else "beetle",
            "weevils": "beet weevil"
        }

    def get_recommendations(self, pest_name):
        pest_name = pest_name.strip().lower()
        csv_name = self.class_to_csv_name.get(pest_name, pest_name)
        pesticides = self.pest_to_pesticide.get(csv_name, None)

        if not pesticides:
            return [{"name": "No recommendation available", "description": ""}]

        return [
                   {"name": p.strip(), "description": "Recommended pesticide for the detected pest."}
                   for p in pesticides.split(',')
               ][:3]
