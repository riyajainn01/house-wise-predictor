
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart } from "lucide-react";

interface PriceHistoryChartProps {
  priceHistory: Array<{month: string, value: number}>;
  formatCurrency: (value: number) => string;
}

const PriceHistoryChart = ({ priceHistory, formatCurrency }: PriceHistoryChartProps) => {
  return (
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
  );
};

export default PriceHistoryChart;
