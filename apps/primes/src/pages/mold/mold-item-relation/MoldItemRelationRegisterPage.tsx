import { useState } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import {
	useCreateMoldItemRelation,
	useUpdateMoldItemRelation,
	useMold,
} from '@primes/hooks';
import {
	MoldItemRelationDto,
	MoldItemRelationCreateRequest,
} from '@primes/types/mold';

interface MoldItemRelationRegisterPageProps {
	onClose?: () => void;
	selectedItemRelation?: MoldItemRelationDto | null;
	isEditMode?: boolean;
	onSuccess?: () => void; // Add callback to refresh the list
}

interface MoldItemRelationRegisterData {
	[key: string]: any;
}

export const MoldItemRelationRegisterPage: React.FC<
	MoldItemRelationRegisterPageProps
> = ({ onClose, selectedItemRelation, isEditMode = false, onSuccess }) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const createMoldItemRelation = useCreateMoldItemRelation(0, 30);
	const updateMoldItemRelation = useUpdateMoldItemRelation();

	// Get mold masters for dropdown
	const {
		list: { data: moldMasterData },
	} = useMold({ page: 0, size: 100 });

	// Create options for dropdown
	const moldMasterOptions =
		moldMasterData?.data?.map((master: any) => ({
			value: master.id.toString(),
			label: `${master.moldCode} - ${master.moldName || 'Unknown'}`,
		})) || [];



	const formSchema: FormField[] = [
		{
			name: 'moldMasterId',
			label: '금형 마스터',
			type: 'select',
			placeholder: '금형 마스터를 선택하세요',
			options: moldMasterOptions,
			defaultValue: isEditMode
				? selectedItemRelation?.moldMasterId?.toString()
				: moldMasterOptions[0]?.value || '',
			required: true,
		},
		{
			name: 'itemId',
			label: '제품 ID',
			type: 'number',
			placeholder: '1',
			defaultValue: isEditMode ? selectedItemRelation?.itemId : 1,
			required: true,
		},
		{
			name: 'itemNo',
			label: '제품 번호',
			type: 'number',
			placeholder: '1',
			defaultValue: isEditMode ? selectedItemRelation?.itemNo : 1,
			required: true,
		},
		{
			name: 'itemName',
			label: '품명',
			type: 'text',
			placeholder: '샘플명',
			defaultValue: isEditMode ? selectedItemRelation?.itemName : '',
			required: false,
		},
		{
			name: 'itemNumber',
			label: '품번',
			type: 'text',
			placeholder: '12345',
			defaultValue: isEditMode ? selectedItemRelation?.itemNumber : '',
			required: false,
		},
		{
			name: 'itemStandard',
			label: '규격',
			type: 'text',
			placeholder: '샘플값',
			defaultValue: isEditMode ? selectedItemRelation?.itemStandard : '',
			required: false,
		},
		{
			name: 'itemProgressId',
			label: '공정 ID',
			type: 'number',
			placeholder: '1',
			defaultValue: isEditMode ? selectedItemRelation?.itemProgressId : 1,
			required: true,
		},
		{
			name: 'progressName',
			label: '공정 이름',
			type: 'text',
			placeholder: '샘플명',
			defaultValue: isEditMode ? selectedItemRelation?.progressName : '',
			required: true,
		},
	];

	const handleSubmit = async (data: MoldItemRelationRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			// Transform the data to match the API requirements
			const transformedData: MoldItemRelationCreateRequest = {
				// Required fields
				moldMasterId: Number(data.moldMasterId),
				itemId: Number(data.itemId),
				itemNo: Number(data.itemNo),
				itemProgressId: Number(data.itemProgressId),
				progressName: data.progressName as string,

				// Optional fields - only include if they have values
				...(data.itemName && { itemName: data.itemName as string }),
				...(data.itemNumber && {
					itemNumber: data.itemNumber as string,
				}),
				...(data.itemStandard && {
					itemStandard: data.itemStandard as string,
				}),
			};

			if (isEditMode && selectedItemRelation) {
				// Update existing item relation
				await updateMoldItemRelation.mutateAsync({
					id: selectedItemRelation.id,
					data: transformedData,
				});
			} else {
				// Create new item relation
				await createMoldItemRelation.mutateAsync([transformedData]);
			}

			// Close modal and refresh list
			if (onSuccess) {
				onSuccess(); // Manually refresh the list
			}
			if (onClose) {
				onClose();
			}
		} catch (error: any) {
			// Error handling is done by the mutation hooks
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		onClose && onClose();
	};

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm
				fields={formSchema}
				onSubmit={handleSubmit}
				submitButtonText={isEditMode ? '수정' : '등록'}
			/>
		</div>
	);
};

export default MoldItemRelationRegisterPage;
