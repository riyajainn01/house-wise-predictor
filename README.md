# HouseWise Predictor

A modern web application that uses machine learning to predict house prices based on property features. Built with React, TypeScript, and Flask.

## 🌟 Features

- **AI-Powered Price Predictions**: Get accurate property valuations using machine learning
- **Interactive Form**: Easy-to-use interface for entering property details
- **Detailed Results**: View predicted price, confidence level, and price trends
- **PDF Reports**: Generate professional property valuation reports
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Live Demo

- Frontend: [https://housewise-predictor-32.vercel.app](https://housewise-predictor-32.vercel.app)
- Backend API: [https://housewisepredictor.onrender.com](https://housewisepredictor.onrender.com)

## 🛠️ Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui for UI components
- React Query for data fetching
- React Hook Form for form handling
- jsPDF for report generation

### Backend
- Flask for the API server
- scikit-learn for machine learning
- pandas for data processing
- joblib for model serialization
- Flask-CORS for CORS handling

## 📦 Installation

### Frontend Setup

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd housewise-predictor-32

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

## 💻 Usage

1. Fill in property details:
   - Number of bedrooms and bathrooms
   - Square footage and lot size
   - Year built
   - Neighborhood and condition
   - Additional features (garage, pool)

2. Submit the form to get:
   - Predicted property value
   - Confidence level
   - Price range
   - Historical price trends
   - Detailed property analysis

3. Download a professional PDF report or share results

## 🔧 API Endpoints

### POST /predict
Predicts property value based on input features.

**Request Body:**
```json
{
  "bedrooms": number,
  "bathrooms": number,
  "squareFeet": number,
  "lotSize": number,
  "yearBuilt": number,
  "neighborhood": string,
  "condition": "poor" | "fair" | "good" | "excellent",
  "hasGarage": boolean,
  "hasPool": boolean
}
```

**Response:**
```json
{
  "status": "success",
  "prediction": {
    "predictedPrice": number,
    "confidence": number,
    "priceRange": {
      "lower": number,
      "upper": number
    },
    "pricePerSqFt": number,
    "trendData": Array<{month: string, price: number}>
  },
  "inputSummary": {
    "propertySize": string,
    "bedBath": string,
    "yearBuilt": string,
    "location": string
  }
}
```

### GET /health
Health check endpoint to verify API status.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Initial work - [Your Name]

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Machine learning with [scikit-learn](https://scikit-learn.org/)
