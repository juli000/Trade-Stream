'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function AiTraderPage() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setIsLoading(true);
    setAnalysis(null);
    setImageUrl(null);

    try {
      // In a real app, you would call your Genkit flow here
      // const response = await analyzeMarket({ prompt });
      // setAnalysis(response.analysis);
      // setImageUrl(response.imageUrl);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnalysis(`This is a simulated AI analysis for: "${prompt}". The AI indicates a bullish sentiment for the tech sector, citing strong earnings reports from major companies. It recommends a long position on NVDA and AAPL. However, it also warns about potential volatility due to upcoming inflation data releases.`);
      setImageUrl('https://placehold.co/600x400.png');

    } catch (error) {
      console.error('Error getting analysis:', error);
      setAnalysis('Failed to get analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Trader</h1>
        <p className="text-muted-foreground">
          Get AI-powered market analysis and trade ideas.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Market Analysis Prompt</CardTitle>
          <CardDescription>
            Enter a prompt to get an AI-generated market analysis. For example: "Analyze the current state of the semiconductor industry."
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Your prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Analysis
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Generating analysis...</p>
        </div>
      )}

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="whitespace-pre-wrap">{analysis}</p>
            {imageUrl && (
              <div className="relative aspect-video">
                <Image 
                    src={imageUrl} 
                    alt="AI Generated Chart"
                    fill
                    className="rounded-md object-cover"
                    data-ai-hint="market chart"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
