import pandas as pd

class PesticideRecommender:
    def __init__(self, csv_path):
        self.pesticide_df = pd.read_csv(csv_path)
        self.pest_to_pesticide = dict(zip(
            self.pesticide_df["Pest Name"].str.strip().str.lower(),
            self.pesticide_df["Most Commonly Used Pesticides"]
        ))

    def get_recommendations(self, pest_name):
        pesticides = self.pest_to_pesticide.get(pest_name.strip().lower())

        if not pesticides:
            return [{"name": "No recommendation available", "description": ""}]

        return [
            {"name": p.strip(), "description": "Recommended pesticide for the detected pest."}
            for p in pesticides.split(',')
        ][:3]
