import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Download, Share2, Home } from "lucide-react";

interface ActionButtonsProps {
  onNewPrediction: () => void;
}

const ActionButtons = ({ onNewPrediction }: ActionButtonsProps) => {
  const handleDownloadReport = () => {
    // In a real app, this would generate and download a PDF report
    console.log("Downloading property report...");
    // Provide feedback to user
    alert("Your property report is being prepared for download.");
  };

  const handleShareResults = () => {
    // In a real app, this would open a share dialog
    console.log("Sharing property results...");
    // Example of sharing data
    if (navigator.share) {
      navigator.share({
        title: 'My Property Valuation Results',
        text: 'Check out my property valuation from HouseWise!',
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support sharing
      alert("Copy this link to share your results: " + window.location.href);
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
