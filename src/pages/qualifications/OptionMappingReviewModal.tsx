// src/pages/qualifications/OptionMappingReviewModal.tsx
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

interface OptionMappingReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  answers: any[];
  memberId: string | number;
  questionId: string | number;
  resolvedTheme: string;
}

const OptionMappingReviewModal: React.FC<OptionMappingReviewModalProps> = ({
  isOpen,
  onClose,
  answers,
  memberId,
  questionId,
  resolvedTheme,
}) => {
  console.log("OptionMappingReviewModal props:", {
    answers,
  });
  const dispatch = useAppDispatch();
  const { successInsert, errorInsert, successUpdate, errorUpdate } =
    useAppSelector((state) => state.answers);

  const [editedValues, setEditedValues] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Handle Insert success/error
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

  // ✅ Handle Update success/error
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

  // ✅ Ensure answers is always an array
  const filteredData = useMemo(
    () =>
      Array.isArray(answers)
        ? answers.filter((ans) =>
          (ans.answerText ?? "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
        : [],
    [answers, searchTerm]
  );

  // ✅ Input change handler
  const handleInputChange = (answerId: number, value: string) => {
    setEditedValues((prev) => ({ ...prev, [answerId]: value }));
  };

  // ✅ Toggle select single row
  const toggleSelect = (answerId: number) => {
    const newSelected = { ...selected, [answerId]: !selected[answerId] };
    setSelected(newSelected);
    setSelectAll(filteredData.every((a) => newSelected[a.answerId]));
  };

  // ✅ Select/Deselect all
  const handleSelectAll = (checked: boolean) => {
    const all: Record<number, boolean> = {};
    filteredData.forEach((ans) => {
      all[ans.answerId] = checked;
    });
    setSelected(all);
    setSelectAll(checked);
  };

  // ✅ Save (Insert)
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
      questionId,
      optionData: selectedData.map((ans) => ({
        id: ans.id,
        answerId: ans.answerId,
        questionId: ans.questionId,
        qualificationId: ans.qualificationId,
        memberAnswerId: ans.memberAnswerId,
        oldMemberAnswerId: ans.oldMemberAnswerId,
      })),
    };

    const res = await dispatch(insertAnswerMapping(payload)).unwrap();
    if (res?.status === 200) {
      toast({
        description: `${res.message || "Mapping saved successfully!"}`,
      });
    }
  };

  // ✅ Update
  // ✅ Update
  const handleUpdate = async () => {
    if (!memberId) {
      setMessage("❌ memberId is missing!");
      return;
    }

    // Agar editedValues khali hai tab bhi call karna hai
    const updatedOptions = Object.entries(editedValues).map(([answerId, value]) => {
      const answerObj = Array.isArray(answers)
        ? answers.find((a) => a.answerId === Number(answerId))
        : null;

      return {
        id: answerObj?.id ?? null,
        answerId: answerObj?.answerId ?? Number(answerId),
        questionId: answerObj?.questionId ?? questionId,
        qualificationId: answerObj?.qualificationId ?? null,
        memberAnswerId: value,
        oldMemberAnswerId: answerObj?.oldMemberAnswerId ?? null,
      };
    });

    // 🔥 Always hit API
    const res = await dispatch(
      updateAnswerMapping({
        memberId,
        questionId,
        memberType: "customer",
        optionData: updatedOptions,
      })
    ).unwrap();

    if (res?.status === 200) {
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
            resolvedTheme === "dark"
              ? "bg-gray-900 text-gray-100"
              : "bg-white text-gray-900"
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
            {/* Search */}
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

            {/* Table */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="max-h-[50vh] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead
                    className={cn(
                      resolvedTheme === "dark" ? "bg-gray-800" : "bg-gray-50"
                    )}
                  >
                    <tr>
                      <th className="px-6 py-4">S.No</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase">
                        Option
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase">
                        Option Review
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase">
                        Option Review Update
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase">
                        New Mapped
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase">
                        Old Mapped
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium uppercase">
                        <div className="flex items-center space-x-2">
                          <span>Select All</span>
                          <Checkbox
                            checked={selectAll}
                            onCheckedChange={handleSelectAll}
                          />
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
                          key={ans.id}
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
                          {/* Answer ID instead of answerText */}
                          <td className="px-6 py-4">Answer #{ans.answerId}</td>

                          {/* Current Mapping */}
                          <td className="px-6 py-4">{ans.memberAnswerId ?? "Not Mapped"}</td>

                          {/* Checkbox for selection */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Input type="text" value={editedValues[ans.answerId] ?? ans.member_answer_id} onChange={(e) => handleInputChange(ans.answerId, e.target.value)} className="w-full" placeholder="Enter constant ID" />
                          </td>


                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={cn(
                                "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                                ans.memberAnswerId != null
                                  ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                  : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                              )}
                            >
                              {ans.memberAnswerId != null ? "Mapped" : "Not Mapped"}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={cn(
                                "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                                ans.oldMemberAnswerId != null
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                              )}
                            >
                              {ans.oldMemberAnswerId != null ? "Old Mapped" : "Not Mapped"}
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
          {/* <div
            className={cn(
              "sticky bottom-0 z-20 flex flex-col sm:flex-row items-center justify-end space-y-4 sm:space-y-0 sm:space-x-3 border-t p-4 transition-colors",
              resolvedTheme === "dark"
                ? "border-gray-700 bg-gray-900"
                : "border-gray-50"
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
          </div> */}

          {/* Footer */}
          <div
            className={cn(
              "sticky bottom-0 z-20 flex flex-col sm:flex-row items-center justify-end space-y-4 sm:space-y-0 sm:space-x-3 border-t p-4 transition-colors",
              resolvedTheme === "dark"
                ? "border-gray-700 bg-gray-900"
                : "border-gray-50"
            )}
          >
            <Button onClick={onClose} variant="outline" className="w-full sm:w-auto">
              <X className="w-4 h-4 mr-2" /> Close
            </Button>

            {/* 🔥 Update button - always enabled */}
            <Button
              onClick={handleUpdate}
              className="bg-yellow-600 text-white hover:bg-yellow-700 w-full sm:w-auto flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-2" /> Update
            </Button>

            {/* 🔥 Save button - only disabled if no checkbox selected */}
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

        <MessageBox
          message={message}
          onClose={() => setMessage("")}
          resolvedTheme={resolvedTheme}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default OptionMappingReviewModal;
