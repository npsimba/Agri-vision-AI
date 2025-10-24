from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models.pest_classifier import PestClassifier
from models.pesticide_recommender import PesticideRecommender
from models.yield_predictor import YieldPredictor
from models.fertilizer_recommender import FertilizerRecommender
from utils.file_handler import allowed_file, save_file, cleanup_file

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

# Initialize models
pest_classifier = PestClassifier(Config.MODEL_PATH)
pesticide_recommender = PesticideRecommender(Config.CSV_PATH)
yield_predictor = YieldPredictor()
fertilizer_recommender = FertilizerRecommender()

@app.route('/api/analyze', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename, app.config['ALLOWED_EXTENSIONS']):
        try:
            filepath = save_file(file, app.config['UPLOAD_FOLDER'])
            pest_name, confidence = pest_classifier.predict(filepath)
            recommendations = pesticide_recommender.get_recommendations(pest_name)
            
            result = {
                "pestName": pest_name,
                "confidence": confidence,
                "severity": "high" if confidence > 0.8 else "medium" if confidence > 0.5 else "low",
                "recommendations": {
                    "pesticides": recommendations,
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
    try:
        data = request.json
        print(data)
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
