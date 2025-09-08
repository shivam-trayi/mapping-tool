import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { getAllAnswersList, updateOptionsThunk } from "@/redux/slices/testing/questionSlice";
import type { AppDispatch, RootState } from "@/redux/store";

const QuestionOptionsPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // props from navigate
  const { question, questionId, memberId, marketId, langCode } = state || {};

  const { items: answers, loading } = useSelector(
    (s: RootState) => s.questionMappings
  );

  const [optionInputs, setOptionInputs] = useState<Record<number, string>>({});

  useEffect(() => {
    if (questionId && memberId && marketId && langCode) {
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
  }, [questionId, memberId, marketId, langCode, dispatch]);

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

  return (
    <motion.div className="p-6">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold">Question Options</h2>
        <Button onClick={() => navigate(-1)} variant="outline">
          <X className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>

      <h3 className="text-lg font-semibold mb-4">{question}</h3>

      <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
        <div className="max-h-[50vh] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Options</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">New Mapped</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Old Mapped</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Enter Constant Id</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">Loading...</td>
                </tr>
              ) : answers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">No data found</td>
                </tr>
              ) : (
                answers.map((ans: any, idx: number) => (
                  <tr key={ans.answerId} className="hover:bg-gray-50">
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex gap-3 justify-end">
        <Button onClick={() => navigate(-1)} variant="outline">
          <X className="w-4 h-4 mr-2" /> Close
        </Button>
        <Button
          onClick={handleUpdateOptions}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Option Save for Review
        </Button>
      </div>
    </motion.div>
  );
};

export default QuestionOptionsPage;
