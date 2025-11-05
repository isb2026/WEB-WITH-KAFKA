import { useState } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import {
	useCreateMoldLifeChangeHistory,
	useUpdateMoldLifeChangeHistory,
	useMold,
} from '@primes/hooks';
import {
	MoldLifeChangeHistoryDto,
	MoldLifeChangeHistoryCreateRequest,
} from '@primes/types/mold';
import { useTranslation } from '@repo/i18n';

interface MoldLifeChangeHistoryRegisterPageProps {
	onClose?: () => void;
	selectedLifeChangeHistory?: MoldLifeChangeHistoryDto | null;
	isEditMode?: boolean;
	onSuccess?: () => void; // Add callback to refresh the list
}

interface MoldLifeChangeHistoryRegisterData {
	[key: string]: any;
}

export const MoldLifeChangeHistoryRegisterPage: React.FC<
	MoldLifeChangeHistoryRegisterPageProps
> = ({ onClose, selectedLifeChangeHistory, isEditMode = false, onSuccess }) => {
	const { t } = useTranslation('dataTable');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const createMoldLifeChangeHistory = useCreateMoldLifeChangeHistory(0, 30);
	const updateMoldLifeChangeHistory = useUpdateMoldLifeChangeHistory();

	// Get mold masters for dropdown
	const {
		list: { data: moldMasterData, isLoading: moldMasterLoading, error: moldMasterError },
	} = useMold({ page: 0, size: 100 });

	// Create options for dropdown - handle different API response structures
	const moldMasterOptions = (() => {
		if (!moldMasterData) return [];
		
		let masters = [];
		// Handle different possible data structures
		if (moldMasterData?.content && Array.isArray(moldMasterData.content)) {
			// Spring Boot Pageable response
			masters = moldMasterData.content;
		} else if (moldMasterData?.data && Array.isArray(moldMasterData.data)) {
			// CommonResponseList response
			masters = moldMasterData.data;
		} else if (Array.isArray(moldMasterData)) {
			// Direct array response
			masters = moldMasterData;
		}

		return masters.map((master: any) => ({
			value: master.id.toString(),
			label: `${master.moldCode || master.id} - ${master.moldName || 'Unknown'}`,
		}));
	})();

	console.log('=== MOLD MASTER DROPDOWN DEBUG ===');
	console.log('Raw moldMasterData:', moldMasterData);
	console.log('Is loading:', moldMasterLoading);
	console.log('Error:', moldMasterError);
	console.log('Processed moldMasterOptions:', moldMasterOptions);
	console.log('Options count:', moldMasterOptions.length);
	console.log('=== EDIT MODE DEBUG ===');
	console.log('Is edit mode:', isEditMode);
	console.log('Selected life change history:', selectedLifeChangeHistory);
	console.log('Selected moldMasterId:', selectedLifeChangeHistory?.moldMasterId);
	console.log('Default value for dropdown:', isEditMode && selectedLifeChangeHistory?.moldMasterId
		? selectedLifeChangeHistory.moldMasterId.toString()
		: '');

	const formSchema: FormField[] = [
		{
			name: 'moldMasterId',
			label: t('columns.moldMasterId') || '금형 마스터',
			type: 'select',
			placeholder: t('placeholders.selectMoldMaster') || 'Select mold master',
			options: moldMasterOptions,
			defaultValue: isEditMode && selectedLifeChangeHistory?.moldMasterId
				? selectedLifeChangeHistory.moldMasterId.toString()
				: '',
			required: true,
			disabled: false, // Always allow clicking to see options
		},
		{
			name: 'beforeLife',
			label: t('columns.beforeLife') || '변경 전 수명',
			type: 'number',
			placeholder: t('placeholders.enterBeforeLife') || 'Enter before life',
			defaultValue: isEditMode
				? selectedLifeChangeHistory?.beforeLife
				: '',
			required: true,
		},
		{
			name: 'afterLife',
			label: t('columns.afterLife') || '변경 후 수명',
			type: 'number',
			placeholder: t('placeholders.enterAfterLife') || 'Enter after life',
			defaultValue: isEditMode
				? selectedLifeChangeHistory?.afterLife
				: '',
			required: true,
		},
		{
			name: 'qcCheck',
			label: t('columns.cpReflection') || 'CP 반영 여부',
			type: 'select',
			placeholder: t('placeholders.selectCpReflection') || 'Select CP reflection',
			options: [
				{ value: 'Y', label: 'Y (반영)' },
				{ value: 'N', label: 'N (미반영)' },
			],
			defaultValue: isEditMode ? selectedLifeChangeHistory?.qcCheck : 'Y',
			required: false,
		},
		{
			name: 'qcName',
			label: t('columns.cpPerson') || 'CP 담당자',
			type: 'text',
			placeholder: t('placeholders.enterCpPerson') || 'Enter CP person',
			defaultValue: isEditMode ? selectedLifeChangeHistory?.qcName : '',
			required: false,
		},
		{
			name: 'qcCheckDate',
			label: t('columns.cpReflectionDate') || 'CP 반영일',
			type: 'datetime-local',
			placeholder: t('placeholders.selectCpReflectionDate') || 'Select CP reflection date',
			defaultValue: isEditMode
				? selectedLifeChangeHistory?.qcCheckDate?.split('.')[0] // Remove milliseconds if present
				: '',
			required: false,
		},
	];

	const handleSubmit = async (data: MoldLifeChangeHistoryRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			console.log('=== FORM DATA RECEIVED ===');
			console.log('Raw form data:', data);
			console.log('Form data keys:', Object.keys(data));

			// Transform the data to match the API requirements
			const transformedData: MoldLifeChangeHistoryCreateRequest = {
				// Required fields
				moldMasterId: Number(data.moldMasterId),
				beforeLife: Number(data.beforeLife),
				afterLife: Number(data.afterLife),

				// Optional fields - only include if they have values
				...(data.qcCheck && { qcCheck: data.qcCheck as string }),
				...(data.qcName && { qcName: data.qcName as string }),
				...(data.qcCheckDate && {
					qcCheckDate: data.qcCheckDate as string,
				}),
			};

			console.log('=== TRANSFORMED DATA ===');
			console.log('Transformed data:', transformedData);
			console.log(
				'Transformed data JSON:',
				JSON.stringify(transformedData, null, 2)
			);

			if (isEditMode && selectedLifeChangeHistory) {
				console.log('=== UPDATE MODE ===');
				console.log(
					'Updating life change history with ID:',
					selectedLifeChangeHistory.id
				);
				// Update existing life change history
				await updateMoldLifeChangeHistory.mutateAsync({
					id: selectedLifeChangeHistory.id,
					data: transformedData,
				});
				console.log('수정이 완료되었습니다.');
			} else {
				console.log('=== CREATE MODE ===');
				console.log('Creating new life change history...');
				console.log('Final request payload:', {
					dataList: [transformedData],
				});
				console.log(
					'Final request payload JSON:',
					JSON.stringify({ dataList: [transformedData] }, null, 2)
				);
				// Create new life change history
				await createMoldLifeChangeHistory.mutateAsync({
					dataList: [transformedData],
				});
				console.log('등록이 완료되었습니다.');
			}

			// Close modal and refresh list
			if (onSuccess) {
				onSuccess(); // Manually refresh the list
			}
			if (onClose) {
				onClose();
			}
		} catch (error: any) {
			console.error(isEditMode ? '수정 실패:' : '등록 실패:', error);
			console.error('Error response:', error.response?.data);
			console.error('Error status:', error.response?.status);
			console.error('Full error object:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		onClose && onClose();
	};

	return (
		<div className="max-w-full mx-auto">
			{/* Show helpful message when no mold masters are available */}
			{moldMasterOptions.length === 0 && !moldMasterLoading && !moldMasterError && (
				<div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
					<div className="flex items-center">
						<div className="text-blue-800 text-sm">
							💡 <strong>팁:</strong> 드롭다운을 클릭하여 사용 가능한 금형 마스터를 확인하세요.
						</div>
					</div>
				</div>
			)}
			
			{/* Show error message if API call failed */}
			{moldMasterError && (
				<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
					<div className="flex items-center">
						<div className="text-red-800 text-sm">
							⚠️ <strong>오류:</strong> 금형 마스터 목록을 불러오는 중 오류가 발생했습니다. 
							페이지를 새로고침해주세요.
						</div>
					</div>
				</div>
			)}

			<DynamicForm
				fields={formSchema}
				onSubmit={handleSubmit}
				submitButtonText={isEditMode ? '수정' : '등록'}
			/>
		</div>
	);
};

export default MoldLifeChangeHistoryRegisterPage;
