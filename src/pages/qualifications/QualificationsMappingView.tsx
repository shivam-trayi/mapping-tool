import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Map, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Qualification, QualificationsMappingData, ViewType } from '../../types/qualicationTypes';
import { saveQualMapping, getAllQualMapping } from '@/redux/slices/testing/saveQualMappingSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';
import QualificationMappingReviewModal from './QualificationMappingReviewModal';

interface QualificationsMappingViewProps {
	setCurrentView: (view: ViewType) => void;
	qualifications: Qualification[];
	isLoadingTable: boolean;
	resolvedTheme: 'light' | 'dark';
}

interface QualificationMappingDataItem {
	id: string;
	qualificationName: string;
	mapped: boolean;
	oldMapped: boolean;
	constantId: string;
}

export const QualificationsMappingView: React.FC<QualificationsMappingViewProps> = ({ setCurrentView, qualifications, isLoadingTable, resolvedTheme }) => {
	const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set());
	const [selectAll, setSelectAll] = React.useState(false);
	const [selectedCustomer, setSelectedCustomer] = React.useState('');
	const [constantIds, setConstantIds] = React.useState<Record<string, string>>({});
	const [isSaving, setIsSaving] = React.useState(false);
	const [showMappingReviewModal, setShowMappingReviewModal] = React.useState(false);
	const [fetchedMappings, setFetchedMappings] = React.useState<Record<string, QualificationMappingDataItem>>({});
	const [reviewMappings, setReviewMappings] = React.useState<QualificationMappingDataItem[]>([]);
	


	const dispatch = useDispatch<AppDispatch>();
	const { items: clients, loading: clientLoading, error: clientError } = useSelector((state: RootState) => state.clients);

  const qualificationMappingData: QualificationMappingDataItem[] = qualifications.map((q) => ({
    id: q.id,
    qualificationName: q.name,
    mapped: !!fetchedMappings[q.id], // mark mapped if API returned mapping
    oldMapped: false, // adjust if you want to track old mappings
    constantId: fetchedMappings[q.id]?.constantId || '',
  }));


	const handleSelectAll = (checked: boolean) => {
		setSelectAll(checked);
		setSelectedItems(checked ? new Set(qualificationMappingData.map((item) => item.id)) : new Set());
	};

	const handleSelectItem = (id: string, checked: boolean) => {
		const newSelected = new Set(selectedItems);
		if (checked) newSelected.add(id);
		else newSelected.delete(id);
		setSelectedItems(newSelected);
		setSelectAll(newSelected.size === qualificationMappingData.length);
	};

	const handleConstantIdChange = (id: string, value: string) => {
		setConstantIds((prev) => ({ ...prev, [id]: value }));
	};

const handleSaveForReview = async () => {
    if (!selectedCustomer) {
        alert('Please select a Customer/Supplier first.');
        return;
    }

    const selectedData: QualificationsMappingData[] = Array.from(selectedItems).map((id) => {
        const item = qualificationMappingData.find((d) => d.id === id)!;
        return {
            qualification_id: item.id,
            member_id: selectedCustomer,
            member_type: 'customer',
            member_qualification_id: undefined,
            created_by: undefined,
            updated_by: undefined,
            old_member_qualification_id: undefined,
            constantId: constantIds[id] || fetchedMappings[item.id]?.constantId || item.constantId || '',
        };
    });

    setIsSaving(true);
    try {
        await dispatch(saveQualMapping(selectedData)).unwrap();

        // Update modal data for review without refetching
        const reviewData = selectedData.map((d) => ({
            id: d.qualification_id,
            qualificationName: qualificationMappingData.find(q => q.id === d.qualification_id)?.qualificationName || '',
            mapped: true,
            oldMapped: false,
            constantId: d.constantId,
        }));
        setReviewMappings(reviewData);

        alert(`Saved ${selectedData.length} qualifications for review`);
    } catch (err) {
        console.error('Error saving qualification mapping:', err);
        alert('Failed to save mapping. Please try again.');
    } finally {
        setIsSaving(false);
    }
};

React.useEffect(() => {
    const fetchMappings = async () => {
        if (!selectedCustomer) {
            setFetchedMappings({});
            return;
        }
        try {
            const response = await dispatch(getAllQualMapping({ memberId: selectedCustomer })).unwrap();

            const result = response.data?.data || []; // <- extract actual array from API
            const mappingRecord: Record<string, QualificationMappingDataItem> = {};

            result.forEach((item: any) => {
                mappingRecord[item.qualification_id] = {
                    id: item.qualification_id,
                    qualificationName: item.qualificationName,
                    mapped: true,
                    oldMapped: false,
                    constantId: item.member_qualification_id?.toString() || '', // <- show API value here
                };
            });

            setFetchedMappings(mappingRecord);
        } catch (err) {
            console.error('Error fetching qualification mappings:', err);
            setFetchedMappings({});
        }
    };

    fetchMappings();
}, [selectedCustomer, dispatch]);


	return (
		<>
			<motion.div key='qualifications-mapping-view' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className='p-6'>
				{/* Header */}
				<div className='flex items-center justify-between mb-6'>
					<h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>Qualifications Mapping</h2>
					<div className='flex space-x-3'>
						<Button onClick={() => setCurrentView('questionMapping')} variant='default'>
							<FileText className='w-4 h-4 mr-2' /> Question Mapping
						</Button>
						<Button onClick={() => setShowMappingReviewModal(true)} variant='default'>
							<Map className='w-4 h-4 mr-2' /> Mapping Review
						</Button>
						<Button onClick={() => setCurrentView('list')} variant='outline'>
							<ArrowLeft className='w-4 h-4 mr-2' /> Back
						</Button>
					</div>
				</div>

				{/* Customer filter */}
				<div className={cn('flex items-center space-x-4 mb-6 transition-colors', resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-900')}>
					<select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} className='px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600'>
						<option value=''>Select Customer/Supplier</option>
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

				{/* Results Summary */}
				<div className={cn('flex items-center justify-between mb-4 text-sm transition-colors', resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
					<span>
						Showing {qualificationMappingData.length} qualifications
						{selectedItems.size > 0 && ` (${selectedItems.size} selected)`}
					</span>
				</div>

				{/* Table */}
				<div className={cn('rounded-lg shadow overflow-hidden transition-colors', resolvedTheme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200')}>
					<div className='max-h-[60vh] overflow-y-auto'>
						<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
							<thead className={cn(resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50')}>
								<tr>
									<th className='px-6 py-3 text-left'>
										<div className='flex items-center space-x-2'>
											<Checkbox checked={selectAll} onCheckedChange={handleSelectAll} className='border-gray-300' />
											<span className='text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200'>Select All</span>
										</div>
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200'>S.No</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200'>Qualifications</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200'>Mapped</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200'>Old Mapped</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200'>Enter Constant Id</th>
								</tr>
							</thead>
							<tbody className={cn(resolvedTheme === 'dark' ? 'bg-gray-800 text-gray-100 divide-gray-700' : 'bg-white text-gray-900 divide-gray-200')}>
								{isLoadingTable ? (
									<tr>
										<td colSpan={6} className='p-6 text-center text-gray-500'>
											<div className='flex items-center justify-center space-x-2'>
												<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-primary'></div>
												<span>Loading...</span>
											</div>
										</td>
									</tr>
								) : qualificationMappingData.length > 0 ? (
									qualificationMappingData.map((item, idx) => (
										<tr key={item.id} className={cn(resolvedTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50', selectedItems.has(item.id) && 'bg-blue-50 dark:bg-blue-900/20')}>
											<td className='px-6 py-4 whitespace-nowrap'>
												<Checkbox checked={selectedItems.has(item.id)} onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)} className='border-gray-300' />
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm'>{idx + 1}</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>{item.qualificationName}</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm'>
												<span
													className={cn(
														'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
														item.mapped ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
													)}>
													{item.mapped ? 'Mapped' : 'Not Mapped'}
												</span>
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm'>
												<span
													className={cn(
														'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
														item.oldMapped ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
													)}>
													{item.oldMapped ? 'Old Mapped' : 'Not Mapped'}
												</span>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<Input
    type='text'
    value={
        constantIds[item.id] || // user typed value
        fetchedMappings[item.id]?.constantId || // API value if exists
        item.constantId // fallback default
    }
    onChange={(e) => handleConstantIdChange(item.id, e.target.value)}
    className='w-full'
    placeholder='Enter constant ID'
/>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={6} className='p-12 text-center'>
											<div className='flex flex-col items-center space-y-3'>
												<div className='w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center'>
													<Search className='w-8 h-8 text-gray-400' />
												</div>
												<h3 className='text-lg font-medium text-gray-900 dark:text-gray-100'>No data found</h3>
												<p className='text-gray-500 dark:text-gray-400'>No qualification mapping data available.</p>
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					{/* Footer */}
					<div className={cn('p-4 border-t flex items-center justify-between transition-colors sticky bottom-0 z-20', resolvedTheme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50')}>
						<div className='text-sm text-gray-600 dark:text-gray-400'>{selectedItems.size > 0 ? <span>{selectedItems.size} qualification(s) selected</span> : <span>No qualifications selected</span>}</div>
						<Button onClick={handleSaveForReview} disabled={selectedItems.size === 0 || isSaving} className='gradient-primary text-white hover:shadow-glow transition-all duration-300'>
							{isSaving ? (
								'Saving...'
							) : (
								<>
									{' '}
									<Save className='w-4 h-4 mr-2' /> Save for Review ({selectedItems.size}){' '}
								</>
							)}
						</Button>
					</div>
				</div>
			</motion.div>

			{/* Qualification Mapping Review Modal */}
		{/* // In your QualificationsMappingView.tsx (only relevant changes) */}
<QualificationMappingReviewModal
    isOpen={showMappingReviewModal}
    onClose={() => setShowMappingReviewModal(false)}
    mappings={Object.values(fetchedMappings).map(item => ({
        id: item.id,
        qualificationName: item.qualificationName,
        constantId: item.constantId,
		memberId: selectedCustomer,
        // remove status completely
    }))}
    qualifications={qualifications || []}
    resolvedTheme={resolvedTheme}
/>


		</>
	);
};
