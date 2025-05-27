import React, { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import TripCard from '../components/TripCard';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import PlacesAutocomplete from '../components/PlacesAutocomplete';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { trips, createTrip, joinTrip } = useTrip();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [stops, setStops] = useState<string[]>(['']);
  const [tripId, setTripId] = useState('');
  const [createdTripId, setCreatedTripId] = useState('');
  const [error, setError] = useState('');

  const handleAddStop = () => {
    setStops([...stops, '']);
  };

  const handleStopChange = (index: number, value: string) => {
    const newStops = [...stops];
    newStops[index] = value;
    setStops(newStops);
  };

  const handleRemoveStop = (index: number) => {
    const newStops = [...stops];
    newStops.splice(index, 1);
    setStops(newStops);
  };

  const handleCreateTrip = async () => {
    if (!origin || !destination) {
      setError('Origin and destination are required');
      return;
    }
    
    try {
      // Filter out empty stops
      const filteredStops = stops.filter(stop => stop.trim() !== '');
      const shareLink = await createTrip(origin, destination, filteredStops);
      
      setIsCreateModalOpen(false);
      setIsSuccessModalOpen(true);
      setCreatedTripId(shareLink);
      
      // Reset form
      setOrigin('');
      setDestination('');
      setStops(['']);
      setError('');
    } catch (error) {
      setError('Failed to create trip. Please try again.');
    }
  };

  const handleJoinTrip = () => {
    if (!tripId) {
      setError('Trip ID is required');
      return;
    }

    const success = joinTrip(tripId);
    if (success) {
      setIsJoinModalOpen(false);
      setTripId('');
      setError('');
      window.location.href = `/trip/${tripId}`;
    } else {
      setError('Invalid Trip ID');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
        {/* Welcome section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
            Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}!
          </h1>
          
          <div className="flex space-x-3">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              fullWidth={false}
              className="flex-1 sm:flex-none"
            >
              <Plus className="h-5 w-5 mr-2" /> Start a Trip
            </Button>
            <Button
              onClick={() => setIsJoinModalOpen(true)}
              variant="outline"
              fullWidth={false}
              className="flex-1 sm:flex-none"
            >
              <Users className="h-5 w-5 mr-2" /> Join a Trip
            </Button>
          </div>
        </div>
        
        {/* Your trips section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Trips</h2>
          
          {trips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <p className="text-gray-500 mb-4">You don't have any trips yet.</p>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                variant="primary"
              >
                Create Your First Trip
              </Button>
            </div>
          )}
        </section>
      </main>
      
      {/* Create Trip Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setError('');
          setOrigin('');
          setDestination('');
          setStops(['']);
        }}
        title="Start a New Trip"
      >
        <form className="space-y-4">
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
              Origin
            </label>
            <PlacesAutocomplete
              placeholder="e.g. San Francisco, CA"
              value={origin}
              onChange={(value) => setOrigin(value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <PlacesAutocomplete
              placeholder="e.g. Los Angeles, CA"
              value={destination}
              onChange={(value) => setDestination(value)}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Optional Stops
              </label>
              <button
                type="button"
                onClick={handleAddStop}
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                + Add another stop
              </button>
            </div>
            
            {stops.map((stop, index) => (
              <div key={index} className="flex items-center mb-2">
                <PlacesAutocomplete
                  placeholder={`Stop ${index + 1}`}
                  value={stop}
                  onChange={(value) => handleStopChange(index, value)}
                  className="w-full"
                />
                {stops.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStop(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          
          <Button
            type="button"
            onClick={handleCreateTrip}
            fullWidth
          >
            Create Trip
          </Button>
        </form>
      </Modal>
      
      {/* Join Trip Modal */}
      <Modal
        isOpen={isJoinModalOpen}
        onClose={() => {
          setIsJoinModalOpen(false);
          setError('');
          setTripId('');
        }}
        title="Join an Existing Trip"
      >
        <form className="space-y-4">
          <div>
            <label htmlFor="tripId" className="block text-sm font-medium text-gray-700 mb-1">
              Trip ID or Invite Code
            </label>
            <input
              type="text"
              id="tripId"
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g. abc123"
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          
          <Button
            type="button"
            onClick={handleJoinTrip}
            fullWidth
          >
            Join Trip
          </Button>
        </form>
      </Modal>
      
      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Trip Created Successfully!"
      >
        <div className="space-y-4">
          <p>Your trip has been created! Share this link with your friends to invite them:</p>
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded">
            <code className="text-lg break-all">{createdTripId}</code>
            <Button onClick={() => copyToClipboard(createdTripId)} variant="secondary">Copy</Button>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <Button onClick={() => setIsSuccessModalOpen(false)} variant="secondary">Close</Button>
            <Button 
              onClick={() => window.location.href = createdTripId} 
              variant="primary"
            >
              Go to Trip
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;