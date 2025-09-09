import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type QuestionType = 'Radio' | 'Checkbox' | 'Text';
type Option = { text: string; language: string; active: boolean };
type Question = { text: string; type: QuestionType; language: string; options?: Option[] };

const AddQuestionView: React.FC = () => {
  const [currentView, setCurrentView] = useState<'edit' | 'addQuestion'>('addQuestion');
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    text: '',
    type: 'Radio',
    language: 'English-US',
    options: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [resolvedTheme] = useState<'light' | 'dark'>('light');

  const languages = ['English-US', 'Hindi', 'Spanish'];
  const questionTypes: QuestionType[] = ['Radio', 'Checkbox', 'Text'];

  const handleAddQuestion = () => {
    setIsSaving(true);
    console.log('Adding question:', newQuestion);
    setTimeout(() => {
      setIsSaving(false);
      setNewQuestion({ text: '', type: 'Radio', language: 'English-US', options: [] });
    }, 1000);
  };

  return (
    <motion.div
      key="add-question-view"
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
          Add Question
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
              value={newQuestion.text || ''}
              onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
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
                value={newQuestion.language || 'English-US'}
                onChange={(e) => setNewQuestion({ ...newQuestion, language: e.target.value })}
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
                value={newQuestion.type || 'Radio'}
                onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as QuestionType })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
              >
                {questionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {(newQuestion.type === 'Radio' || newQuestion.type === 'Checkbox') && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Options (separated by semicolon)
            </label>
            <input
              type="text"
              value={newQuestion.options?.map(o => o.text).join(';') || ''}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  options: e.target.value
                    .split(';')
                    .map(opt => ({ text: opt.trim(), active: true, language: newQuestion.language || 'English-US' }))
                    .filter(opt => opt.text)
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
              placeholder="Option 1; Option 2; Option 3"
            />
          </div>
        )}

        <div className="mt-8 flex justify-end space-x-3">
          <Button onClick={handleAddQuestion} disabled={!newQuestion.text?.trim() || isSaving}>
            {isSaving ? 'Adding...' : 'Add Question'}
          </Button>
          <Button onClick={() => setCurrentView('edit')} variant="outline" disabled={isSaving}>
            Cancel
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default AddQuestionView;
