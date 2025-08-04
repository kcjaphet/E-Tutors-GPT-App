import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubscriptionCard from '@/components/dashboard/SubscriptionCard';
import TextInputCard from '@/components/dashboard/TextInputCard';
import ResultCard from '@/components/dashboard/ResultCard';
import NavigationTabs from '@/components/ai-detection/NavigationTabs';

import LearnMoreSection from '@/components/ai-detection/LearnMoreSection';
import { useSubscription } from '@/hooks/useSubscription';
import { useTextOperations } from '@/hooks/useTextOperations';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Zap } from 'lucide-react';

const AIDetection: React.FC = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('check-text');
  const [testResults, setTestResults] = useState<Array<{
    sampleType: 'human' | 'ai';
    detectedProbability: number;
    isCorrect: boolean;
  }>>([]);

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

  // Handle sample text selection
  const handleSampleSelect = async (text: string, expectedType: 'human' | 'ai') => {
    handleTextChange(text);
    
    // Auto-run detection on sample
    toast({
      title: "Sample loaded",
      description: `Testing ${expectedType}-written sample. Running detection...`
    });
    
    setActiveTab('get-report');
    
    // Wait a moment then run detection
    setTimeout(async () => {
      await detectAIText();
    }, 500);
  };

  // Calculate test accuracy for the report
  const getTestAccuracy = () => {
    if (testResults.length === 0) return 0;
    const correct = testResults.filter(r => r.isCorrect).length;
    return (correct / testResults.length) * 100;
  };

  const CheckTextContent = (
    <div className="space-y-6">
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
    </div>
  );

  const GetReportContent = (
    <div className="space-y-6">
      {/* Results card */}
      <ResultCard 
        resultText={resultText}
        detectionResult={detectionResult}
        humanizationResult={humanizationResult}
        copyToClipboard={copyToClipboard}
        textCopied={textCopied}
        inputText={inputText}
      />

      {/* Performance Stats */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Testing Performance
            </CardTitle>
            <CardDescription>
              Your test results with sample texts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold">{getTestAccuracy().toFixed(1)}%</h3>
                <p className="text-sm text-muted-foreground">Overall Accuracy</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">
                  {testResults.filter(r => r.sampleType === 'human' && r.isCorrect).length}/
                  {testResults.filter(r => r.sampleType === 'human').length}
                </h3>
                <p className="text-sm text-muted-foreground">Human Texts Correct</p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">
                  {testResults.filter(r => r.sampleType === 'ai' && r.isCorrect).length}/
                  {testResults.filter(r => r.sampleType === 'ai').length}
                </h3>
                <p className="text-sm text-muted-foreground">AI Texts Correct</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const LearnMoreContent = <LearnMoreSection />;

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">AI Content Detection</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Advanced AI detection with detailed analysis, sample testing, and comprehensive reporting.
              Test with curated samples or analyze your own content.
            </p>
          </div>
          
          <NavigationTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            {{
              checkText: CheckTextContent,
              getReport: GetReportContent,
              learnMore: LearnMoreContent
            }}
          </NavigationTabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AIDetection;