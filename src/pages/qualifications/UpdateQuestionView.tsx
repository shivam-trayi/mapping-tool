import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, ToggleRight, ToggleLeft, Save, X, List, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';


type QuestionType = "Radio" | "Checkbox" | "Text";
type Option = { text: string; language: string; active: boolean };
type Question = { text: string; type: QuestionType; language: string; options?: Option[] };

const UpdateQuestionView: React.FC = () => {
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState<"edit" | "addOption">("edit");
  const [updateQuestionForm, setUpdateQuestionForm] = useState<Partial<Question>>({
    text: "Sample question?",
    type: "Radio",
    language: "English-US",
    options: [
      { text: "Option 1", language: "English-US", active: true },
      { text: "Option 2", language: "English-US", active: false },
      { text: "Option 3", language: "English-US", active: true },
    ],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [resolvedTheme] = useState<"light" | "dark">("light");

  const languages = ["English-US", "Hindi", "Spanish"];
  const questionTypes: QuestionType[] = ["Radio", "Checkbox", "Text"];
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleToggleOption = (index: number) => {
    if (!updateQuestionForm.options) return;
    const updatedOptions = [...updateQuestionForm.options];
    updatedOptions[index] = { ...updatedOptions[index], active: !updatedOptions[index].active };
    setUpdateQuestionForm({ ...updateQuestionForm, options: updatedOptions });
  };

  const filteredOptions = useMemo(() => {
    if (!updateQuestionForm.options) return [];
    return updateQuestionForm.options.filter((o) =>
      o.text.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [updateQuestionForm.options, debouncedSearch]);

  const paginatedOptions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOptions.slice(start, start + pageSize);
  }, [filteredOptions, currentPage]);

  const totalPages = useMemo(() => Math.ceil(filteredOptions.length / pageSize) || 1, [filteredOptions]);

  const handleUpdateQuestion = () => {
    setIsSaving(true);
    console.log("Updated question:", updateQuestionForm);
    setTimeout(() => setIsSaving(false), 1000);
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
        <h2 className={cn("text-2xl font-bold transition-colors", resolvedTheme === "dark" ? "text-gray-100" : "text-gray-900")}>
          Update Question
        </h2>
        <Button onClick={() => setCurrentView("edit")} variant="default">
          <List className="w-4 h-4 mr-2" /> Qualification list
        </Button>
      </div>

      {/* Question Form */}
      <div className={cn(
        "rounded-2xl shadow-lg p-8 transition-colors",
        resolvedTheme === "dark" ? "bg-gray-800 text-gray-100 border border-gray-700" : "bg-white text-gray-900 border border-gray-200"
      )}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium mb-2">Question*</label>
            <textarea
              value={updateQuestionForm.text || ""}
              onChange={(e) => setUpdateQuestionForm({ ...updateQuestionForm, text: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
              rows={3}
            />
          </div>

          {/* Language & Type */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Question Language*</label>
              <select
                value={updateQuestionForm.language || "English-US"}
                onChange={(e) => setUpdateQuestionForm({ ...updateQuestionForm, language: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
              >
                {languages.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Question Type*</label>
              <select
                value={updateQuestionForm.type || "Radio"}
                onChange={(e) => setUpdateQuestionForm({ ...updateQuestionForm, type: e.target.value as QuestionType })}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
              >
                {questionTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Options Input */}
        {(updateQuestionForm.type === "Radio" || updateQuestionForm.type === "Checkbox") && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Options (semicolon separated)</label>
            <input
              type="text"
              value={updateQuestionForm.options?.map(o => o.text).join(";") || ""}
              onChange={(e) =>
                setUpdateQuestionForm({
                  ...updateQuestionForm,
                  options: e.target.value
                    .split(";")
                    .map(text => ({ text: text.trim(), active: true, language: updateQuestionForm.language || "English-US" }))
                    .filter(opt => opt.text)
                })
              }
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
            />
          </div>
        )}

        {/* Save / Cancel */}
        <div className="mt-8 flex justify-end space-x-3">
          <Button
            onClick={handleUpdateQuestion}
            disabled={!updateQuestionForm.text?.trim() || isSaving}
            className="gradient-primary text-white hover:shadow-glow transition-all duration-300"
          >
            <Save className="w-4 h-4 mr-2" /> {isSaving ? "Updating..." : "Update Question"}
          </Button>
          <Button onClick={() => setCurrentView("edit")} variant="outline" disabled={isSaving}>
            <X className="w-4 h-4 mr-2" /> Cancel
          </Button>
        </div>
      </div>

      {/* Options Table + Search */}
      <div className={cn("rounded-2xl shadow-lg overflow-hidden mt-6 transition-colors", resolvedTheme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200")}>
        <div className="px-8 py-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-bold">Option list</h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <Button onClick={() => navigate("/dashboard/add-option")} className="gradient-primary text-white hover:shadow-glow transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" /> Add Option
            </Button>
          </div>
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
          <tbody className={cn("divide-y transition-colors", resolvedTheme === "dark" ? "divide-gray-700" : "divide-gray-200")}>
            {isLoadingTable ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-500">Loading...</td></tr>
            ) : paginatedOptions.length ? (
              paginatedOptions.map((option, idx) => (
                <tr key={idx} className={cn("transition-colors", resolvedTheme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50")}>
                  <td className="px-6 py-4 text-sm">{(currentPage - 1) * pageSize + idx + 1}</td>
                  <td className="px-6 py-4 text-sm">{option.text}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{option.language}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {/* <button onClick={() => setUpdateQuestionForm({ ...updateQuestionForm, text: option.text, language: option.language })}  className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Edit option">
                      <Edit className="w-4 h-4" />
                    </button> */}

                    <button
                      onClick={() => navigate("/dashboard/update-option")}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      title="Edit option"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button onClick={() => handleToggleOption((currentPage - 1) * pageSize + idx)} className="flex items-center p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" title="Toggle option status">
                      {option.active ? <ToggleRight className="w-6 h-6 text-green-500" /> : <ToggleLeft className="w-6 h-6 text-gray-400" />}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="p-6 text-center text-gray-500">No options found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UpdateQuestionView;
