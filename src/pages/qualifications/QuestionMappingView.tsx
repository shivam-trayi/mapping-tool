import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ViewType } from "../../types/qualicationTypes";
import { useDispatch, useSelector } from "react-redux";
import { fetchLanguages } from "@/redux/slices/testing/languageSlice";
import type { RootState, AppDispatch } from "@/redux/store";
import { fetchClients } from "@/redux/slices/testing/clientSlice";
import { fetchQuestionMappings, fetchQuestionReviewMappings, saveQuestionReviewMapping } from "@/redux/slices/testing/questionSlice";

interface QuestionMappingViewProps {
  setCurrentView: (view: ViewType) => void;
  setShowMappingReviewModal: (show: boolean) => void;
  resolvedTheme: "light" | "dark";
}

export const QuestionMappingView: React.FC<QuestionMappingViewProps> = ({
  setCurrentView,
  setShowMappingReviewModal,
  resolvedTheme,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux states
  const { items: languages, loading: langLoading, error: langError } = useSelector(
    (state: RootState) => state.languages
  );
  const { items: clients, loading: clientLoading, error: clientError } = useSelector(
    (state: RootState) => state.clients
  );
  const {
    items: questionMappings,
    loading: qmLoading,
    error: qmError,
  } = useSelector((state: RootState) => state.questionMappings);

  // Local state for selected filters
  const [selectedLang, setSelectedLang] = useState<number | null>(null);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);

  // Load dropdowns initially
  useEffect(() => {
    dispatch(fetchLanguages());
    dispatch(fetchClients());
  }, [dispatch]);

  // Fetch review mapping data when both dropdowns are selected
  useEffect(() => {
    if (selectedLang && selectedClient) {
      dispatch(
        fetchQuestionReviewMappings({
          memberType: "customer",       // always customer (can make dynamic later if needed)
          memberId: selectedClient,     // dynamic from dropdown
          langCode: selectedLang,       // dynamic from dropdown
        })
      );
    }
  }, [selectedLang, selectedClient, dispatch]);


  // Fetch mapping data when both dropdowns selected
  useEffect(() => {
    if (selectedLang && selectedClient) {
      dispatch(
        fetchQuestionMappings({
          memberType: "customer",
          memberId: selectedClient,
          langCode: selectedLang,
        })
      );
    }
  }, [selectedLang, selectedClient, dispatch]);


  const handleSaveReview = () => {
    if (!selectedClient) return;

    const optionData = questionMappings.map((item) => ({
      memberQuestionId: item.memberQuestionId?.toString() || "",
      masterDemoId: item.qualificationId,
      masterQueryId: item.questionId,
    }));

    dispatch(
      saveQuestionReviewMapping({
        memberType: "customer",
        memberId: selectedClient.toString(),
        optionData,
      })
    );
  };

  return (
    <motion.div
      key="question-mapping-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Question Mapping
        </h2>
        <div className="flex space-x-3">
          <Button onClick={() => setShowMappingReviewModal(true)} variant="default">
            Mapping Review
          </Button>
          <Button onClick={() => setCurrentView("list")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>
      </div>

      {/* Dropdowns */}
      <div
        className={cn(
          "flex items-center space-x-4 mb-6 transition-colors",
          resolvedTheme === "dark" ? "text-gray-100" : "text-gray-900"
        )}
      >
        {/* Language dropdown */}
        <select
          onChange={(e) => setSelectedLang(Number(e.target.value))}
          value={selectedLang ?? ""}
          className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
        >
          <option value="">Select Language</option>
          {langLoading && <option>Loading...</option>}
          {langError && <option disabled>{langError}</option>}
          {!langLoading &&
            !langError &&
            languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
        </select>

        {/* Client dropdown */}
        <select
          onChange={(e) => setSelectedClient(Number(e.target.value))}
          value={selectedClient ?? ""}
          className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
        >
          <option value="">Select Customer/Supplier</option>
          {clientLoading && <option>Loading...</option>}
          {clientError && <option disabled>{clientError}</option>}
          {!clientLoading &&
            !clientError &&
            clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
        </select>
      </div>

      {/* Table */}
      <div
        className={cn(
          "rounded-lg shadow overflow-hidden transition-colors",
          resolvedTheme === "dark"
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        )}
      >
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead
            className={cn(
              "transition-colors",
              resolvedTheme === "dark" ? "bg-gray-700" : "bg-gray-50"
            )}
          >
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200">
                S.No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200">
                Question
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200">
                Qualification
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200">
                Mapped
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200">
                Old Mapped
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200">
                Enter Constant Id
              </th>
            </tr>
          </thead>
          <tbody>
            {qmLoading && (
              <tr>
                <td colSpan={6} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}
            {qmError && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-red-500">
                  {qmError}
                </td>
              </tr>
            )}
            {!qmLoading && !qmError && Array.isArray(questionMappings) && questionMappings.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Data not found
                </td>
              </tr>
            )}
            {!qmLoading &&
              !qmError &&
              Array.isArray(questionMappings) &&
              questionMappings.map((item, idx) => (
                <tr key={item.questionId}>
                  <td className="px-6 py-4">{idx + 1}</td>
                  <td className="px-6 py-4">{item.questionText}</td>
                  <td className="px-6 py-4">{item.qualificationName}</td>
                  <td className="px-6 py-4">{item.memberQuestionId ?? "-"}</td>
                  <td className="px-6 py-4">{item.oldMemberQuestionId ?? "-"}</td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      defaultValue={item.memberQuestionId ?? ""}
                      className="px-2 py-1 border rounded w-full"
                    />
                  </td>
                </tr>
              ))}
          </tbody>

        </table>
        <div className="p-4 text-right">
          <Button onClick={handleSaveReview}>Save for Review</Button>
        </div>
      </div>
    </motion.div>
  );
};
