import { useState, useRef, useEffect } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { UseFormReturn } from 'react-hook-form';

import { MachinePartFormFields } from '@primes/schemas/machine';
import {
	MachinePart,
	CreateMachinePartPayload,
	UpdateMachinePartPayload,
} from '@primes/types/machine';
import {
	useCreateMachinePart,
	useUpdateMachinePart,
} from '@primes/hooks/machine/useMachinePart';

interface MachineMachinePartRegisterPageProps {
	onClose?: () => void;
	mode: 'create' | 'edit';
	data?: MachinePart | null;
}
import { MachineSelectComponent } from '@primes/components/customSelect';

interface MachineMachinePartRegisterData {
	partName?: string;
	partStandard?: string;
	partGrade?: string;
	optimum?: string;
	realStock?: string | number;
	machineId?: number;
	storeName?: string;
	storeTel?: string;
	productionTime?: string;
	cost?: number;
	fileName?: string;
	keepPlace?: string;
	etc?: string;
	[key: string]: unknown;
}

export const MachineMachinePartRegisterPage: React.FC<MachineMachinePartRegisterPageProps> = ({
	onClose, mode, data
}) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);

	const formSchema: FormField[] = MachinePartFormFields();
	const createMutation = useCreateMachinePart();
	const updateMutation = useUpdateMachinePart();

	const handleSubmit = async (formData: MachineMachinePartRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			// 데이터 변환 로직 - 제공된 예시에 맞춰 수정
			const processedData: CreateMachinePartPayload = {
				partName: String(formData.partName || ''),
				partStandard: String(formData.partStandard || ''),
				partGrade: formData.partGrade ? String(formData.partGrade) : '',
				optimum: String(formData.optimum || ''),
				realStock: formData.realStock ? Number(formData.realStock) : 0,
				machineId: parseInt(String(formData.machineId), 10) || 0,
				storeName: formData.storeName ? String(formData.storeName) : '',
				storeTel: formData.storeTel ? String(formData.storeTel) : '',
				productionTime: formData.productionTime ? String(formData.productionTime) : '',
				cost: formData.cost ? Number(formData.cost) : 0,
				keepPlace: formData.keepPlace ? String(formData.keepPlace) : '',
				etc: formData.etc ? String(formData.etc) : '',
			};

			if (mode === 'create') {
				await createMutation.mutateAsync([processedData]);
			} else if (mode === 'edit' && data) {
				await updateMutation.mutateAsync({
					id: data.id,
					data: processedData as UpdateMachinePartPayload,
				});
			}

			handleCancel();
		} catch (error) {
			console.error('등록 실패:', error);
			console.error('등록 중 오류가 발생했습니다.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		onClose && onClose();
	};

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);
	};

	useEffect(() => {
		if (formMethods && mode === 'edit' && data) {
			const defaultValues = {
				partName: data.partName || '',
				partStandard: data.partStandard || '',
				partGrade: data.partGrade || '',
				optimum: data.optimum || '',
				realStock: data.realStock || 0,
				machineId: data.machineId ? Number(data.machineId) : 0, // 문자열로 변환
				storeName: data.storeName || '',
				storeTel: data.storeTel || '',
				productionTime: data.productionTime || '',
				cost: data.cost || 0,
				keepPlace: data.keepPlace || '',
				etc: data.etc || '',
			};
			formMethods.reset(defaultValues);
		}
	}, [mode, data, formMethods]);

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm
				fields={formSchema}
				onSubmit={handleSubmit}
				onFormReady={handleFormReady}
				otherTypeElements={{
					machineId: (props: any) => (
						<MachineSelectComponent
							{...props}
							showMachineName={true}
							showMachineType={false}
						/>
					),
				}}

			/>
		</div>
	);
};

export default MachineMachinePartRegisterPage;
