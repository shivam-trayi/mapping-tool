import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type QuestionType = "Radio" | "Checkbox" | "Text";
type Option = { text: string; language: string; active: boolean };
type Question = { id: string; text: string; type: QuestionType; language: string; options?: Option[] };
type Qualification = { id: string; name: string; questions: Question[] };

const AddOptionView: React.FC = () => {
  const [currentView, setCurrentView] = useState<"updateQuestion" | "addOption">("addOption");
  const [updateQuestionForm, setUpdateQuestionForm] = useState<Partial<Question>>({
    text: "",
    language: "English-US",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Dummy data for demonstration
  const [qualifications, setQualifications] = useState<Qualification[]>([
    {
      id: "q1",
      name: "Sample Qualification",
      questions: [
        {
          id: "ques1",
          text: "Sample question?",
          type: "Radio",
          language: "English-US",
          options: [
            { text: "Option 1", language: "English-US", active: true },
          ],
        },
      ],
    },
  ]);
  const [editingQualification, setEditingQualification] = useState<Qualification | null>(qualifications[0]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(editingQualification?.questions[0] || null);

  const languages = ["English-US", "Hindi", "Spanish"];

  const handleAddOption = () => {
    if (!editingQuestion || !editingQualification) return;

    const text = (updateQuestionForm.text || "").trim();
    const language = updateQuestionForm.language || "English-US";
    if (!text) return;

    setIsSaving(true);
    setTimeout(() => {
      const newOption: Option = { text, language, active: true };

      const updatedQuestions = editingQualification.questions.map((q) =>
        q.id === editingQuestion.id
          ? { ...q, options: [...(q.options ?? []), newOption] }
          : q
      );

      const updatedQualification: Qualification = {
        ...editingQualification,
        questions: updatedQuestions,
      };

      setQualifications((prev) =>
        prev.map((q) => (q.id === editingQualification.id ? updatedQualification : q))
      );
      setEditingQualification(updatedQualification);

      setUpdateQuestionForm({ ...updateQuestionForm, text: "", language });
      setMessage("Option added successfully!");
      setIsSaving(false);
      setCurrentView("updateQuestion");
    }, 600);
  };

  return (
    <motion.div
      key="add-option-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className={cn("text-2xl font-bold transition-colors", "text-gray-900")}>Add Option</h2>
        <Button onClick={() => setCurrentView("updateQuestion")} variant="default">
          Back to Question
        </Button>
      </div>

      <div className={cn(
        "rounded-2xl shadow-lg p-8 transition-colors",
        "bg-white text-gray-900 border border-gray-200"
      )}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Option Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Option Text*</label>
            <input
              type="text"
              value={updateQuestionForm.text || ""}
              onChange={(e) => setUpdateQuestionForm((prev) => ({ ...prev, text: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="Enter option text"
            />
          </div>

          {/* Option Language */}
          <div>
            <label className="block text-sm font-medium mb-2">Option Language*</label>
            <select
              value={updateQuestionForm.language || "English-US"}
              onChange={(e) => setUpdateQuestionForm((prev) => ({ ...prev, language: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              {languages.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button onClick={handleAddOption} disabled={!updateQuestionForm.text?.trim() || isSaving}>
            {isSaving ? "Adding..." : "Add Option"}
          </Button>
          <Button onClick={() => setCurrentView("updateQuestion")} variant="outline" disabled={isSaving}>
            Cancel
          </Button>
        </div>

        {message && <p className="mt-4 text-green-600">{message}</p>}
      </div>
    </motion.div>
  );
};

export default AddOptionView;
