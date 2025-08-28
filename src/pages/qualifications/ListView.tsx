import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Search, Filter, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Qualification, ViewType } from '../../types/qualicationTypes';

interface ListViewProps {
  filteredQualifications: Qualification[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setCurrentView: (view: ViewType) => void;
  handleCreateQualification: () => void;
  handleEditQualification: (qualification: Qualification) => void;
  handleToggleActive: (id: string) => void;
  isLoadingTable: boolean;
  resolvedTheme: 'light' | 'dark';
}
export const ListView: React.FC<ListViewProps> = ({
  filteredQualifications,
  searchTerm,
  setSearchTerm,
  setCurrentView,
  handleCreateQualification,
  handleEditQualification,
  handleToggleActive,
  isLoadingTable,
  resolvedTheme
}) => (
  <motion.div 
    key="list-view"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }} 
    className="p-6"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className={cn(
            "w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors",
            resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-400'
          )} />
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
              "dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
            )}
          />
        </div>
        <Filter className={cn(
          "w-5 h-5 transition-colors",
          resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-400'
        )} />
      </div>
      <div className="flex space-x-3">
        <Button onClick={() => setCurrentView('demoMapping')} variant="outline">
          Demo Priority Mapping
        </Button>
        <Button onClick={() => setCurrentView('mapping')} variant="outline">
          Qualifications Mapping
        </Button>
        <Button onClick={handleCreateQualification}>
          <Plus className="w-4 h-4 mr-2" />
          <span>Create Qualifications</span>
        </Button>
      </div>
    </div>

    <div className={cn(
      "rounded-2xl shadow-lg overflow-hidden",
      resolvedTheme === 'dark' 
        ? 'bg-gray-800 text-gray-200 border border-gray-700' 
        : 'bg-white text-gray-900 border border-gray-200'
    )}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className={cn(
          "transition-colors",
          resolvedTheme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-500'
        )}>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Questions
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Actions
            </th>
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
          ) : filteredQualifications.length > 0 ? (
            filteredQualifications.map((qualification) => (
              <tr key={qualification.id} className={cn(
                "transition-colors",
                resolvedTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              )}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium">
                    {qualification.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    qualification.isTest 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' 
                      : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                  }`}>
                    {qualification.isTest ? 'Test' : 'Production'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {qualification.questions.length} questions
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleActive(qualification.id)}
                    className="flex items-center"
                  >
                    {qualification.active ? (
                      <ToggleRight className="w-6 h-6 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditQualification(qualification)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-6 text-center text-gray-500">
                No qualifications found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </motion.div>
);