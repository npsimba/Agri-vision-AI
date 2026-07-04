import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background px-6">
      <div className="text-center space-y-3">
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground">
          {location.pathname} doesn't exist.
        </p>
        <a
          href="/"
          className="inline-block pt-2 text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          Back to AgroVision
        </a>
      </div>
    </div>
  );
};

export default NotFound;
