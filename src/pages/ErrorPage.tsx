import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';
import Button from '../components/Button';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Car className="h-24 w-24 text-gray-200" />
            <div className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-2xl">❓</span>
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-black mb-4">Uh-oh. This road doesn't exist.</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          It looks like you've taken a wrong turn. The page you're looking for can't be found.
        </p>
        
        <Button
          onClick={() => navigate('/dashboard')}
          size="lg"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;