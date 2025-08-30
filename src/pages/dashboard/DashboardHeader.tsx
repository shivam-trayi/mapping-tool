import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  resolvedTheme: "light" | "dark";
  toggleTheme: () => void;
}

export const DashboardHeader: React.FC<HeaderProps> = ({
  resolvedTheme,
  toggleTheme,
}) => {
  const { user, logout } = useAuth();

  // ✅ Extract initials from username (max 2 letters, uppercase)
  const getInitials = (username?: string) => {
    if (!username) return "U";
    return username
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className={cn(
        "border-b px-6 py-4 transition-colors",
        resolvedTheme === "dark"
          ? "bg-gray-900 border-gray-700"
          : "bg-white border-gray-200"
      )}
    >
      <div className="flex items-center justify-between">
        {/* Left side - Logo + Title */}
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
            SD
          </div>
          <h1
            className={cn(
              "text-2xl font-bold transition-colors",
              resolvedTheme === "dark" ? "text-gray-100" : "text-gray-900"
            )}
          >
            Qualifications Management
          </h1>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={cn(
                "w-9 h-9 rounded-lg transition-colors",
                resolvedTheme === "dark"
                  ? "text-gray-200 hover:bg-gray-700"
                  : "text-gray-800 hover:bg-gray-200"
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={resolvedTheme}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {resolvedTheme === "light" ? (
                    <Moon size={20} />
                  ) : (
                    <Sun size={20} />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </motion.div>

          {/* User Info */}
          <div className="hidden md:flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={user?.username || "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {getInitials(user?.username)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Logout */}
          <Button variant="outline" onClick={logout} size="sm">
            Logout
          </Button>

          {/* Icons */}
          <User
            className={cn(
              "w-6 h-6 transition-colors",
              resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
            )}
          />
          <Settings
            className={cn(
              "w-6 h-6 transition-colors",
              resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
            )}
          />
        </div>
      </div>
    </div>
  );
};
