
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TextTools from '@/components/TextTools';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Search, FileText, Brain, Languages, Wrench } from 'lucide-react';

const Products = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Our Products</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our powerful AI-driven text tools designed to help you detect, humanize, and perfect your content.
            </p>
          </div>

          {/* Product Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  <CardTitle>AI Text Detection</CardTitle>
                </div>
                <CardDescription>
                  Advanced AI detection with detailed analysis and comprehensive reporting.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p>✓ Real-time AI probability scoring</p>
                  <p>✓ Detailed confidence analysis</p>
                  <p>✓ Sample text testing</p>
                </div>
                <Link to="/ai-detection">
                  <Button className="w-full">Try AI Detection</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <CardTitle>Text Humanization</CardTitle>
                </div>
                <CardDescription>
                  Transform AI-generated text into natural, human-like content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p>✓ Natural language conversion</p>
                  <p>✓ Tone preservation</p>
                  <p>✓ Instant processing</p>
                </div>
                <Link to="/ai-detection">
                  <Button className="w-full">Try Humanization</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-primary" />
                  <CardTitle>Text Processing Tools</CardTitle>
                </div>
                <CardDescription>
                  Comprehensive text tools for summarizing, paraphrasing, and enhancement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p>✓ Text summarization</p>
                  <p>✓ Paraphrasing & rewriting</p>
                  <p>✓ Grammar correction</p>
                </div>
                <Button className="w-full">View Tools Below</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Languages className="h-5 w-5 text-primary" />
                  <CardTitle>Translation</CardTitle>
                </div>
                <CardDescription>
                  Accurate translation services powered by advanced AI.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p>✓ Multi-language support</p>
                  <p>✓ Context-aware translation</p>
                  <p>✓ Professional quality</p>
                </div>
                <Button className="w-full">View Tools Below</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle>Tone Adjustment</CardTitle>
                </div>
                <CardDescription>
                  Adjust text tone for different audiences and contexts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p>✓ Professional tone</p>
                  <p>✓ Casual & friendly</p>
                  <p>✓ Academic style</p>
                </div>
                <Button className="w-full">View Tools Below</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>Content Enhancement</CardTitle>
                </div>
                <CardDescription>
                  Improve clarity, flow, and impact of your written content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p>✓ Writing enhancement</p>
                  <p>✓ Clarity improvement</p>
                  <p>✓ Style optimization</p>
                </div>
                <Button className="w-full">View Tools Below</Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Text Tools Section */}
        <TextTools />
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
