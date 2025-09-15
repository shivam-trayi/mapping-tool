import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const NotFound = () => {

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 text-foreground p-4 font-sans">
      <Card className="text-center space-y-8 p-10 sm:p-16 rounded-3xl shadow-elevated max-w-lg w-full border border-border/20 bg-background/95 backdrop-blur-md">
        <div className="relative">
          <h1 className="text-7xl sm:text-8xl font-extrabold text-transparent bg-clip-text gradient-primary drop-shadow-lg animate-pulse">
            404
          </h1>
          <p className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            Page Not Found
          </p>
        </div>
        <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
          The page you’re looking for doesn’t exist or has been moved. Let’s get you back on track.
        </p>
        <Button asChild className="w-full gradient-primary text-white font-semibold h-11 rounded-full shadow-md hover:shadow-lg transition-transform hover:scale-[1.02] active:scale-95">
          <Link to="/">Return to Home</Link>
        </Button>
      </Card>
    </div>
  );
};

export default NotFound;
