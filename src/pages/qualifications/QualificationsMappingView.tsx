// src/pages/qualifications/QualificationsMappingView.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Map, FileText, Search, Loader2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { saveQualMapping, getAllQualMapping } from "@/redux/slices/Features/saveQualMappingSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import QualificationMappingReviewModal from "./QualificationMappingReviewModal";
import { QualificationsMappingData } from "@/types/qualicationTypes";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchClients } from "@/redux/slices/Features/clientSlice";
import { setClient } from "@/redux/slices/Features/selectedMappingSlice";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
interface QualificationsMappingViewProps {
	setCurrentView: (view: string) => void;
	resolvedTheme: "light" | "dark";
}

interface QualificationMappingDataItem extends QualificationsMappingData {
	id: string;
	qualificationName: string;
	mapped: boolean;
	oldMapped: boolean;
	constantId: string;
}

const QualificationsMappingView: React.FC<QualificationsMappingViewProps> = ({
	resolvedTheme,

}) => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const location = useLocation();
	const { items: clients, loading: clientLoading, error: clientError } = useSelector(
		(state: RootState) => state.clients
	);

	// const [selectedCustomer, setSelectedCustomer] = useState("");
	const [fetchedQualifications, setFetchedQualifications] = useState<QualificationMappingDataItem[]>([]);
	const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
	const [selectAll, setSelectAll] = useState(false);
	const [constantIds, setConstantIds] = useState<Record<string, string>>({});
	const [isSaving, setIsSaving] = useState(false);
	const [loadingTable, setLoadingTable] = useState(false);
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [reviewMappings, setReviewMappings] = useState<QualificationMappingDataItem[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);



	const selectedCustomer = useSelector((state: RootState) => state.selectedMapping.client);

	useEffect(() => {
		const fromChild = location.state?.fromChild;
		if (!fromChild) {
			dispatch(setClient(0));
		}
		dispatch(fetchClients());
	}, [location.pathname, dispatch]);

	// ✅ Debounce effect
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(searchQuery);
		}, 300); // 300ms delay

		return () => {
			clearTimeout(handler); // cleanup on query change
		};
	}, [searchQuery]);

	// Filtered qualifications based on search
	const filteredQualifications = fetchedQualifications.filter((item) =>
		item.qualificationName.toLowerCase().includes(searchQuery.toLowerCase())
	);



	// ✅ Fetch qualifications
	const fetchMappings = async () => {
		// if (!selectedCustomer) {
		// 	setFetchedQualifications([]);
		// 	return;
		// }
		setLoadingTable(true);
		try {
			const response = await dispatch(getAllQualMapping({ memberId: selectedCustomer })).unwrap();
			const apiData: QualificationMappingDataItem[] = response?.data.data || [];

			setFetchedQualifications(
				apiData.map((item) => ({
					id: item.qualification_id,
					qualificationName: (item as any).qualificationName || "",
					mapped: !!item.member_qualification_id,
					oldMapped: !!item.old_member_qualification_id,
					constantId: item.member_qualification_id ?? "",
					qualification_id: item.qualification_id,
					member_id: item.member_id,
					member_type: item.member_type,
				}))
			);
		} catch (err) {
			console.error("Error fetching mappings:", err);
			setFetchedQualifications([]);
		} finally {
			setLoadingTable(false);
		}
	};

	// Fetch whenever customer changes
	useEffect(() => {
		fetchMappings();
		fetchClients();
	}, [selectedCustomer]);

	// Handlers
	const handleSelectAll = (checked: boolean) => {
		setSelectAll(checked);
		setSelectedItems(checked ? new Set(fetchedQualifications.map((q) => q.id)) : new Set());
	};

	const handleSelectItem = (id: string, checked: boolean) => {
		const newSelected = new Set(selectedItems);
		if (checked) newSelected.add(id);
		else newSelected.delete(id);
		setSelectedItems(newSelected);
		setSelectAll(newSelected.size === fetchedQualifications.length);
	};

	// const handleConstantIdChange = (id: string, value: string) => {
	// 	setConstantIds((prev) => ({ ...prev, [id]: value }));
	// };

	// const handleSaveForReview = async () => {
	// 	if (!selectedCustomer) {
	// 		toast({ description: "Please select a Customer/Supplier first." });
	// 		return;
	// 	}
	// 	if (selectedItems.size === 0) return;

	// 	const selectedData: QualificationsMappingData[] = Array.from(selectedItems).map((id) => {
	// 		const item = fetchedQualifications.find((q) => q.id === id)!;
	// 		return {
	// 			qualification_id: item.id,
	// 			member_id: selectedCustomer,
	// 			member_type: "customer",
	// 			constantId: constantIds[id] ?? item.constantId,
	// 		};
	// 	});

	// 	setIsSaving(true);
	// 	try {
	// 		const res = await dispatch(saveQualMapping(selectedData)).unwrap();

	// 		setReviewMappings(
	// 			selectedData.map((d) => ({
	// 				id: d.qualification_id,
	// 				qualificationName: fetchedQualifications.find((q) => q.id === d.qualification_id)?.qualificationName ?? "",
	// 				mapped: true,
	// 				oldMapped: false,
	// 				constantId: d.constantId,
	// 				qualification_id: d.qualification_id,
	// 				member_id: d.member_id,
	// 				member_type: d.member_type,
	// 			}))
	// 		);
	// 		toast({ description: res.message || "Saved for review successfully." });

	// 		setSelectedItems(new Set());
	// 		setSelectAll(false);
	// 		setConstantIds({});
	// 		fetchMappings();
	// 	} catch (err) {
	// 		console.error("Error saving:", err);
	// 		toast({ description: "Failed to save. Try again." });
	// 	} finally {
	// 		setIsSaving(false);
	// 	}
	// };


		const handleConstantIdChange = (id: string, value: string) => {
		// ✅ Always update input state, even if blank
		setConstantIds((prev) => ({ ...prev, [id]: value }));
	};

	const handleSaveForReview = async () => {
		// 1️⃣ Check if customer is selected
		if (!selectedCustomer) {
			toast({
				description: "⚠️ Please select a Customer/Supplier first.",
				variant: "destructive",
				className: "max-w-sm w-full",
			});
			return;
		}

		// 2️⃣ Check if any items are selected
		if (selectedItems.size === 0) {
			toast({
				description: "⚠️ Please select at least one qualification to save.",
				variant: "destructive",
				className: "max-w-sm w-full",
			});
			return;
		}

		const invalidIds = Array.from(selectedItems).filter(
			(id) => {
				const val = constantIds[id]?.trim() ?? fetchedQualifications.find(q => q.id === id)?.constantId?.trim();
				return !val; // blocks only truly empty values
			}
		);
		if (invalidIds.length > 0) {
			toast({
				description: "⚠️ Constant ID cannot be blank for selected qualifications.",
				variant: "destructive",
				className: "max-w-sm w-full",
			});
			return;
		}

		// 4️⃣ Prepare selectedData for save
		const selectedData: QualificationsMappingData[] = Array.from(selectedItems).map((id) => {
			const item = fetchedQualifications.find((q) => q.id === id)!;
			return {
				qualification_id: item.id,
				member_id: selectedCustomer,
				member_type: "customer",
				constantId: constantIds[id]?.trim() ?? item.constantId,
			};
		});

		// 5️⃣ Save
		setIsSaving(true);
		try {
			const res = await dispatch(saveQualMapping(selectedData)).unwrap();

			// 6️⃣ Update reviewMappings for modal
			setReviewMappings(
				selectedData.map((d) => ({
					id: d.qualification_id,
					qualificationName:
						fetchedQualifications.find((q) => q.id === d.qualification_id)?.qualificationName ?? "",
					mapped: true,
					oldMapped: false,
					constantId: d.constantId,
					qualification_id: d.qualification_id,
					member_id: d.member_id,
					member_type: d.member_type,
				}))
			);

			toast({
				description: res.message || "✅ Saved for review successfully.",
				variant: "default",
				className: "max-w-sm w-full",
			});

			// 7️⃣ Reset selection and constant IDs
			setSelectedItems(new Set());
			setSelectAll(false);
			setConstantIds({});
			fetchMappings();
		} catch (err) {
			console.error("Error saving:", err);
			toast({
				description: "❌ Failed to save. Try again.",
				variant: "destructive",
				className: "max-w-sm w-full",
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<>
			<motion.div key="qual-mapping" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="p-6">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Qualifications Mapping</h2>
					<div className="flex space-x-3">
						<Button onClick={() => navigate("/dashboard/question-mapping")} variant="default">
							<FileText className="w-4 h-4 mr-2" /> Question Mapping
						</Button>
						{/* <Button onClick={() => setShowReviewModal(true)} variant="default">
							<Map className="w-4 h-4 mr-2" /> Mapping Review
						</Button> */}
						<Button onClick={() => navigate("/dashboard/list")} variant="outline">
							<ArrowLeft className="w-4 h-4 mr-2" /> Back
						</Button>
					</div>
				</div>

				{/* Customer select */}

				<div className={cn("flex items-center mb-6 space-x-4", resolvedTheme === "dark" ? "text-gray-100" : "text-gray-900")}>
					{/* Customer/Supplier select */}
					<div className="w-64 flex-shrink-0">
						<select
							value={selectedCustomer ?? ""}
							onChange={(e) => dispatch(setClient(Number(e.target.value)))}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

					{/* Search input */}
					<div className="flex items-center space-x-2 flex-1 min-w-0">
						<div className="relative">
							<Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
							<input
								type="text"
								placeholder="Search Qualifications..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 transition-colors min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
					</div>
				</div>

				{/* Table */}
				<div className={cn("rounded-2xl shadow-lg border flex flex-col overflow-hidden", resolvedTheme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
					<div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
						<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
							<thead className={cn("sticky top-0 z-10", resolvedTheme === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-50 text-gray-500")}>
								<tr>
									<th className="px-6 py-3 text-left">
										<div className="flex items-center space-x-2">
											<Checkbox checked={selectAll} onCheckedChange={handleSelectAll} className="border-gray-300" />
											<span className="text-xs font-medium uppercase tracking-wider">Select All</span>
										</div>
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">S.No</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Qualifications</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Mapped</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Old Mapped</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Constant Id</th>
								</tr>
							</thead>

							<tbody className={cn(resolvedTheme === "dark" ? "divide-gray-700" : "divide-gray-200")}>
								{loadingTable ? (
									// Skeleton rows
									[...Array(5)].map((_, idx) => (
										<tr key={idx} className="animate-pulse">
											<td className="px-6 py-4 whitespace-nowrap">
												<Skeleton className="h-4 w-4 rounded" />
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm">
												<Skeleton className="h-4 w-6" />
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm">
												<Skeleton className="h-4 w-40" />
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm">
												<Skeleton className="h-5 w-20 rounded-full" />
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm">
												<Skeleton className="h-5 w-24 rounded-full" />
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<Skeleton className="h-9 w-full rounded-md" />
											</td>
										</tr>
									))
								) : filteredQualifications.length > 0 ? (
									filteredQualifications.map((item, idx) => (
										<tr
											key={item.id}
											className={cn(
												selectedItems.has(item.id) ? "bg-blue-50 dark:bg-blue-900/20" : "",
												resolvedTheme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
											)}
										>
											<td className="px-6 py-4 whitespace-nowrap">
												<Checkbox
													checked={selectedItems.has(item.id)}
													onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
													className="border-gray-300"
												/>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm">{idx + 1}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												{item.qualificationName}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm">
												<span
													className={cn(
														"inline-flex px-2 py-1 text-xs font-semibold rounded-full",
														item.mapped
															? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
															: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
													)}
												>
													{item.mapped ? "Mapped" : "Not Mapped"}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm">
												<span
													className={cn(
														"inline-flex px-2 py-1 text-xs font-semibold rounded-full",
														item.oldMapped
															? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
															: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
													)}
												>
													{item.oldMapped ? "Old Mapped" : "Not Mapped"}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<Input
													type="text"
													value={constantIds[item.id] ?? item.constantId}
													onChange={(e) => handleConstantIdChange(item.id, e.target.value)}
													className="w-full"
													placeholder="Enter constant ID"
												/>
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
													No qualification mapping data available.
												</p>
											</div>
										</td>
									</tr>
								)}
							</tbody>

						</table>

						{/* Footer */}
						<div className={cn("p-4 border-t flex items-center justify-between sticky bottom-0 z-20 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700")}>
							<div className="text-sm text-gray-600 dark:text-gray-400">{selectedItems.size > 0 ? `${selectedItems.size} qualification(s) selected` : "No qualifications selected"}</div>
							<Button onClick={handleSaveForReview} disabled={selectedItems.size === 0 || isSaving} className="gradient-primary text-white hover:shadow-glow transition-all duration-300">
								{isSaving ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
									</>
								) : (
									<>
										<Save className="w-4 h-4 mr-2" /> Save for Review ({selectedItems.size})
									</>
								)}
							</Button>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Review Modal */}
			<QualificationMappingReviewModal
				isOpen={showReviewModal}
				onClose={() => {
					setShowReviewModal(false);
					fetchMappings();
				}}
				mappings={reviewMappings}
				qualifications={[]}
				resolvedTheme={resolvedTheme}
			/>
		</>
	);
};

export default QualificationsMappingView;
