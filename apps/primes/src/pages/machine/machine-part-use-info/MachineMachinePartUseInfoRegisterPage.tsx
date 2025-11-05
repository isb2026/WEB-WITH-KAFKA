import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { UseFormReturn } from 'react-hook-form';

import { MachinePartUseInfoFormFields } from '@primes/schemas/machine';
import {
	MachinePartUseInfo,
	CreateMachinePartUseInfoPayload,
	UpdateMachinePartUseInfoPayload,
} from '@primes/types/machine';
import {
	useCreateMachinePartUseInfo,
	useUpdateMachinePartUseInfo,
} from '@primes/hooks/machine/useMachinePartUseInfo';

import {
	MachineSelectComponent,
	MachinePartSelectComponent,
	MachineRepairSelectComponent
} from '@primes/components/customSelect';
import { toast } from 'sonner';

interface MachineMachinePartUseInfoRegisterPageProps {
	onClose?: () => void;
	machinePartUseInfoData?: MachinePartUseInfo;
	mode: 'create' | 'update';
	selectedMachinePartUseInfo?: MachinePartUseInfo | any;
}

interface MachineMachinePartUseInfoRegisterData {
	[key: string]: any;
}

export const MachineMachinePartUseInfoRegisterPage: React.FC<MachineMachinePartUseInfoRegisterPageProps> = ({
	onClose,
	mode,
	selectedMachinePartUseInfo,
	machinePartUseInfoData
}) => {
	const { t } = useTranslation('dataTable');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);

	const formSchema: FormField[] = MachinePartUseInfoFormFields();
	const createMutation = useCreateMachinePartUseInfo();
	const updateMutation = useUpdateMachinePartUseInfo();

	const handleSubmit = async (formData: MachineMachinePartUseInfoRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			const processedData: CreateMachinePartUseInfoPayload = {
				machineId: formData.machineId ? Number(formData.machineId) : 0,
				machinePartId: formData.machinePartId ? Number(formData.machinePartId) : undefined,
				machineRepairId: formData.machineRepairId ? Number(formData.machineRepairId) : 0,
				useDate: formData.useDate ? String(formData.useDate) : undefined,
				useStock: formData.useStock ? Number(formData.useStock) : 0,
			};

			if (mode === 'create') {
				await createMutation.mutateAsync([processedData]);
				toast.success('설비 부품 사용 정보가 성공적으로 등록되었습니다.');
			} else if (mode === 'update' && selectedMachinePartUseInfo) {
				await updateMutation.mutateAsync({
					id: selectedMachinePartUseInfo.id,
					data: processedData as UpdateMachinePartUseInfoPayload,
				});
				toast.success('설비 부품 사용 정보가 성공적으로 수정되었습니다.');
			}

			handleCancel();
		} catch (error) {
			console.error('등록 실패:', error);
			toast.error('등록 중 오류가 발생했습니다.');
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
	};

	useEffect(() => {
		if (mode === 'update' && selectedMachinePartUseInfo && formMethodsRef.current) {
			// 기존 데이터를 폼에 설정
			formMethodsRef.current.setValue('machineId', selectedMachinePartUseInfo.machineId || 0);
			formMethodsRef.current.setValue('machinePartId', selectedMachinePartUseInfo.machinePartId || '');
			formMethodsRef.current.setValue('machineRepairId', selectedMachinePartUseInfo.machineRepairId || 0);
			formMethodsRef.current.setValue('useDate', selectedMachinePartUseInfo.useDate || '');
			formMethodsRef.current.setValue('useStock', selectedMachinePartUseInfo.useStock || 0);
		}
	}, [mode, selectedMachinePartUseInfo, formMethodsRef.current]);

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm
				fields={formSchema}
				onSubmit={handleSubmit}
				onFormReady={handleFormReady}
				otherTypeElements={{
					machineName: (props: any) => (
						<MachineSelectComponent
							{...props}
							showMachineName={true}
							showMachineType={false}
							onChange={(value: any) => {
								props.onChange(value);
							}}
							onMachineIdChange={(machineId: number) => {
								formMethodsRef.current?.setValue('machineId', machineId);
							}}
						/>
					),
					partName: (props: any) => (
						<MachinePartSelectComponent 
							{...props} 
							onChange={(value: any) => {
								props.onChange(value);
							}}
							onMachinePartIdChange={(machinePartId: number) => {
								formMethodsRef.current?.setValue('machinePartId', machinePartId);
							}}
						/>
					),
					repairSubject: (props: any) => (
						<MachineRepairSelectComponent 
							{...props} 
							onChange={(value: any) => {
								props.onChange(value);
							}}
							onMachineRepairIdChange={(machineRepairId: number) => {
								formMethodsRef.current?.setValue('machineRepairId', machineRepairId);
							}}
						/>
					),
				}}
			/>
		</div>
	);
};

export default MachineMachinePartUseInfoRegisterPage;
