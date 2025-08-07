
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubscriptionCard from '@/components/dashboard/SubscriptionCard';
import TextInputCard from '@/components/dashboard/TextInputCard';
import ResultCard from '@/components/dashboard/ResultCard';
import UsageAnalytics from '@/components/analytics/UsageAnalytics';
import QuickActions from '@/components/text-tools/QuickActions';
import TextMetrics from '@/components/performance/TextMetrics';
import TextTemplates from '@/components/templates/TextTemplates';
import { useSubscription } from '@/hooks/useSubscription';
import { useTextOperations } from '@/hooks/useTextOperations';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [sampleText, setSampleText] = useState('');
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
    return <Navigate to="/auth" />;
  }

  const remaining = getRemainingUsage();

  const handleTemplateSelect = (template: string) => {
    setSampleText(template);
    handleTextChange(template);
  };

  const handleClearText = () => {
    setSampleText('');
    handleTextChange('');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(resultText || inputText);
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Enhanced Dashboard</h1>
            <p className="text-muted-foreground">
              Advanced text processing with analytics and professional tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Subscription info card */}
              <SubscriptionCard 
                subscription={subscription} 
                isLoadingSubscription={isLoadingSubscription} 
              />
              
              {/* Text input card */}
              <TextInputCard 
                inputText={inputText}
                handleTextChange={(text) => {
                  handleTextChange(text);
                  setSampleText(text);
                }}
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
                inputText={inputText}
              />
              
              {/* Text Metrics */}
              {(inputText || resultText) && (
                <TextMetrics text={resultText || inputText} />
              )}
            </div>
            
            {/* Right Sidebar */}
            <div className="space-y-6">
              <UsageAnalytics subscription={subscription} />
              
              <TextTemplates onSelectTemplate={handleTemplateSelect} />
              
              {(inputText || resultText) && (
                <QuickActions 
                  text={resultText || inputText}
                  onClear={handleClearText}
                  onCopy={handleCopyText}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;
