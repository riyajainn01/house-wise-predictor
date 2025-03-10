import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Download, Share2, Home } from "lucide-react";
import { generateReport } from "@/utils/reportGenerator";
import { toast } from "sonner";

interface ActionButtonsProps {
  onNewPrediction: () => void;
}

const ActionButtons = ({ onNewPrediction }: ActionButtonsProps) => {
  const handleDownloadReport = () => {
    try {
      // Get prediction results from session storage
      const savedResult = sessionStorage.getItem('predictionResult');
      if (!savedResult) {
        throw new Error('No prediction results found');
      }

      const result = JSON.parse(savedResult);
      generateReport(result);
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

  const handleShareResults = () => {
    try {
      if (navigator.share) {
        navigator.share({
          title: 'My Property Valuation Results',
          text: 'Check out my property valuation from HouseWise!',
          url: window.location.href,
        })
        .then(() => toast.success('Shared successfully!'))
        .catch((error) => {
          console.error('Error sharing:', error);
          toast.error('Failed to share');
        });
      } else {
        // Fallback for browsers that don't support sharing
        navigator.clipboard.writeText(window.location.href)
          .then(() => toast.success('Link copied to clipboard!'))
          .catch(() => toast.error('Failed to copy link'));
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share results');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
      <Button variant="outline" onClick={onNewPrediction} className="flex items-center">
        <Home className="mr-2 h-4 w-4" /> New Prediction
      </Button>
      
      <Button onClick={handleDownloadReport} className="flex items-center">
        <Download className="mr-2 h-4 w-4" /> Download Report
      </Button>
      
      <Button variant="secondary" onClick={handleShareResults} className="flex items-center">
        <Share2 className="mr-2 h-4 w-4" /> Share Results
      </Button>
    </div>
  );
};

export default ActionButtons;
