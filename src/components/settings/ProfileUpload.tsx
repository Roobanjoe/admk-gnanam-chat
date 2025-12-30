import { useState, useRef } from "react";
import { Upload, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface ProfileUploadProps {
  currentAvatar?: string;
  displayName?: string;
  onAvatarUpdate?: (url: string) => void;
}

export function ProfileUpload({ currentAvatar, displayName, onAvatarUpdate }: ProfileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // Create a local preview URL
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      onAvatarUpdate?.(localUrl);
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully"
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={previewUrl} alt="Profile picture" />
          <AvatarFallback className="text-lg">
            <User className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        
        {previewUrl && (
          <Button
            variant="outline"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={() => {
              setPreviewUrl(undefined);
              onAvatarUpdate?.("");
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? "border-primary bg-primary/5" 
            : "border-muted hover:border-primary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="space-y-2">
          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
          <div className="text-sm">
            <span className="font-medium text-primary">Click to upload</span>
            <span className="text-muted-foreground"> or drag and drop</span>
          </div>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, GIF up to 5MB
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full"
      >
        {uploading ? "Uploading..." : "Change Avatar"}
      </Button>
    </div>
  );
}
