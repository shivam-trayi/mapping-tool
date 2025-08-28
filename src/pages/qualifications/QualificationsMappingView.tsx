import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Search, Map, FileText } from 'lucide-react';
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
import type { Qualification, ViewType } from '../../types/qualicationTypes';



interface QualificationsMappingViewProps {
  setCurrentView: (view: ViewType) => void;
  setShowMappingReviewModal: (show: boolean) => void;
  qualifications: Qualification[];
  isLoadingTable: boolean;
  resolvedTheme: 'light' | 'dark';
}

interface QualificationMappingData {
  id: string;
  qualificationName: string;
  mapped: boolean;
  oldMapped: boolean;
  constantId: string;
}

export const QualificationsMappingView: React.FC<QualificationsMappingViewProps> = ({
  setCurrentView,
  setShowMappingReviewModal,
  qualifications,
  isLoadingTable,
  resolvedTheme
}) => {
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState('');
  const [selectedCustomer, setSelectedCustomer] = React.useState('');
  const [constantIds, setConstantIds] = React.useState<Record<string, string>>({});

  // Mock data for qualifications mapping
  const mockQualificationMappingData: QualificationMappingData[] = qualifications.map((q, index) => ({
    id: q.id,
    qualificationName: q.name,
    mapped: index % 2 === 0,
    oldMapped: index % 3 === 0,
    constantId: index % 2 === 0 ? `QUAL_${index + 1}` : '',
  }));

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
    data: mockQualificationMappingData,
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
      const item = mockQualificationMappingData.find(d => d.id === id);
      return {
        ...item,
        constantId: constantIds[id] || item?.constantId || '',
      };
    });
    
    console.log('Saving selected qualifications for review:', selectedData);
    alert(`Saved ${selectedData.length} qualifications for review`);
    setShowMappingReviewModal(true);
  };

  return (
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
        <Button onClick={() => setCurrentView('questionMapping')} variant="default">
          <FileText className="w-4 h-4 mr-2" />
          Question Mapping
        </Button>
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
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
      >
        <option value="">Select Type</option>
        <option value="demographic">Demographic</option>
        <option value="behavioral">Behavioral</option>
        <option value="psychographic">Psychographic</option>
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
        <option value="supplier2">Supplier Y</option>
      </select>
    </div>

    {/* Results Summary */}
    <div className={cn(
      "flex items-center justify-between mb-4 text-sm transition-colors",
      resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
    )}>
      <span>
        Showing {startIndex} to {endIndex} of {totalItems} qualifications
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
              <td colSpan={6} className="p-6 text-center text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span>Loading...</span>
                </div>
              </td>
            </tr>
          ) : paginatedData.length > 0 ? (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.qualificationName}</td>
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
              <td colSpan={6} className="p-12 text-center">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No data found</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    No qualification mapping data available.
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
            <span>{selectedItems.size} qualification(s) selected</span>
          ) : (
            <span>No qualifications selected</span>
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