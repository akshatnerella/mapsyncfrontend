import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 py-3 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2" onClick={() => navigate('/dashboard')} role="button">
          <MapPin className="h-6 w-6 text-black" />
          <span className="font-bold text-xl text-black">MapSync</span>
        </div>
        
        {user && (
          <div className="relative">
            <button 
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user.name}
              </span>
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-black" />
                )}
              </div>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md border border-gray-100 py-1 z-10">
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate('/profile');
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;