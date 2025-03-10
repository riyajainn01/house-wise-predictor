
import { Home, Search, TrendingUp, History, DollarSign, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HouseHero from "@/components/HouseHero";
import FeatureCard from "@/components/FeatureCard";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HouseHero />
        
        {/* How It Works Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How HouseWise Works</h2>
              <p className="max-w-2xl mx-auto text-gray-600">
                Our advanced AI algorithms analyze thousands of data points to deliver accurate property value estimates.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-housewise-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-housewise-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Input Your Property Details</h3>
                <p className="text-gray-600">
                  Enter information about your property such as location, size, features, and condition.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-housewise-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-housewise-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Analysis Process</h3>
                <p className="text-gray-600">
                  Our machine learning models analyze your data against current market trends and comparable properties.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-housewise-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-housewise-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Your Value Estimate</h3>
                <p className="text-gray-600">
                  Receive a detailed property valuation with confidence scores and comparable property data.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button size="lg" asChild>
                <Link to="/predict">Try It Now</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Features</h2>
              <p className="max-w-2xl mx-auto text-gray-600">
                Discover the powerful tools and insights HouseWise provides to help you make informed real estate decisions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={TrendingUp}
                title="AI-Powered Price Predictions"
                description="Get accurate property valuations based on advanced machine learning algorithms and extensive market data."
              />
              
              <FeatureCard 
                icon={History}
                title="Historical Price Trends"
                description="View how your property's value has changed over time and understand the factors driving those changes."
              />
              
              <FeatureCard 
                icon={MapPin}
                title="Location Analysis"
                description="See how your neighborhood affects property value with detailed location-based insights."
              />
              
              <FeatureCard 
                icon={Search}
                title="Detailed Property Analysis"
                description="Understand how each feature of your home contributes to its overall value."
              />
              
              <FeatureCard 
                icon={Home}
                title="Renovation Value Impact"
                description="Explore how potential renovations or improvements could affect your property's market value."
              />
              
              <FeatureCard 
                icon={DollarSign}
                title="Market Comparison"
                description="Compare your property's value to similar properties in your area to gauge its competitiveness."
              />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 gradient-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Discover Your Home's Value?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-white/80">
              Get an accurate, data-driven estimate in minutes with our AI-powered prediction tool.
            </p>
            <Button size="lg" variant="outline" className="bg-white text-housewise-600 hover:bg-gray-100 border-none" asChild>
              <Link to="/predict">Get Your Estimate Now</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
