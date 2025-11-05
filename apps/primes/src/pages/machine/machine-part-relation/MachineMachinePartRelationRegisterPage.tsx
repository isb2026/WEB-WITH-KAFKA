import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { UseFormReturn } from 'react-hook-form';

import { MachinePartRelationFormFields } from '@primes/schemas/machine';
import {
	MachinePartRelation,
	CreateMachinePartRelationPayload,
	UpdateMachinePartRelationPayload,
} from '@primes/types/machine';
import {
	useCreateMachinePartRelation,
	useUpdateMachinePartRelation,
} from '@primes/hooks/machine/useMachinePartRelation';

import { MachineSelectComponent, MachinePartSelectComponent } from '@primes/components/customSelect';
import { BinaryToggleComponent } from '@primes/components/customSelect';
import { toast } from 'sonner';

interface MachineMachinePartRelationRegisterPageProps {
	onClose?: () => void;
	machinePartRelationData?: MachinePartRelation;
	mode: 'create' | 'update';
	selectedMachinePartRelation?: MachinePartRelation | any;
}

interface MachineMachinePartRelationRegisterData {
	[key: string]: any;
}

export const MachineMachinePartRelationRegisterPage: React.FC<
	MachineMachinePartRelationRegisterPageProps
> = ({
	onClose,
	mode,
	selectedMachinePartRelation,
	machinePartRelationData
}) => {
	const { t } = useTranslation('dataTable');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);

	const formSchema: FormField[] = MachinePartRelationFormFields();
	const createMutation = useCreateMachinePartRelation();
	const updateMutation = useUpdateMachinePartRelation();

	const handleSubmit = async (formData: MachineMachinePartRelationRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			const processedData: CreateMachinePartRelationPayload = mode === 'create' ? {
				machineId: formData.machineId ? Number(formData.machineId) : 0,
				machinePartId: formData.machinePartId ? Number(formData.machinePartId) : 0,
			} : {
				machineId: formData.machineId ? Number(formData.machineId) : 0,
				machinePartId: formData.machinePartId ? Number(formData.machinePartId) : 0,
				isUse: formData.isUse !== undefined ? formData.isUse : true,
			};

			if (mode === 'create') {
	
				await createMutation.mutateAsync([processedData]);
				toast.success('설비 예비부품 연동 관계가 성공적으로 등록되었습니다.');
			} else if (mode === 'update' && selectedMachinePartRelation) {
				await updateMutation.mutateAsync({
					id: selectedMachinePartRelation.id,
					data: processedData as UpdateMachinePartRelationPayload,
				});
				toast.success('설비 예비부품 연동 관계가 성공적으로 수정되었습니다.');
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
		if (mode === 'update' && selectedMachinePartRelation && formMethodsRef.current) {
			formMethodsRef.current.setValue('machineId', selectedMachinePartRelation.machineId || 0);
			formMethodsRef.current.setValue('machinePartId', selectedMachinePartRelation.machinePartId || 0);
			formMethodsRef.current.setValue('isUse', selectedMachinePartRelation.isUse !== undefined ? selectedMachinePartRelation.isUse : true);
		} else if (mode === 'create' && formMethodsRef.current) {
			formMethodsRef.current.setValue('isUse', true);
		}
	}, [mode, selectedMachinePartRelation, formMethodsRef.current]);

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
					isUse: (props: any) => (
						<BinaryToggleComponent
							value={props.value === true ? 'true' : 'false'}
							onChange={(value) => {
								props.onChange(value === 'true');
							}}
							falseLabel="미사용"
							trueLabel="사용"
						/>
					),
				}}
			/>
		</div>
	);
};

export default MachineMachinePartRelationRegisterPage;
