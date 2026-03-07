import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Offers from './pages/Offers';
import JobDetails from './pages/JobDetails';
import OfferDetails from './pages/OfferDetails';
import Posters from './pages/Posters';
import PosterDetails from './pages/PosterDetails';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import './i18n';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={
          <PrivateRoute>
            <Jobs />
          </PrivateRoute>
        } />
        <Route path="/jobs/:id" element={
          <PrivateRoute>
            <JobDetails />
          </PrivateRoute>
        } />
        <Route path="/offers" element={
          <PrivateRoute>
            <Offers />
          </PrivateRoute>
        } />
        <Route path="/offers/:id" element={
          <PrivateRoute>
            <OfferDetails />
          </PrivateRoute>
        } />
        <Route path="/posters" element={
          <PrivateRoute>
            <Posters />
          </PrivateRoute>
        } />
        <Route path="/posters/:id" element={
          <PrivateRoute>
            <PosterDetails />
          </PrivateRoute>
        } />
        
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="/chat" element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        } />

        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
      </Routes>
    </Layout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
