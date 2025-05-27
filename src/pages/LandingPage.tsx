import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Github, Twitter } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const LandingPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    login();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="max-w-md w-full flex flex-col items-center text-center">
          <div className="flex items-center mb-6">
            <MapPin className="h-10 w-10 text-black" />
            <h1 className="text-5xl font-bold text-black ml-2">MapSync</h1>
          </div>
          
          <p className="text-xl text-gray-700 mb-8">Plan together. Sync everywhere.</p>
          
          <Button 
            onClick={handleLogin}
            size="lg"
            fullWidth
            className="mb-4"
          >
            Login with Google
          </Button>
          
          <p className="text-sm text-gray-500 mb-10">No sign-up needed. Start planning instantly.</p>
          
          <div className="inline-block px-3 py-1 rounded-full border border-gray-200 text-xs font-medium text-gray-600 mb-8">
            Built on Google Maps
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center space-x-4">
          <p>Made with ❤️ by the MapSync team</p>
          <div className="flex space-x-2">
            <a href="#" className="text-gray-400 hover:text-black transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-black transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;