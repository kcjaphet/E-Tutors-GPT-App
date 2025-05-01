
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccountInfo from '@/components/account/AccountInfo';
import EmailUpdateForm from '@/components/account/EmailUpdateForm';
import PasswordUpdateForm from '@/components/account/PasswordUpdateForm';
import DeleteAccountForm from '@/components/account/DeleteAccountForm';

const Account = () => {
  const { currentUser } = useAuth();
  
  // Redirect if not signed in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
          
          <div className="space-y-8">
            {/* Account Info */}
            <AccountInfo email={currentUser.email} />
            
            {/* Update Email Form */}
            <EmailUpdateForm currentEmail={currentUser.email} />
            
            {/* Update Password Form */}
            <PasswordUpdateForm />
            
            {/* Delete Account Form */}
            <DeleteAccountForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
