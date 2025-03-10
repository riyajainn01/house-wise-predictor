
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowRight } from 'lucide-react';

const HouseHero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="gradient-bg absolute inset-0 z-0" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Predict Your Home's Value with AI Precision
            </h1>
            <p className="text-white/90 text-lg mb-8">
              HouseWise uses advanced machine learning to provide accurate, data-driven home price predictions based on location, features, and market trends.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link to="/predict" className="flex items-center">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute -left-4 -top-4 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-xl animate-float">
                <Home className="h-10 w-10 text-white" />
                <p className="text-white mt-2 font-semibold">Property Analysis</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Your Property Value</h3>
                    <p className="text-gray-500">Based on current market data</p>
                  </div>
                  <div className="bg-housewise-50 p-2 rounded-full">
                    <Home className="h-6 w-6 text-housewise-600" />
                  </div>
                </div>
                
                <div className="text-4xl font-bold text-housewise-600 mb-6">$425,000</div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Bedrooms</p>
                      <p className="font-semibold">3</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Bathrooms</p>
                      <p className="font-semibold">2</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Square Feet</p>
                      <p className="font-semibold">1,850</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Year Built</p>
                      <p className="font-semibold">2005</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -right-4 -bottom-4 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-green-400 rounded-full mr-2"></div>
                  <p className="text-white font-semibold">95% Accuracy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseHero;
