import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import Account from '@/pages/Account';
import Pricing from '@/pages/Pricing';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import SubscriptionSuccess from '@/pages/SubscriptionSuccess';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account" element={<Account />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/subscription-success" element={<SubscriptionSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
