import { ArrowLeft, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className }: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // If on settings page, go to home instead of browser back
  const isSettingsPage = location.pathname === '/settings';
  
  const handleClick = () => {
    if (isSettingsPage) {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={`flex items-center gap-2 text-muted-foreground hover:text-foreground ${className}`}
    >
      {isSettingsPage ? <Home className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
      {isSettingsPage ? 'Home' : 'Back'}
    </Button>
  );
}