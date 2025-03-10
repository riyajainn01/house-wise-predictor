
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign } from "lucide-react";

interface PredictionCardProps {
  predictedPrice: number;
  priceRange: { min: number; max: number };
  confidence: number;
  formatCurrency: (value: number) => string;
}

const PredictionCard = ({ predictedPrice, priceRange, confidence, formatCurrency }: PredictionCardProps) => {
  return (
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
  );
};

export default PredictionCard;
