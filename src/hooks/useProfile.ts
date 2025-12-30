import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  user_id: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>({
    id: "local",
    user_id: "local",
    display_name: "",
    bio: "",
    avatar_url: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  const [loading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return;

    setUpdating(true);
    try {
      const updatedProfile = {
        ...profile,
        ...updates,
        updated_at: new Date().toISOString()
      };
      setProfile(updatedProfile);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  return {
    profile,
    loading,
    updating,
    updateProfile,
    refetch: () => {}
  };
}
