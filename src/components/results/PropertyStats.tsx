
import { Card, CardContent } from "@/components/ui/card";

interface PropertyStatsProps {
  propertyDetails: {
    pricePerSqft: number;
    size: number;
    type: string;
    age: number;
  };
  formatCurrency: (value: number) => string;
}

const PropertyStats = ({ propertyDetails, formatCurrency }: PropertyStatsProps) => {
  return (
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
  );
};

export default PropertyStats;
