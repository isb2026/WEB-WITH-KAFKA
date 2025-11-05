import { useState } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { useUpdateMoldInstance, useMold } from '@primes/hooks';
import { useCreateSingleMoldInstance } from '@primes/hooks/mold/mold-instance/useCreateSingleMoldInstance';
import { MoldInstanceDto, MoldInstanceCreateRequest } from '@primes/types/mold';

interface MoldInstanceRegisterPageProps {
	onClose?: () => void;
	selectedInstance?: MoldInstanceDto | null;
	isEditMode?: boolean;
}

interface MoldInstanceRegisterData {
	[key: string]: any;
}

export const MoldInstanceRegisterPage: React.FC<
	MoldInstanceRegisterPageProps
> = ({ onClose, selectedInstance, isEditMode = false }) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const createMoldInstance = useCreateSingleMoldInstance(0, 30);
	const updateMoldInstance = useUpdateMoldInstance();

	// Fetch MoldMaster data for dropdown
	const {
		list: { data: moldMasterData },
	} = useMold({ page: 0, size: 100 });

	const formSchema: FormField[] = [
		{
			name: 'moldInstanceCode',
			label: '금형코드',
			type: 'text',
			placeholder: 'CODE001',
			defaultValue: isEditMode
				? selectedInstance?.moldInstanceCode
				: 'CODE001',
			required: true,
		},
		{
			name: 'moldMasterId',
			label: '금형번호',
			type: 'select',
			placeholder: '금형 마스터를 선택하세요',
			options: (() => {
				// Handle different possible data structures
				let masters = [];
				const data = moldMasterData as any;
				if (data?.content && Array.isArray(data.content)) {
					masters = data.content;
				} else if (data?.data && Array.isArray(data.data)) {
					masters = data.data;
				} else if (Array.isArray(data)) {
					masters = data;
				}

				return masters.map((master: any) => ({
					label: `${master.moldCode || master.id} - ${master.moldName || 'No Name'}`,
					value: master.id.toString(),
				}));
			})(),
			defaultValue: isEditMode
				? selectedInstance?.moldMasterId?.toString()
				: undefined,
			required: true,
		},
		{
			name: 'inDate',
			label: '입고일자',
			type: 'date',
			placeholder: '2024-01-01',
			defaultValue: isEditMode
				? selectedInstance?.inDate?.split('T')[0]
				: '2024-01-01',
			required: false,
		},
		{
			name: 'series',
			label: 'Series',
			type: 'number',
			placeholder: '1',
			defaultValue: isEditMode ? selectedInstance?.series : 1,
			required: false,
		},
		{
			name: 'moldCode',
			label: 'Mold code',
			type: 'text',
			placeholder: 'CODE001',
			defaultValue: isEditMode ? selectedInstance?.moldCode : 'CODE001',
			required: false,
		},
		{
			name: 'moldInstanceName',
			label: '입고금형품명',
			type: 'text',
			placeholder: '샘플명',
			defaultValue: isEditMode
				? selectedInstance?.moldInstanceName
				: '샘플명',
			required: false,
		},
		{
			name: 'moldInstanceNumber',
			label: '입고금형품번',
			type: 'text',
			placeholder: '12345',
			defaultValue: isEditMode
				? selectedInstance?.moldInstanceNumber
				: '12345',
			required: false,
		},
		{
			name: 'moldInstanceStandard',
			label: '입고금형규격',
			type: 'text',
			placeholder: '샘플값',
			defaultValue: isEditMode
				? selectedInstance?.moldInstanceStandard
				: '샘플값',
			required: false,
		},
		{
			name: 'moldVendorId',
			label: '금형제조업체코드',
			type: 'number',
			placeholder: '1',
			defaultValue: 1,
			required: false,
		},
		{
			name: 'keepPlace',
			label: '보관장소',
			type: 'text',
			placeholder: '샘플값',
			defaultValue: '샘플값',
			required: false,
		},
		{
			name: 'cost',
			label: '비용',
			type: 'number',
			placeholder: '1',
			defaultValue: 1,
			required: false,
		},

		{
			name: 'firstPunchNum',
			label: '최초타수',
			type: 'number',
			placeholder: '1',
			defaultValue: 1,
			required: false,
		},
		{
			name: 'grade',
			label: '금형등급',
			type: 'text',
			placeholder: 'A',
			defaultValue: isEditMode ? selectedInstance?.grade : 'A',
			required: true,
		},
		{
			name: 'isAutoGrade',
			label: '등급 자동 설정여부',
			type: 'checkbox',
			placeholder: '등급 자동 설정여부를 선택하세요',
			defaultValue: true,
			required: false,
		},
		{
			name: 'currentStock',
			label: '현재재고수량',
			type: 'number',
			placeholder: '1',
			defaultValue: 1,
			required: false,
		},
		{
			name: 'isManage',
			label: '타수관리여부',
			type: 'checkbox',
			placeholder: '타수관리여부를 선택하세요',
			defaultValue: true,
			required: false,
		},
		{
			name: 'isPublic',
			label: '공용사용여부',
			type: 'checkbox',
			placeholder: '공용사용여부를 선택하세요',
			defaultValue: true,
			required: false,
		},
		{
			name: 'ownComp',
			label: '금형 소유업체코드',
			type: 'number',
			placeholder: '1',
			defaultValue: 1,
			required: false,
		},
		{
			name: 'moldInId',
			label: '입고번호',
			type: 'number',
			placeholder: '1',
			defaultValue: 1,
			required: false,
		},
		{
			name: 'excAggre',
			label: '금형 데이터 집계 제외',
			type: 'text',
			placeholder: 'Y',
			defaultValue: 'Y',
			required: false,
		},
		{
			name: 'capacityNum',
			label: 'Capacity num',
			type: 'number',
			placeholder: '1',
			defaultValue: 1,
			required: false,
		},
		{
			name: 'isSubMold',
			label: '예비금형여부',
			type: 'checkbox',
			placeholder: '예비금형여부를 선택하세요',
			defaultValue: true,
			required: false,
		},
		{
			name: 'status',
			label: 'Status',
			type: 'select',
			options: [
				{ value: '001', label: 'Active' },
				{ value: '002', label: 'Normal' },
				{ value: '003', label: 'Inactive' },
			],
			defaultValue: isEditMode ? selectedInstance?.status : '002',
			required: false,
		},
	];

	const handleSubmit = async (data: MoldInstanceRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			console.log('=== FORM DATA RECEIVED ===');
			console.log('Raw form data:', data);
			console.log('Form data keys:', Object.keys(data));

			// Transform the data to match the API requirements
			const transformedData: MoldInstanceCreateRequest = {
				// Required fields
				moldInstanceCode: data.moldInstanceCode as string,
				progTypeCode: data.progTypeCode as string,
				grade: data.grade as string,
				itemId: data.itemId ? Number(data.itemId) : 1,

				// Optional foreign key fields - only include if provided
				moldMasterId: Number(data.moldMasterId),
				inDate: (data.inDate as string) || '2024-01-01',
				series: data.series ? Number(data.series) : 1,
				moldCode: (data.moldCode as string) || 'CODE001',
				moldInstanceName: (data.moldInstanceName as string) || '샘플명',
				moldInstanceNumber:
					(data.moldInstanceNumber as string) || '12345',
				moldInstanceStandard:
					(data.moldInstanceStandard as string) || '샘플값',
				moldLife: data.moldLife ? Number(data.moldLife) : 1,
				...(data.moldVendorId && {
					moldVendorId: Number(data.moldVendorId),
				}),
				keepPlace: (data.keepPlace as string) || '샘플값',
				cost: data.cost ? Number(data.cost) : 1,
				firstPunchNum: data.firstPunchNum
					? Number(data.firstPunchNum)
					: 1,
				isAutoGrade: (data.isAutoGrade as boolean) || true,
				currentStock: data.currentStock ? Number(data.currentStock) : 1,
				isManage: (data.isManage as boolean) || true,
				isPublic: (data.isPublic as boolean) || true,
				...(data.ownComp && { ownComp: Number(data.ownComp) }),
				...(data.moldInId && { moldInId: Number(data.moldInId) }),
				excAggre: (data.excAggre as string) || 'Y',
				capacityNum: data.capacityNum ? Number(data.capacityNum) : 1,
				isSubMold: (data.isSubMold as boolean) || true,
				status: (data.status as string) || '002',
			};

			console.log('=== TRANSFORMED DATA ===');
			console.log('Transformed data:', transformedData);
			console.log(
				'Transformed data JSON:',
				JSON.stringify(transformedData, null, 2)
			);

			if (isEditMode && selectedInstance) {
				// Update existing instance
				console.log('=== UPDATE MODE ===');
				console.log('Updating instance ID:', selectedInstance.id);
				await updateMoldInstance.mutateAsync({
					id: selectedInstance.id,
					data: transformedData,
				});
				console.log('수정이 완료되었습니다.');
			} else {
				// Create new instance
				console.log('=== CREATE MODE ===');
				console.log('Final request data:', transformedData);
				console.log(
					'Final request data JSON:',
					JSON.stringify(transformedData, null, 2)
				);

				await createMoldInstance.mutateAsync(transformedData);
				console.log('등록이 완료되었습니다.');
			}
			onClose && onClose();
		} catch (error: any) {
			console.error(isEditMode ? '수정 실패:' : '등록 실패:', error);
			console.error('Error response:', error.response?.data);
			console.error('Error status:', error.response?.status);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		onClose && onClose();
	};

	return (
		<div className="w-full mx-auto">
			{/* Scrollable form container with compact styling */}
			<div className="max-h-[80vh] overflow-y-auto pr-2 pb-4">
				<DynamicForm
					fields={formSchema}
					onSubmit={handleSubmit}
					submitButtonText={isEditMode ? '수정' : '등록'}
				/>
			</div>
		</div>
	);
};

export default MoldInstanceRegisterPage;
