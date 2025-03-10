
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HouseForm from "@/components/HouseForm";
import { Home } from "lucide-react";

const Predict = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-gray-200">
            <div className="text-center mb-8">
              <div className="bg-housewise-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-housewise-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Property Value Predictor</h1>
              <p className="text-gray-600 mt-2">
                Fill in your property details to get an accurate AI-powered price estimate
              </p>
            </div>
            
            <HouseForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Predict;
