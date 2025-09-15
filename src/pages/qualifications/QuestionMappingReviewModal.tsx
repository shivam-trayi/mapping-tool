import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Save, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageBox } from "@/components/ui/MessageBox";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import {
  insertMappingReviewThunk,
  updateMappingReviewThunk,
} from "@/redux/slices/Features/createmMppingReviewSlice";
import { QuestionMappingItem } from "@/service/questions/questions.service";
import { fetchQuestionReviewMappings } from "@/redux/slices/Features/questionSlice";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface MappingReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resolvedTheme: "light" | "dark";
  selectedLang: number;
  selectedClient: number;
}

const MappingReviewModal: React.FC<MappingReviewModalProps> = ({
  isOpen,
  onClose,
  resolvedTheme,
  selectedLang,
  selectedClient,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [mappings, setMappings] = React.useState<QuestionMappingItem[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [saveLoading, setSaveLoading] = React.useState(false);
  // const [updateLoading, setUpdateLoading] = React.useState(false);
  // const [editedValues, setEditedValues] = React.useState<Record<number, string>>({});
  const [loading, setLoading] = React.useState(false);

  const fetchMappings = async () => {
    try {
      setLoading(true);
      const result = await dispatch(
        fetchQuestionReviewMappings({
          memberType: "customer",
          memberId: selectedClient,
          langCode: selectedLang,
        })
      ).unwrap();
      setMappings(result);
    } catch (err) {
      console.error("Error fetching mappings:", err);
    } finally {
      setLoading(false);
    }
  };


  // Fetch when modal opens
  React.useEffect(() => {
    if (isOpen) {
      fetchMappings();
    }
  }, [isOpen, selectedClient, selectedLang]);

  // const handleInputChange = (questionId: number, value: string) => {
  //   setEditedValues((prev) => ({ ...prev, [questionId]: value }));
  // };

  const mappedData = React.useMemo(
    () => mappings.filter((item) => item.memberQuestionId != null),
    [mappings]
  );

  const filteredData = React.useMemo(
    () => mappedData.filter((item) =>
      item.questionText.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [mappedData, searchTerm]
  );

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedItems(checked ? new Set(filteredData.map((item) => item.questionId)) : new Set());
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    checked ? newSelected.add(id) : newSelected.delete(id);
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === filteredData.length && filteredData.length > 0);
  };

  const questionHandleSave = async () => {
    const selectedData = Array.from(selectedItems)
      .map((id) => mappedData.find((d) => d.questionId === id))
      .filter(Boolean);

    if (selectedData.length === 0) return;

    setSaveLoading(true);
    try {
      const payload = {
        memberId: selectedData[0]!.memberId,
        memberType: selectedData[0]!.memberType,
        optionData: selectedData.map((item) => ({
          questionId: item!.questionId,
          qualificationId: item!.qualificationId,
          memberQuestionId: item!.memberQuestionId!,
        })),
      };

      const res = await dispatch(insertMappingReviewThunk(payload)).unwrap();
      if (res?.status === 200) {
        toast({ description: res.message || "Mappings inserted successfully." });
      }
      setMessage("✅ Successfully inserted mappings!");
      setSelectedItems(new Set());
      setSelectAll(false);
      await fetchMappings(); // refresh after save
    } catch (err: any) {
      setMessage(`❌ ${err.message || "Insert failed"}`);
    } finally {
      setSaveLoading(false);
    }
  };

  // const handleUpdate = async () => {
  //   const selectedData = Object.entries(editedValues)
  //     .map(([questionIdStr, memberQuestionIdStr]) => {
  //       const questionId = Number(questionIdStr);
  //       const memberQuestionId = Number(memberQuestionIdStr);
  //       if (isNaN(memberQuestionId)) return null;
  //       const item = mappings.find((d) => d.questionId === questionId);
  //       if (!item) return null;

  //       return {
  //         questionId: item.questionId,
  //         qualificationId: item.qualificationId,
  //         memberQuestionId,
  //         memberId: item.memberId,
  //         memberType: item.memberType,
  //       };
  //     })
  //     .filter(Boolean) as {
  //       questionId: number;
  //       qualificationId: number;
  //       memberQuestionId: number;
  //       memberId: number;
  //       memberType: string;
  //     }[];

  //   if (selectedData.length === 0) return;

  //   setUpdateLoading(true);
  //   try {
  //     const payload = {
  //       memberId: selectedData[0].memberId,
  //       memberType: selectedData[0].memberType,
  //       optionData: selectedData.map(({ questionId, qualificationId, memberQuestionId }) => ({
  //         questionId,
  //         qualificationId,
  //         memberQuestionId,
  //       })),
  //     };

  //     const res = await dispatch(updateMappingReviewThunk(payload)).unwrap();
  //     if (res?.status === 200) {
  //       toast({ description: res.message || "Mappings updated successfully." });
  //     }
  //     setMessage("✅ Successfully updated mappings!");
  //     setEditedValues({});
  //     await fetchMappings(); // refresh after update
  //   } catch (err: any) {
  //     setMessage(`❌ ${err.message || "Update failed"}`);
  //   } finally {
  //     setUpdateLoading(false);
  //   }
  // };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={cn(
            "relative rounded-2xl shadow-2xl w-full max-w-8xl max-h-[90vh] flex flex-col",
            resolvedTheme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
          )}
        >
          {/* Header */}
          <div className={cn("p-6 flex justify-between items-center border-b", resolvedTheme === "dark" ? "border-gray-700" : "border-gray-200")}>
            <h2 className="text-2xl font-bold">Question Mapping Review</h2>
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
                placeholder="Search questions..."
              />
            </div>

            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="max-h-[50vh] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={resolvedTheme === "dark" ? "bg-gray-800" : "bg-gray-50"}>
                    <tr>
                      <th className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                          <span className="text-xs font-medium uppercase hidden sm:block">Select All</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase">Qualification</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase">Question</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase">Question Review</th>
                      {/* <th className="px-6 py-4 text-left text-xs font-medium uppercase">Question Review Update</th> */}
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase">New Mapped</th>

                      <th className="px-6 py-4 text-left text-xs font-medium uppercase">Old Mapped</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [...Array(5)].map((_, idx) => (
                        <tr key={idx} className="animate-pulse">
                          <td className="px-6 py-4">
                            <Skeleton className="h-4 w-4 rounded" />
                          </td>
                          <td className="px-6 py-4">
                            <Skeleton className="h-4 w-32" />
                          </td>
                          <td className="px-6 py-4">
                            <Skeleton className="h-4 w-40" />
                          </td>
                          <td className="px-6 py-4">
                            <Skeleton className="h-4 w-20" />
                          </td>
                          <td className="px-6 py-4">
                            <Skeleton className="h-4 w-20" />
                          </td>
                          <td className="px-6 py-4">
                            <Skeleton className="h-6 w-full rounded-md" />
                          </td>
                        </tr>
                      ))
                    ) : filteredData.length ? (
                      filteredData.map((item) => (
                        <tr
                          key={item.questionId}
                          className={
                            selectedItems.has(item.questionId)
                              ? "bg-blue-50 dark:bg-blue-900/20"
                              : ""
                          }
                        >
                          <td className="px-6 py-4">
                            <Checkbox
                              checked={selectedItems.has(item.questionId)}
                              onCheckedChange={(checked) =>
                                handleSelectItem(item.questionId, !!checked)
                              }
                            />
                          </td>
                          <td className="px-6 py-4">{item.qualificationName}</td>
                          <td className="px-6 py-4">{item.questionText}</td>
                          <td className="px-6 py-4 font-mono">{item.memberQuestionId}</td>
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
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-12 text-center">
                          <div className="flex flex-col items-center space-y-3">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                              <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No data found</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                              All  Question Mapping / Approved
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={cn("sticky bottom-0 z-20 flex flex-col sm:flex-row items-center justify-end space-y-4 sm:space-y-0 sm:space-x-3 border-t p-4", resolvedTheme === "dark" ? "border-gray-700 bg-gray-900" : "border-gray-50")}>
            <Button onClick={questionHandleSave} disabled={selectedItems.size === 0 || saveLoading} className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto flex items-center justify-center">
              {saveLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="w-4 h-4 mr-2" /> Question Mapping Approved ({selectedItems.size})
            </Button>

            {/* <Button onClick={handleUpdate} disabled={Object.keys(editedValues).length === 0 || updateLoading} className="bg-yellow-600 text-white hover:bg-yellow-700 w-full sm:w-auto flex items-center justify-center">
              {updateLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="w-4 h-4 mr-2" /> Update
            </Button> */}

            <Button onClick={onClose} variant="outline" className="w-full sm:w-auto">
              <X className="w-4 h-4 mr-2" /> Close
            </Button>
          </div>
        </motion.div>

        <MessageBox message={message} onClose={() => setMessage("")} resolvedTheme={resolvedTheme} />
      </motion.div>
    </AnimatePresence>
  );
};

export default MappingReviewModal;
