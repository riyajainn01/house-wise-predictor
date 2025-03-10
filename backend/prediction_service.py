
import numpy as np
import pandas as pd
from flask import jsonify
import pandas as pd

class PredictionService:
    def __init__(self, model, encoder, scaler, cat_cols, num_cols):
        """
        Initialize the prediction service with the trained model and preprocessing components.
        
        Args:
            model: Trained machine learning model
            encoder: One-hot encoder for categorical features
            scaler: Scaler for numerical features
            cat_cols: List of categorical column names
            num_cols: List of numerical column names
        """
        self.model = model
        self.encoder = encoder
        self.scaler = scaler
        self.cat_cols = cat_cols
        self.num_cols = num_cols
    
    def predict(self, data):
        """
        Make a price prediction based on input data.
        
        Args:
            data: Dictionary with property features
            
        Returns:
            JSON response with prediction results
        """
        try:
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
            X_cat = self.encoder.transform(input_data[self.cat_cols])
            
            # Process numerical features
            X_num = self.scaler.transform(input_data[self.num_cols])
            
            # Combine features
            X_processed = np.hstack([X_num, X_cat])
            
            # Make prediction
            predicted_price = self.model.predict(X_processed)[0]
            
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
