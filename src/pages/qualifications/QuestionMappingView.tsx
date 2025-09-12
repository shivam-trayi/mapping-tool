import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Save, Search } from "lucide-react";
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
import { useNavigate, useLocation } from "react-router-dom";
import { setClient, setLang } from "@/redux/slices/testing/selectedMappingSlice";
// import { setClient, setLang } from "@/redux/slices/testing/selectedMappingSlice";

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

const QuestionMappingView: React.FC<QuestionMappingViewProps> = ({ resolvedTheme }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Local state
  const [fetchedMappings, setFetchedMappings] = useState<QuestionMappingItem[]>([]);
  const [loadingMappings, setLoadingMappings] = useState(false);
  const [showMappingReviewModal, setShowMappingReviewModal] = useState(false);


  const [isSaving, setIsSaving] = useState(false);
  // const [selectedLang, setSelectedLang] = useState<number | null>(null);
  // const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [reviewMappings, setReviewMappings] = useState<any[]>([]);


  const { items: languages, loading: langLoading, error: langError } = useSelector(
    (state: RootState) => state.languages
  );

  const { items: clients, loading: clientLoading, error: clientError } = useSelector(
    (state: RootState) => state.clients
  );

  const selectedLang = useSelector((state: RootState) => state.selectedMapping.lang);
  const selectedClient = useSelector((state: RootState) => state.selectedMapping.client);

  // Fetch languages & clients on mount
  useEffect(() => {
    dispatch(fetchLanguages());
    dispatch(fetchClients());
  }, [dispatch]);

  // Fetch mappings whenever language or client selection changes
  useEffect(() => {
    if (selectedLang && selectedClient) {
      loadMappings(selectedLang, selectedClient);
    } else {
      setFetchedMappings([]);
    }
  }, [selectedLang, selectedClient]);

  // Load mappings + reviews
  const loadMappings = async (lang: number, client: number) => {
    setLoadingMappings(true);
    try {
      const mappingsResult = await dispatch(
        fetchQuestionMappings({ memberType: "customer", memberId: client, langCode: lang })
      ).unwrap();

      const reviewResult = await dispatch(
        fetchQuestionReviewMappings({ memberType: "customer", memberId: client, langCode: lang })
      ).unwrap();
      console.log("Review Result:", reviewResult);

      const mergedData: QuestionMappingItem[] = mappingsResult.map((item) => {
        const review = reviewResult.find((r) => r.questionId === item.questionId);
        return {
          questionId: item.questionId,
          questionText: item.questionText,
          qualificationId: item.qualificationId,
          qualificationName: item.qualificationName,
          memberQuestionId: item.memberQuestionId ?? "",
          oldMemberQuestionId: review?.oldMemberQuestionId ?? item.memberQuestionId ?? "",
          memberId: client,
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

  // Input change handler
  const handleInputChange = (index: number, value: string) => {
    setFetchedMappings((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, memberQuestionId: value } : item))
    );
  };

  // Save review
  const handleSaveReview = async () => {
    if (!selectedLang || !selectedClient) return;
    // if (selectedClient == null || selectedLang == null) return;


    const optionData = fetchedMappings
      .filter((item) => item.memberQuestionId !== item.oldMemberQuestionId)
      .map((item) => ({
        memberQuestionId: item.memberQuestionId ?? "",
        qualificationId: item.qualificationId,
        masterQueryId: item.questionId,
      }));

    if (optionData.length === 0) {
      alert("No changes to save!");
      return;
    }

    setIsSaving(true);
    try {
      await dispatch(
        saveQuestionReviewMapping({
          memberType: "customer",
          langCode: selectedLang,
          memberId: selectedClient.toString(),
          optionData,
        })
      ).unwrap();

      await loadMappings(selectedLang, selectedClient);
    } catch (err) {
      console.error("Error saving review:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenReviewModal = async () => {
    if (!selectedLang || !selectedClient) {
      alert("Please select both Language and Customer first!");
      return;
    }

    try {
      const reviewResult = await dispatch(
        fetchQuestionReviewMappings({
          memberType: "customer",
          memberId: selectedClient,
          langCode: selectedLang,
        })
      ).unwrap();

      console.log("Review Modal Data:", reviewResult);
      setReviewMappings(reviewResult);
      setShowMappingReviewModal(true);
    } catch (err) {
      console.error("Error loading review mappings:", err);
      setReviewMappings([]);
      setShowMappingReviewModal(true);
    }
  };


  // useEffect(() => {
  //   if (selectedLang && selectedClient) {
  //     loadMappings(selectedLang, selectedClient);
  //   } else {
  //     setFetchedMappings([]);
  //   }
  // }, [selectedLang, selectedClient]);

  const location = useLocation();

  useEffect(() => {
    const isData = location.state?.isData;
    if (!isData) {
      dispatch(setClient(0));
      dispatch(setLang(0));
    }
    dispatch(fetchClients());
  }, [location.pathname, dispatch]);

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
          <Button onClick={handleOpenReviewModal} className="rounded-xl shadow-sm">
            Mapping Review
          </Button>

          <Button
            onClick={() => navigate("/dashboard/qualifications-mapping", { state: { fromChild: true } })}
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
          onChange={(e) => dispatch(setLang(Number(e.target.value)))}
          // onChange={(e) => setSelectedLang(Number(e.target.value))}

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
          onChange={(e) => dispatch(setClient(Number(e.target.value)))}
          // onChange={(e) => setSelectedClient(Number(e.target.value))}
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
          "rounded-2xl shadow-lg border flex flex-col overflow-hidden",
          resolvedTheme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        )}
      >
        <div className="overflow-y-auto max-h-[500px]">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead
              className={cn(
                "text-xs uppercase font-medium tracking-wide sticky top-0 z-10",
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
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        No data found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        No qualification and questions mapping data available.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                fetchedMappings.map((item, idx) => {
                  const isMapped = item.memberQuestionId != null && item.memberQuestionId !== "";
                  const isOldMapped =
                    item.oldMemberQuestionId != null && item.oldMemberQuestionId !== "";

                  return (
                    <tr
                      key={item.questionId}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">{idx + 1}</td>
                      <td
                        className="text-blue-600 dark:text-blue-400 cursor-pointer underline"
                        onClick={() =>
                          navigate("/dashboard/question-options", {
                            state: {
                              question: item.questionText,
                              questionId: item.questionId,
                              memberId: selectedClient,
                              marketId: item.qualificationId,
                              langCode: selectedLang,
                            },
                          })
                        }
                      >
                        {item.questionText}
                      </td>
                      <td className="px-6 py-4">{item.qualificationName}</td>
                      {/* <td className="px-6 py-4 text-center">
                        <span
                          className={cn(
                            "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                            isMapped
                              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                              : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                          )}
                        >
                          {isMapped ? "Mapped" : "Not Mapped"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={cn(
                            "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                            isOldMapped
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                          )}
                        >
                          {isOldMapped ? "Old Mapped" : "Not Mapped"}
                        </span>
                      </td> */}


                       <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={cn(
                                "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                                item.memberQuestionId != null
                                  ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                  : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                              )}
                            >
                              {item.memberQuestionId != null ? "Mapped" : "Not Mapped"}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={cn(
                                "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                                item.oldMemberQuestionId != null
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                              )}
                            >
                              {item.oldMemberQuestionId != null ? "Old Mapped" : "Not Mapped"}
                            </span>
                          </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={item.memberQuestionId ?? ""}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className={cn(
            "p-4 border-t flex items-center justify-end transition-colors sticky bottom-0 z-20",
            resolvedTheme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
          )}
        >
          <Button
            onClick={handleSaveReview}
            className="gradient-primary text-white hover:shadow-glow transition-all duration-300"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Question Save for Review
              </>
            )}
          </Button>
        </div>
      </div>

      <MappingReviewModal
        isOpen={showMappingReviewModal}
        onClose={() => {
          setShowMappingReviewModal(false);
          if (selectedLang && selectedClient) {
            loadMappings(selectedLang, selectedClient); // 🔄 Refresh main table
          }
        }}
        mappings={reviewMappings}
        resolvedTheme={resolvedTheme}
        selectedLang={selectedLang}
        selectedClient={selectedClient}
      />

    </motion.div>
  );
};

export default QuestionMappingView;
