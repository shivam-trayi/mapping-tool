import { cn } from "@/lib/utils";
import { Button } from "./button";

export const MessageBox = ({ message, onClose, resolvedTheme }) => {
  if (!message) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={cn(
          "p-6 rounded-lg shadow-xl max-w-sm w-full transition-colors",
          resolvedTheme === "dark"
            ? "bg-gray-800 text-gray-100"
            : "bg-white text-gray-900"
        )}
      >
        <p className="text-center text-lg">{message}</p>
        <div className="mt-4 text-center">
          <Button onClick={onClose}>OK</Button>
        </div>
      </div>
    </div>
  );
};
