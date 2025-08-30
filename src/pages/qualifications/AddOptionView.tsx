import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Qualification, Question, ViewType } from "../../types/qualicationTypes";

interface AddOptionViewProps {
  resolvedTheme: "light" | "dark";
  setCurrentView: (view: ViewType) => void;

  // option input is stored in updateQuestionForm.text + language
  updateQuestionForm: Partial<Question>;
  setUpdateQuestionForm: React.Dispatch<React.SetStateAction<Partial<Question>>>;

  languages: string[];
  isSaving: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;

  // current editing context
  editingQuestion: Question | null;
  editingQualification: Qualification | null;
  setEditingQualification: React.Dispatch<React.SetStateAction<Qualification | null>>;

  // full list
  qualifications: Qualification[];
  setQualifications: React.Dispatch<React.SetStateAction<Qualification[]>>;

  // feedback
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const AddOptionView: React.FC<AddOptionViewProps> = ({
  resolvedTheme,
  setCurrentView,
  updateQuestionForm,
  setUpdateQuestionForm,
  languages,
  isSaving,
  setIsSaving,
  editingQuestion,
  editingQualification,
  setEditingQualification,
  qualifications,
  setQualifications,
  setMessage,
}) => {
const handleAddOption = () => {
  if (!editingQuestion || !editingQualification) return;

  const text = (updateQuestionForm.text || "").trim();
  const language = updateQuestionForm.language || "English-US";

  if (!text) return;

  setIsSaving(true);

  setTimeout(() => {
    // Create new Option object
    const newOption = { text, language, active: true };

    // Append to current question's options
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

    // Clear input but keep last chosen language
    setUpdateQuestionForm((prev) => ({ ...prev, text: "", language }));

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
        <h2
          className={cn(
            "text-2xl font-bold transition-colors",
            resolvedTheme === "dark" ? "text-gray-100" : "text-gray-900"
          )}
        >
          Add Option
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
          {/* Option Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Option Text*</label>
            <input
              type="text"
              value={updateQuestionForm.text || ""}
              onChange={(e) =>
                setUpdateQuestionForm((prev) => ({ ...prev, text: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
              placeholder="Enter option text"
            />
          </div>

          {/* Option Language */}
          <div>
            <label className="block text-sm font-medium mb-2">Option Language*</label>
            <select
              value={updateQuestionForm.language || "English-US"}
              onChange={(e) =>
                setUpdateQuestionForm((prev) => ({ ...prev, language: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            onClick={handleAddOption}
            disabled={!updateQuestionForm.text?.trim() || isSaving}
          >
            {isSaving ? "Adding..." : "Add Option"}
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
