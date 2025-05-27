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
  createTrip: (origin: string, destination: string, stops: string[]) => Promise<string>;
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
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);

  const createTrip = async (origin: string, destination: string, stops: string[]) => {
    try {
      const response = await fetch('https://mapsync.onrender.com/newtrip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({
          origin,
          destination,
          stops,
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        return data.shareLink.trim();
      } else {
        throw new Error(data.message || 'Failed to create trip');
      }
    } catch (error) {
      console.log('Falling back to local storage due to backend error');
      const tripId = Math.random().toString(36).substring(2, 8);
      const newTrip: Trip = {
        id: tripId,
        origin,
        destination,
        stops: stops.map((stop, index) => ({
          id: `stop-${index}`,
          name: stop,
          address: stop
        })),
        createdAt: new Date().toISOString(),
        createdBy: 'user123'
      };

      setTrips(prev => [...prev, newTrip]);
      setCurrentTrip(newTrip);
      return `trips/${tripId}`;
    }
  };

  // Remove the entire old createTrip implementation and its helper function
  // Only keep the other existing functions

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