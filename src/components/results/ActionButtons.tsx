
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ActionButtons = () => {
  return (
    <div className="text-center">
      <Button variant="outline" asChild>
        <Link to="/predict">Back to Form</Link>
      </Button>
    </div>
  );
};

export default ActionButtons;
