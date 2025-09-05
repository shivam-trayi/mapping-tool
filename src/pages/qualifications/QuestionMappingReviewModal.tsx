import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageBox } from "@/components/ui/MessageBox";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { insertMappingReviewThunk, resetReviewState } from "@/redux/slices/testing/createmMppingReviewSlice";
import { useAppSelector } from "@/redux/store";

const MappingReviewModal = ({ isOpen, onClose, mappings, resolvedTheme }) => {
  const [selectedItems, setSelectedItems] = React.useState<Set<number>>(
    new Set()
  );
  const [selectAll, setSelectAll] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [message, setMessage] = React.useState("");

  const dispatch = useDispatch();
const { loading, success, error } = useAppSelector(
  (state) => state.mappingReview
);

  // ✅ Sirf mapped questions hi lena hai
  const mappedData = React.useMemo(
    () =>
      mappings.filter(
        (item) => item.memberQuestionId && item.memberQuestionId !== ""
      ),
    [mappings]
  );

  const filteredData = React.useMemo(
    () =>
      mappedData.filter((item) =>
        item.questionText.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [mappedData, searchTerm]
  );

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedItems(new Set(filteredData.map((item) => item.questionId)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
    setSelectAll(
      newSelected.size === filteredData.length && filteredData.length > 0
    );
  };

const handleSave = () => {
  const selectedData = Array.from(selectedItems).map((id) =>
    mappedData.find((d) => d.questionId === id)
  ).filter(Boolean); // null/undefined clean

  if (selectedData.length === 0) return;

  const memberId = selectedData[0]?.memberId || mappings[0]?.memberId;

  const payload = {
    memberId,
    optionData: selectedData.map((item) => ({
      questionId: item.questionId,
      qualificationId: item.qualificationId,
      memberQuestionId: item.memberQuestionId,
    })),
  };

  dispatch(insertMappingReviewThunk(payload));
};



  // ✅ Success/Error message handling
  React.useEffect(() => {
    if (success) {
      setMessage("✅ Successfully inserted mappings!");
      dispatch(resetReviewState());
      setSelectedItems(new Set());
      setSelectAll(false);
    } else if (error) {
      setMessage(`❌ ${error}`);
      dispatch(resetReviewState());
    }
  }, [success, error, dispatch]);

  if (!isOpen) return null;

  return (
		<AnimatePresence>
			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed inset-0 z-50 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 sm:p-6'>
				<motion.div
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.95, opacity: 0 }}
					className={cn('relative rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col transition-colors', resolvedTheme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900')}>
					{/* Header */}
					<div className={cn('p-6 flex justify-between items-center border-b transition-colors', resolvedTheme === 'dark' ? 'border-gray-700' : 'border-gray-200')}>
						<h2 className='text-2xl font-bold'>Question Mapping Review</h2>
						<Button onClick={onClose} variant='ghost' size='sm' className='rounded-full'>
							<X className='w-5 h-5' />
						</Button>
					</div>

					{/* Content */}
					<div className='flex-1 overflow-y-auto p-6'>
						{/* Search */}
						<div className='relative flex-1 max-w-full sm:max-w-sm mb-6'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
							<Input type='text' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='pl-10 rounded-lg' placeholder='Search questions...' />
						</div>

						{/* Results Summary */}
						<div className='flex items-center justify-between mb-4 text-sm'>
							<span>
								Showing {filteredData.length} mapped items {selectedItems.size > 0 && `(${selectedItems.size} selected)`}
							</span>
						</div>

						{/* Table */}
						<div className='rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700'>
							<div className='max-h-[50vh] overflow-y-auto'>
								<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
									<thead className={cn(resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50')}>
										<tr>
											<th className='px-6 py-4'>
												<div className='flex items-center space-x-2'>
													<Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
													<span className='text-xs font-medium uppercase hidden sm:block'>Select All</span>
												</div>
											</th>
											<th className='px-6 py-4 text-left text-xs font-medium uppercase'>Question</th>
											<th className='px-6 py-4 text-left text-xs font-medium uppercase'>Qualification</th>
											<th className='px-6 py-4 text-left text-xs font-medium uppercase'>Mapped Field</th>
										</tr>
									</thead>
									<tbody>
										{filteredData.length > 0 ? (
											filteredData.map((item) => (
												<motion.tr
													key={item.questionId}
													initial={{ opacity: 0, y: -10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: 10 }}
													transition={{ duration: 0.2 }}
													className={cn(selectedItems.has(item.questionId) && 'bg-blue-50 dark:bg-blue-900/20')}>
													<td className='px-6 py-4'>
														<Checkbox checked={selectedItems.has(item.questionId)} onCheckedChange={(checked) => handleSelectItem(item.questionId, !!checked)} />
													</td>
													<td className='px-6 py-4'>{item.questionText}</td>
													<td className='px-6 py-4'>{item.qualificationName}</td>
													<td className='px-6 py-4 font-mono'>{item.memberQuestionId}</td>
												</motion.tr>
											))
										) : (
											<tr>
												<td colSpan={4} className='p-12 text-center'>
													No mapped data found
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>

					{/* Footer */}
					<div
						className={cn(
							'sticky bottom-0 z-20 flex flex-col sm:flex-row items-center justify-end space-y-4 sm:space-y-0 sm:space-x-3',
							'border-t p-4 transition-colors',
							resolvedTheme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-50'
						)}>
						{/* <Button
              onClick={handleSave}
              disabled={selectedItems.size === 0 || loading}
              className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto"
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Insert Selected (
                  {selectedItems.size})
                </>
              )}
            </Button> */}
						<Button onClick={handleSave} className='bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto'>
							Option Mapping Approved
						</Button>
						<Button onClick={onClose} variant='outline' className='w-full sm:w-auto'>
							<X className='w-4 h-4 mr-2' /> Close
						</Button>
					</div>
				</motion.div>
			</motion.div>

			{/* MessageBox */}
			<MessageBox message={message} onClose={() => setMessage('')} resolvedTheme={resolvedTheme} />
		</AnimatePresence>
  );
};

export default MappingReviewModal;
