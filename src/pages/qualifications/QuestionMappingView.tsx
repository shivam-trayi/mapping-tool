import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
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

interface Qualification {
  id: string;
  name: string;
}

interface QuestionMappingData {
  id: string;
  qualificationName: string;
  mapped: boolean;
  oldMapped: boolean;
  constantId: string;
}

const QuestionMappingViewMock: React.FC = () => {
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [constantIds, setConstantIds] = useState<Record<string, string>>({});

  // Mock data
  const qualifications: Qualification[] = Array.from({ length: 18 }, (_, i) => ({
    id: `q${i+1}`,
    name: `Qualification ${i+1}`,
  }));

  const mockQuestionMappingData: QuestionMappingData[] = qualifications.map((q, index) => ({
    id: q.id,
    qualificationName: q.name,
    mapped: index % 2 === 0,
    oldMapped: index % 3 === 0,
    constantId: index % 2 === 0 ? `CONST_${index + 1}` : '',
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
    data: mockQuestionMappingData,
    itemsPerPage: 10,
  });

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) setSelectedItems(new Set(paginatedData.map(item => item.id)));
    else setSelectedItems(new Set());
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) newSelected.add(id);
    else newSelected.delete(id);
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === paginatedData.length);
  };

  const handleConstantIdChange = (id: string, value: string) => {
    setConstantIds(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveForReview = () => {
    const selectedData = Array.from(selectedItems).map(id => {
      const item = mockQuestionMappingData.find(d => d.id === id);
      return { ...item, constantId: constantIds[id] || item?.constantId || '' };
    });
    alert(`Saved ${selectedData.length} question mappings for review (mock)`);
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Question Mapping (Mock)
        </h2>
      </div>

      {/* Table */}
      <div className={cn(
        "rounded-lg shadow overflow-hidden transition-colors",
        resolvedTheme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      )}>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={cn(resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50')}>
            <tr>
              <th className="px-6 py-3"><Checkbox checked={selectAll} onCheckedChange={handleSelectAll} /></th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">S.No</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Qualification</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Mapped</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Old Mapped</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Constant ID</th>
            </tr>
          </thead>
          <tbody className={cn(resolvedTheme === 'dark' ? 'bg-gray-800 text-gray-100 divide-gray-700' : 'bg-white text-gray-900 divide-gray-200')}>
            {paginatedData.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center">No data</td></tr>
            ) : paginatedData.map((item, idx) => (
              <tr key={item.id} className={selectedItems.has(item.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Checkbox checked={selectedItems.has(item.id)} onCheckedChange={checked => handleSelectItem(item.id, checked as boolean)} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{startIndex + idx}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.qualificationName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{item.mapped ? 'Mapped' : 'Not Mapped'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{item.oldMapped ? 'Old Mapped' : 'Not Mapped'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Input value={constantIds[item.id] || item.constantId} onChange={e => handleConstantIdChange(item.id, e.target.value)} placeholder="Enter constant ID" className="w-full"/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={cn("px-6 py-4 border-t transition-colors", resolvedTheme === 'dark' ? 'border-gray-700' : 'border-gray-200')}>
          <Pagination>
            <PaginationContent>
              <PaginationItem><PaginationFirst onClick={goToFirstPage} className={!canGoPrevious ? 'pointer-events-none opacity-50' : ''} /></PaginationItem>
              <PaginationItem><PaginationPrevious onClick={goToPreviousPage} className={!canGoPrevious ? 'pointer-events-none opacity-50' : ''} /></PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}><PaginationLink onClick={() => goToPage(i+1)} isActive={currentPage===i+1}>{i+1}</PaginationLink></PaginationItem>
              ))}
              <PaginationItem><PaginationNext onClick={goToNextPage} className={!canGoNext ? 'pointer-events-none opacity-50' : ''} /></PaginationItem>
              <PaginationItem><PaginationLast onClick={goToLastPage} className={!canGoNext ? 'pointer-events-none opacity-50' : ''} /></PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Save for review */}
      <div className={cn("p-4 border-t flex items-center justify-between transition-colors", resolvedTheme==='dark'?'border-gray-700 bg-gray-800':'border-gray-200 bg-gray-50')}>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {selectedItems.size>0 ? `${selectedItems.size} question mapping(s) selected` : 'No question mappings selected'}
        </div>
        <Button onClick={handleSaveForReview} disabled={selectedItems.size===0} className="gradient-primary text-white">
          <Save className="w-4 h-4 mr-2" /> Save for Review ({selectedItems.size})
        </Button>
      </div>
    </motion.div>
  );
};

export default QuestionMappingViewMock;
