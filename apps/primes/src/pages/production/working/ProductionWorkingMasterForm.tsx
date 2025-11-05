import { useState, useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { useCreateWorking, useUpdateWorking } from '@primes/hooks/production';
import { CreateWorkingPayload, UpdateWorkingPayload, WorkingMaster } from '@primes/types/production';
import { workingMasterColumns } from '@primes/schemas/production/workingMasterSchemas';
import {
	UserSelectComponent,
	CodeSelectComponent
} from '@primes/components/customSelect';
import { toast } from 'sonner';

interface ProductionWorkingMasterFormProps {
	mode?: 'create' | 'update';
	onSuccess?: (data: WorkingMaster) => void;
	onClose?: () => void;
	masterData?: any;
}

export const ProductionWorkingMasterForm: React.FC<
	ProductionWorkingMasterFormProps
> = ({ onSuccess, onClose, masterData, mode = 'create' }) => {
	const formRef = useRef<UseFormReturn<Record<string, unknown>> | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// API Hooks
	const createMutation = useCreateWorking();
	const updateMutation = useUpdateWorking();

	// Form 필드 정의
	const formFields = workingMasterColumns();

	useEffect(() => {
		if (mode === 'update' && masterData && formRef.current) {
			formRef.current.setValue('commandNo', masterData.commandNo || '');
			formRef.current.setValue('workBy', masterData.workBy || '');
			formRef.current.setValue('workDate', masterData.workDate || '');
			formRef.current.setValue('standardTime', masterData.standardTime || '');
			formRef.current.setValue('workHour', masterData.workHour || '');
			formRef.current.setValue('shift', masterData.shift || '');
			formRef.current.setValue('workCode', masterData.workCode || '');
			formRef.current.setValue('startTime', masterData.startTime || '');
			formRef.current.setValue('endTime', masterData.endTime || '');
		}
	}, [mode, masterData, formRef.current]);

	useEffect(() => {
		if (masterData && formRef.current) {
			if (mode === 'update') {
				Object.keys(masterData).forEach(key => {
					if (masterData[key] !== undefined && masterData[key] !== null) {
						formRef.current?.setValue(key, masterData[key]);
					}
				});
			} else if (mode === 'create') {
				if (masterData.id) {
					formRef.current?.setValue('commandId', masterData.id);
				}

				if (masterData.commandNo) {
					formRef.current?.setValue('commandNo', masterData.commandNo);
				}
			}
		}
	}, [masterData, mode]);

	// Submit 핸들러
	const handleSubmit = (formData: Record<string, unknown>) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		// 비동기 처리를 내부 함수로 분리
		const submitData = async () => {
			try {
				let result;

				if (mode === 'create') {
					const typedFormData = formData as unknown as CreateWorkingPayload;
					result = await createMutation.mutateAsync(typedFormData);
					toast.success('작업이 성공적으로 생성되었습니다.');
				} else {
					const typedFormData = formData as unknown as UpdateWorkingPayload;
					result = await updateMutation.mutateAsync({
						id: masterData?.id,
						data: typedFormData
					});
					toast.success('작업이 성공적으로 수정되었습니다.');
				}

				// 성공 콜백 호출
				if (onSuccess && result) {
					onSuccess(result as WorkingMaster);
				}
				if (onClose) {
					onClose();
				}
			} catch (error) {
				console.error('등록 실패:', error);
				console.error('등록 중 오류가 발생했습니다.');
			} finally {
				setIsSubmitting(false);
			}
		};

		submitData();
	};

	return (
		<DynamicForm
			onFormReady={(methods) => {
				formRef.current = methods;
			}}
			fields={formFields}
			onSubmit={handleSubmit}
			visibleSaveButton={true}
			otherTypeElements={{
				userSelect: (props: any) => {
					return <UserSelectComponent 
								{...props}
								selectWithoutSearch={true}
							/>
				},
				codeSelect: CodeSelectComponent,
			}}
		/>
	);
};

export default ProductionWorkingMasterForm;
