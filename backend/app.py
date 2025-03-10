from flask import Flask, request, jsonify
from flask_cors import CORS
from model_trainer import load_or_train_model
from prediction_service import PredictionService
from functools import wraps
import traceback

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:8080", "http://127.0.0.1:8080", 
                   "http://localhost:5173", "http://127.0.0.1:5173",
                   "http://10.11.16.89:8080", "http://10.11.16.89:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "expose_headers": ["Content-Type"],
        "supports_credentials": True,
        "max_age": 3600
    }
})

def validate_predict_input(data):
    required_fields = [
        'bedrooms', 'bathrooms', 'squareFeet', 'lotSize',
        'yearBuilt', 'neighborhood', 'condition', 'hasGarage', 'hasPool'
    ]
    
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")
    
    try:
        # Convert and validate numeric fields
        bedrooms = float(data['bedrooms'])
        bathrooms = float(data['bathrooms'])
        square_feet = float(data['squareFeet'])
        lot_size = float(data['lotSize'])
        year_built = int(data['yearBuilt'])
        
        if bedrooms <= 0 or bedrooms > 10:
            raise ValueError("Bedrooms must be between 1 and 10")
        if bathrooms <= 0 or bathrooms > 10:
            raise ValueError("Bathrooms must be between 1 and 10")
        if square_feet < 500 or square_feet > 10000:
            raise ValueError("Square feet must be between 500 and 10,000")
        if lot_size < 0.1 or lot_size > 5:
            raise ValueError("Lot size must be between 0.1 and 5 acres")
        if year_built < 1900 or year_built > 2024:
            raise ValueError("Year built must be between 1900 and 2024")
            
        # Validate categorical fields
        if not isinstance(data['neighborhood'], str):
            raise ValueError("Neighborhood must be a string")
        if data['condition'] not in ['poor', 'fair', 'good', 'excellent']:
            raise ValueError("Invalid condition value")
        if not isinstance(data['hasGarage'], bool):
            raise ValueError("hasGarage must be a boolean")
        if not isinstance(data['hasPool'], bool):
            raise ValueError("hasPool must be a boolean")
            
    except (ValueError, TypeError) as e:
        raise ValueError(f"Invalid input data: {str(e)}")

def error_handler(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            app.logger.error(f"Error: {str(e)}\n{traceback.format_exc()}")
            return jsonify({
                'error': str(e),
                'status': 'error'
            }), 500
    return wrapper

# Load or train the model
try:
    model, encoder, scaler, cat_cols, num_cols = load_or_train_model()
    prediction_service = PredictionService(model, encoder, scaler, cat_cols, num_cols)
except Exception as e:
    app.logger.error(f"Failed to load model: {str(e)}")
    raise

@app.route('/predict', methods=['POST'])
@error_handler
def predict():
    """API endpoint for price predictions"""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided', 'status': 'error'}), 400
    
    try:
        validate_predict_input(data)
        result = prediction_service.predict(data)
        return result
    except ValueError as e:
        return jsonify({'error': str(e), 'status': 'error'}), 400

@app.route('/health', methods=['GET'])
@error_handler
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': prediction_service is not None
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
