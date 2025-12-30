import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, Trash2, Download, LogOut } from "lucide-react";

interface AuthenticationSectionProps {
  phoneNumber: string;
}

export function AuthenticationSection({ phoneNumber }: AuthenticationSectionProps) {
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { toast } = useToast();

  const handlePhoneUpdate = async () => {
    toast({
      title: "Feature coming soon",
      description: "Phone number updates will be available in a future update",
      variant: "default"
    });
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const exportData = {
        user: {
          phone_number: phoneNumber,
        },
        exported_at: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported",
        description: "Your data has been downloaded successfully"
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message || "Failed to export data",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleAccountDeletion = async () => {
    setIsDeleting(true);
    try {
      toast({
        title: "Account deletion initiated",
        description: "Contact support to complete account deletion.",
        variant: "destructive"
      });
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to delete account",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "Failed to sign out",
        variant: "destructive"
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Manage your account credentials and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Phone number changes will be available in a future update
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update Phone Number</CardTitle>
          <CardDescription>
            Change your phone number (coming soon)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handlePhoneUpdate}
            disabled={isUpdatingPhone}
            className="w-full"
            variant="outline"
          >
            {isUpdatingPhone ? "Updating..." : "Update Phone Number"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            This feature will be available in a future update
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Export your data or manage your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            onClick={handleExportData}
            disabled={isExporting}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export My Data"}
          </Button>

          <Button
            variant="outline"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isSigningOut ? "Signing Out..." : "Sign Out"}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleAccountDeletion}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
