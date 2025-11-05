import { useState, useRef, useEffect, useCallback } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { UseFormReturn } from 'react-hook-form';
import { MachineRegisterFormSchema } from '@primes/schemas/machine';
import {
	Machine,
	CreateMachinePayload,
	UpdateMachinePayload,
} from '@primes/types/machine';
import {
	useCreateMachine,
	useUpdateMachine,
} from '@primes/hooks/machine/useMachine';
import { BinaryToggleComponent, CodeSelectComponent } from '@primes/components/customSelect';

interface MachineMachineRegisterPageProps {
	onClose?: () => void;
	machineData?: Machine;
	mode: 'create' | 'update';
	selectedMachine?: Machine | any;
}

interface MachineMachineRegisterData {
	[key: string]: any;
}

export const MachineMachineRegisterPage: React.FC<MachineMachineRegisterPageProps> = ({
	onClose, 
	mode, 
	selectedMachine, 
	machineData 
}) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const initializedRef = useRef<boolean>(false); // 초기화 여부를 추적

	const formSchema: FormField[] = MachineRegisterFormSchema();
	const createMutation = useCreateMachine();
	const updateMutation = useUpdateMachine();

	const handleSubmit = async (formData: MachineMachineRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			const processedData: CreateMachinePayload = {
				machineCode: formData.machineCode || '',
				machineName: formData.machineName || '',
				machineType: formData.machineTypeCode || '',
				usingGroup: formData.usingGroupCode || '',
				rph: Number(formData.rph) || 0,
				isNotwork: formData.isNotwork !== undefined ? formData.isNotwork : true,
				isUse: formData.isUse !== undefined ? formData.isUse : true,
				machineGrade: formData.machineGrade || '',
				machineSpec: formData.machineSpec || '',
				modelName: formData.modelName || '',
				madeYear: Number(formData.madeYear) || 0,
				madeBy: formData.madeBy || '',
				buyDate: formData.buyDate || '',
				buyPrice: Number(formData.buyPrice) || 0,
				motorNumber: Number(formData.motorNumber) || 0,
				mainWorker: formData.mainWorker || '',
				subWorker: formData.subWorker || '',
			};

			if (mode === 'create') {
				await createMutation.mutateAsync([processedData]);
			} else if (mode === 'update' && selectedMachine) {
				await updateMutation.mutateAsync({
					id: selectedMachine.id,
					data: processedData as UpdateMachinePayload,
				});
			}
			handleCancel();
		} catch (error) {
			// 오류 처리는 React Query에서 자동으로 처리됨
			console.error('설비 등록/수정 실패:', error);
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
		// formMethods가 준비되면 formMethodsRef에 저장
		if (formMethods) {
			formMethodsRef.current = formMethods;
		}
	}, [formMethods]);

	// 수정 모드일 때 기존 데이터로 폼 초기화
	useEffect(() => {
		if (mode === 'update' && selectedMachine && formMethods && !initializedRef.current) {
			
			const defaultValues = {
				machineCode: selectedMachine.machineCode || '',
				machineName: selectedMachine.machineName || '',
				machineType: selectedMachine.machineTypeCode || '',
				usingGroup: selectedMachine.usingGroupCode || '',
				rph: selectedMachine.rph || 0,
				isNotwork: selectedMachine.isNotwork !== undefined ? selectedMachine.isNotwork : true,
				isUse: selectedMachine.isUse !== undefined ? selectedMachine.isUse : true,
				machineGrade: selectedMachine.machineGrade || '',
				machineSpec: selectedMachine.machineSpec || '',
				modelName: selectedMachine.modelName || '',
				madeYear: selectedMachine.madeYear || 0,
				madeBy: selectedMachine.madeBy || '',
				buyDate: selectedMachine.buyDate || '',
				buyPrice: selectedMachine.buyPrice || 0,
				motorNumber: selectedMachine.motorNumber || 0,
				mainWorker: selectedMachine.mainWorker || '',
				subWorker: selectedMachine.subWorker || '',
			};
			
			formMethods.reset(defaultValues);
			initializedRef.current = true; // 초기화 완료 표시
		}
	}, [mode, selectedMachine, formMethods]);

	return (
		<div className="w-full max-w-7xl mx-auto p-6">
			<DynamicForm
				fields={formSchema}
				onSubmit={handleSubmit}
				onFormReady={handleFormReady}
				visibleSaveButton={true}
				layout="split"
				initialData={mode === 'update' ? selectedMachine : undefined}
				otherTypeElements={{
					isNotwork: (props: any) => {
						return (
							<BinaryToggleComponent
								value={Boolean(props.value) ? 'true' : 'false'}
								onChange={(value) => {
									props.onChange(value === 'true');
								}}
								falseLabel="가동"
								trueLabel="비가동"
							/>
						);
					},
					isUse: (props: any) => {
						return (
							<BinaryToggleComponent
								value={Boolean(props.value) ? 'true' : 'false'}
								onChange={(value) => {
									props.onChange(value === 'true');
								}}
								falseLabel="미사용"
								trueLabel="사용"
							/>
						);
					},
					codeSelect: (props: any) => (
						<CodeSelectComponent {...props} />
					),
				}}
			/>
		</div>
	);
};

export default MachineMachineRegisterPage;
