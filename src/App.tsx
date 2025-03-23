
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import Account from '@/pages/Account';
import Pricing from '@/pages/Pricing';
import SubscriptionSuccess from '@/pages/SubscriptionSuccess';
import NotFound from '@/pages/NotFound';
import LiteratureReview from '@/pages/LiteratureReview';

function App() {
  
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account" element={<Account />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/subscription-success" element={<SubscriptionSuccess />} />
            <Route path="/literature-review" element={<LiteratureReview />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
