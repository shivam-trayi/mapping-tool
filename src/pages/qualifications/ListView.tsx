// src/components/qualifications/ListView.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Search, Filter, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Qualification, ViewType } from '../../types/qualicationTypes';
import { Pagination, PaginationFirst, PaginationPrevious, PaginationNext, PaginationLast, PaginationLink } from '@/components/ui/pagination';

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
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
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
  resolvedTheme,
  currentPage,
  setCurrentPage,
  totalPages
}) => {

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <motion.div key="list-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 transition-colors"
            />
          </div>
          <Filter className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => setCurrentView('demoMapping')} variant="outline">Demo Priority Mapping</Button>
          <Button onClick={() => setCurrentView('mapping')} variant="outline">Qualifications Mapping</Button>
          <Button onClick={handleCreateQualification}>
            <Plus className="w-4 h-4 mr-2" /> Create Qualifications
          </Button>
        </div>
      </div>

      <div className={cn("rounded-2xl shadow-lg overflow-hidden", resolvedTheme === 'dark' ? 'bg-gray-800 text-gray-200 border border-gray-700' : 'bg-white text-gray-900 border border-gray-200')}>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={cn("transition-colors", resolvedTheme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-500')}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Questions</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={cn("divide-y transition-colors", resolvedTheme === 'dark' ? 'divide-gray-700' : 'divide-gray-200')}>
            {isLoadingTable ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">Loading...</td>
              </tr>
            ) : filteredQualifications.length > 0 ? (
              filteredQualifications.map((q) => (
                <tr key={q.id} className={cn(resolvedTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50')}>
                  <td className="px-6 py-4 font-medium">{q.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${q.isTest ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'}`}>{q.isTest ? 'Test' : 'Production'}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{q.questions.length} questions</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleToggleActive(q.id)}>
                      {q.active ? <ToggleRight className="w-6 h-6 text-green-500" /> : <ToggleLeft className="w-6 h-6 text-gray-400" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <Button variant="ghost" size="sm" onClick={() => handleEditQualification(q)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">No qualifications found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination className="flex justify-center mt-4 space-x-2">
          <PaginationFirst onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
          <PaginationPrevious onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1} />
          {pageNumbers.map((num) => (
            <PaginationLink key={num} isActive={currentPage === num} onClick={() => setCurrentPage(num)}>{num}</PaginationLink>
          ))}
          <PaginationNext onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages} />
          <PaginationLast onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      )}
    </motion.div>
  );
};
