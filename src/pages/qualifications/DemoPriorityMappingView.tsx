import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Search, 
  Map, 
  Target,
  Filter,
  Download,
  Upload,
  AlertCircle
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
import type { ViewType } from '../../types/qualicationTypes';

interface DemoPriorityMappingViewProps {
  setCurrentView: (view: ViewType) => void;
  setShowMappingReviewModal: (show: boolean) => void;
  resolvedTheme: 'light' | 'dark';
}

interface DemoPriorityData {
  id: string;
  qualificationName: string;
  priority: number;
  mapped: boolean;
  oldMapped: boolean;
  constantId: string;
  category: string;
  lastUpdated: string;
}

export const DemoPriorityMappingView: React.FC<DemoPriorityMappingViewProps> = ({
  setCurrentView,
  setShowMappingReviewModal,
  resolvedTheme
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [constantIds, setConstantIds] = useState<Record<string, string>>({});

  // Mock data for demo priority mapping
  const mockDemoPriorityData: DemoPriorityData[] = [
    {
      id: '1',
      qualificationName: 'Age Demographics',
      priority: 1,
      mapped: true,
      oldMapped: false,
      constantId: 'AGE_DEMO_001',
      category: 'Demographics',
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      qualificationName: 'Income Level',
      priority: 2,
      mapped: false,
      oldMapped: true,
      constantId: '',
      category: 'Demographics',
      lastUpdated: '2024-01-14'
    },
    {
      id: '3',
      qualificationName: 'Shopping Behavior',
      priority: 3,
      mapped: true,
      oldMapped: true,
      constantId: 'SHOP_BEH_001',
      category: 'Behavioral',
      lastUpdated: '2024-01-13'
    },
    {
      id: '4',
      qualificationName: 'Brand Preference',
      priority: 4,
      mapped: false,
      oldMapped: false,
      constantId: '',
      category: 'Psychographic',
      lastUpdated: '2024-01-12'
    },
    {
      id: '5',
      qualificationName: 'Technology Usage',
      priority: 5,
      mapped: true,
      oldMapped: false,
      constantId: 'TECH_USE_001',
      category: 'Behavioral',
      lastUpdated: '2024-01-11'
    },
    {
      id: '6',
      qualificationName: 'Geographic Location',
      priority: 6,
      mapped: false,
      oldMapped: true,
      constantId: '',
      category: 'Demographics',
      lastUpdated: '2024-01-10'
    }
  ];

  // Filter data based on search and filters
  const filteredData = mockDemoPriorityData.filter(item => {
    if (searchTerm && !item.qualificationName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (priorityFilter && item.priority.toString() !== priorityFilter) return false;
    if (categoryFilter && item.category !== categoryFilter) return false;
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
    itemsPerPage: 8,
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

  const handleConstantIdChange = (id: string, value: string) => {
    setConstantIds(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveSelected = () => {
    const selectedData = Array.from(selectedItems).map(id => {
      const item = mockDemoPriorityData.find(d => d.id === id);
      return {
        ...item,
        constantId: constantIds[id] || item?.constantId || '',
      };
    });
    
    console.log('Saving selected demo priority data:', selectedData);
    alert(`Successfully saved ${selectedData.length} demo priority mappings for review`);
    setShowMappingReviewModal(true);
    
    // Reset selections
    setSelectedItems(new Set());
    setSelectAll(false);
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    if (priority <= 4) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
    return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
  };

  return (
    <motion.div
      key="demo-priority-mapping-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Target className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Demo Priority Mapping
          </h2>
        </div>
        <div className="flex space-x-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={() => setShowMappingReviewModal(true)} variant="default">
              <Map className="w-4 h-4 mr-2" />
              Review Mappings
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={() => setCurrentView('list')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
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
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className={cn(
                "px-4 py-2 border rounded-lg transition-colors",
                resolvedTheme === 'dark' 
                  ? 'bg-gray-900 text-gray-100 border-gray-600' 
                  : 'bg-white text-gray-900 border-gray-300'
              )}
            >
              <option value="">All Priorities</option>
              <option value="1">High (1-2)</option>
              <option value="3">Medium (3-4)</option>
              <option value="5">Low (5+)</option>
            </select>
            
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={cn(
                "px-4 py-2 border rounded-lg transition-colors",
                resolvedTheme === 'dark' 
                  ? 'bg-gray-900 text-gray-100 border-gray-600' 
                  : 'bg-white text-gray-900 border-gray-300'
              )}
            >
              <option value="">All Categories</option>
              <option value="Demographics">Demographics</option>
              <option value="Behavioral">Behavioral</option>
              <option value="Psychographic">Psychographic</option>
            </select>
            
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Apply
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
              onClick={handleSaveSelected}
              className="gradient-primary text-white hover:shadow-glow transition-all duration-300"
            >
              <Save className="w-4 h-4 mr-1" />
              Save Selected ({selectedItems.size})
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setSelectedItems(new Set());
                setSelectAll(false);
              }}
            >
              Clear Selection
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
          Showing {startIndex} to {endIndex} of {totalItems} priority mappings
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
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                Qualification
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                Mapped
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                Old Mapped
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                Constant ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody className={cn(
            "divide-y transition-colors",
            resolvedTheme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
          )}>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "transition-colors",
                    resolvedTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
                    selectedItems.has(item.id) && 'bg-blue-50 dark:bg-blue-900/20'
                  )}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Checkbox
                      checked={selectedItems.has(item.id)}
                      onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                      className="border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        "inline-flex px-2 py-1 text-xs font-bold rounded-full",
                        getPriorityColor(item.priority)
                      )}>
                        #{item.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.qualificationName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                      item.mapped 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    )}>
                      {item.mapped ? 'Mapped' : 'Not Mapped'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                      className="w-full max-w-[150px]"
                      placeholder="Enter ID"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.lastUpdated}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-12 text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center space-y-4"
                  >
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-10 h-10 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        No priority mappings found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                        {searchTerm || priorityFilter || categoryFilter 
                          ? 'No results match your search criteria. Try adjusting your filters.'
                          : 'No demo priority mapping data available at the moment.'
                        }
                      </p>
                    </div>
                    {(searchTerm || priorityFilter || categoryFilter) && (
                      <Button 
                        onClick={() => {
                          setSearchTerm('');
                          setPriorityFilter('');
                          setCategoryFilter('');
                        }}
                        variant="outline"
                      >
                        Clear Filters
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

        {/* Footer with Actions */}
        <div className={cn(
          "p-4 border-t flex items-center justify-between transition-colors",
          resolvedTheme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        )}>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedItems.size > 0 ? (
                <span className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>{selectedItems.size} priority mapping(s) selected</span>
                </span>
              ) : (
                <span>No items selected</span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleSaveSelected}
              disabled={selectedItems.size === 0}
              className="gradient-primary text-white hover:shadow-glow transition-all duration-300"
            >
              <Save className="w-4 h-4 mr-2" />
              Save for Review ({selectedItems.size})
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => {
                const data = paginatedData.map(item => ({
                  ...item,
                  constantId: constantIds[item.id] || item.constantId
                }));
                console.log('Exporting data:', data);
                alert('Data exported successfully');
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
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
              <p className="text-sm text-muted-foreground">Total Mappings</p>
              <p className="text-2xl font-bold text-primary">{mockDemoPriorityData.length}</p>
            </div>
            <Target className="w-8 h-8 text-primary/60" />
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
              <p className="text-sm text-muted-foreground">High Priority</p>
              <p className="text-2xl font-bold text-red-600">
                {mockDemoPriorityData.filter(item => item.priority <= 2).length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500/60" />
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
              <p className="text-sm text-muted-foreground">Mapped</p>
              <p className="text-2xl font-bold text-green-600">
                {mockDemoPriorityData.filter(item => item.mapped).length}
              </p>
            </div>
            <Map className="w-8 h-8 text-green-500/60" />
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
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {mockDemoPriorityData.filter(item => !item.mapped).length}
              </p>
            </div>
            <Upload className="w-8 h-8 text-yellow-500/60" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};