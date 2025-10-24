import os
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from google.generativeai.types.safety_types import HarmBlockThreshold, HarmCategory

class FertilizerRecommender:
    def __init__(self):
        # Initialize safety settings
        self.safety_settings = {
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        }
        
        # Initialize the Gemini AI model
        self.chat_model = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro",
            google_api_key="AIzaSyBRmkSyw-LAU-kHaDG7tki_n2oC0VQh61M",
            temperature=0.3,
            safety_settings=self.safety_settings
        )

    def get_recommendations(self, data):
        composite_prompt = f"""
        You are an expert agronomist. Based on the given inputs, predict the most likely pest affecting the crop and recommend appropriate pesticides and fertilizers.
        Please output your response as a JSON object in the following format:

        {{
          "predicted_pest": {{
            "name": "<pest name>",
            "explanation": "<brief explanation>"
          }},
          "pesticides": [
            {{
              "name": "<pesticide name>",
              "description": "<short reason>",
              "dosage": "Apply as per manufacturer's instructions"
            }}
            // up to 3 items
          ],
          "fertilizers": [
            {{
              "name": "<fertilizer name>",
              "description": "<short reason>",
              "dosage": "Apply as per manufacturer's instructions"
            }}
            // up to 3 items
          ]
        }}

        **Input Data:**
        - **Crop Name:** {data['crop_name']}
        - **Environmental Factors:** 
          - Temperature: {data['temperature']}°C
          - Humidity: {data['humidity']}%
          - Moisture: {data['moisture']}%
          - Soil Type: {data['soil_type']}
        - **Soil Nutrient Levels:** 
          - Nitrogen: {data['nitrogen']}
          - Phosphorus: {data['phosphorus']}
          - Potassium: {data['potassium']}
        """

        # Call the Gemini AI model
        response = self.chat_model.invoke(composite_prompt)

        # Extract response safely
        if hasattr(response, "content"):
            recommendation = response.content
        elif isinstance(response, dict) and "content" in response:
            recommendation = response["content"]
        else:
            recommendation = str(response)

        # Strip markdown formatting if present
        recommendation = recommendation.strip()
        if recommendation.startswith("```json"):
            recommendation = recommendation[len("```json"):].strip()
        if recommendation.startswith("```"):
            recommendation = recommendation[len("```"):].strip()
        if recommendation.endswith("```"):
            recommendation = recommendation[:-3].strip()

        # Attempt to parse the JSON response
        try:
            recommendations_json = json.loads(recommendation)
        except Exception as e:
            recommendations_json = {"error": "Failed to parse response", "raw": recommendation}
        print(recommendations_json)
        return recommendations_json
