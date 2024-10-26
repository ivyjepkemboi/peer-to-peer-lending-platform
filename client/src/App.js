import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import DashboardLayout from './layouts/DashboardLayout';

// Lazy load dashboard components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Loans = lazy(() => import('./pages/Loans'));
const Messages = lazy(() => import('./pages/Messages'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Users = lazy(() => import('./pages/Users'));
const LoanRequestPage = lazy(() => import('./pages/LoanRequestPage')); 
const InvestmentPage = lazy(() => import('./pages/InvestmentPage'));

// Loading Component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<LoadingFallback />}>
                <Dashboard />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* New routes for LoanRequestPage and InvestmentPage */}
        <Route path="/request-loan" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<LoadingFallback />}>
                <LoanRequestPage />  {/* Loan request form */}
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/make-investment" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<LoadingFallback />}>
                <InvestmentPage />  {/* Investment form */}
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/loans" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<LoadingFallback />}>
                <Loans />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/messages" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<LoadingFallback />}>
                <Messages />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<LoadingFallback />}>
                <Profile />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<LoadingFallback />}>
                <Settings />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/users" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<LoadingFallback />}>
                <Users />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;