
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-housewise-600 text-lg font-bold">HouseWise</h3>
            <p className="mt-2 text-sm text-gray-600">
              Advanced AI-powered house price prediction to help you make better real estate decisions.
            </p>
          </div>
          
          <div>
            <h3 className="text-gray-900 font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-housewise-600 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/predict" className="text-gray-600 hover:text-housewise-600 text-sm">
                  Get a Prediction
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-housewise-600 text-sm">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gray-900 font-semibold mb-3">Contact</h3>
            <p className="text-gray-600 text-sm">
              For support and inquiries:
            </p>
            <p className="mt-1 text-gray-600 text-sm">
              support@housewise.example.com
            </p>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} HouseWise. All rights reserved. developed ❤️<a className="text-housewise-600" href='https://github.com/kartikmehta18'> kartikmehta18</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
