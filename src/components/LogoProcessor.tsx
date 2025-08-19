import React, { useState } from 'react';
import { Button } from './ui/button';
import { removeBackground, loadImageFromUrl } from '../lib/background-removal';
import { toast } from 'sonner';

export const LogoProcessor: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string>('');

  const processLogo = async () => {
    setIsProcessing(true);
    try {
      toast.info('Loading logo image...');
      
      // Load the current logo
      const logoImage = await loadImageFromUrl('/lovable-uploads/8ccb2411-1bf4-432d-8590-fbdd08ec8027.png');
      
      toast.info('Removing background... This may take a moment.');
      
      // Remove background
      const transparentBlob = await removeBackground(logoImage);
      
      // Create URL for the processed image
      const processedUrl = URL.createObjectURL(transparentBlob);
      setProcessedImageUrl(processedUrl);
      
      // Download the processed image
      const link = document.createElement('a');
      link.download = 'aiadmk-logo-transparent.png';
      link.href = processedUrl;
      link.click();
      
      toast.success('Background removed successfully! Download started.');
    } catch (error) {
      console.error('Error processing logo:', error);
      toast.error('Failed to remove background. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 bg-card rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Logo Background Removal</h3>
      <div className="space-y-4">
        <div className="flex gap-4 items-center">
          <img 
            src="/lovable-uploads/8ccb2411-1bf4-432d-8590-fbdd08ec8027.png"
            alt="Original Logo"
            className="w-16 h-16 border rounded"
          />
          <Button 
            onClick={processLogo} 
            disabled={isProcessing}
            className="min-w-[200px]"
          >
            {isProcessing ? 'Processing...' : 'Remove Background'}
          </Button>
        </div>
        
        {processedImageUrl && (
          <div className="flex gap-4 items-center">
            <img 
              src={processedImageUrl}
              alt="Processed Logo"
              className="w-16 h-16 border rounded bg-checkered"
              style={{ 
                backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                backgroundSize: '10px 10px',
                backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
              }}
            />
            <span className="text-sm text-muted-foreground">Transparent background applied</span>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-4">
        This tool uses AI to automatically remove the white background from the logo, making it transparent.
      </p>
    </div>
  );
};