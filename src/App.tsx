import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import TripView from './pages/TripView';
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TripProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trips/:tripId" element={<TripView />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </TripProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/trips/:tripId" element={<TripView />} />
  <Route path="*" element={<ErrorPage />} />
</Routes>