import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UpdateOptionView: React.FC = () => {
  const { id } = useParams();
  const [option, setOption] = useState(`Option ${id}`); // mock data
  const navigate = useNavigate();

  const handleUpdate = () => {
    console.log("Updated option:", id, option);
  };

  return (
    <div className="p-6">
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
        <Button variant="outline" onClick={() => navigate("/options")}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default UpdateOptionView;
