
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubscriptionCard from '@/components/dashboard/SubscriptionCard';
import TextInputCard from '@/components/dashboard/TextInputCard';
import ResultCard from '@/components/dashboard/ResultCard';
import { useSubscription } from '@/hooks/useSubscription';
import { useTextOperations } from '@/hooks/useTextOperations';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    subscription, 
    isLoading: isLoadingSubscription, 
    fetchSubscription, 
    getRemainingUsage 
  } = useSubscription();
  
  const {
    inputText,
    resultText,
    isDetecting,
    isHumanizing,
    textCopied,
    detectionResult,
    humanizationResult,
    handleTextChange,
    handleFileUpload,
    detectAIText,
    humanizeText,
    copyToClipboard
  } = useTextOperations(currentUser, subscription, fetchSubscription);
  
  // Redirect if not logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const remaining = getRemainingUsage();

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Text Analysis Dashboard</h1>
          
          {/* Subscription info card */}
          <SubscriptionCard 
            subscription={subscription} 
            isLoadingSubscription={isLoadingSubscription} 
          />
          
          {/* Text input card */}
          <TextInputCard 
            inputText={inputText}
            handleTextChange={handleTextChange}
            handleFileUpload={handleFileUpload}
            detectAIText={detectAIText}
            humanizeText={humanizeText}
            isDetecting={isDetecting}
            isHumanizing={isHumanizing}
            remainingDetections={remaining.detections}
            remainingHumanizations={remaining.humanizations}
            subscriptionType={subscription?.planType}
          />
          
          {/* Results card */}
          <ResultCard 
            resultText={resultText}
            detectionResult={detectionResult}
            humanizationResult={humanizationResult}
            copyToClipboard={copyToClipboard}
            textCopied={textCopied}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;
