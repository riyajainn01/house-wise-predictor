
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
import joblib
import os

app = Flask(__name__)
CORS(app)

# Check if model exists, if not, train it
model_path = 'model.joblib'
model = None

# Function to generate synthetic data
def generate_synthetic_data(n_samples=1000):
    np.random.seed(42)
    
    # Generate features
    bedrooms = np.random.randint(1, 7, n_samples)
    bathrooms = np.random.choice([1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5], n_samples)
    square_feet = np.random.randint(800, 5000, n_samples)
    lot_size = np.random.uniform(0.1, 2.0, n_samples)
    year_built = np.random.randint(1950, 2023, n_samples)
    neighborhoods = ['downtown', 'midtown', 'uptown', 'suburbanNorth', 'suburbanSouth', 'suburbanEast', 'suburbanWest']
    neighborhood = np.random.choice(neighborhoods, n_samples)
    conditions = ['poor', 'fair', 'good', 'excellent']
    condition = np.random.choice(conditions, n_samples)
    has_garage = np.random.choice([0, 1], n_samples)
    has_pool = np.random.choice([0, 1], n_samples)
    
    # Base price calculation
    base_price = 200000 + 150 * square_feet
    
    # Adjustments
    bedroom_adj = 15000 * (bedrooms - 3)
    bathroom_adj = 20000 * (bathrooms - 2)
    age_adj = -1000 * (2023 - year_built)
    lot_adj = 50000 * lot_size
    
    # Condition multipliers
    condition_mult = np.ones(n_samples)
    condition_mult[condition == 'poor'] = 0.8
    condition_mult[condition == 'fair'] = 0.9
    condition_mult[condition == 'good'] = 1.0
    condition_mult[condition == 'excellent'] = 1.2
    
    # Neighborhood multipliers
    neighborhood_mult = np.ones(n_samples)
    neighborhood_mult[neighborhood == 'downtown'] = 1.3
    neighborhood_mult[neighborhood == 'midtown'] = 1.2
    neighborhood_mult[neighborhood == 'uptown'] = 1.1
    neighborhood_mult[neighborhood == 'suburbanNorth'] = 1.05
    neighborhood_mult[neighborhood == 'suburbanSouth'] = 0.95
    neighborhood_mult[neighborhood == 'suburbanEast'] = 1.0
    neighborhood_mult[neighborhood == 'suburbanWest'] = 1.1
    
    # Features
    garage_adj = has_garage * 25000
    pool_adj = has_pool * 40000
    
    # Calculate price
    price = (base_price + bedroom_adj + bathroom_adj + age_adj + lot_adj + garage_adj + pool_adj) * condition_mult * neighborhood_mult
    
    # Add some noise
    price = price * np.random.normal(1, 0.1, n_samples)
    
    # Create DataFrame
    data = pd.DataFrame({
        'bedrooms': bedrooms,
        'bathrooms': bathrooms,
        'square_feet': square_feet,
        'lot_size': lot_size,
        'year_built': year_built,
        'neighborhood': neighborhood,
        'condition': condition,
        'has_garage': has_garage,
        'has_pool': has_pool,
        'price': price
    })
    
    return data

# Train model function
def train_model():
    print("Training new house price prediction model...")
    
    # Generate synthetic data
    data = generate_synthetic_data(2000)
    
    # Prepare features and target
    X = data.drop('price', axis=1)
    y = data['price']
    
    # Split categorical and numerical features
    cat_cols = ['neighborhood', 'condition']
    num_cols = ['bedrooms', 'bathrooms', 'square_feet', 'lot_size', 'year_built', 'has_garage', 'has_pool']
    
    # One-hot encode categorical features
    encoder = OneHotEncoder(sparse=False, handle_unknown='ignore')
    X_cat = encoder.fit_transform(X[cat_cols])
    
    # Scale numerical features
    scaler = StandardScaler()
    X_num = scaler.fit_transform(X[num_cols])
    
    # Combine features
    X_processed = np.hstack([X_num, X_cat])
    
    # Split into train and test
    X_train, X_test, y_train, y_test = train_test_split(X_processed, y, test_size=0.2, random_state=42)
    
    # Train RandomForest model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Save model and preprocessing components
    joblib.dump({
        'model': model,
        'encoder': encoder,
        'scaler': scaler,
        'cat_cols': cat_cols,
        'num_cols': num_cols
    }, model_path)
    
    print(f"Model trained and saved to {model_path}")
    return model, encoder, scaler, cat_cols, num_cols

# Load or train model
if os.path.exists(model_path):
    print(f"Loading existing model from {model_path}")
    components = joblib.load(model_path)
    model = components['model']
    encoder = components['encoder']
    scaler = components['scaler']
    cat_cols = components['cat_cols']
    num_cols = components['num_cols']
else:
    model, encoder, scaler, cat_cols, num_cols = train_model()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        data = request.json
        
        # Convert to DataFrame with expected columns
        input_data = pd.DataFrame({
            'bedrooms': [data['bedrooms']],
            'bathrooms': [data['bathrooms']],
            'square_feet': [data['squareFeet']],
            'lot_size': [data['lotSize']],
            'year_built': [data['yearBuilt']],
            'neighborhood': [data['neighborhood']],
            'condition': [data['condition']],
            'has_garage': [1 if data['hasGarage'] else 0],
            'has_pool': [1 if data['hasPool'] else 0]
        })
        
        # Process categorical features
        X_cat = encoder.transform(input_data[cat_cols])
        
        # Process numerical features
        X_num = scaler.transform(input_data[num_cols])
        
        # Combine features
        X_processed = np.hstack([X_num, X_cat])
        
        # Make prediction
        predicted_price = model.predict(X_processed)[0]
        
        # Calculate confidence
        confidence = np.random.randint(80, 96)  # Simulated confidence score
        
        # Generate price range (±5%)
        lower_bound = predicted_price * 0.95
        upper_bound = predicted_price * 1.05
        
        # Generate trend data (last 12 months)
        current_month = pd.Timestamp.now().month
        trend_data = []
        
        for i in range(12):
            month_idx = (current_month - 11 + i) % 12 + 1
            month_name = pd.Timestamp(2023, month_idx, 1).strftime('%b')
            
            # Calculate historical value with some randomness
            variance = predicted_price * (np.random.uniform(-0.05, 0.1))
            historical_price = predicted_price - variance
            
            trend_data.append({
                'month': month_name,
                'price': round(historical_price)
            })
        
        # Return prediction results
        return jsonify({
            'predictedPrice': round(predicted_price),
            'confidence': confidence,
            'priceRange': {
                'lower': round(lower_bound),
                'upper': round(upper_bound)
            },
            'pricePerSqFt': round(predicted_price / input_data['square_feet'][0]),
            'trendData': trend_data
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
