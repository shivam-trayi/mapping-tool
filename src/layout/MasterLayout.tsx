// src/layout/MasterLayout.tsx
// import Header from "@/components/Header";
import React from "react";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

const MasterLayout: React.FC = () => {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <div className="flex flex-col min-h-screen">
          {/* <Header /> */}
          <main className="flex-grow">
            <Outlet />
          </main>
          {/* <Footer /> */}
        </div>
      </TooltipProvider>
    </AuthProvider>
  );
};

export default MasterLayout;
