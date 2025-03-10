
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Main Result Card */}
      <Card className="border-housewise-200">
        <CardHeader className="bg-gradient-to-r from-housewise-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Predicted Property Value
          </CardTitle>
          <CardDescription className="text-white/80">
            Based on your property details and current market trends
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 text-center">
          <h3 className="text-4xl font-bold text-housewise-600 mb-2">
            {formatCurrency(predictedPrice)}
          </h3>
          <p className="text-gray-600 mb-6">
            Estimated value range: {formatCurrency(priceRange.min)} - {formatCurrency(priceRange.max)}
          </p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Confidence Level: {confidence}%</span>
            </div>
            <Progress value={confidence} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      {/* Property Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-gray-500">Price per SQ FT</h3>
            <div className="text-2xl font-bold mt-2">{formatCurrency(propertyDetails.pricePerSqft)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-gray-500">Property Size</h3>
            <div className="text-2xl font-bold mt-2">{propertyDetails.size.toLocaleString()} sq ft</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-gray-500">Property Type</h3>
            <div className="text-2xl font-bold mt-2">{propertyDetails.type}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-gray-500">Property Age</h3>
            <div className="text-2xl font-bold mt-2">{propertyDetails.age} years</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Price History Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Property Value Trend
          </CardTitle>
          <CardDescription>
            Estimated value over the past 12 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceHistory} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => `$${(value/1000)}k`}
                  domain={[
                    (dataMin: number) => Math.floor(dataMin * 0.9),
                    (dataMax: number) => Math.ceil(dataMax * 1.1)
                  ]}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Value']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Action Button */}
      <div className="text-center">
        <Button variant="outline" asChild>
          <Link to="/predict">Back to Form</Link>
        </Button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
