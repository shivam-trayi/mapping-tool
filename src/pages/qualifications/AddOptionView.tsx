import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ViewType } from "@/types/qualicationTypes";

interface AddOptionViewProps {
  setCurrentView: React.Dispatch<React.SetStateAction<ViewType>>;
}

export const AddOptionView: React.FC<AddOptionViewProps> = ({ setCurrentView }) => {
  const [option, setOption] = useState("");

  const handleSave = () => {
    // TODO: save option API call ya state update
    console.log("New option added:", option);
    setCurrentView("edit"); // back to option list / edit screen
  };

  return (
    <motion.div
      key="addOption"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="p-6"
    >
      <h2 className="text-xl font-bold mb-4">Add Option</h2>
      <Input
        placeholder="Enter option text"
        value={option}
        onChange={(e) => setOption(e.target.value)}
        className="mb-4"
      />
      <div className="flex space-x-3">
        <Button onClick={handleSave} className="gradient-primary text-white">
          Save
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentView("edit")}
        >
          Cancel
        </Button>
      </div>
    </motion.div>
  );
};
