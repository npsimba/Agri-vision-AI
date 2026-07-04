import os
import re
import json
import base64

class VisionPestClassifier:
    """
    Pest/disease identification via a hosted vision-language model, instead
    of the fixed 132-class local CNN. Provider-agnostic: uses whichever key
    is set, GOOGLE_API_KEY (Gemini) or NVIDIA_API_KEY (NVIDIA NIM catalog).
    Unlike the local model, this isn't limited to a fixed insect/mite class
    list -- it can recognize plant diseases too (e.g. yellow rust), since
    it's not a fixed-output classifier.
    """

    PROMPT = (
        "You are an expert agronomist. Look at this crop photo and identify the "
        "single most likely pest or disease affecting the plant. Respond with ONLY "
        "a JSON object, no markdown fences, no extra text, in this exact shape:\n"
        '{"pestName": "<short name>", "confidence": <0.0-1.0>, '
        '"severity": "low"|"medium"|"high", "description": "<1-2 sentence explanation>", '
        '"pesticides": [{"name": "<pesticide or treatment>", "description": "<why>"}]}\n'
        "confidence reflects your own certainty. If the photo shows no clear pest or "
        "disease, say so in pestName and set confidence low."
    )

    def __init__(self):
        self.provider = None
        if os.environ.get("GOOGLE_API_KEY"):
            self.provider = "gemini"
        elif os.environ.get("NVIDIA_API_KEY"):
            self.provider = "nvidia"
        else:
            raise RuntimeError(
                "Neither GOOGLE_API_KEY nor NVIDIA_API_KEY is set -- "
                "VisionPestClassifier needs one of them."
            )

    def predict(self, img_path):
        with open(img_path, "rb") as f:
            image_bytes = f.read()

        if self.provider == "gemini":
            raw_text = self._predict_gemini(image_bytes)
        else:
            raw_text = self._predict_nvidia(image_bytes)

        return self._parse_response(raw_text)

    def _predict_gemini(self, image_bytes):
        import google.generativeai as genai

        genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(
            [self.PROMPT, {"mime_type": "image/jpeg", "data": image_bytes}]
        )
        return response.text

    def _predict_nvidia(self, image_bytes):
        import requests

        b64_image = base64.b64encode(image_bytes).decode("utf-8")
        response = requests.post(
            "https://integrate.api.nvidia.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.environ['NVIDIA_API_KEY']}",
                "Accept": "application/json",
            },
            json={
                # NVIDIA's model catalog changes over time -- swap this if it's
                # retired; any vision-capable model on build.nvidia.com works.
                "model": "meta/llama-3.2-90b-vision-instruct",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": self.PROMPT},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{b64_image}"
                                },
                            },
                        ],
                    }
                ],
                "temperature": 0.2,
                "max_tokens": 512,
            },
            timeout=30,
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

    def _parse_response(self, raw_text):
        text = raw_text.strip()
        if text.startswith("```"):
            text = re.sub(r"^```(json)?", "", text).strip()
            text = re.sub(r"```$", "", text).strip()

        try:
            data = json.loads(text)
        except json.JSONDecodeError:
            return {
                "pestName": "Unknown",
                "confidence": 0.0,
                "severity": "low",
                "description": raw_text[:300],
                "pesticides": [],
            }

        return {
            "pestName": data.get("pestName", "Unknown"),
            "confidence": float(data.get("confidence", 0.0)),
            "severity": data.get("severity", "low"),
            "description": data.get("description", ""),
            "pesticides": data.get("pesticides", []),
        }
