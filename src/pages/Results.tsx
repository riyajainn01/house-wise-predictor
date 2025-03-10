
import ResultsDisplay from "@/components/ResultsDisplay";

const Results = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gray-50 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Your Property Valuation Results</h1>
            <p className="text-gray-600 mt-2">
              Based on your property details and current market data
            </p>
          </div>
          
          <ResultsDisplay />
        </div>
      </main>
    </div>
  );
};

export default Results;
