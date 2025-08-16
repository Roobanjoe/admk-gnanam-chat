import { Link } from "react-router-dom";
import { BackButton } from "@/components/ui/back-button";
import { useEffect } from "react";

const NotFound = () => {
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      window.location.pathname
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <div className="text-center space-y-6">
        <BackButton className="mb-8" />
        <h1 className="text-6xl font-bold text-neon">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Oops! Page not found</p>
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-neon hover:text-neon/80 transition-colors font-medium"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
