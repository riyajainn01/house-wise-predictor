
from flask import Flask, request
from flask_cors import CORS
from model_trainer import load_or_train_model
from prediction_service import PredictionService

app = Flask(__name__)
CORS(app)

# Load or train the model
model, encoder, scaler, cat_cols, num_cols = load_or_train_model()

# Initialize prediction service
prediction_service = PredictionService(model, encoder, scaler, cat_cols, num_cols)

@app.route('/predict', methods=['POST'])
def predict():
    """API endpoint for price predictions"""
    data = request.json
    return prediction_service.predict(data)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return {'status': 'healthy'}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
