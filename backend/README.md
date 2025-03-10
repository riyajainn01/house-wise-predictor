
# HouseWise Backend API

This is the Python backend for the HouseWise house price prediction system. It provides a machine learning model that predicts house prices based on various features.

## Installation

1. Create a Python virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

## Running the Server

To start the backend server:

```
python app.py
```

The server will run on http://localhost:5000

## API Endpoints

### POST /predict

Predicts the price of a house based on its features.

**Request Body:**

```json
{
  "bedrooms": 3,
  "bathrooms": 2,
  "squareFeet": 1800,
  "lotSize": 0.25,
  "yearBuilt": 2000,
  "neighborhood": "downtown",
  "condition": "good",
  "hasGarage": true,
  "hasPool": false
}
```

**Response:**

```json
{
  "predicted_price": 425000,
  "confidence_interval": {
    "lower": 403750,
    "upper": 446250
  },
  "confidence_level": 85
}
```

## Model Details

The current model is a RandomForestRegressor trained on synthetic data. In a production environment, this should be replaced with a model trained on real housing data.

## Future Improvements

- Add more features for prediction (school ratings, crime stats, etc.)
- Implement model versioning and A/B testing
- Add authentication for API endpoints
- Deploy with Gunicorn/WSGI for production use
