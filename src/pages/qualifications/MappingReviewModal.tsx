import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MappingEntry, Qualification } from '../../types/qualicationTypes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';


interface MappingReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mappings: MappingEntry[];
  qualifications: Qualification[];
  resolvedTheme: 'light' | 'dark';
}

export const MappingReviewModal: React.FC<MappingReviewModalProps> = ({
  isOpen,
  onClose,
  mappings,
  qualifications,
  resolvedTheme
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={cn(
            "rounded-2xl shadow-lg w-full max-w-4xl p-6 transition-colors",
            resolvedTheme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
          )}
        >
          <div className={cn(
            "flex justify-between items-center border-b pb-4 mb-4 transition-colors",
            resolvedTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          )}>
            <h2 className="text-xl font-bold">Question Mapping Review</h2>
            <Button onClick={onClose} variant="ghost" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </Button>
          </div>
          
          <div className="overflow-y-auto max-h-[70vh]">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={cn(
                "sticky top-0 transition-colors",
                resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              )}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Question</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Mapped Field</th>
                </tr>
              </thead>
              <tbody className={cn(
                "divide-y transition-colors",
                resolvedTheme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
              )}>
                {mappings.map(m => {
                  const qualification = qualifications.find(q => q.id === m.qualificationId);
                  const question = qualification?.questions.find(q => q.id === m.questionId);
                  if (!question) return null;

                  return (
                    <tr key={m.questionId} className={cn(
                      "transition-colors",
                      resolvedTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    )}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{question.text}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{m.externalId || 'Not Mapped'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={cn(
            "mt-6 flex justify-end space-x-3 border-t pt-4 transition-colors",
            resolvedTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          )}>
            <Button onClick={() => { /* save logic here */ }} variant="default">Save</Button>
            <Button onClick={onClose} variant="outline">Close</Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};