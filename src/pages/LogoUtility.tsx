import React from 'react';
import { LogoProcessor } from '../components/LogoProcessor';
import { BackButton } from '../components/ui/back-button';

export default function LogoUtility() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <BackButton />
        </div>
        
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Logo Background Removal Utility</h1>
            <p className="text-muted-foreground">
              Use AI to automatically remove the background from the AIADMK logo
            </p>
          </div>
          
          <LogoProcessor />
        </div>
      </div>
    </div>
  );
}