import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import { DashboardHeader } from "@/pages/dashboard/DashboardHeader";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const MasterLayout: React.FC = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <div className="flex flex-col min-h-screen">
          {/* {!isDashboardRoute && <Header />} */}

          {isDashboardRoute && (
            <DashboardHeader
              resolvedTheme={resolvedTheme}
              toggleTheme={toggleTheme}
            />
          )}

          <main
            className={cn(
              "flex-grow",
              isDashboardRoute ? "mt-24" : ""
            )}
          >
            <Outlet />
          </main>
        </div>
      </TooltipProvider>
    </AuthProvider>
  );
};

export default MasterLayout;
