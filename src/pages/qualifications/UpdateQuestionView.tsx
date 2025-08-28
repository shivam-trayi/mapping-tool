import React from 'react';
import { motion } from 'framer-motion';
import { Edit, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Question } from '../../types/qualicationTypes';


// types/views.ts
export type ViewType =
    | 'list'
    | 'create'
    | 'edit'
    | 'mapping'
    | 'addQuestion'
    | 'qualificationsMapping'
    | 'questionMapping'
    | 'updateQuestion';


interface UpdateQuestionViewProps {
    setCurrentView: (view: ViewType) => void;
    updateQuestionForm: Partial<Question>;
    setUpdateQuestionForm: (form: Partial<Question>) => void;
    handleUpdateQuestion: () => void;
    editingQuestion: Question | null;
    languages: string[];
    questionTypes: Question['type'][];
    isSaving: boolean;
    isLoadingTable: boolean;
    resolvedTheme: 'light' | 'dark';
}

export const UpdateQuestionView: React.FC<UpdateQuestionViewProps> = ({
    setCurrentView,
    updateQuestionForm,
    setUpdateQuestionForm,
    handleUpdateQuestion,
    editingQuestion,
    languages,
    questionTypes,
    isSaving,
    isLoadingTable,
    resolvedTheme
}) => (
    <motion.div
        key="update-question-view"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6"
    >
        <div className="flex justify-between items-center mb-6">
            <h2 className={cn(
                "text-2xl font-bold transition-colors",
                resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            )}>
                Update Question
            </h2>
            <Button onClick={() => setCurrentView('edit')} variant="default">
                Qualification list
            </Button>
        </div>
        <div className={cn(
            "rounded-2xl shadow-lg p-8 transition-colors",
            resolvedTheme === 'dark'
                ? 'bg-gray-800 text-gray-100 border border-gray-700'
                : 'bg-white text-gray-900 border border-gray-200'
        )}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Question*
                    </label>
                    <textarea
                        value={updateQuestionForm.text || ''}
                        onChange={(e) => setUpdateQuestionForm({ ...updateQuestionForm, text: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
                        rows={3}
                        placeholder="Enter your question"
                    />
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Question Language*
                        </label>
                        <select
                            value={updateQuestionForm.language || 'English-US'}
                            onChange={(e) => setUpdateQuestionForm({ ...updateQuestionForm, language: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
                        >
                            {languages.map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Question Type*
                        </label>
                        <select
                            value={updateQuestionForm.type || 'Radio'}
                            onChange={(e) => setUpdateQuestionForm({ ...updateQuestionForm, type: e.target.value as Question['type'] })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
                        >
                            {questionTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            {(updateQuestionForm.type === 'Radio' || updateQuestionForm.type === 'Checkbox') && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Options (separated by semicolon)
                    </label>
                    <input
                        type="text"
                        value={updateQuestionForm.options?.join(';') || ''}
                        onChange={(e) => setUpdateQuestionForm({
                            ...updateQuestionForm,
                            options: e.target.value.split(';').map(opt => opt.trim()).filter(opt => opt)
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
                        placeholder="Option 1; Option 2; Option 3"
                    />
                </div>
            )}
            <div className="mt-8 flex justify-end space-x-3">
                <Button onClick={handleUpdateQuestion} disabled={!updateQuestionForm.text?.trim() || isSaving}>
                    {isSaving ? 'Updating...' : 'Update Question'}
                </Button>
                <Button onClick={() => setCurrentView('edit')} variant="outline" disabled={isSaving}>
                    Cancel
                </Button>
            </div>
        </div>
        <div className={cn(
            "rounded-2xl shadow-lg overflow-hidden mt-6 transition-colors",
            resolvedTheme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        )}>
            <div className={cn(
                "px-8 py-6 border-b transition-colors",
                resolvedTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            )}>
                <h3 className="text-xl font-bold">Option list</h3>
            </div>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={cn(
                    "transition-colors",
                    resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                )}>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">S.No</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Option</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Language</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Update/Edit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Active/Inactive</th>
                    </tr>
                </thead>
                <tbody className={cn(
                    "divide-y transition-colors",
                    resolvedTheme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
                )}>
                    {isLoadingTable ? (
                        <tr>
                            <td colSpan={5} className="p-6 text-center text-gray-500">
                                Loading...
                            </td>
                        </tr>
                    ) : editingQuestion?.options.length > 0 ? (
                        editingQuestion?.options.map((option, idx) => (
                            <tr key={idx} className={cn(
                                "transition-colors",
                                resolvedTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                            )}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{idx + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{option}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{editingQuestion.language}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="flex items-center">
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