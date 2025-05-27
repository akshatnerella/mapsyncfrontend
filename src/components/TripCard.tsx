import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { Trip } from '../context/TripContext';

interface TripCardProps {
  trip: Trip;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const navigate = useNavigate();
  const date = new Date(trip.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card className="w-full transition-all duration-200 hover:shadow-lg">
      <div className="flex flex-col h-full">
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="h-4 w-4 text-indigo-600 flex-shrink-0" />
          <p className="font-medium text-gray-900 text-sm">{trip.origin}</p>
          <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <p className="font-medium text-gray-900 text-sm">{trip.destination}</p>
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xs text-gray-500">Created {date}</span>
          <Button 
            size="sm" 
            variant="primary"
            onClick={() => navigate(`/trip/${trip.id}`)}
          >
            View
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TripCard;