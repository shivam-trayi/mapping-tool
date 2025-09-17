// src/pages/qualifications/OptionMappingReviewModal.tsx
import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageBox } from "@/components/ui/MessageBox";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/redux/store";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// ✅ Import slice actions
import { insertAnswerMapping } from "@/redux/slices/Features/answerSlice";

// ✅ Import API service
import { getOptionQueryReviewMapping } from "@/service/answers/answer.Service";
import { useTheme } from "@/hooks/useTheme";

interface OptionMappingReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string | number;
  questionId: string | number;
  // resolvedTheme: "light" | "dark";
}

// ✅ Helper to normalize API response
const normalizeAnswerResponse = (res: any) => {
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data)) return res.data;
  return [];
};

const OptionMappingReviewModal: React.FC<OptionMappingReviewModalProps> = ({
  isOpen,
  onClose,
  memberId,
  questionId,
  // resolvedTheme,
}) => {
  const dispatch = useAppDispatch();

  interface Answer {
    id: number;
    answerId: number;
    answerText: string;
    questionId: number;
    qualificationId: number;
    memberAnswerId?: number | null;
    oldMemberAnswerId?: number | null;
  }

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = React.useState(false);
  const selectedCount = Object.values(selected).filter(Boolean).length;
  const { resolvedTheme } = useTheme();


  // ✅ API call for fetching review mapping
  useEffect(() => {
    if (!isOpen || !memberId || !questionId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getOptionQueryReviewMapping({
          memberId: Number(memberId),
          questionId: Number(questionId),
        });

        console.log("🔍 API Raw Response:", res);

        const finalData = normalizeAnswerResponse(res);
        console.log("✅ Final Answer Data:", finalData);

        setAnswers(finalData);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        toast({
          description: "❌ Failed to fetch option mappings",
          variant: "destructive",
        });
        setAnswers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, memberId, questionId]);

  // ✅ Filtered data with search
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

  // 🔹 Helper function
  const fetchAnswers = async () => {
    setLoading(true); // 🔹 Start loader
    try {
      const res = await getOptionQueryReviewMapping({
        memberId: Number(memberId),
        questionId: Number(questionId),
      });

      const finalData = normalizeAnswerResponse(res);
      console.log("📌 Latest Answers:", finalData);
      setAnswers(finalData);

      // 🔹 Reset selection on new data fetch
      setSelected({});
      setSelectAll(false);
    } catch (err) {
      console.error("❌ Failed to fetch answers:", err);
      setAnswers([]);
      toast({
        description: "❌ Failed to fetch option mappings",
        variant: "destructive",
      });
    } finally {
      setLoading(false); // 🔹 Stop loader
    }
  };


  // 🔹 useEffect for first load
  useEffect(() => {
    if (memberId && questionId) {
      fetchAnswers();
    }
  }, [memberId, questionId]);

  // 🔹 Save handler
  const handleSave = async () => {
    const selectedData = filteredData.filter((ans) => selected[ans.answerId]);
    if (!selectedData.length) return;

    if (!memberId) {
      setMessage("❌ memberId is missing!");
      return;
    }

    const payload = {
      memberId: Number(memberId),
      memberType: "customer",
      questionId: Number(questionId),
      optionData: selectedData.map((ans) => ({
        id: ans.id,
        answerId: ans.answerId,
        questionId: ans.questionId,
        qualificationId: ans.qualificationId,
        memberAnswerId: ans.memberAnswerId,
        oldMemberAnswerId: ans.oldMemberAnswerId,
      })),
    };


    setSaveLoading(true);

    try {
      const res = await dispatch(insertAnswerMapping(payload)).unwrap();

      if (res?.status === 200 && res.data?.affectedRows > 0) {
        toast({
          description: res.message || "✅ Mapping saved successfully!",
          variant: "success",
        });
        await fetchAnswers();
        setSelected({});
        setSelectAll(false);
      } else {
        toast({
          description: res.message || "❌ Something went wrong!",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        description: "❌ Something went wrong!",
        variant: "destructive",
      });
    } finally {
      setSaveLoading(false);
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
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border-b border-gray-200 dark:border-gray-700">
                  <thead
                    className={cn(
                      resolvedTheme === "dark" ? "bg-gray-800" : "bg-gray-50",
                      "sticky top-0 z-10"
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
                      {/* <th className="px-6 py-4 text-left text-xs font-medium uppercase">
                        Option Review Update
                      </th> */}
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
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {/* ✅ Show skeleton while loading */}
                    {loading ? (
                      [...Array(5)].map((_, idx) => (
                        <tr key={idx} className="animate-pulse">
                          <td className="px-6 py-4">
                            <Skeleton className="h-4 w-6 rounded" />
                          </td>
                          <td className="px-6 py-4">
                            <Skeleton className="h-4 w-32" />
                          </td>
                          <td className="px-6 py-4">
                            <Skeleton className="h-4 w-24" />
                          </td>
                          <td className="px-6 py-4">
                            <Skeleton className="h-4 w-20" />
                          </td>
                          <td className="px-6 py-4">
                            <Skeleton className="h-4 w-20" />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Skeleton className="h-5 w-5 rounded" />
                          </td>
                        </tr>
                      ))
                    ) : filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center">
                          <div className="flex flex-col items-center space-y-3">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                              <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No data found</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                              All option are approved / Mapped
                            </p>
                          </div>
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

                        >
                          <td className="px-6 py-4">{idx + 1}</td>
                          <td className="px-6 py-4">{ans.answerText}</td>
                          <td className="px-6 py-4">{ans.memberAnswerId ?? "Not Mapped"}</td>

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
            <Button
              onClick={handleSave}
              disabled={selectedCount === 0 || saveLoading}
              className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto flex items-center justify-center"
            >
              {saveLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="w-4 h-4 mr-2" /> Options Mapping Approve ({selectedCount})
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
