import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Search, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import { ViewType } from '../../types/qualicationTypes';


interface QuestionMappingViewProps {
  setCurrentView: (view: ViewType) => void;
  setShowMappingReviewModal: (show: boolean) => void;
  resolvedTheme: 'light' | 'dark';
}

interface QuestionMappingData {
  id: string;
  questionText: string;
  language: string;
  type: string;
  mapped: boolean;
  oldMapped: boolean;
  constantId: string;
}

export const QuestionMappingView: React.FC<QuestionMappingViewProps> = ({
  setCurrentView,
  setShowMappingReviewModal,
  resolvedTheme
}) => {
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState('');
  const [selectedType, setSelectedType] = React.useState('');
  const [selectedCustomer, setSelectedCustomer] = React.useState('');
  const [constantIds, setConstantIds] = React.useState<Record<string, string>>({});

  // Mock data for question mapping
  const mockQuestionMappingData: QuestionMappingData[] = [
    {
      id: '1',
      questionText: 'What is your age group?',
      language: 'English',
      type: 'Radio',
      mapped: true,
      oldMapped: false,
      constantId: 'AGE_001',
    },
    {
      id: '2',
      questionText: '¿Cuál es tu grupo de edad?',
      language: 'Spanish',
      type: 'Radio',
      mapped: false,
      oldMapped: true,
      constantId: '',
    },
    {
      id: '3',
      questionText: 'What is your gender?',
      language: 'English',
      type: 'Radio',
      mapped: true,
      oldMapped: true,
      constantId: 'GENDER_001',
    },
    {
      id: '4',
      questionText: 'What is your income level?',
      language: 'English',
      type: 'Radio',
      mapped: false,
      oldMapped: false,
      constantId: '',
    },
  ];

  const filteredData = mockQuestionMappingData.filter(item => {
    if (selectedLanguage && item.language !== selectedLanguage) return false;
    if (selectedType && item.type !== selectedType) return false;
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
    itemsPerPage: 10,
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

  const handleConstantIdChange = (id: string, value: string) => {
    setConstantIds(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveForReview = () => {
    const selectedData = Array.from(selectedItems).map(id => {
      const item = mockQuestionMappingData.find(d => d.id === id);
      return {
        ...item,
        constantId: constantIds[id] || item?.constantId || '',
      };
    });
    
    console.log('Saving selected questions for review:', selectedData);
    alert(`Saved ${selectedData.length} questions for review`);
    setShowMappingReviewModal(true);
  };

  return (
  <motion.div
    key="question-mapping-view"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="p-6"
  >
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Question Mapping</h2>
      <div className="flex space-x-3">
        <Button onClick={() => setShowMappingReviewModal(true)} variant="default">
          <Map className="w-4 h-4 mr-2" />
          Mapping Review
        </Button>
        <Button onClick={() => setCurrentView('list')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    </div>
    <div className={cn(
      "flex items-center space-x-4 mb-6 transition-colors",
      resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
    )}>
      <select 
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
      >
        <option value="">Select Language</option>
        <option value="English">English</option>
        <option value="Spanish">Spanish</option>
        <option value="French">French</option>
      </select>
      <select 
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
      >
        <option value="">Select Type</option>
        <option value="Radio">Radio</option>
        <option value="Checkbox">Checkbox</option>
        <option value="Text">Text</option>
      </select>
      <select 
        value={selectedCustomer}
        onChange={(e) => setSelectedCustomer(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
      >
        <option value="">Select Customer/Supplier</option>
        <option value="customer1">Customer A</option>
        <option value="customer2">Customer B</option>
        <option value="supplier1">Supplier X</option>
      </select>
    </div>

    {/* Results Summary */}
    <div className={cn(
      "flex items-center justify-between mb-4 text-sm transition-colors",
      resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
    )}>
      <span>
        Showing {startIndex} to {endIndex} of {totalItems} questions
        {selectedItems.size > 0 && ` (${selectedItems.size} selected)`}
      </span>
      <span>
        Page {currentPage} of {totalPages}
      </span>
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
            <th className="px-6 py-3 text-left">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                  className="border-gray-300"
                />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                  Select All
                </span>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
              S.No
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
              Question
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
              Language
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
              Type
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
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, idx) => (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm">{startIndex + idx}</td>
                <td className="px-6 py-4 text-sm font-medium max-w-xs truncate" title={item.questionText}>
                  {item.questionText}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{item.language}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={cn(
                    "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                    item.mapped 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                  )}>
                    {item.mapped ? 'Mapped' : 'Not Mapped'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={cn(
                    "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                    item.oldMapped 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                  )}>
                    {item.oldMapped ? 'Old Mapped' : 'Not Mapped'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Input
                    type="text"
                    value={constantIds[item.id] || item.constantId}
                    onChange={(e) => handleConstantIdChange(item.id, e.target.value)}
                    className="w-full"
                    placeholder="Enter constant ID"
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="p-12 text-center">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No data found</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    No question mapping data available for the selected filters.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
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
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i));
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
        "p-4 border-t flex items-center justify-between transition-colors",
        resolvedTheme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
      )}>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {selectedItems.size > 0 ? (
            <span>{selectedItems.size} question(s) selected</span>
          ) : (
            <span>No questions selected</span>
          )}
        </div>
        <Button 
          onClick={handleSaveForReview}
          disabled={selectedItems.size === 0}
          className="gradient-primary text-white hover:shadow-glow transition-all duration-300"
        >
          <Save className="w-4 h-4 mr-2" />
          Save for Review ({selectedItems.size})
        </Button>
      </div>
    </div>
  </motion.div>
  );
};