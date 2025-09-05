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
import {
  fetchQuestionMappings,
  fetchQuestionReviewMappings,
  saveQuestionReviewMapping,
} from "@/redux/slices/testing/questionSlice";
import MappingReviewModal from "./QuestionMappingReviewModal";
import QuestionOptionsModal from "./QuestionOptionsModal";

interface QuestionMappingViewProps {
  setCurrentView: (view: ViewType) => void;
  resolvedTheme: "light" | "dark";
}

interface QuestionMappingItem {
  questionId: number;
  questionText: string;
  qualificationId: number;
  qualificationName: string;
  memberQuestionId?: string;
  oldMemberQuestionId?: string;
  memberId: number;
}

export const QuestionMappingView: React.FC<QuestionMappingViewProps> = ({
  setCurrentView,
  resolvedTheme,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [fetchedMappings, setFetchedMappings] = useState<QuestionMappingItem[]>([]);
  const [loadingMappings, setLoadingMappings] = useState(false);
  const [showMappingReviewModal, setShowMappingReviewModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [selectedQuestionData, setSelectedQuestionData] = useState<{
    questionId: number | null;
    memberId: number | null;
    marketId: number | null;
    langCode: number | null;
  }>({ questionId: null, memberId: null, marketId: null, langCode: null });

  const { items: languages, loading: langLoading, error: langError } = useSelector(
    (state: RootState) => state.languages
  );
  const { items: clients, loading: clientLoading, error: clientError } = useSelector(
    (state: RootState) => state.clients
  );

  const [selectedLang, setSelectedLang] = useState<number | null>(null);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchLanguages());
    dispatch(fetchClients());
  }, [dispatch]);

  useEffect(() => {
    if (selectedLang != null && selectedClient != null) {
      const fetchData = async () => {
        setLoadingMappings(true);
        try {
          const mappingsResult = await dispatch(
            fetchQuestionMappings({
              memberType: "customer",
              memberId: selectedClient,
              langCode: selectedLang,
            })
          ).unwrap();

          const reviewResult = await dispatch(
            fetchQuestionReviewMappings({
              memberType: "customer",
              memberId: selectedClient,
              langCode: selectedLang,
            })
          ).unwrap();

          const mergedData: QuestionMappingItem[] = mappingsResult.map((item) => {
            const review = reviewResult.find((r) => r.questionId === item.questionId);
            return {
              questionId: item.questionId,
              questionText: item.questionText,
              qualificationId: item.qualificationId,
              qualificationName: item.qualificationName,
              memberQuestionId: item.memberQuestionId,
              oldMemberQuestionId: review?.memberQuestionId,
              memberId: selectedClient,
            };
          });

          setFetchedMappings(mergedData);
        } catch (err) {
          console.error("Error fetching mappings or reviews:", err);
          setFetchedMappings([]);
        } finally {
          setLoadingMappings(false);
        }
      };

      fetchData();
    } else {
      setFetchedMappings([]);
    }
  }, [selectedLang, selectedClient, dispatch]);

  const handleInputChange = (index: number, value: string) => {
    setFetchedMappings((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, memberQuestionId: value } : item
      )
    );
  };

  const handleSaveReview = () => {
		if (selectedClient == null || selectedLang == null) return;

		// 👇 Sirf wahi rows lo jisme change hua hai
		const optionData = fetchedMappings
			.filter((item) => item.memberQuestionId !== item.oldMemberQuestionId)
			.map((item) => ({
				memberQuestionId: item.memberQuestionId ?? '',
				qualificationId: item.qualificationId,
				masterQueryId: item.questionId,
			}));

		if (optionData.length === 0) {
			alert('No changes to save!');
			return;
		}

		dispatch(
			saveQuestionReviewMapping({
				memberType: 'customer',
				langCode: selectedLang,
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
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Question Mapping
        </h2>
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowMappingReviewModal(true)}
            className="rounded-xl shadow-sm"
          >
            Mapping Review
          </Button>
          <MappingReviewModal
            isOpen={showMappingReviewModal}
            onClose={() => setShowMappingReviewModal(false)}
            mappings={fetchedMappings}
            resolvedTheme={resolvedTheme}
          />
          <Button
            onClick={() => setCurrentView("mapping")}
            variant="outline"
            className="rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>
      </div>

      {/* Dropdowns */}
      <div className="flex items-center space-x-4 mb-6">
        <select
          onChange={(e) => setSelectedLang(Number(e.target.value))}
          value={selectedLang ?? ""}
          className={cn(
            "px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all",
            resolvedTheme === "dark"
              ? "bg-gray-900 text-gray-100 border-gray-700 focus:ring-blue-500"
              : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
          )}
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

        <select
          onChange={(e) => setSelectedClient(Number(e.target.value))}
          value={selectedClient ?? ""}
          className={cn(
            "px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all",
            resolvedTheme === "dark"
              ? "bg-gray-900 text-gray-100 border-gray-700 focus:ring-blue-500"
              : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
          )}
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
          "rounded-2xl shadow-lg overflow-hidden border",
          resolvedTheme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        )}
      >
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead
            className={cn(
              "text-xs uppercase font-medium tracking-wide",
              resolvedTheme === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-50 text-gray-600"
            )}
          >
            <tr>
              <th className="px-6 py-3 text-left">S.No</th>
              <th className="px-6 py-3 text-left">Question</th>
              <th className="px-6 py-3 text-left">Qualification</th>
              <th className="px-6 py-3 text-left">Mapped</th>
              <th className="px-6 py-3 text-left">Old Mapped</th>
              <th className="px-6 py-3 text-left">Enter Constant Id</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {!selectedLang || !selectedClient ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Please select both Language and Customer to load data.
                </td>
              </tr>
            ) : loadingMappings ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : fetchedMappings.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            ) : (
              fetchedMappings.map((item, idx) => (
                <tr
                  key={item.questionId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4">{idx + 1}</td>
                  <td
                    className="text-blue-600 dark:text-blue-400 cursor-pointer underline"
                    onClick={() => {
                      setSelectedQuestion(item.questionText);
                      setShowQuestionModal(true);
                      setSelectedQuestionData({
                        questionId: item.questionId,
                        memberId: selectedClient,
                        marketId: item.qualificationId,
                        langCode: selectedLang,
                      });
                    }}
                  >
                    {item.questionText}
                  </td>
                  <td className="px-6 py-4">{item.qualificationName}</td>
                  <td className="px-6 py-4">{item.memberQuestionId ?? "-"}</td>
                  <td className="px-6 py-4">{item.oldMemberQuestionId ?? "-"}</td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      defaultValue={item.memberQuestionId ?? ""}
                      onChange={(e) => handleInputChange(idx, e.target.value)}
                      className={cn(
                        "px-2 py-1 border rounded-lg w-full text-sm focus:outline-none focus:ring-2 transition-all",
                        resolvedTheme === "dark"
                          ? "bg-gray-900 text-gray-100 border-gray-700 focus:ring-blue-500"
                          : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
                      )}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {showQuestionModal && (
          <QuestionOptionsModal
            isOpen={showQuestionModal}
            onClose={() => setShowQuestionModal(false)}
            question={selectedQuestion}
            questionId={selectedQuestionData.questionId}
            memberId={selectedQuestionData.memberId}
            marketId={selectedQuestionData.marketId}
            langCode={selectedQuestionData.langCode}
          />
        )}

        <div className="p-4 text-right border-t dark:border-gray-700">
          <Button className="rounded-xl shadow-sm" onClick={handleSaveReview}>
            Save for Review
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
