import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Stop {
  id: string;
  name: string;
  address: string;
}

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  stops: Stop[];
  createdAt: string;
  createdBy: string;
}

interface TripContextType {
  trips: Trip[];
  currentTrip: Trip | null;
  createTrip: (origin: string, destination: string, stops: string[]) => string;
  joinTrip: (tripId: string) => boolean;
  addStop: (tripId: string, stopName: string, stopAddress: string) => void;
  getTrip: (tripId: string) => Trip | null;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

interface TripProviderProps {
  children: ReactNode;
}

export const TripProvider: React.FC<TripProviderProps> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: 'abc123',
      origin: 'San Francisco, CA',
      destination: 'Los Angeles, CA',
      stops: [
        { id: 'stop1', name: 'Monterey', address: 'Monterey, CA' },
        { id: 'stop2', name: 'Santa Barbara', address: 'Santa Barbara, CA' }
      ],
      createdAt: new Date().toISOString(),
      createdBy: 'user123'
    }
  ]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);

  // Generate a random ID (simplified)
  const generateId = () => Math.random().toString(36).substring(2, 8);

  const createTrip = (origin: string, destination: string, stops: string[]) => {
    const newTripId = generateId();
    const newTrip: Trip = {
      id: newTripId,
      origin,
      destination,
      stops: stops.map((stop, index) => ({
        id: `stop-${index}`,
        name: stop,
        address: stop
      })),
      createdAt: new Date().toISOString(),
      createdBy: 'user123' // Would be replaced with current user ID
    };

    setTrips([...trips, newTrip]);
    setCurrentTrip(newTrip);
    return newTripId;
  };

  const joinTrip = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      setCurrentTrip(trip);
      return true;
    }
    return false;
  };

  const addStop = (tripId: string, stopName: string, stopAddress: string) => {
    setTrips(prevTrips => 
      prevTrips.map(trip => {
        if (trip.id === tripId) {
          return {
            ...trip,
            stops: [...trip.stops, {
              id: `stop-${trip.stops.length}`,
              name: stopName,
              address: stopAddress
            }]
          };
        }
        return trip;
      })
    );

    if (currentTrip?.id === tripId) {
      setCurrentTrip(prev => {
        if (!prev) return null;
        return {
          ...prev,
          stops: [...prev.stops, {
            id: `stop-${prev.stops.length}`,
            name: stopName,
            address: stopAddress
          }]
        };
      });
    }
  };

  const getTrip = (tripId: string) => {
    return trips.find(trip => trip.id === tripId) || null;
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        currentTrip,
        createTrip,
        joinTrip,
        addStop,
        getTrip
      }}
    >
      {children}
    </TripContext.Provider>
  );
};