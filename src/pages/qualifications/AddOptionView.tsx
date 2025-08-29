import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AddOption: React.FC = () => {
  const [option, setOption] = useState("");
  const navigate = useNavigate();

  const handleSave = () => {
    console.log("New option:", option);
    navigate("/options"); // back to list
  };

  return (
    <div className="p-6">
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
        <Button variant="outline" onClick={() => navigate("/options")}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AddOption;
