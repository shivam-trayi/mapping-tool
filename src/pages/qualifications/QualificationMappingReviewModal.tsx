import React from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { MessageBox } from '@/components/ui/MessageBox';
import type { Qualification } from '@/types/qualicationTypes';
import { saveQualMappingReviewData } from '@/redux/slices/testing/saveQualMappingSlice';
import type { AppDispatch } from '@/redux/store';

interface QualificationMappingReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mappings: {
    id: string;
    qualificationId: number;
    qualificationName: string;
    memberId: number;
    memberQualificationId: number;
    constantId: string;
  }[];
  qualifications: Qualification[];
  resolvedTheme: 'light' | 'dark';
}

const QualificationMappingReviewModal: React.FC<QualificationMappingReviewModalProps> = ({
  isOpen,
  onClose,
  mappings,
  qualifications,
  resolvedTheme
}) => {
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [localMappings, setLocalMappings] = React.useState(mappings);

  const dispatch = useDispatch<AppDispatch>();

  const filteredData = localMappings.filter(item =>
    (item.qualificationName?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (item.constantId?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedItems(checked ? new Set(filteredData.map(item => item.id)) : new Set());
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) newSelected.add(id);
    else newSelected.delete(id);
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === filteredData.length && filteredData.length > 0);
  };

  React.useEffect(() => {
    setLocalMappings(mappings);
    setSelectedItems(new Set());
    setSelectAll(false);
  }, [mappings]);

  const handleSave = async () => {
    const selectedData = Array.from(selectedItems)
      .map(id => localMappings.find(d => d.id === id))
      .filter(Boolean);

    if (selectedData.length === 0) return;

    try {
      await dispatch(saveQualMappingReviewData(selectedData as any[])).unwrap();

      setMessage(`✅ Successfully inserted ${selectedData.length} qualification mapping entries.`);

      // ✅ Remove inserted items from localMappings
      const remaining = localMappings.filter(item => !selectedItems.has(item.id));
      setLocalMappings(remaining);

      // ✅ Reset selection
      setSelectedItems(new Set());
      setSelectAll(false);
    } catch (error) {
      console.error('Error inserting qualification mappings:', error);
      setMessage('❌ Failed to insert qualification mapping entries.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Modal wrapper */}
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
            "relative rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col transition-colors",
            resolvedTheme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
          )}
        >
          {/* Header */}
          <div className={cn(
            "p-6 flex justify-between items-center border-b transition-colors",
            resolvedTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          )}>
            <h2 className="text-2xl font-bold">Qualification Mapping Review</h2>
            <Button onClick={onClose} variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Search */}
            <div className="relative mb-6 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg"
                placeholder="Search qualification or constant ID..."
              />
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
                          <Checkbox checked={selectAll} onCheckedChange={val => handleSelectAll(Boolean(val))} />
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 hidden sm:block">
                            Select All
                          </span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Qualification</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Constant ID</th>
                    </tr>
                  </thead>
                  <tbody className={cn(
                    "divide-y transition-colors",
                    resolvedTheme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
                  )}>
                    {filteredData.length > 0 ? filteredData.map(item => (
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
                            onCheckedChange={val => handleSelectItem(item.id, Boolean(val))}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {item.qualificationName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-100">
                          {item.constantId || 'Not Mapped'}
                        </td>
                      </motion.tr>
                    )) : (
                      <tr>
                        <td colSpan={3} className="p-12 text-center">
                          <div className="flex flex-col items-center space-y-3">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                              <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No data found</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                              {searchTerm ? 'No results match your search criteria.' : 'No mapping data available.'}
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

          {/* Footer */}
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
      <MessageBox message={message} onClose={() => setMessage('')} resolvedTheme={resolvedTheme} />
    </AnimatePresence>
  );
};

export default QualificationMappingReviewModal;
