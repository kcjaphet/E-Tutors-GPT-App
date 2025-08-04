import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Shield, AlertTriangle, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

const LearnMoreSection: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            How AI Detection Works
          </CardTitle>
          <CardDescription>
            Understanding the technology behind AI content detection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">Analysis Methods</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Pattern recognition in writing style</li>
                <li>• Vocabulary and sentence structure analysis</li>
                <li>• Consistency and coherence evaluation</li>
                <li>• Contextual understanding assessment</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Detection Indicators</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Repetitive phrasing patterns</li>
                <li>• Overly formal or structured language</li>
                <li>• Generic expressions and transitions</li>
                <li>• Lack of personal voice or experience</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accuracy Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Accuracy & Limitations
          </CardTitle>
          <CardDescription>
            Understanding the reliability of AI detection results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-green-800 dark:text-green-400">High Accuracy</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                85-95% accurate on clearly AI-generated text
              </p>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-medium text-orange-800 dark:text-orange-400">Medium Accuracy</h4>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                70-85% accurate on mixed human-AI content
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <h4 className="font-medium text-red-800 dark:text-red-400">Lower Accuracy</h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                60-70% accurate on heavily edited AI text
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Important Considerations</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Detection accuracy varies based on content type and length</li>
              <li>• Short texts (under 100 words) may yield less reliable results</li>
              <li>• Human editing of AI content can reduce detection accuracy</li>
              <li>• Results should be used as guidance, not definitive proof</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Confidence Levels Explained */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Understanding Confidence Levels
          </CardTitle>
          <CardDescription>
            What confidence levels mean for your analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                High
              </Badge>
              <div>
                <p className="font-medium">High Confidence (70-100%)</p>
                <p className="text-sm text-muted-foreground">
                  Strong indicators present, results are highly reliable
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                Medium
              </Badge>
              <div>
                <p className="font-medium">Medium Confidence (30-70%)</p>
                <p className="text-sm text-muted-foreground">
                  Some indicators present, results should be considered carefully
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                Low
              </Badge>
              <div>
                <p className="font-medium">Low Confidence (0-30%)</p>
                <p className="text-sm text-muted-foreground">
                  Few clear indicators, results are less certain
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Best Practices for AI Detection</CardTitle>
          <CardDescription>
            Tips for getting the most accurate results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-green-600 dark:text-green-400">✓ Do</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Use texts of at least 100 words for better accuracy</li>
                <li>• Test multiple samples for consistent patterns</li>
                <li>• Consider the context and purpose of the text</li>
                <li>• Use results as guidance alongside human judgment</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-red-600 dark:text-red-400">✗ Don't</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Rely solely on detection results for important decisions</li>
                <li>• Test very short texts or fragments</li>
                <li>• Assume 100% accuracy in all cases</li>
                <li>• Ignore context and human factors</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearnMoreSection;