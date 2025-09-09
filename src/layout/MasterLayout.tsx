import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import { DashboardHeader } from "@/pages/dashboard/DashboardHeader";
import { useTheme } from "@/hooks/useTheme";

const MasterLayout: React.FC = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <div className="flex flex-col min-h-screen">
          {/* 🔹 Public pages ke liye normal Header */}
          {!isDashboardRoute && <Header />}

          {/* 🔹 Dashboard ke liye DashboardHeader */}
          {isDashboardRoute && (
            <DashboardHeader resolvedTheme={resolvedTheme} toggleTheme={toggleTheme} />
          )}

          <main className="flex-grow">
            <Outlet />
          </main>
        </div>
      </TooltipProvider>
    </AuthProvider>
  );
};

export default MasterLayout;
