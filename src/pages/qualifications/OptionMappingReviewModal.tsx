import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface OptionMappingReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  answers: any[];
}

const OptionMappingReviewModal: React.FC<OptionMappingReviewModalProps> = ({
  isOpen,
  onClose,
  answers,
}) => {
  const [updatedValues, setUpdatedValues] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<Record<number, boolean>>({});

  if (!isOpen) return null;

  const handleInputChange = (answerId: number, value: string) => {
    setUpdatedValues((prev) => ({ ...prev, [answerId]: value }));
  };

  const toggleSelect = (answerId: number) => {
    setSelected((prev) => ({ ...prev, [answerId]: !prev[answerId] }));
  };

  const handleSelectAll = (checked: boolean) => {
    const all: Record<number, boolean> = {};
    answers.forEach((ans) => {
      all[ans.answerId] = checked;
    });
    setSelected(all);
  };

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
          className="relative rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col bg-white text-gray-900"
        >
          {/* Header */}
          <div className="p-6 flex justify-between items-center border-b border-gray-200">
            <h2 className="text-2xl font-bold">Option Mapping Review</h2>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
              <div className="max-h-[50vh] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                        S.No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                        Options
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                        Option Review
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                        Option Review Update
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                        Old Mapped
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium uppercase">
                        <div className="flex items-center space-x-2">
                          <span>Select All</span>
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              handleSelectAll(e.target.checked)
                            }
                          />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {answers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center">
                          No data found
                        </td>
                      </tr>
                    ) : (
                      answers.map((ans, idx) => (
                        <motion.tr
                          key={ans.answerId}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            "hover:bg-gray-50",
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          )}
                        >
                          <td className="px-6 py-4">{idx + 1}</td>
                          <td className="px-6 py-4">{ans.answerText}</td>
                          <td className="px-6 py-4 font-mono text-sm">
                            {ans.member_answer_id ?? "Not Mapped"}
                          </td>
                          <td className="px-6 py-4">
                            <Input
                              type="text"
                              value={updatedValues[ans.answerId] || ""}
                              onChange={(e) =>
                                handleInputChange(ans.answerId, e.target.value)
                              }
                              placeholder="Enter update"
                              className="rounded-lg"
                            />
                          </td>
                          <td className="px-6 py-4 font-mono text-sm">
                            {ans.old_member_answer_id ?? "Not Mapped"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={!!selected[ans.answerId]}
                              onChange={() => toggleSelect(ans.answerId)}
                            />
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-20 flex flex-col sm:flex-row items-center justify-end space-y-4 sm:space-y-0 sm:space-x-3 border-t p-4 bg-gray-50">
            {/* <Button
              onClick={onClose}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <X className="w-4 h-4 mr-2" /> Close
            </Button> */}
            <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto">
              Update
            </Button>
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700 w-full sm:w-auto">
              Mapping Approve
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OptionMappingReviewModal;
