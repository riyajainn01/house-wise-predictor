
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# This would normally be trained on actual data and saved
# For demo purposes, we'll create a simple model when the app starts
def create_dummy_model():
    # Create some dummy training data
    np.random.seed(42)
    n_samples = 1000
    
    # Features that might affect house prices
    bedrooms = np.random.randint(1, 6, n_samples)
    bathrooms = np.random.randint(1, 5, n_samples)
    sq_feet = np.random.randint(500, 5000, n_samples)
    lot_size = np.random.uniform(0.1, 2.0, n_samples)
    year_built = np.random.randint(1950, 2023, n_samples)
    neighborhoods = np.random.choice(['downtown', 'midtown', 'uptown', 
                                     'suburbanNorth', 'suburbanSouth', 
                                     'suburbanEast', 'suburbanWest'], n_samples)
    conditions = np.random.choice(['poor', 'fair', 'good', 'excellent'], n_samples)
    has_garage = np.random.choice([0, 1], n_samples)
    has_pool = np.random.choice([0, 1], n_samples)
    
    # Create a dataframe
    X = pd.DataFrame({
        'bedrooms': bedrooms,
        'bathrooms': bathrooms,
        'square_feet': sq_feet,
        'lot_size': lot_size,
        'year_built': year_built,
        'neighborhood': neighborhoods,
        'condition': conditions,
        'has_garage': has_garage,
        'has_pool': has_pool
    })
    
    # Generate prices based on these features with some noise
    base_price = 200000
    price = base_price + \
            bedrooms * 15000 + \
            bathrooms * 12000 + \
            sq_feet * 200 + \
            lot_size * 50000 - \
            (2023 - year_built) * 1000 + \
            has_garage * 20000 + \
            has_pool * 30000
    
    # Add condition factor
    condition_map = {'poor': 0.8, 'fair': 0.9, 'good': 1.1, 'excellent': 1.2}
    for i, condition in enumerate(conditions):
        price[i] *= condition_map[condition]
    
    # Add neighborhood factor
    neighborhood_map = {
        'downtown': 1.3, 
        'midtown': 1.1, 
        'uptown': 1.2, 
        'suburbanNorth': 1.05, 
        'suburbanSouth': 0.95, 
        'suburbanEast': 1.0, 
        'suburbanWest': 1.1
    }
    for i, neighborhood in enumerate(neighborhoods):
        price[i] *= neighborhood_map[neighborhood]
    
    # Add randomness
    price = price + np.random.normal(0, 20000, n_samples)
    
    # Define preprocessing for numeric and categorical features
    numeric_features = ['bedrooms', 'bathrooms', 'square_feet', 'lot_size', 'year_built', 'has_garage', 'has_pool']
    categorical_features = ['neighborhood', 'condition']
    
    numeric_transformer = Pipeline(steps=[
        ('scaler', StandardScaler())
    ])
    
    categorical_transformer = Pipeline(steps=[
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])
    
    # Create and train the model
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
    ])
    
    model.fit(X, price)
    
    return model

# Create and save the model
model = create_dummy_model()
joblib.dump(model, 'house_price_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from request
        data = request.json
        
        # Create a DataFrame from the input data
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
        
        # Load the model and make prediction
        model = joblib.load('house_price_model.pkl')
        prediction = model.predict(input_data)[0]
        
        # Generate confidence interval (this is simplified)
        lower_bound = prediction * 0.95
        upper_bound = prediction * 1.05
        
        # Return prediction
        return jsonify({
            'predicted_price': round(prediction, 2),
            'confidence_interval': {
                'lower': round(lower_bound, 2),
                'upper': round(upper_bound, 2)
            },
            'confidence_level': 85
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
