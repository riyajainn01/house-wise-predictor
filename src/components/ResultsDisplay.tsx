import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PredictionCard from './results/PredictionCard';
import PropertyStats from './results/PropertyStats';
import PriceHistoryChart from './results/PriceHistoryChart';
import ActionButtons from './results/ActionButtons';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

interface PredictionResult {
  status: string;
  prediction: {
    predictedPrice: number;
    confidence: number;
    priceRange: {
      lower: number;
      upper: number;
    };
    pricePerSqFt: number;
    trendData: Array<{
      month: string;
      price: number;
    }>;
  };
  inputSummary: {
    propertySize: string;
    bedBath: string;
    yearBuilt: string;
    location: string;
  };
}

interface HouseData {
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt: number;
  neighborhood: string;
  condition: string;
  hasGarage: boolean;
  hasPool: boolean;
}

const ResultsDisplay = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [houseData, setHouseData] = useState<HouseData | null>(null);

  useEffect(() => {
    const loadResults = () => {
      try {
        // Get prediction results and house data from sessionStorage
        const savedResult = sessionStorage.getItem('predictionResult');
        const savedHouseData = sessionStorage.getItem('houseData');
        
        if (!savedResult || !savedHouseData) {
          throw new Error('No prediction results found');
        }
        
        const result = JSON.parse(savedResult) as PredictionResult;
        const house = JSON.parse(savedHouseData) as HouseData;
        
        if (result.status !== 'success') {
          throw new Error('Invalid prediction result');
        }
        
        setPredictionResult(result);
        setHouseData(house);
        
      } catch (error) {
        console.error('Error loading results:', error);
        toast.error('Failed to load prediction results');
        navigate('/predict');
      } finally {
        setLoading(false);
      }
    };
    
    loadResults();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-housewise-600"></div>
      </div>
    );
  }

  if (!predictionResult || !houseData) {
    return null;
  }

  const { prediction, inputSummary } = predictionResult;
  
  const propertyDetails = {
    pricePerSqft: prediction.pricePerSqFt,
    size: houseData.squareFeet,
    type: inputSummary.bedBath,
    location: inputSummary.location,
    age: new Date().getFullYear() - houseData.yearBuilt,
    condition: houseData.condition,
    features: [
      houseData.hasGarage ? 'Garage' : null,
      houseData.hasPool ? 'Pool' : null
    ].filter(Boolean)
  };

  return (
    <div className="space-y-8">
      <PredictionCard 
        predictedPrice={prediction.predictedPrice}
        priceRange={{
          min: prediction.priceRange.lower,
          max: prediction.priceRange.upper
        }}
        confidence={prediction.confidence}
        formatCurrency={formatCurrency}
      />
      
      <PropertyStats 
        propertyDetails={propertyDetails}
        formatCurrency={formatCurrency}
      />
      
      <PriceHistoryChart 
        priceHistory={prediction.trendData.map(item => ({
          month: item.month,
          value: item.price
        }))}
        formatCurrency={formatCurrency}
      />
      <ActionButtons 
        onNewPrediction={() => {
          sessionStorage.removeItem('predictionResult');
          sessionStorage.removeItem('houseData');
          navigate('/predict');
        }}
      />
    </div>
  );
};

export default ResultsDisplay;
