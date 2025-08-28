import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X, CheckSquare, Square, Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast,
} from '@/components/ui/pagination';
import { usePagination } from '@/hooks/usePagination';
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

interface ReviewMappingData {
  id: string;
  questionText: string;
  qualificationName: string;
  mappedField: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const MappingReviewModal: React.FC<MappingReviewModalProps> = ({
  isOpen,
  onClose,
  mappings,
  qualifications,
  resolvedTheme
}) => {
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');

  // Mock review data
  const mockReviewData: ReviewMappingData[] = [
    {
      id: '1',
      questionText: 'What is your age group?',
      qualificationName: 'Demographics',
      mappedField: 'AGE_001',
      status: 'pending',
    },
    {
      id: '2',
      questionText: 'What is your gender?',
      qualificationName: 'Demographics',
      mappedField: 'GENDER_001',
      status: 'approved',
    },
    {
      id: '3',
      questionText: 'What is your income level?',
      qualificationName: 'Demographics',
      mappedField: 'INCOME_001',
      status: 'pending',
    },
    {
      id: '4',
      questionText: 'How often do you shop?',
      qualificationName: 'Behavioral',
      mappedField: 'SHOP_FREQ_001',
      status: 'rejected',
    },
  ];

  const filteredData = mockReviewData.filter(item => {
    if (searchTerm && !item.questionText.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (statusFilter && item.status !== statusFilter) return false;
    return true;
  });

  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    canGoNext,
    canGoPrevious,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({
    data: filteredData,
    itemsPerPage: 5,
  });

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedItems(new Set(paginatedData.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === paginatedData.length);
  };

  const handleSave = () => {
    const selectedData = Array.from(selectedItems).map(id => {
      return mockReviewData.find(d => d.id === id);
    });
    
    console.log('Inserting selected review data:', selectedData);
    alert(`Successfully inserted ${selectedData.length} mapping entries`);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
    }
  };

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
            "rounded-2xl shadow-lg w-full max-w-6xl max-h-[90vh] overflow-hidden transition-colors",
            resolvedTheme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
          )}
        >
          <div className={cn(
            "flex justify-between items-center border-b pb-4 mb-6 transition-colors",
            resolvedTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          )}>
            <h2 className="text-2xl font-bold">Question Mapping Review</h2>
            <Button onClick={onClose} variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                placeholder="Search questions..."
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Results Summary */}
          <div className={cn(
            "flex items-center justify-between mb-4 text-sm transition-colors",
            resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            <span>
              Showing {startIndex} to {endIndex} of {totalItems} items
              {selectedItems.size > 0 && ` (${selectedItems.size} selected)`}
            </span>
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <div className="overflow-y-auto max-h-[50vh] border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={cn(
                "sticky top-0 transition-colors",
                resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              )}>
                <tr>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                        className="border-gray-300"
                      />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                        Select All
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Qualification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Mapped Field
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className={cn(
                "divide-y transition-colors",
                resolvedTheme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
              )}>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <tr key={item.id} className={cn(
                      "transition-colors",
                      resolvedTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
                      selectedItems.has(item.id) && 'bg-blue-50 dark:bg-blue-900/20'
                    )}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                          className="border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate" title={item.questionText}>
                        {item.questionText}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {item.qualificationName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-100">
                        {item.mappedField || 'Not Mapped'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={cn(
                          "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                          getStatusColor(item.status)
                        )}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No data found</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          {searchTerm ? 'No results match your search criteria.' : 'No review data available.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className={cn(
              "px-6 py-4 border-t transition-colors",
              resolvedTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            )}>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationFirst 
                      onClick={goToFirstPage}
                      className={!canGoPrevious ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={goToPreviousPage}
                      className={!canGoPrevious ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    const pageNumber = Math.max(1, Math.min(currentPage - 1 + i, totalPages - 2 + i));
                    if (pageNumber > totalPages) return null;
                    
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => goToPage(pageNumber)}
                          isActive={currentPage === pageNumber}
                          className="cursor-pointer"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={goToNextPage}
                      className={!canGoNext ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLast 
                      onClick={goToLastPage}
                      className={!canGoNext ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          <div className={cn(
            "mt-6 flex items-center justify-between border-t pt-4 transition-colors",
            resolvedTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          )}>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedItems.size > 0 ? (
                <span>{selectedItems.size} item(s) selected for insertion</span>
              ) : (
                <span>No items selected</span>
              )}
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={handleSave} 
                disabled={selectedItems.size === 0}
                className="gradient-primary text-white hover:shadow-glow transition-all duration-300"
              >
                <Save className="w-4 h-4 mr-2" />
                Insert Selected ({selectedItems.size})
              </Button>
              <Button onClick={onClose} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};