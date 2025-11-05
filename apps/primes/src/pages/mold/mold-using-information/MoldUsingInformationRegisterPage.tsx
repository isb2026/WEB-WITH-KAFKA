import { useState } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { useUpdateMoldUsingInformation } from '@primes/hooks';
import { useCreateSingleMoldUsingInformation } from '@primes/hooks/mold/mold-using-information/useCreateSingleMoldUsingInformation';
import {
	MoldUsingInformationDto,
	MoldUsingInformationCreateRequest,
} from '@primes/types/mold';
import { useMoldInstance, useMold } from '@primes/hooks';

interface MoldUsingInformationRegisterPageProps {
	onClose?: () => void;
	selectedUsingInformation?: MoldUsingInformationDto | null;
	isEditMode?: boolean;
}

interface MoldUsingInformationRegisterData {
	[key: string]: any;
}

export const MoldUsingInformationRegisterPage: React.FC<
	MoldUsingInformationRegisterPageProps
> = ({ onClose, selectedUsingInformation, isEditMode = false }) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const createMoldUsingInformation = useCreateSingleMoldUsingInformation(
		0,
		30
	);
	const updateMoldUsingInformation = useUpdateMoldUsingInformation();

	// Get existing mold instances to use as options
	const {
		list: { data: moldInstanceData },
	} = useMoldInstance({ page: 0, size: 100 });

	// Get mold masters for dropdown
	const {
		list: { data: moldMasterData },
	} = useMold({ page: 0, size: 100 });

	// Create options for dropdowns
	const moldInstanceOptions =
		moldInstanceData?.data?.content?.map((instance: any) => ({
			value: instance.id.toString(),
			label: `${instance.moldInstanceCode} - ${instance.moldInstanceName || 'Unknown'}`,
		})) ||
		(moldInstanceData as any)?.content?.map((instance: any) => ({
			value: instance.id.toString(),
			label: `${instance.moldInstanceCode} - ${instance.moldInstanceName || 'Unknown'}`,
		})) ||
		[];

	const moldMasterOptions =
		moldMasterData?.data?.map((master: any) => ({
			value: master.id.toString(),
			label: `${master.moldCode} - ${master.moldName || 'Unknown'}`,
		})) || [];

	const formSchema: FormField[] = [
		{
			name: 'moldInstanceId',
			label: '실금형',
			type: 'select',
			placeholder: '실금형을 선택하세요',
			options: moldInstanceOptions,
			defaultValue: isEditMode
				? selectedUsingInformation?.moldInstanceId
				: moldInstanceOptions[0]?.value || '',
			required: true,
		},
		{
			name: 'commandId',
			label: '명령 ID',
			type: 'number',
			placeholder: '명령 ID를 입력하세요',
			defaultValue: isEditMode ? selectedUsingInformation?.commandId : '',
			required: true,
		},
		{
			name: 'commandNo',
			label: '명령 번호',
			type: 'text',
			placeholder: '12345',
			defaultValue: isEditMode ? selectedUsingInformation?.commandNo : '',
			required: true,
		},
		{
			name: 'moldInstanceCode',
			label: '실금형 코드',
			type: 'text',
			placeholder: 'CODE001',
			defaultValue: isEditMode
				? selectedUsingInformation?.moldInstanceCode
				: '',
			required: true,
		},
		{
			name: 'moldMasterId',
			label: '금형 마스터',
			type: 'select',
			placeholder: '금형 마스터를 선택하세요',
			options: moldMasterOptions,
			defaultValue: isEditMode
				? selectedUsingInformation?.moldMasterId
				: moldMasterOptions[0]?.value || '',
			required: true,
		},
		{
			name: 'jobId',
			label: '작업 ID',
			type: 'number',
			placeholder: '작업 ID를 입력하세요',
			defaultValue: isEditMode ? selectedUsingInformation?.jobId : '',
			required: true,
		},
		{
			name: 'num',
			label: '타수',
			type: 'number',
			placeholder: '타수를 입력하세요',
			defaultValue: isEditMode ? selectedUsingInformation?.num : '',
			required: true,
		},
		{
			name: 'workerName',
			label: '작업자명',
			type: 'text',
			placeholder: '작업자',
			defaultValue: isEditMode
				? selectedUsingInformation?.workerName
				: '',
			required: true,
		},
		{
			name: 'machineName',
			label: '작업설비',
			type: 'text',
			placeholder: '설비명',
			defaultValue: isEditMode
				? selectedUsingInformation?.machineName
				: '',
			required: true,
		},
		{
			name: 'workDate',
			label: '작업일자',
			type: 'date',
			placeholder: '2024-01-01',
			defaultValue: isEditMode
				? selectedUsingInformation?.workDate?.split('T')[0]
				: '',
			required: true,
		},
		{
			name: 'workCode',
			label: '작업코드',
			type: 'text',
			placeholder: 'CODE001',
			defaultValue: isEditMode ? selectedUsingInformation?.workCode : '',
			required: true,
		},
	];

	const handleSubmit = async (data: MoldUsingInformationRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			// Transform the data to match the API requirements
			const transformedData: MoldUsingInformationCreateRequest = {
				// All required fields as per backend expectation
				moldInstanceId: Number(data.moldInstanceId),
				commandId: Number(data.commandId),
				commandNo: data.commandNo as string,
				moldInstanceCode: data.moldInstanceCode as string,
				moldMasterId: Number(data.moldMasterId),
				jobId: Number(data.jobId),
				num: Number(data.num),
				workerName: data.workerName as string,
				machineName: data.machineName as string,
				workDate: data.workDate as string,
				workCode: data.workCode as string,
			};

			if (isEditMode && selectedUsingInformation) {
				// Update existing using information
				await updateMoldUsingInformation.mutateAsync({
					id: selectedUsingInformation.id,
					data: transformedData,
				});
			} else {
				// Create new using information
				await createMoldUsingInformation.mutateAsync(transformedData);
			}
			onClose && onClose();
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
			<DynamicForm
				fields={formSchema}
				onSubmit={handleSubmit}
				submitButtonText={isEditMode ? '수정' : '등록'}
			/>
		</div>
	);
};

export default MoldUsingInformationRegisterPage;
