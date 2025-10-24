
import pandas as pd

class PesticideRecommender:
    def __init__(self, csv_path):
        self.pesticide_df = pd.read_csv(csv_path)
        self.pest_to_pesticide = dict(zip(
            self.pesticide_df["Pest Name"],
            self.pesticide_df["Most Commonly Used Pesticides"]
        ))

    def get_recommendations(self, pest_name):
        pesticides = self.pest_to_pesticide.get(pest_name, "No recommendation available")
        return [
            {"name": p.strip(), "description": "Recommended pesticide for the detected pest."}
            for p in pesticides.split(',')
        ][:3] if isinstance(pesticides, str) else []
