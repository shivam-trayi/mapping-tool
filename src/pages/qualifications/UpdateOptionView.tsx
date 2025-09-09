import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const UpdateOptionView: React.FC = () => {
  const resolvedTheme = "light"; // dummy theme
  const [currentOption, setCurrentOption] = useState({
    text: "Sample Option",
    language: "English-US",
    active: true,
  });

  const languages = ["English-US", "Spanish", "French"]; // dummy languages
  const [isSaving, setIsSaving] = useState(false);
  const [currentView, setCurrentView] = useState<"updateOption" | "updateQuestion">(
    "updateOption"
  );

  const handleSaveOption = () => {
    setIsSaving(true);
    setTimeout(() => {
      console.log("Saved option:", currentOption);
      setIsSaving(false);
      setCurrentView("updateQuestion"); // redirect to dummy previous view
    }, 500);
  };

  if (currentView === "updateQuestion") {
    return (
      <div className="p-6">
        <h2>Back to Question View (dummy)</h2>
      </div>
    );
  }

  return (
    <motion.div
      key="update-option-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2
          className={cn(
            "text-2xl font-bold transition-colors",
            resolvedTheme === "dark" ? "text-gray-100" : "text-gray-900"
          )}
        >
          Update Option
        </h2>
        <Button onClick={() => setCurrentView("updateQuestion")} variant="default">
          Back to Question
        </Button>
      </div>

      <div
        className={cn(
          "rounded-2xl shadow-lg p-8 transition-colors",
          resolvedTheme === "dark"
            ? "bg-gray-800 text-gray-100 border border-gray-700"
            : "bg-white text-gray-900 border border-gray-200"
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Option Text*</label>
            <input
              type="text"
              value={currentOption.text}
              onChange={(e) =>
                setCurrentOption({ ...currentOption, text: e.target.value })
              }
              placeholder="Enter option text"
              className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Option Language*</label>
            <select
              value={currentOption.language}
              onChange={(e) =>
                setCurrentOption({ ...currentOption, language: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <input
            type="checkbox"
            checked={currentOption.active}
            onChange={(e) =>
              setCurrentOption({ ...currentOption, active: e.target.checked })
            }
          />
          <span>Active</span>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            onClick={handleSaveOption}
            disabled={!currentOption.text.trim() || isSaving}
          >
            {isSaving ? "Updating..." : "Update Option"}
          </Button>
          <Button
            onClick={() => setCurrentView("updateQuestion")}
            variant="outline"
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default UpdateOptionView;
