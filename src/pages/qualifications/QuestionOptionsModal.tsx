// src/pages/qualifications/QuestionOptionsPage.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Save, Map, Search, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  getAllAnswersList,
  updateOptionsThunk,
} from "@/redux/slices/testing/questionSlice";
import OptionMappingReviewModal from "./OptionMappingReviewModal";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { getOptionQueryReviewMapping } from "@/service/answers/answer.Service";

interface LocationState {
  question: string;
  questionId: number;
  memberId: number;
  marketId: number;
  langCode: number;
}

interface AnswerItem {
  answerId: number;
  answerText: string;
  member_answer_id?: string;
  old_member_answer_id?: string;
  qualificationId?: number;
}

const QuestionOptionsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [optionInputs, setOptionInputs] = useState<Record<number, string>>({});
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const state = location.state as LocationState;
  const [reviewData, setReviewData] = useState<any[]>([]);

  const { items: answers, loading } = useSelector(
    (state: RootState) => state.questionMappings
  );

  // Fetch answers on page load
  useEffect(() => {
    if (!state) {
      navigate(-1);
      return;
    }

    dispatch(
      getAllAnswersList({
        memberType: "customer",
        memberId: state.memberId,
        marketId: state.marketId,
        langCode: state.langCode,
        questionId: state.questionId,
      })
    );
  }, [state, dispatch, navigate]);

  const handleInputChange = (answerId: number, value: string) => {
    setOptionInputs((prev) => ({ ...prev, [answerId]: value }));
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedItems(checked ? new Set(answers.map((a) => a.answerId)) : new Set());
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) newSelected.add(id);
    else newSelected.delete(id);
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === answers.length);
  };


  // handleOpenReview
  const handleOpenReview = async () => {
    try {
      const res = await getOptionQueryReviewMapping({
        memberId: state.memberId,
        questionId: state.questionId,
      });

      console.log("Review API response:", res);

      // ✅ Only send data array
      setReviewData(res.data || []);
      setIsReviewOpen(true);
    } catch (err) {
      console.error("Failed to fetch review data:", err);
      toast({ description: "Failed to fetch review data" });
    }
  };


  // QuestionOptionsPage.tsx ke andar
  const handleCloseReview = async () => {
    setIsReviewOpen(false);

    if (!state) return;

    try {
      // ✅ Refetch answers for table
      await dispatch(
        getAllAnswersList({
          memberType: "customer",
          memberId: state.memberId,
          marketId: state.marketId,
          langCode: state.langCode,
          questionId: state.questionId,
        })
      ).unwrap();

      // ✅ Refetch review data for next time modal opens
      const res = await getOptionQueryReviewMapping({
        memberId: state.memberId,
        questionId: state.questionId,
      });

      setReviewData(res.data || []);
    } catch (err) {
      console.error("Failed to refresh data on modal close:", err);
      toast({ description: "Failed to refresh data" });
    }
  };

  
  const handleUpdateOptions = async () => {
    if (!state) return;

    const options = answers
      .filter((ans: AnswerItem) => selectedItems.has(ans.answerId))
      .map((ans: AnswerItem) => ({
        answerId: ans.answerId,
        constantId: optionInputs[ans.answerId] ?? ans.member_answer_id ?? "",
      }));

    if (options.length === 0) return;

    setIsSaving(true);
    try {
      const res = await dispatch(
        updateOptionsThunk({
          qualificationId: answers[0]?.qualificationId,
          questionId: state.questionId,
          memberId: state.memberId,
          langCode: state.langCode,
          options,
        })
      ).unwrap();

      if (res.status === 200) {
        toast({ description: `${res.message || "Options update for review successfully!"}` });
      }
      // ✅ Refetch latest answers after update
      await dispatch(
        getAllAnswersList({
          memberType: "customer",
          memberId: state.memberId,
          marketId: state.marketId,
          langCode: state.langCode,
          questionId: state.questionId,
        })
      ).unwrap();
      // alert(`Saved ${options.length} option(s) for review`);
      setSelectedItems(new Set());
      setSelectAll(false);
      setOptionInputs({});
    } catch (err) {
      console.error(err);
      // alert("Failed to save options. Try again.");
      toast({ description: 'Failed to save options. Try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!state) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Question Options
        </h2>
        <div className="flex space-x-3">
          <Button
            onClick={handleOpenReview}
            variant="default"
          >
            <Map className="w-4 h-4 mr-2" /> Options Mapping Review
          </Button>
          <Button onClick={() => navigate("/dashboard/question-mapping", { state: { isData: true } })} variant="default">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-md">
        <h6 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
          {state.question}
        </h6>
      </div>
      {/* Table */}
      <div
        className={cn(
          "rounded-xl shadow border overflow-hidden",
          "dark:border-gray-700 dark:bg-gray-800 bg-white border-gray-200"
        )}
      >
        <div className="max-h-[60vh] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead
              className={cn(
                "sticky top-0 z-10",
                "bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-200"
              )}
            >
              <tr>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                      className="border-gray-300"
                    />
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Select All
                    </span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  S.No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Options
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  New Mapped
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Old Mapped
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Constant Id
                </th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", "dark:divide-gray-700 divide-gray-200")}>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="animate-spin h-4 w-4" /> Loading...
                    </div>
                  </td>
                </tr>
              ) : answers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        No data found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        No options available for this question.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                answers.map((ans: AnswerItem, idx: number) => (
                  <tr
                    key={ans.answerId}
                    className={cn(
                      selectedItems.has(ans.answerId)
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : "",
                      "hover:bg-gray-50 dark:hover:bg-gray-700"
                    )}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Checkbox
                        checked={selectedItems.has(ans.answerId)}
                        onCheckedChange={(checked) =>
                          handleSelectItem(ans.answerId, checked as boolean)
                        }
                        className="border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {ans.answerText}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={cn(
                          "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                          ans.member_answer_id != null
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        )}
                      >
                        {ans.member_answer_id != null ? "Mapped" : "Not Mapped"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={cn(
                          "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                          ans.old_member_answer_id != null
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                        )}
                      >
                        {ans.old_member_answer_id != null ? "Old Mapped" : "Not Mapped"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input type="text" value={optionInputs[ans.answerId] ?? ans.member_answer_id} onChange={(e) => handleInputChange(ans.answerId, e.target.value)} className="w-full" placeholder="Enter constant ID" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex items-center justify-between sticky bottom-0 z-20 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedItems.size > 0
              ? `${selectedItems.size} option(s) selected`
              : "No options selected"}
          </div>
          <Button
            onClick={handleUpdateOptions}
            disabled={selectedItems.size === 0 || isSaving}
            className="gradient-primary text-white hover:shadow-glow transition-all duration-300"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Options Save for Review ({selectedItems.size})
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Review Modal */}
      <OptionMappingReviewModal
        isOpen={isReviewOpen}
        onClose={handleCloseReview}   // ✅ yaha pe handleCloseReview
        answers={reviewData}
        memberId={state.memberId}
        questionId={state.questionId}
        resolvedTheme={undefined}
      />


    </motion.div>
  );
};

export default QuestionOptionsPage;
