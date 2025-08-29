import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit, ToggleRight, Save, X, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// View Types
type ViewType =
  | "list"
  | "create"
  | "edit"
  | "mapping"
  | "addQuestion"
  | "qualificationsMapping"
  | "questionMapping"
  | "updateQuestion";

type QuestionType = "Radio" | "Checkbox" | "Text";

interface Question {
  text: string;
  language: string;
  type: QuestionType;
  options?: string[];
  active: boolean;
}

const UpdateQuestionView: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("updateQuestion");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  const languages = ["English-US", "Spanish", "French"];
  const questionTypes: QuestionType[] = ["Radio", "Checkbox", "Text"];

  const [updateQuestionForm, setUpdateQuestionForm] = useState<Partial<Question>>({
    text: "",
    language: "English-US",
    type: "Radio",
    options: ["Option 1", "Option 2"],
    active: true,
  });

  const [editingQuestion, setEditingQuestion] = useState<Question>({
    text: "Sample Question",
    language: "English-US",
    type: "Radio",
    options: ["Option 1", "Option 2"],
    active: true,
  });

  const handleUpdateQuestion = () => {
    setIsSaving(true);
    setTimeout(() => {
      alert(
        `Question Updated (mock):\nText: ${updateQuestionForm.text}\nLanguage: ${updateQuestionForm.language}\nType: ${updateQuestionForm.type}\nOptions: ${updateQuestionForm.options?.join(
          ", "
        )}`
      );
      setIsSaving(false);
      setCurrentView("edit");
    }, 1000);
  };

  const handleToggleOption = (index: number) => {
    const updatedOptions = [...(editingQuestion.options || [])];
    if (updatedOptions[index].includes("(inactive)")) {
      updatedOptions[index] = updatedOptions[index].replace(" (inactive)", "");
    } else {
      updatedOptions[index] += " (inactive)";
    }
    setUpdateQuestionForm({ ...updateQuestionForm, options: updatedOptions });
  };

  return (
    <motion.div
      key="update-question-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2
          className={cn(
            "text-2xl font-bold transition-colors",
            resolvedTheme === "dark" ? "text-gray-100" : "text-gray-900"
          )}
        >
          Update Question
        </h2>
        <Button onClick={() => setCurrentView("edit")} variant="default">
          <List className="w-4 h-4 mr-2" />
          Qualification list
        </Button>
      </div>

      {/* Update Question Form */}
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
            <label className="block text-sm font-medium mb-2">Question*</label>
            <textarea
              value={updateQuestionForm.text || ""}
              onChange={(e) =>
                setUpdateQuestionForm({ ...updateQuestionForm, text: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
              rows={3}
              placeholder="Enter your question"
            />
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Question Language*</label>
              <select
                value={updateQuestionForm.language || "English-US"}
                onChange={(e) =>
                  setUpdateQuestionForm({ ...updateQuestionForm, language: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Question Type*</label>
              <select
                value={updateQuestionForm.type || "Radio"}
                onChange={(e) =>
                  setUpdateQuestionForm({
                    ...updateQuestionForm,
                    type: e.target.value as QuestionType,
                  })
                }
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
              >
                {questionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {(updateQuestionForm.type === "Radio" || updateQuestionForm.type === "Checkbox") && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Options (separated by semicolon)
            </label>
            <input
              type="text"
              value={updateQuestionForm.options?.join(";") || ""}
              onChange={(e) =>
                setUpdateQuestionForm({
                  ...updateQuestionForm,
                  options: e.target.value
                    .split(";")
                    .map((opt) => opt.trim())
                    .filter(Boolean),
                })
              }
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
              placeholder="Option 1; Option 2; Option 3"
            />
          </div>
        )}

        <div className="mt-8 flex justify-end space-x-3">
          <Button
            onClick={handleUpdateQuestion}
            disabled={!updateQuestionForm.text?.trim() || isSaving}
            className="gradient-primary text-white hover:shadow-glow transition-all duration-300"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Updating..." : "Update Question"}
          </Button>
          <Button
            onClick={() => setCurrentView("edit")}
            variant="outline"
            disabled={isSaving}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>

      {/* Option List Table */}
      <div
        className={cn(
          "rounded-2xl shadow-lg overflow-hidden mt-6 transition-colors",
          resolvedTheme === "dark"
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        )}
      >
        <div
          className={cn(
            "px-8 py-6 border-b flex items-center justify-between transition-colors",
            resolvedTheme === "dark" ? "border-gray-700" : "border-gray-200"
          )}
        >
          <h3 className="text-xl font-bold">Option list</h3>
          <Button
            onClick={() =>
              setUpdateQuestionForm({
                ...updateQuestionForm,
                options: [...(updateQuestionForm.options || []), `Option ${updateQuestionForm.options?.length + 1}`],
              })
            }
            className="gradient-primary text-white hover:shadow-glow transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Option
          </Button>
        </div>

        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={cn(resolvedTheme === "dark" ? "bg-gray-700" : "bg-gray-50")}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">S.No</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Option</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Language</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Update/Edit</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Active/Inactive</th>
            </tr>
          </thead>
          <tbody className={cn(resolvedTheme === "dark" ? "divide-gray-700" : "divide-gray-200")}>
            {isLoadingTable ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : updateQuestionForm.options && updateQuestionForm.options.length > 0 ? (
              updateQuestionForm.options.map((option, idx) => (
                <tr key={idx} className={cn(resolvedTheme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50")}>
                  <td className="px-6 py-4 text-sm">{idx + 1}</td>
                  <td className="px-6 py-4 text-sm">{option}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{updateQuestionForm.language}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => handleToggleOption(idx)}
                      className="flex items-center p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ToggleRight className="w-6 h-6 text-green-500" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No options found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UpdateQuestionView;
