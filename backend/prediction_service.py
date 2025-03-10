import numpy as np
import pandas as pd
from flask import jsonify
import logging

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
        self.logger = logging.getLogger(__name__)
    
    def _preprocess_data(self, input_data):
        """Preprocess input data for prediction"""
        try:
            # Process categorical features
            X_cat = self.encoder.transform(input_data[self.cat_cols])
            
            # Process numerical features
            X_num = self.scaler.transform(input_data[self.num_cols])
            
            # Combine features
            return np.hstack([X_num, X_cat])
        except Exception as e:
            self.logger.error(f"Error preprocessing data: {str(e)}")
            raise ValueError(f"Failed to preprocess data: {str(e)}")

    def _generate_trend_data(self, predicted_price):
        """Generate historical trend data"""
        current_month = pd.Timestamp.now().month
        trend_data = []
        
        for i in range(12):
            month_idx = (current_month - 11 + i) % 12 + 1
            month_name = pd.Timestamp(2023, month_idx, 1).strftime('%b')
            
            # Calculate historical value with some randomness but maintain trend
            variance = predicted_price * (np.random.uniform(-0.05, 0.1))
            historical_price = predicted_price - variance + (i * predicted_price * 0.01)  # Slight upward trend
            
            trend_data.append({
                'month': month_name,
                'price': round(historical_price)
            })
        
        return trend_data
    
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
                'bedrooms': [float(data['bedrooms'])],
                'bathrooms': [float(data['bathrooms'])],
                'square_feet': [float(data['squareFeet'])],
                'lot_size': [float(data['lotSize'])],
                'year_built': [int(data['yearBuilt'])],
                'neighborhood': [str(data['neighborhood'])],
                'condition': [str(data['condition'])],
                'has_garage': [1 if data['hasGarage'] else 0],
                'has_pool': [1 if data['hasPool'] else 0]
            })
            
            try:
                # Preprocess data
                X_processed = self._preprocess_data(input_data)
                
                # Make prediction
                predicted_price = float(self.model.predict(X_processed)[0])
                
                # Validate prediction
                if not (10000 <= predicted_price <= 10000000):
                    raise ValueError("Prediction out of reasonable range")
                
                # Calculate confidence based on input data quality
                confidence = self._calculate_confidence(input_data, predicted_price)
                
                # Calculate price range
                margin = 0.05 + (1 - confidence/100) * 0.05  # Wider range for lower confidence
                lower_bound = predicted_price * (1 - margin)
                upper_bound = predicted_price * (1 + margin)
                
                # Generate trend data
                trend_data = self._generate_trend_data(predicted_price)
                
                # Prepare response
                response = {
                    'status': 'success',
                    'prediction': {
                        'predictedPrice': round(predicted_price),
                        'confidence': round(confidence, 1),
                        'priceRange': {
                            'lower': round(lower_bound),
                            'upper': round(upper_bound)
                        },
                        'pricePerSqFt': round(predicted_price / float(input_data['square_feet'][0])),
                        'trendData': trend_data
                    },
                    'inputSummary': {
                        'propertySize': f"{input_data['square_feet'][0]:,.0f} sq ft",
                        'bedBath': f"{input_data['bedrooms'][0]:.0f} bed, {input_data['bathrooms'][0]:.1f} bath",
                        'yearBuilt': str(input_data['year_built'][0]),
                        'location': str(input_data['neighborhood'][0]).title()
                    }
                }
                
                return jsonify(response)
                
            except Exception as e:
                self.logger.error(f"Prediction processing error: {str(e)}")
                return jsonify({
                    'status': 'error',
                    'error': f"Failed to process prediction: {str(e)}"
                }), 500
                
        except Exception as e:
            self.logger.error(f"Input data error: {str(e)}")
            return jsonify({
                'status': 'error',
                'error': f"Invalid input data: {str(e)}"
            }), 400

    def _calculate_confidence(self, input_data, predicted_price):
        """Calculate confidence score based on input data quality"""
        confidence = 90  # Base confidence
        
        # Adjust confidence based on data quality
        if input_data['square_feet'][0] < 100 or input_data['square_feet'][0] > 10000:
            confidence -= 5
        if input_data['year_built'][0] < 1900:
            confidence -= 5
        if predicted_price < 10000 or predicted_price > 10000000:
            confidence -= 10
            
        return max(min(confidence, 95), 60)  # Keep confidence between 60 and 95
