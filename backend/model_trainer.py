
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
import joblib
import os
from data_generator import generate_synthetic_data

# Model file path
MODEL_PATH = 'model.joblib'

def train_model():
    """
    Train a house price prediction model using synthetic data.
    
    Returns:
        tuple: (model, encoder, scaler, cat_cols, num_cols)
    """
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
    }, MODEL_PATH)
    
    print(f"Model trained and saved to {MODEL_PATH}")
    return model, encoder, scaler, cat_cols, num_cols

def load_or_train_model():
    """
    Load an existing model if available, otherwise train a new one.
    
    Returns:
        tuple: (model, encoder, scaler, cat_cols, num_cols)
    """
    if os.path.exists(MODEL_PATH):
        print(f"Loading existing model from {MODEL_PATH}")
        components = joblib.load(MODEL_PATH)
        model = components['model']
        encoder = components['encoder']
        scaler = components['scaler']
        cat_cols = components['cat_cols']
        num_cols = components['num_cols']
    else:
        model, encoder, scaler, cat_cols, num_cols = train_model()
    
    return model, encoder, scaler, cat_cols, num_cols
