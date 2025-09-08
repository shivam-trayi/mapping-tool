import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import {
  getAllAnswersList,
  updateOptionsThunk,
} from "@/redux/slices/testing/questionSlice";
import OptionMappingReviewModal from "./OptionMappingReviewModal";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  question: string;
  questionId: number | null;
  memberId: number | null;
  marketId: number | null;
  langCode: number | null;
}

const QuestionOptionsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  question,
  questionId,
  memberId,
  marketId,
  langCode,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const { items: answers, loading } = useSelector(
    (state: RootState) => state.questionMappings
  );

  const [optionInputs, setOptionInputs] = useState<Record<number, string>>({});

  useEffect(() => {
    if (isOpen && questionId && memberId && marketId && langCode) {
      dispatch(
        getAllAnswersList({
          memberType: "customer",
          memberId,
          marketId,
          langCode,
          questionId,
        })
      );
    }
  }, [isOpen, questionId, memberId, marketId, langCode, dispatch]);

  const handleInputChange = (answerId: number, value: string) => {
    setOptionInputs((prev) => ({ ...prev, [answerId]: value }));
  };

  const handleUpdateOptions = () => {
    if (!questionId || !memberId || !langCode) return;

    const options = answers
      .filter(
        (ans: any) =>
          optionInputs[ans.answerId] && optionInputs[ans.answerId].trim() !== ""
      )
      .map((ans: any) => ({
        answerId: ans.answerId,
        constantId: optionInputs[ans.answerId],
      }));

    dispatch(
      updateOptionsThunk({
        qualificationId: answers[0]?.qualificationId,
        questionId,
        memberId,
        langCode,
        options,
      })
    );
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
            "relative rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col bg-white text-gray-900"
          )}
        >
          {/* Header */}
          <div className="p-6 flex justify-between items-center border-b border-gray-200">
            <h2 className="text-2xl font-bold">Question Options45</h2>
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
            <h3 className="text-lg font-semibold mb-4">{question}</h3>

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
                        New Mapped
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                        Old Mapped
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                        Enter Constant Id
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : answers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center">
                          No data found
                        </td>
                      </tr>
                    ) : (
                      answers.map((ans: any, idx: number) => (
                        <motion.tr
                          key={ans.answerId}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.2 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">{idx + 1}</td>
                          <td className="px-6 py-4">{ans.answerText}</td>
                          <td className="px-6 py-4 font-mono text-sm">
                            {ans.member_answer_id ?? "Not Mapped"}
                          </td>
                          <td className="px-6 py-4 font-mono text-sm">
                            {ans.old_member_answer_id ?? "Not Mapped"}
                          </td>
                          <td className="px-6 py-4">
                            <Input
                              type="text"
                              defaultValue={ans.member_answer_id ?? ""}
                              onChange={(e) =>
                                handleInputChange(ans.answerId, e.target.value)
                              }
                              placeholder="Enter constant ID"
                              className="rounded-lg"
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
            <Button onClick={onClose} variant="outline" className="w-full sm:w-auto">
              <X className="w-4 h-4 mr-2" /> Close
            </Button>
            <Button
              onClick={handleUpdateOptions}
              className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
            >
              Option Savefor Review
            </Button>
            <Button
              onClick={() => setIsReviewOpen(true)}
              className="bg-indigo-600 text-white hover:bg-indigo-700 w-full sm:w-auto"
            >
              Mapping Review
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* Mapping Review Modal */}
      <OptionMappingReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        answers={answers}
      />
    </AnimatePresence>
  );
};

export default QuestionOptionsModal;
