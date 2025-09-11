import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageBox } from "@/components/ui/MessageBox";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Checkbox } from "@/components/ui/checkbox";

// ✅ Import slice actions
import {
  insertAnswerMapping,
  resetInsertState,
  updateAnswerMapping,
  resetUpdateState,
} from "@/redux/slices/testing/answerSlice";
import { toast } from "@/components/ui/use-toast";

const OptionMappingReviewModal = ({ isOpen, onClose, answers, memberId, resolvedTheme }) => {
  const dispatch = useAppDispatch();

  const { successInsert, errorInsert, successUpdate, errorUpdate } = useAppSelector(
    (state) => state.answers
  );

  const [editedValues, setEditedValues] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Show message for Insert Mapping
  useEffect(() => {
    if (successInsert) {
      setMessage("✅ Mapping saved successfully!");
      dispatch(resetInsertState());
      setSelected({});
      setSelectAll(false);
    }
    if (errorInsert) {
      setMessage(`❌ ${errorInsert}`);
      dispatch(resetInsertState());
    }
  }, [successInsert, errorInsert, dispatch]);

  // ✅ Show message for Update Mapping
  useEffect(() => {
    if (successUpdate) {
      setMessage("✅ Update saved successfully!");
      dispatch(resetUpdateState());
      setEditedValues({});
    }
    if (errorUpdate) {
      setMessage(`❌ ${errorUpdate}`);
      dispatch(resetUpdateState());
    }
  }, [successUpdate, errorUpdate, dispatch]);

  // Filter based on search term
  const filteredData = useMemo(
    () =>
      answers.filter((ans) =>
        (ans.answerText ?? "").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [answers, searchTerm]
  );

  const handleInputChange = (questionId: number, value: string) => {
    setEditedValues((prev) => ({ ...prev, [questionId]: value }));
  };

  const toggleSelect = (answerId: number) => {
    const newSelected = { ...selected, [answerId]: !selected[answerId] };
    setSelected(newSelected);
    setSelectAll(filteredData.every((a) => newSelected[a.answerId]));
  };

  const handleSelectAll = (checked) => {
    const all: Record<number, boolean> = {};
    filteredData.forEach((ans) => {
      all[ans.answerId] = checked;
    });
    setSelected(all);
    setSelectAll(checked);
  };

  const handleSave = async () => {
    const selectedData = filteredData.filter((ans) => selected[ans.answerId]);
    if (!selectedData.length) return;

    if (!memberId) {
      setMessage("❌ memberId is missing!");
      return;
    }

    const payload = {
      memberId,
      memberType: "customer",
      optionData: selectedData,
    };

    const res = await dispatch(insertAnswerMapping(payload)).unwrap();
    if(res?.status === 200) {
      toast({ description: `${res.message || "Mapping saved successfully!"}` });
    }
  };

const handleUpdate = async() => {
  if (!memberId) {
    setMessage("❌ memberId is missing!");
    return;
  }

  const updatedOptions = Object.entries(editedValues).map(([answerId, value]) => {
    const answerObj = answers.find((a) => a.answerId === Number(answerId));
    if (!answerObj) return null;

    return {
      questionId: answerObj.questionId,
      qualificationId: answerObj.qualificationId,
      member_answer_id: value,
    };
  }).filter(Boolean); // remove nulls

  if (!updatedOptions.length) return;

  const res = await dispatch(updateAnswerMapping({ memberId, memberType: "customer", optionData: updatedOptions })).unwrap();
  if(res?.status === 200) {
    toast({ description: `${res.message || "Update saved successfully!"}` });
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
            resolvedTheme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
          )}
        >
          {/* Header */}
          <div
            className={cn(
              "p-6 flex justify-between items-center border-b transition-colors",
              resolvedTheme === "dark" ? "border-gray-700" : "border-gray-200"
            )}
          >
            <h2 className="text-2xl font-bold">Option Mapping Review</h2>
            <Button onClick={onClose} variant="ghost" size="sm" className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="relative flex-1 max-w-full sm:max-w-sm mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg"
                placeholder="Search options..."
              />
            </div>

            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="max-h-[50vh] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={cn(resolvedTheme === "dark" ? "bg-gray-800" : "bg-gray-50")}>
                    <tr>
                      <th className="px-6 py-4">S.No</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase">Option</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase">Option Review</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase">Option Review Update</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase">Update</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase">Old Mapped</th>
                      <th className="px-6 py-4 text-center text-xs font-medium uppercase">
                        <div className="flex items-center space-x-2">
                          <span>Select All</span>
                          <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center">
                          No data found
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((ans, idx) => (
                        <motion.tr
                          key={ans.answerId}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50",
                            selected[ans.answerId] && "bg-blue-50 dark:bg-blue-900/20"
                          )}
                        >
                          <td className="px-6 py-4">{idx + 1}</td>
                          <td className="px-6 py-4">{ans.answerText}</td>
                          <td className="px-6 py-4">{ans.member_answer_id}</td>

                          <td className="px-6 py-4">
                            <Input
                              type="text"
                              value={editedValues[ans.answerId] ?? ans.member_answer_id ?? ""}
                              onChange={(e) => handleInputChange(ans.answerId, e.target.value)}
                              placeholder="Enter value"
                              className={cn(
                                "px-2 py-1 border rounded-lg w-full text-sm focus:outline-none focus:ring-2 transition-all",
                                resolvedTheme === "dark"
                                  ? "bg-gray-900 text-gray-100 border-gray-700 focus:ring-blue-500"
                                  : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
                              )}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={cn(
                                "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                                ans.member_answer_id
                                  ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                  : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                              )}
                            >
                              {ans.member_answer_id ?? "Not Mapped"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={cn(
                                "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                                ans.old_member_answer_id
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                              )}
                            >
                              {ans.old_member_answer_id ?? "Not Mapped"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Checkbox
                              checked={!!selected[ans.answerId]}
                              onCheckedChange={() => toggleSelect(ans.answerId)}
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
          <div
            className={cn(
              "sticky bottom-0 z-20 flex flex-col sm:flex-row items-center justify-end space-y-4 sm:space-y-0 sm:space-x-3 border-t p-4 transition-colors",
              resolvedTheme === "dark" ? "border-gray-700 bg-gray-900" : "border-gray-50"
            )}
          >
            <Button onClick={onClose} variant="outline" className="w-full sm:w-auto">
              <X className="w-4 h-4 mr-2" /> Close
            </Button>

            <Button
              onClick={handleUpdate}
              disabled={Object.keys(editedValues).length === 0}
              className="bg-yellow-600 text-white hover:bg-yellow-700 w-full sm:w-auto flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-2" /> Update
            </Button>

            <Button
              onClick={handleSave}
              disabled={Object.values(selected).every((v) => !v)}
              className={cn(
                "transition-all duration-300 w-full sm:w-auto flex items-center justify-center",
                Object.values(selected).some((v) => v)
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-200 text-white cursor-not-allowed"
              )}
            >
              <Save className="w-4 h-4 mr-2" /> Mapping Approve
            </Button>
          </div>
        </motion.div>

        <MessageBox message={message} onClose={() => setMessage("")} resolvedTheme={resolvedTheme} />
      </motion.div>
    </AnimatePresence>
  );
};

export default OptionMappingReviewModal;
