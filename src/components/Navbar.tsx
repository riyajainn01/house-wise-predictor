
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, LineChart, Info, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-housewise-600 text-xl font-bold">HouseWise</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="text-gray-600 hover:text-housewise-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <Link to="/predict" className="text-gray-600 hover:text-housewise-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <LineChart className="w-4 h-4 mr-1" />
              Predict
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-housewise-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <Info className="w-4 h-4 mr-1" />
              About
            </Link>
            <Button size="sm" asChild>
              <Link to="/predict">Get Started</Link>
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-housewise-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/predict" 
              className="text-gray-700 hover:text-housewise-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Predict
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-housewise-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-2">
              <Button className="w-full" asChild>
                <Link to="/predict" onClick={() => setIsMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
