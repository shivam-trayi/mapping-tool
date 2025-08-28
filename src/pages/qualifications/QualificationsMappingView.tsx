import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Qualification, ViewType } from '../../types/qualicationTypes';



interface QualificationsMappingViewProps {
  setCurrentView: (view: ViewType) => void;
  setShowMappingReviewModal: (show: boolean) => void;
  qualifications: Qualification[];
  isLoadingTable: boolean;
  resolvedTheme: 'light' | 'dark';
}

export const QualificationsMappingView: React.FC<QualificationsMappingViewProps> = ({
  setCurrentView,
  setShowMappingReviewModal,
  qualifications,
  isLoadingTable,
  resolvedTheme
}) => (
  <motion.div
    key="qualifications-mapping-view"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="p-6"
  >
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Qualifications Mapping</h2>
      <div className="flex space-x-3">
        <Button onClick={() => setCurrentView('questionMapping')} variant="default">Question Mapping</Button>
        <Button onClick={() => setShowMappingReviewModal(true)} variant="default">Mapping Review</Button>
        <Button onClick={() => setCurrentView('list')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    </div>

    <div className={cn(
      "flex items-center space-x-4 mb-6 transition-colors",
      resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
    )}>
      <select className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600">
        <option>Select Type</option>
      </select>
      <select className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600">
        <option>Select Customer/Supplier</option>
      </select>
    </div>

    <div className={cn(
      "rounded-lg shadow overflow-hidden transition-colors",
      resolvedTheme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    )}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className={cn(
          "transition-colors",
          resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        )}>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
              S.No
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
              Qualifications
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
              Mapped
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
              Old Mapped
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
              Enter Constant Id
            </th>
          </tr>
        </thead>
        <tbody className={cn(
          "divide-y transition-colors",
          resolvedTheme === 'dark' ? 'bg-gray-800 text-gray-100 divide-gray-700' : 'bg-white text-gray-900 divide-gray-200'
        )}>
          {isLoadingTable ? (
            <tr>
              <td colSpan={5} className="p-6 text-center text-gray-500">
                Loading...
              </td>
            </tr>
          ) : (
            qualifications.map((q, idx) => (
              <tr key={q.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{idx + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{q.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">Not Mapped</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">Not Mapped</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="text" className="px-2 py-1 w-full border rounded-lg dark:bg-gray-900 dark:border-gray-600" />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="p-4 text-right">
        <Button>Save for Review</Button>
      </div>
    </div>
  </motion.div>
);