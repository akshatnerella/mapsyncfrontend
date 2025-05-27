import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Plus, ExternalLink, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { useTrip, Stop } from '../context/TripContext';

const TripView: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { getTrip, addStop } = useTrip();
  
  const [trip, setTrip] = useState(getTrip(tripId || ''));
  const [isAddStopModalOpen, setIsAddStopModalOpen] = useState(false);
  const [newStopName, setNewStopName] = useState('');
  const [newStopAddress, setNewStopAddress] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!tripId || !trip) {
      navigate('/dashboard');
    }
  }, [tripId, trip, navigate]);

  const handleAddStop = () => {
    if (!newStopName || !newStopAddress) {
      setError('Both name and address are required');
      return;
    }

    if (tripId) {
      addStop(tripId, newStopName, newStopAddress);
      setTrip(getTrip(tripId));
      setIsAddStopModalOpen(false);
      setNewStopName('');
      setNewStopAddress('');
      setError('');
    }
  };

  const openInGoogleMaps = () => {
    if (!trip) return;
    
    const origin = encodeURIComponent(trip.origin);
    const destination = encodeURIComponent(trip.destination);
    const waypoints = trip.stops.map(stop => encodeURIComponent(stop.address)).join('|');
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}`;
    window.open(url, '_blank');
  };

  if (!trip) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
        {/* Trip header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-5 w-5 text-indigo-600" />
                <h1 className="text-2xl font-bold text-gray-900">{trip.origin}</h1>
                <ArrowRight className="h-5 w-5 text-gray-400" />
                <h1 className="text-2xl font-bold text-gray-900">{trip.destination}</h1>
              </div>
              <p className="text-sm text-gray-500">Trip ID: {trip.id}</p>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <Button
                onClick={openInGoogleMaps}
                variant="primary"
                className="w-full sm:w-auto"
              >
                <ExternalLink className="h-4 w-4 mr-2" /> Open in Google Maps
              </Button>
            </div>
          </div>

          {/* Trip participants */}
          <div className="flex -space-x-2 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white">
              <User className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center border-2 border-white">
              <User className="h-4 w-4 text-purple-600" />
            </div>
          </div>
        </div>
        
        {/* Stops list */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Trip Stops</h2>
            <Button
              onClick={() => setIsAddStopModalOpen(true)}
              size="sm"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Stop
            </Button>
          </div>
          
          <Card>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-indigo-100"></div>
              
              {/* Origin */}
              <div className="flex items-start mb-6 relative z-10">
                <div className="h-12 w-12 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center mr-4 border-4 border-white">
                  <MapPin className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Start: {trip.origin}</h3>
                  <p className="text-sm text-gray-500">Starting point</p>
                </div>
              </div>
              
              {/* Stops */}
              {trip.stops.map((stop: Stop, index: number) => (
                <div key={stop.id} className="flex items-start mb-6 relative z-10">
                  <div className="h-12 w-12 flex-shrink-0 bg-indigo-50 rounded-full flex items-center justify-center mr-4 border-4 border-white">
                    <span className="text-indigo-600 font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{stop.name}</h3>
                    <p className="text-sm text-gray-500">{stop.address}</p>
                  </div>
                </div>
              ))}
              
              {/* Destination */}
              <div className="flex items-start relative z-10">
                <div className="h-12 w-12 flex-shrink-0 bg-indigo-600 rounded-full flex items-center justify-center mr-4 border-4 border-white">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">End: {trip.destination}</h3>
                  <p className="text-sm text-gray-500">Final destination</p>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </main>
      
      {/* Add Stop Modal */}
      <Modal
        isOpen={isAddStopModalOpen}
        onClose={() => {
          setIsAddStopModalOpen(false);
          setNewStopName('');
          setNewStopAddress('');
          setError('');
        }}
        title="Add a New Stop"
      >
        <form className="space-y-4">
          <div>
            <label htmlFor="stopName" className="block text-sm font-medium text-gray-700 mb-1">
              Stop Name
            </label>
            <input
              type="text"
              id="stopName"
              value={newStopName}
              onChange={(e) => setNewStopName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g. Golden Gate Bridge"
            />
          </div>
          
          <div>
            <label htmlFor="stopAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Stop Address
            </label>
            <input
              type="text"
              id="stopAddress"
              value={newStopAddress}
              onChange={(e) => setNewStopAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g. Golden Gate Bridge, San Francisco, CA"
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          
          <Button
            type="button"
            onClick={handleAddStop}
            fullWidth
          >
            Add Stop
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default TripView;