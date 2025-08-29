import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ViewType } from "@/types/qualicationTypes";

interface Option {
  id: string;
  text: string;
}

interface UpdateOptionViewProps {
  setCurrentView: React.Dispatch<React.SetStateAction<ViewType>>;
  editingOption?: Option | null;
}

export const UpdateOptionView: React.FC<UpdateOptionViewProps> = ({
  setCurrentView,
  editingOption,
}) => {
  const [option, setOption] = useState(editingOption?.text || "");

  const handleUpdate = () => {
    // TODO: update option API call ya state update
    console.log("Option updated:", option);
    setCurrentView("edit");
  };

  return (
    <motion.div
      key="updateOption"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="p-6"
    >
      <h2 className="text-xl font-bold mb-4">Update Option</h2>
      <Input
        placeholder="Enter option text"
        value={option}
        onChange={(e) => setOption(e.target.value)}
        className="mb-4"
      />
      <div className="flex space-x-3">
        <Button onClick={handleUpdate} className="gradient-primary text-white">
          Update
        </Button>
        <Button variant="outline" onClick={() => setCurrentView("edit")}>
          Cancel
        </Button>
      </div>
    </motion.div>
  );
};
