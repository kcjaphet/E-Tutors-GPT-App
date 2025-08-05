
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import ProtectedRoute from '@/components/ProtectedRoute';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Account from '@/pages/Account';
import Pricing from '@/pages/Pricing';
import Products from '@/pages/Products';
import SubscriptionSuccess from '@/pages/SubscriptionSuccess';
import NotFound from '@/pages/NotFound';
import LiteratureReview from '@/pages/LiteratureReview';
import PDFSummary from '@/pages/PDFSummary';
import AIDetection from '@/pages/AIDetection';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Toaster />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route 
                path="/auth" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Auth />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Auth />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Auth />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/account" 
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                } 
              />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/products" element={<Products />} />
              <Route 
                path="/subscription-success" 
                element={
                  <ProtectedRoute>
                    <SubscriptionSuccess />
                  </ProtectedRoute>
                } 
              />
              <Route path="/literature-review" element={<LiteratureReview />} />
              <Route path="/pdf-summary" element={<PDFSummary />} />
              <Route path="/ai-detection" element={<AIDetection />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
