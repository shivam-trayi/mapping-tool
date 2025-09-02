import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageBox } from '@/components/ui/MessageBox';
import { Checkbox } from '@/components/ui/checkbox';

const MappingReviewModal = ({
  isOpen,
  onClose,
  mappings,
  qualifications,
  resolvedTheme
}) => {
  const [selectedItems, setSelectedItems] = React.useState(new Set());
  const [selectAll, setSelectAll] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [message, setMessage] = React.useState('');

  // Mock review data
  const mockReviewData = [
    { id: '1', questionText: 'What is your age group?', qualificationName: 'Demographics', mappedField: 'AGE_001', status: 'pending' },
    { id: '2', questionText: 'What is your gender?', qualificationName: 'Demographics', mappedField: 'GENDER_001', status: 'approved' },
    { id: '3', questionText: 'What is your income level?', qualificationName: 'Demographics', mappedField: 'INCOME_001', status: 'pending' },
    { id: '4', questionText: 'How often do you shop?', qualificationName: 'Behavioral', mappedField: 'SHOP_FREQ_001', status: 'rejected' },
    { id: '5', questionText: 'What is your highest level of education?', qualificationName: 'Education', mappedField: 'EDU_LEVEL_001', status: 'pending' },
    { id: '6', questionText: 'Do you own a car?', qualificationName: 'Transportation', mappedField: 'CAR_OWNER_001', status: 'approved' },
    { id: '7', questionText: 'What is your primary shopping destination?', qualificationName: 'Behavioral', mappedField: 'SHOP_DEST_001', status: 'pending' },
    { id: '8', questionText: 'Are you a frequent flyer?', qualificationName: 'Travel', mappedField: 'FLYER_STATUS_001', status: 'approved' },
    { id: '9', questionText: 'What is your favorite sport?', qualificationName: 'Hobbies', mappedField: 'SPORT_001', status: 'pending' },
    { id: '10', questionText: 'Where do you live?', qualificationName: 'Geography', mappedField: 'REGION_001', status: 'approved' },
  ];

  const filteredData = mockReviewData.filter(item => {
    const matchesSearch = item.questionText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedItems(new Set(filteredData.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id, checked) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === filteredData.length && filteredData.length > 0);
  };

  const handleSave = () => {
    const selectedData = Array.from(selectedItems).map(id => {
      return mockReviewData.find(d => d.id === id);
    });

    console.log('Inserting selected review data:', selectedData);
    setMessage(`Successfully inserted ${selectedData.length} mapping entries.`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={cn(
            "relative rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col transition-colors",
            resolvedTheme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
          )}
        >
          {/* Header */}
          <div className={cn(
            "p-6 flex justify-between items-center border-b transition-colors",
            resolvedTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          )}>
            <h2 className="text-2xl font-bold">Question Mapping Review</h2>
            <Button onClick={onClose} variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              <div className="relative flex-1 max-w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-lg"
                  placeholder="Search questions..."
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={cn(
                  "flex-shrink-0 h-10 px-4 py-2 border rounded-lg text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  "focus-visible:ring-offset-2",
                  resolvedTheme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-300'
                )}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Results Summary */}
            <div className={cn(
              "flex flex-col sm:flex-row items-center justify-between mb-4 text-sm transition-colors",
              resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              <span>
                Showing {filteredData.length} items
                {selectedItems.size > 0 && ` (${selectedItems.size} selected)`}
              </span>
            </div>

            {/* Table */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="max-h-[50vh] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={cn(
                    "sticky top-0 z-10 transition-colors",
                    resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                  )}>
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectAll}
                            onCheckedChange={handleSelectAll}
                          />
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 hidden sm:block">
                            Select All
                          </span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Question</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Qualification</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Mapped Field</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className={cn(
                    "divide-y transition-colors",
                    resolvedTheme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
                  )}>
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            "transition-colors",
                            resolvedTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
                            selectedItems.has(item.id) && 'bg-blue-50 dark:bg-blue-900/20'
                          )}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Checkbox
                              checked={selectedItems.has(item.id)}
                              onCheckedChange={(checked) => handleSelectItem(item.id, checked)}
                            />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 max-w-[200px] truncate" title={item.questionText}>
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
                              "inline-flex px-3 py-1 text-xs font-semibold rounded-full",
                              getStatusColor(item.status)
                            )}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-12 text-center">
                          <div className="flex flex-col items-center space-y-3">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
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
            </div>
          </div>

          {/* Sticky Footer */}
          <div className={cn(
            "sticky bottom-0 z-20 flex flex-col sm:flex-row items-center justify-end space-y-4 sm:space-y-0 sm:space-x-3",
            "border-t p-4 transition-colors",
            resolvedTheme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-50'
          )}>
            <Button
              onClick={handleSave}
              disabled={selectedItems.size === 0}
              className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto"
            >
              <Save className="w-4 h-4 mr-2" />
              Insert Selected ({selectedItems.size})
            </Button>
            <Button onClick={onClose} variant="outline" className="w-full sm:w-auto">
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </motion.div>
      </motion.div>
      <MessageBox
        message={message}
        onClose={() => setMessage('')}
        resolvedTheme={resolvedTheme}
      />
    </AnimatePresence>
  );
};

export default MappingReviewModal;
