from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models.pest_classifier import PestClassifier
from models.vision_pest_classifier import VisionPestClassifier
from models.pesticide_recommender import PesticideRecommender
from models.yield_predictor import YieldPredictor
from models.fertilizer_recommender import FertilizerRecommender
from utils.file_handler import allowed_file, save_file, cleanup_file

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

# Initialize models. Each is isolated so a failure in one (e.g. a model file
# pickled with an incompatible scikit-learn version) doesn't take down the
# whole server -- the other endpoints keep working.
def _safe_init(name, factory):
    try:
        return factory()
    except Exception as e:
        print(f"Failed to initialize {name}: {e}")
        return None

pest_classifier = _safe_init("pest_classifier", lambda: PestClassifier(Config.MODEL_PATH))
# Vision classifier is optional -- only initializes if GOOGLE_API_KEY or
# NVIDIA_API_KEY is set. When available it's preferred over the local model
# since it isn't limited to a fixed 132-class insect/mite list and can also
# recognize plant diseases.
vision_pest_classifier = _safe_init("vision_pest_classifier", VisionPestClassifier)
pesticide_recommender = _safe_init("pesticide_recommender", lambda: PesticideRecommender(Config.CSV_PATH))
yield_predictor = _safe_init("yield_predictor", YieldPredictor)
fertilizer_recommender = _safe_init("fertilizer_recommender", FertilizerRecommender)

@app.route('/api/analyze', methods=['POST'])
def analyze_image():
    if vision_pest_classifier is None and pest_classifier is None:
        return jsonify({'error': 'Pest classifier is unavailable on the server.'}), 503

    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename, app.config['ALLOWED_EXTENSIONS']):
        try:
            filepath = save_file(file, app.config['UPLOAD_FOLDER'])

            if vision_pest_classifier is not None:
                prediction = vision_pest_classifier.predict(filepath)
                pest_name = prediction["pestName"]
                confidence = prediction["confidence"]
                severity = prediction["severity"]
                pesticides = prediction["pesticides"]
                if not pesticides and pesticide_recommender is not None:
                    pesticides = pesticide_recommender.get_recommendations(pest_name)
            else:
                pest_name, confidence = pest_classifier.predict(filepath)
                severity = "high" if confidence > 0.8 else "medium" if confidence > 0.5 else "low"
                pesticides = (
                    pesticide_recommender.get_recommendations(pest_name)
                    if pesticide_recommender is not None else []
                )

            result = {
                "pestName": pest_name,
                "confidence": confidence,
                "severity": severity,
                "recommendations": {
                    "pesticides": pesticides,
                    "fertilizers": []
                }
            }

            return jsonify(result)

        except Exception as e:
            return jsonify({'error': str(e)}), 500

        finally:
            cleanup_file(filepath)

    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/predict-yield', methods=['POST'])
def predict_yield():
    if yield_predictor is None:
        return jsonify({'error': 'Yield predictor is unavailable on the server.'}), 503

    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        prediction = yield_predictor.predict(data)
        return jsonify({
            'prediction': prediction,
            'unit': 'kg per hectare'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recommend-fertilizer', methods=['POST'])
def recommend_fertilizer():
    if fertilizer_recommender is None:
        return jsonify({'error': 'Fertilizer recommender is unavailable on the server.'}), 503

    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        recommendations = fertilizer_recommender.get_recommendations(data)
        return jsonify({
            'recommendations': recommendations
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
