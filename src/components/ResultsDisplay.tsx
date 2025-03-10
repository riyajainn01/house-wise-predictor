
import { useState, useEffect } from 'react';
import PredictionCard from './results/PredictionCard';
import PropertyStats from './results/PropertyStats';
import PriceHistoryChart from './results/PriceHistoryChart';
import ActionButtons from './results/ActionButtons';
import { formatCurrency } from '@/utils/formatters';

const ResultsDisplay = () => {
  const [predictedPrice, setPredictedPrice] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({min: 0, max: 0});
  const [confidence, setConfidence] = useState<number>(0);
  const [propertyDetails, setPropertyDetails] = useState({
    pricePerSqft: 0,
    size: 0,
    type: '',
    age: 0
  });
  const [priceHistory, setPriceHistory] = useState<Array<{month: string, value: number}>>([]);

  useEffect(() => {
    // Simulate loading data from local storage or API
    const loadResults = () => {
      // Get prediction results from localStorage if available
      const savedResults = localStorage.getItem('predictionResults');
      
      if (savedResults) {
        const results = JSON.parse(savedResults);
        
        // Set the predicted price
        setPredictedPrice(results.price || 425000);
        
        // Set price range (typically within 10% of prediction)
        const minPrice = Math.round((results.price || 425000) * 0.9);
        const maxPrice = Math.round((results.price || 425000) * 1.1);
        setPriceRange({ min: minPrice, max: maxPrice });
        
        // Set confidence level
        setConfidence(results.confidence || 85);
        
        // Set property details
        setPropertyDetails({
          pricePerSqft: results.pricePerSqft || Math.round((results.price || 425000) / (results.squareFeet || 1800)),
          size: results.squareFeet || 1800,
          type: `${results.bedrooms || 3}BR/${results.bathrooms || 2}BA`,
          age: new Date().getFullYear() - (results.yearBuilt || 2000)
        });
      } else {
        // If no saved results, use demo data
        setPredictedPrice(425000);
        setPriceRange({ min: 380000, max: 470000 });
        setConfidence(85);
        setPropertyDetails({
          pricePerSqft: 236,
          size: 1800,
          type: '3BR/2BA',
          age: new Date().getFullYear() - 2000
        });
      }
      
      // Generate price history data
      generatePriceHistoryData();
    };
    
    loadResults();
  }, []);
  
  const generatePriceHistoryData = () => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const currentMonth = new Date().getMonth();
    const historyData = [];
    
    // Generate last 12 months of data
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth - 11 + i) % 12;
      const monthName = months[monthIndex < 0 ? monthIndex + 12 : monthIndex];
      
      // Base value around predicted price with some random fluctuation
      const baseValue = predictedPrice * (0.85 + (i * 0.02));
      const randomFactor = 1 + (Math.random() * 0.1 - 0.05);
      const value = Math.round(baseValue * randomFactor);
      
      historyData.push({ month: monthName, value });
    }
    
    setPriceHistory(historyData);
  };

  return (
    <div className="space-y-8">
      <PredictionCard 
        predictedPrice={predictedPrice}
        priceRange={priceRange}
        confidence={confidence}
        formatCurrency={formatCurrency}
      />
      
      <PropertyStats 
        propertyDetails={propertyDetails}
        formatCurrency={formatCurrency}
      />
      
      <PriceHistoryChart 
        priceHistory={priceHistory}
        formatCurrency={formatCurrency}
      />
      
      <ActionButtons />
    </div>
  );
};

export default ResultsDisplay;
