'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function SettingsPage() {
    const { toast } = useToast();
    const [apiKey, setApiKey] = useState('');
    const [apiSecret, setApiSecret] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real application, you would send this to a secure backend endpoint.
        // Never store secrets on the client side.
        console.log("API Key:", apiKey);
        console.log("API Secret:", apiSecret);

        toast({
            title: "Settings Saved (Simulated)",
            description: "In a real app, your keys would be securely processed.",
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your Alpaca API credentials.</p>
            </div>
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>API Credentials</CardTitle>
                        <CardDescription>
                            Enter your API key and secret from your Alpaca account. These are used to fetch your portfolio data.
                            <br/>
                            <strong>Note:</strong> Your credentials are not stored in the browser.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="api-key">API Key</Label>
                            <Input 
                                id="api-key" 
                                placeholder="Your Alpaca API Key" 
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="api-secret">API Secret</Label>
                            <Input 
                                id="api-secret" 
                                placeholder="Your Alpaca API Secret" 
                                type="password" 
                                value={apiSecret}
                                onChange={(e) => setApiSecret(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Save Credentials</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
