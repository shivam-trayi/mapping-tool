import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 
type ViewType = 'list' | 'create' | 'edit';

interface QualificationForm {
  name: string;
  isTest: boolean;
  active: boolean;
}


interface CreateEditViewProps {
  setCurrentView: (view: ViewType) => void;
  qualificationForm: QualificationForm;
  setQualificationForm: (form: QualificationForm) => void;
  handleSaveQualification: () => void;
  isSaving: boolean;
  resolvedTheme: 'light' | 'dark';
}

export const CreateEditView: React.FC<CreateEditViewProps> = ({
  setCurrentView,
  qualificationForm,
  setQualificationForm,
  handleSaveQualification,
  isSaving,
  resolvedTheme
}) => (
  <motion.div 
    key="create-edit-view"
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
        Create Qualifications
      </h2>
      <Button onClick={() => setCurrentView('list')} variant="default">
        Qualification list
      </Button>
    </div>
    <div className={cn(
      "rounded-2xl shadow-lg p-8 transition-colors",
      resolvedTheme === 'dark' 
        ? 'bg-gray-800 text-gray-100 border border-gray-700' 
        : 'bg-white text-gray-900 border border-gray-200'
    )}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Create New Qualification</h3>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={qualificationForm.isTest}
            onChange={(e) => setQualificationForm({ ...qualificationForm, isTest: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
          />
          <span className="text-sm text-gray-700 dark:text-gray-200">Is Test</span>
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Qualification name*
        </label>
        <input
          type="text"
          value={qualificationForm.name}
          onChange={(e) => setQualificationForm({ ...qualificationForm, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
          placeholder="Enter qualification name"
        />
      </div>
      <div className="flex justify-center mt-8">
        <Button
          onClick={handleSaveQualification}
          disabled={!qualificationForm.name.trim() || isSaving}
          className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>{isSaving ? 'Creating...' : 'Create'}</span>
        </Button>
      </div>
    </div>
  </motion.div>
);