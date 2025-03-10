
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface HouseData {
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

// This is a mock function that simulates a prediction algorithm
const getPredictedPrice = (data: HouseData): number => {
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

// Generate price history data for the chart
const generateHistoryData = (currentPrice: number) => {
  const data = [];
  // Start from 12 months ago
  for (let i = 11; i >= 0; i--) {
    // Add some random variance (between -5% and +10% of the current price)
    const variance = currentPrice * (Math.random() * 0.15 - 0.05);
    // Calculate historical price for each month
    const historicalPrice = currentPrice - variance;
    data.push({
      month: new Date(new Date().setMonth(new Date().getMonth() - i)).toLocaleString('default', { month: 'short' }),
      price: Math.round(historicalPrice)
    });
  }
  return data;
};

const ResultsDisplay = () => {
  const [houseData, setHouseData] = useState<HouseData | null>(null);
  const [predictedPrice, setPredictedPrice] = useState(0);
  const [confidenceLevel, setConfidenceLevel] = useState(0);
  const [priceHistoryData, setPriceHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Retrieve the house data from session storage
    const storedData = sessionStorage.getItem("houseData");
    
    if (!storedData) {
      // If no data is found, redirect to the prediction form
      navigate("/predict");
      return;
    }
    
    // Parse the stored data
    const parsedData = JSON.parse(storedData);
    setHouseData(parsedData);
    
    // Simulate loading time for the prediction
    setTimeout(() => {
      const price = getPredictedPrice(parsedData);
      setPredictedPrice(price);
      
      // Generate historical data for the chart
      setPriceHistoryData(generateHistoryData(price));
      
      // Set a random confidence level between 75 and 95
      setConfidenceLevel(Math.floor(Math.random() * 20) + 75);
      
      setLoading(false);
    }, 1000);
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center">
        <div className="text-center mb-4">
          <Activity className="h-12 w-12 text-housewise-600 animate-pulse mx-auto" />
          <h3 className="text-xl font-semibold mt-4">Analyzing Property Data</h3>
          <p className="text-gray-500 mt-2">Our AI is calculating your property value...</p>
        </div>
        <Progress value={35} className="w-64 mt-4" />
      </div>
    );
  }

  if (!houseData) {
    return null;
  }

  // Format the predicted price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(predictedPrice);
  
  // Calculate price per square foot
  const pricePerSqFt = Math.round(predictedPrice / houseData.squareFeet);
  
  // Format the range (±5%)
  const lowerRange = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(predictedPrice * 0.95);
  
  const upperRange = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(predictedPrice * 1.05);

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-housewise-100">
        <CardHeader className="pb-4 gradient-bg text-white">
          <CardTitle className="text-2xl md:text-3xl flex items-center">
            <DollarSign className="mr-2 h-8 w-8" />
            Predicted Property Value
          </CardTitle>
          <CardDescription className="text-white/80">
            Based on your property details and current market trends
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-4xl md:text-5xl font-bold text-housewise-600">{formattedPrice}</h3>
            <p className="text-gray-500 mt-2">Estimated value range: {lowerRange} - {upperRange}</p>
            
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Confidence Level: {confidenceLevel}%</span>
              </div>
              <Progress value={confidenceLevel} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Price per SQ FT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pricePerSqFt}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Property Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{houseData.squareFeet} sq ft</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Property Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{houseData.bedrooms}BR/{houseData.bathrooms}BA</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Property Age</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Date().getFullYear() - houseData.yearBuilt} years</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-housewise-600" />
            Property Value Trend
          </CardTitle>
          <CardDescription>
            Estimated value over the past 12 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={priceHistoryData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  width={80}
                  tickFormatter={(value) => 
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      notation: 'compact',
                      maximumFractionDigits: 1
                    }).format(value)
                  }
                />
                <Tooltip 
                  formatter={(value) => 
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0
                    }).format(value as number)
                  }
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8b5cf6" 
                  fill="url(#colorPrice)" 
                  fillOpacity={0.6}
                />
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => navigate('/predict')} 
          className="mr-4"
        >
          Back to Form
        </Button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
