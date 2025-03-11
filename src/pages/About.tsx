
import { Building, BookOpen, Users, Code, Lightbulb, PieChart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="py-20 gradient-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-4xl font-bold mb-4">About HouseWise</h1>
            <p className="max-w-2xl mx-auto text-white/80 text-lg">
              Revolutionizing real estate valuation with artificial intelligence and data science
            </p>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-gray-600 mb-6">
                  At HouseWise, we&apos;re committed to bringing transparency and accuracy to property valuation. Our mission is to empower homeowners, buyers, and real estate professionals with precise, data-driven insights into property values.
                </p>
                <p className="text-gray-600">
                  Through our innovative AI technology, we analyze thousands of data points from market trends to property features, delivering valuations you can trust for making critical real estate decisions.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-housewise-50 rounded-lg border border-housewise-100">
                  <Building className="h-8 w-8 text-housewise-600 mb-4" />
                  <h3 className="font-semibold mb-2">Real Estate Expertise</h3>
                  <p className="text-gray-600 text-sm">
                    Built with insights from industry professionals
                  </p>
                </div>
                
                <div className="p-6 bg-housewise-50 rounded-lg border border-housewise-100">
                  <Code className="h-8 w-8 text-housewise-600 mb-4" />
                  <h3 className="font-semibold mb-2">Advanced Technology</h3>
                  <p className="text-gray-600 text-sm">
                    Powered by cutting-edge machine learning algorithms
                  </p>
                </div>
                
                <div className="p-6 bg-housewise-50 rounded-lg border border-housewise-100">
                  <PieChart className="h-8 w-8 text-housewise-600 mb-4" />
                  <h3 className="font-semibold mb-2">Data-Driven</h3>
                  <p className="text-gray-600 text-sm">
                    Analysis based on comprehensive market data
                  </p>
                </div>
                
                <div className="p-6 bg-housewise-50 rounded-lg border border-housewise-100">
                  <Users className="h-8 w-8 text-housewise-600 mb-4" />
                  <h3 className="font-semibold mb-2">User-Centric</h3>
                  <p className="text-gray-600 text-sm">
                    Designed for accessibility and ease of use
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Technology Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Technology</h2>
              <p className="max-w-2xl mx-auto text-gray-600">
                Behind HouseWise is a sophisticated technology stack that combines the latest in machine learning with comprehensive real estate data analysis.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <Lightbulb className="h-8 w-8 text-housewise-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Machine Learning Models</h3>
                <p className="text-gray-600">
                  Our proprietary algorithms analyze patterns in property data to predict market values with high accuracy.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <BookOpen className="h-8 w-8 text-housewise-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Comprehensive Data Sources</h3>
                <p className="text-gray-600">
                  We integrate multiple data sources including historical sales, property features, neighborhood statistics, and economic indicators.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <PieChart className="h-8 w-8 text-housewise-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-gray-600">
                  Our system continuously improves through feedback loops and validation against actual market transactions.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="max-w-2xl mx-auto text-gray-600">
                HouseWise is built by a passionate team of real estate experts, data scientists, and technology innovators.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <img className="h-40 w-40 rounded-full mx-auto mb-4" src="https://avatars.githubusercontent.com/u/125860170?s=400&u=e82f197d0a21f57223e0d867ce558b1a36c2236f&v=4" alt="karik mehta"/>
                {/* <div className="h-40 w-40 rounded-full bg-gray-200 mx-auto mb-4"></div> */}
                <h3 className="text-xl font-semibold">karik mehta</h3>
                <p className="text-housewise-600">Founder & CEO</p>
                <p className="text-gray-600 mt-2">
                  15+ years in real estate technology and investment
                </p>
              </div>
              
              {/* <div className="text-center">
                <div className="h-40 w-40 rounded-full bg-gray-200 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold">Samantha Chen</h3>
                <p className="text-housewise-600">Lead Data Scientist</p>
                <p className="text-gray-600 mt-2">
                  Expert in predictive modeling and machine learning
                </p>
              </div> */}
              
              {/* <div className="text-center">
                <div className="h-40 w-40 rounded-full bg-gray-200 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold">Marcus Williams</h3>
                <p className="text-housewise-600">Head of Real Estate Analysis</p>
                <p className="text-gray-600 mt-2">
                  Former appraiser with deep industry knowledge
                </p>
              </div> */}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
