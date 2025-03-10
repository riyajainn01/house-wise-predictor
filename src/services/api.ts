
import { toast } from "sonner";

// Base URL for our API
// 
const API_URL = "http://10.11.16.89:5000/";
// const API_URL = "https://housewisepredictor.onrender.com";
// Types
export interface HouseData {
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize: number;
  yearBuilt: number;
  neighborhood: string;
  condition: string;
  hasGarage: boolean;
  hasPool: boolean;
}

export interface PredictionResult {
  predicted_price: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  confidence_level: number;
}

// Function to send house data to the backend and get a prediction
export const getPrediction = async (houseData: HouseData): Promise<PredictionResult> => {
  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(houseData),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting prediction:", error);
    
    // Show error toast
    toast.error("Failed to connect to prediction service. Using local fallback model.");
    
    // If API call fails, use our frontend fallback model (from ResultsDisplay)
    // This allows the app to work even without the backend running
    return {
      predicted_price: getFallbackPrediction(houseData),
      confidence_interval: {
        lower: getFallbackPrediction(houseData) * 0.95,
        upper: getFallbackPrediction(houseData) * 1.05,
      },
      confidence_level: 75,
    };
  }
};

// Fallback prediction function (same logic as in ResultsDisplay)
const getFallbackPrediction = (data: HouseData): number => {
  // Starting with a base price
  let basePrice = 250000;
  
  // Adjusting for square footage (avg $200 per sq ft)
  basePrice += (data.squareFeet - 1800) * 200;
  
  // Adjusting for bedrooms
  basePrice += (data.bedrooms - 3) * 15000;
  
  // Adjusting for bathrooms
  basePrice += (data.bathrooms - 2) * 12000;
  
  // Adjusting for lot size
  basePrice += (data.lotSize - 0.25) * 50000;
  
  // Adjusting for age
  const age = new Date().getFullYear() - data.yearBuilt;
  basePrice -= age * 500;
  
  // Adjusting for condition
  switch (data.condition) {
    case "poor": basePrice *= 0.85; break;
    case "fair": basePrice *= 0.95; break;
    case "good": basePrice *= 1.05; break;
    case "excellent": basePrice *= 1.15; break;
  }
  
  // Adjusting for neighborhood
  switch (data.neighborhood) {
    case "downtown": basePrice *= 1.2; break;
    case "midtown": basePrice *= 1.1; break;
    case "uptown": basePrice *= 1.15; break;
    case "suburbanNorth": basePrice *= 1.05; break;
    case "suburbanSouth": basePrice *= 0.95; break;
    case "suburbanEast": basePrice *= 1.0; break;
    case "suburbanWest": basePrice *= 1.1; break;
  }
  
  // Adjusting for garage
  if (data.hasGarage) basePrice += 20000;
  
  // Adjusting for pool
  if (data.hasPool) basePrice += 30000;
  
  // Add some randomness to simulate real-world variations
  const randomFactor = 0.9 + Math.random() * 0.2; // between 0.9 and 1.1
  basePrice *= randomFactor;
  
  // Round to nearest thousand
  return Math.round(basePrice / 1000) * 1000;
};
