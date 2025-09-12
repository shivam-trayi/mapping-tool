import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Save, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { MessageBox } from '@/components/ui/MessageBox';
import type { Qualification } from '@/types/qualicationTypes';

import type { AppDispatch } from '@/redux/store';
import { saveQualMappingReviewData, updateQualificationConstantIdData } from '@/redux/slices/testing/saveQualMappingSlice';
import { toast } from "@/components/ui/use-toast";

interface QualificationMappingItem {
  id: string;
  qualificationId: number;
  qualificationName: string;
  memberId: number;
  memberQualificationId: number;
  constantId: string;
  oldMapped: boolean;
  newMapped: boolean;
}

interface QualificationMappingReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mappings: QualificationMappingItem[];
  qualifications: Qualification[];
  resolvedTheme: 'light' | 'dark';
}

const QualificationMappingReviewModal: React.FC<QualificationMappingReviewModalProps> = ({
  isOpen,
  onClose,
  mappings,
  resolvedTheme
}) => {
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [localMappings, setLocalMappings] = React.useState<QualificationMappingItem[]>(mappings);
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const [editedValues, setEditedValues] = React.useState<Record<number, string>>({});

  const dispatch = useDispatch<AppDispatch>();

  const filteredData = localMappings.filter(item =>
    (item.qualificationName?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (item.constantId?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedItems(checked ? new Set(filteredData.map(item => item.id)) : new Set());
  };

  const handleInputChange = (questionId: number, value: string) => {
    setEditedValues((prev) => ({ ...prev, [questionId]: value }));
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

  // const handleSaveQualification = async () => {
  //   const selectedData = Array.from(selectedItems)
  //     .map(id => localMappings.find(d => d.id === id))
  //     .filter(Boolean);

  //   if (selectedData.length === 0) return;

  //   setLoading(true);
  //   try {
  //     await dispatch(saveQualMappingReviewData(selectedData as any[])).unwrap();

  //     setMessage(`✅ Successfully inserted ${selectedData.length} qualification mapping entries.`);

  //     const remaining = localMappings.filter(item => !selectedItems.has(item.id));
  //     setLocalMappings(remaining);

  //     setSelectedItems(new Set());
  //     setSelectAll(false);
  //   } catch (error) {
  //     console.error('Error inserting qualification mappings:', error);
  //     setMessage('❌ Failed to insert qualification mapping entries.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // // New handler for Update
  // const handleUpdateQualification = async () => {
  //   if (Object.keys(editedValues).length === 0) return;

  //   setUpdateLoading(true);
  //   try {
  //     // Map editedValues onto the full objects in localMappings
  //     const payload = localMappings.map((item) => {
  //       if (editedValues[item.qualificationId]) {
  //         return {
  //           ...item,
  //           constantId: editedValues[item.qualificationId], // update constantId
  //         };
  //       }
  //       return item;
  //     });

  //     console.log("Payload being sent:", payload); // ✅ check payload

  //     // Dispatch thunk
  //     await dispatch(updateQualificationConstantIdData(payload)).unwrap();

  //     setMessage("✅ Constant IDs updated successfully");

  //     // Update UI instantly
  //     setLocalMappings(payload);
  //     setEditedValues({});
  //   } catch (error) {
  //     console.error("Error updating qualification constant IDs:", error);
  //     setMessage("❌ Failed to update constant IDs");
  //   } finally {
  //     setUpdateLoading(false);
  //   }
  // };


  const handleSaveQualification = async () => {
  const selectedData = Array.from(selectedItems)
    .map(id => localMappings.find(d => d.id === id))
    .filter(Boolean);

  if (selectedData.length === 0) return;

  setLoading(true);
  try {
    const response = await dispatch(saveQualMappingReviewData(selectedData)).unwrap();

    // ✅ Access message, success, data safely
    setMessage(response.message || "Saved successfully");
    if(response.status === 200) {
      toast({ description: response.message || "Qualification mappings saved successfully." });
    }

    const remaining = localMappings.filter(item => !selectedItems.has(item.id));
    setLocalMappings(remaining);
    setSelectedItems(new Set());
    setSelectAll(false);
  } catch (error) {
    console.error(error);
    setMessage("❌ Failed to save qualification mapping entries");
  } finally {
    setLoading(false);
  }
};

const handleUpdateQualification = async () => {
  if (Object.keys(editedValues).length === 0) return;

  setUpdateLoading(true);
  try {
    const payload = localMappings.map((item) => {
      if (editedValues[item.qualificationId]) {
        return {
          ...item,
          constantId: editedValues[item.qualificationId],
        };
      }
      return item;
    });

    const response = await dispatch(updateQualificationConstantIdData(payload)).unwrap();
    if(response.status === 200) {
      toast({ description: response.message || "Constant IDs updated successfully." });
    }

    setMessage(response.message || "✅ Constant IDs updated successfully");
    setLocalMappings(payload);
    setEditedValues({});
  } catch (error) {
    console.error(error);
    toast({ description: response.message || "Something went wrong" });
    setMessage("❌ Failed to update constant IDs");
  } finally {
    setUpdateLoading(false);
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
            "relative rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col transition-colors",
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
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">S.No</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Qualification</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Constant ID</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Qualifications Constant ID</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Old Mapped</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">New Mapped</th>
                    </tr>
                  </thead>
                  <tbody className={cn(
                    "divide-y transition-colors",
                    resolvedTheme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
                  )}>
                    {filteredData.length > 0 ? filteredData.map((item, index) => (
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
                        {/* Select Checkbox */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Checkbox
                            checked={selectedItems.has(item.id)}
                            onCheckedChange={val => handleSelectItem(item.id, Boolean(val))}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-100">
                          {index + 1}
                        </td>

                        {/* Qualification */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {item.qualificationName}
                        </td>

                        {/* Constant ID */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-100">
                          {item.constantId || 'Not Mapped'}
                        </td>

                        <td className="px-6 py-4">

                          <td className="px-6 py-4">
                            <Input
                              type="text"
                              value={editedValues[item.qualificationId] ?? ""}
                              onChange={(e) => handleInputChange(item.qualificationId, e.target.value)}
                              placeholder="Enter Constant ID"
                              className={cn(
                                "px-2 py-1 border rounded-lg w-full text-sm focus:outline-none focus:ring-2 transition-all",
                                resolvedTheme === "dark"
                                  ? "bg-gray-900 text-gray-100 border-gray-700 focus:ring-blue-500"
                                  : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
                              )}
                            />
                          </td>

                        </td>

                        {/* Old Mapped */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={cn(
                            "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                            item.oldMapped
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                          )}>
                            {item.oldMapped ? "Old Mapped" : "Not Mapped"}
                          </span>
                        </td>

                        {/* New Mapped */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={cn(
                            "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                            item.constantId
                              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                              : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                          )}>
                            {item.constantId ? "Mapped" : "Not Mapped"}
                          </span>
                        </td>
                      </motion.tr>
                    )) : (
                      <tr>
                        <td colSpan={8} className="p-12 text-center">
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
              onClick={handleSaveQualification}
              disabled={selectedItems.size === 0 || loading}
              className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto flex items-center justify-center"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="w-4 h-4 mr-2" />
              Approved Selected ({selectedItems.size})
            </Button>

            <Button onClick={handleUpdateQualification} disabled={Object.keys(editedValues).length === 0 || updateLoading} className="bg-yellow-600 text-white hover:bg-yellow-700 w-full sm:w-auto flex items-center justify-center">
              {updateLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="w-4 h-4 mr-2" /> Update
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
