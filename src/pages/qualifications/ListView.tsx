import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Search, 
  ToggleLeft, 
  ToggleRight, 
  Eye, 
  Map, 
  Target,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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

interface ListViewProps {
  setCurrentView: (view: ViewType) => void;
  filteredQualifications: Qualification[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleCreateQualification: () => void;
  handleEditQualification: (qualification: Qualification) => void;
  handleToggleActive: (id: string) => void;
  handleViewQuestions: (qualification: Qualification) => void;
  isLoadingTable: boolean;
  resolvedTheme: 'light' | 'dark';
}

export const ListView: React.FC<ListViewProps> = ({
  setCurrentView,
  filteredQualifications,
  searchTerm,
  setSearchTerm,
  handleCreateQualification,
  handleEditQualification,
  handleToggleActive,
  handleViewQuestions,
  isLoadingTable,
  resolvedTheme
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Filter qualifications based on search and filters
  const filteredData = filteredQualifications.filter(qualification => {
    if (statusFilter === 'active' && !qualification.active) return false;
    if (statusFilter === 'inactive' && qualification.active) return false;
    if (typeFilter === 'test' && !qualification.isTest) return false;
    if (typeFilter === 'regular' && qualification.isTest) return false;
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
    setSelectAll(newSelected.size === paginatedData.length && paginatedData.length > 0);
  };

  const handleBulkAction = (action: string) => {
    const selectedData = Array.from(selectedItems);
    console.log(`Performing ${action} on:`, selectedData);
    alert(`${action} performed on ${selectedData.length} items`);
    setSelectedItems(new Set());
    setSelectAll(false);
  };

  return (
    <motion.div
      key="list-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      {/* Header with Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <h2 className={cn(
          "text-2xl font-bold transition-colors",
          resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
        )}>
          Qualifications Management
        </h2>
        
        <div className="flex flex-wrap items-center gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handleCreateQualification}
              className="gradient-primary text-white hover:shadow-glow transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={() => setCurrentView('mapping')} 
              variant="outline"
            >
              <Map className="w-4 h-4 mr-2" />
              Mapping
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={() => setCurrentView('demoMapping')} 
              variant="outline"
            >
              <Target className="w-4 h-4 mr-2" />
              Demo Priority
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={cn(
        "rounded-xl p-6 mb-6 transition-colors",
        resolvedTheme === 'dark' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      )}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              placeholder="Search qualifications..."
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={cn(
                "px-4 py-2 border rounded-lg transition-colors",
                resolvedTheme === 'dark' 
                  ? 'bg-gray-900 text-gray-100 border-gray-600' 
                  : 'bg-white text-gray-900 border-gray-300'
              )}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={cn(
                "px-4 py-2 border rounded-lg transition-colors",
                resolvedTheme === 'dark' 
                  ? 'bg-gray-900 text-gray-100 border-gray-600' 
                  : 'bg-white text-gray-900 border-gray-300'
              )}
            >
              <option value="">All Types</option>
              <option value="test">Test</option>
              <option value="regular">Regular</option>
            </select>
            
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
        
        {/* Bulk Actions */}
        {selectedItems.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50"
          >
            <span className="text-sm text-muted-foreground">
              {selectedItems.size} item(s) selected:
            </span>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleBulkAction('Export')}
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleBulkAction('Archive')}
            >
              Archive
            </Button>
          </motion.div>
        )}
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

      {/* Table */}
      <div className={cn(
        "rounded-xl shadow-lg overflow-hidden transition-colors",
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
                Qualification Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                Questions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                Actions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                Status
              </th>
            </tr>
          </thead>
          <tbody className={cn(
            "divide-y transition-colors",
            resolvedTheme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
          )}>
            {isLoadingTable ? (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="text-gray-500">Loading qualifications...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((qualification, idx) => (
                <motion.tr 
                  key={qualification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "transition-colors",
                    resolvedTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
                    selectedItems.has(qualification.id) && 'bg-blue-50 dark:bg-blue-900/20'
                  )}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Checkbox
                      checked={selectedItems.has(qualification.id)}
                      onCheckedChange={(checked) => handleSelectItem(qualification.id, checked as boolean)}
                      className="border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {startIndex + idx}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className={cn(
                          "text-sm font-medium",
                          resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        )}>
                          {qualification.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {qualification.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                      qualification.isTest 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                    )}>
                      {qualification.isTest ? 'Test' : 'Regular'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        "font-medium",
                        resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                      )}>
                        {qualification.questions.length}
                      </span>
                      <Button
                        onClick={() => handleViewQuestions(qualification)}
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto"
                        title="View questions"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          onClick={() => handleEditQualification(qualification)}
                          variant="ghost"
                          size="sm"
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 hover:text-blue-700"
                          title="Edit qualification"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleActive(qualification.id)}
                      className="flex items-center p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title={qualification.active ? 'Deactivate qualification' : 'Activate qualification'}
                    >
                      {qualification.active ? (
                        <ToggleRight className="w-6 h-6 text-green-500" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-gray-400" />
                      )}
                    </motion.button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center space-y-4"
                  >
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Search className="w-10 h-10 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        No qualifications found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                        {searchTerm || statusFilter || typeFilter 
                          ? 'No results match your search criteria. Try adjusting your filters.'
                          : 'Get started by creating your first qualification.'
                        }
                      </p>
                    </div>
                    {!searchTerm && !statusFilter && !typeFilter && (
                      <Button 
                        onClick={handleCreateQualification}
                        className="gradient-primary text-white hover:shadow-glow transition-all duration-300"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Qualification
                      </Button>
                    )}
                  </motion.div>
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
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={cn(
            "p-4 rounded-xl transition-colors",
            resolvedTheme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-primary">{filteredQualifications.length}</p>
            </div>
            <List className="w-8 h-8 text-primary/60" />
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={cn(
            "p-4 rounded-xl transition-colors",
            resolvedTheme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredQualifications.filter(q => q.active).length}
              </p>
            </div>
            <ToggleRight className="w-8 h-8 text-green-500/60" />
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={cn(
            "p-4 rounded-xl transition-colors",
            resolvedTheme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Test</p>
              <p className="text-2xl font-bold text-blue-600">
                {filteredQualifications.filter(q => q.isTest).length}
              </p>
            </div>
            <Target className="w-8 h-8 text-blue-500/60" />
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={cn(
            "p-4 rounded-xl transition-colors",
            resolvedTheme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Questions</p>
              <p className="text-2xl font-bold text-purple-600">
                {filteredQualifications.reduce((acc, q) => acc + q.questions.length, 0)}
              </p>
            </div>
            <FileText className="w-8 h-8 text-purple-500/60" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};