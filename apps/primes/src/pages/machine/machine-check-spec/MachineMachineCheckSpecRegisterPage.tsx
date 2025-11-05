import { useState } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { useCreateMachineCheckSpec } from '@primes/hooks/machine/useCreateMachineCheckSpec';
import { useUpdateMachineCheckSpec } from '@primes/hooks/machine/useUpdateMachineCheckSpec';
import { useTranslation } from '@repo/i18n';
import type {
	CreateMachineCheckSpecPayload,
	MachineCheckSpec,
} from '@primes/types/machine/machineCheckSpec';

interface MachineMachineCheckSpecRegisterPageProps {
	mode?: 'create' | 'edit';
	data?: MachineCheckSpec;
	onClose?: () => void;
}

export const MachineMachineCheckSpecRegisterPage: React.FC<
	MachineMachineCheckSpecRegisterPageProps
> = ({ mode = 'create', data, onClose }) => {
	const { t } = useTranslation('common');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const createMutation = useCreateMachineCheckSpec();
	const updateMutation = useUpdateMachineCheckSpec();

	const formSchema: FormField[] = [
		{
			name: 'machineId',
			label: '기계 ID',
			type: 'number',
			placeholder: '기계 ID를 입력하세요',
			required: true,
			defaultValue: data?.machineId || 0,
		},
		{
			name: 'machineName',
			label: '기계명',
			type: 'text',
			placeholder: '기계명을 입력하세요',
			required: false,
			defaultValue: data?.machineName || '',
		},
		{
			name: 'specName',
			label: '검사 기준명',
			type: 'text',
			placeholder: '검사 기준명을 입력하세요',
			required: true,
			defaultValue: data?.specName || '',
		},
		{
			name: 'specType',
			label: '검사 유형',
			type: 'text',
			placeholder: '검사 유형을 입력하세요',
			required: true,
			defaultValue: data?.specType || '',
		},
		{
			name: 'standardValue',
			label: '기준값',
			type: 'number',
			placeholder: '기준값을 입력하세요',
			required: true,
			defaultValue: data?.standardValue || 0,
		},
		{
			name: 'upperLimit',
			label: '상한값',
			type: 'number',
			placeholder: '상한값을 입력하세요',
			required: false,
			defaultValue: data?.upperLimit || 0,
		},
		{
			name: 'lowerLimit',
			label: '하한값',
			type: 'number',
			placeholder: '하한값을 입력하세요',
			required: false,
			defaultValue: data?.lowerLimit || 0,
		},
		{
			name: 'unit',
			label: '단위',
			type: 'text',
			placeholder: '단위를 입력하세요',
			required: false,
			defaultValue: data?.unit || '',
		},
		{
			name: 'checkCycle',
			label: '검사 주기',
			type: 'text',
			placeholder: '검사 주기를 입력하세요',
			required: false,
			defaultValue: data?.checkCycle || '',
		},
		{
			name: 'checkMethod',
			label: '검사 방법',
			type: 'text',
			placeholder: '검사 방법을 입력하세요',
			required: false,
			defaultValue: data?.checkMethod || '',
		},
		{
			name: 'description',
			label: '설명',
			type: 'textarea',
			placeholder: '상세 설명을 입력하세요',
			required: false,
			defaultValue: data?.description || '',
		},
		{
			name: 'isActive',
			label: '활성 상태',
			type: 'checkbox',
			placeholder: '활성 상태를 선택하세요',
			required: false,
			defaultValue: data?.isActive ?? true,
		},
	];

	const handleSubmit = (formData: Record<string, unknown>) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		// 타입 변환 (unknown을 거쳐서 안전하게 변환)
		const typedFormData =
			formData as unknown as CreateMachineCheckSpecPayload;

		// 비동기 작업을 별도 함수로 처리
		const submitData = async () => {
			try {
				if (mode === 'edit' && data?.id) {
					// 수정 모드
					await updateMutation.mutateAsync({
						id: data.id,
						data: typedFormData,
					});
					console.log('기계 검사 기준이 수정되었습니다.');
				} else {
					// 등록 모드
					await createMutation.mutateAsync(typedFormData);
					console.log('기계 검사 기준이 등록되었습니다.');
				}
				onClose && onClose();
			} catch (error) {
				console.error(
					`${mode === 'edit' ? '수정' : '등록'} 실패:`,
					error
				);
				console.error(
					`${mode === 'edit' ? '수정' : '등록'} 중 오류가 발생했습니다.`
				);
			} finally {
				setIsSubmitting(false);
			}
		};

		// 비동기 함수 실행
		submitData();
	};

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm fields={formSchema} onSubmit={handleSubmit} />
		</div>
	);
};

export default MachineMachineCheckSpecRegisterPage;
