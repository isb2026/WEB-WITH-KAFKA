import React, { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { useMachineListQuery } from '@primes/hooks/machine/machine/useMachineListQuery';
import { CodeSelectComponent } from '@primes/components/customSelect/CodeSelectComponent';
import { MachineSelectComponent } from '@primes/components/customSelect/MachineSelectComponent';
import {
	useCreateProgressMachine,
	useUpdateProgressMachine,
} from '@primes/hooks/machine/progressMachine';
import { ProgressMachineDto } from '@primes/types/progressMachine';
import { toast } from 'sonner';

interface IniItemProgressMachineRegisterPageProps {
	onClose?: () => void;
	progressId?: number | string;
	productName?: string;
	progressName?: string;
	mode?: 'create' | 'edit';
	selectedMachineData?: ProgressMachineDto; // 수정 시 기존 데이터
}

interface ProgressMachineFormData {
	machineId: number;
	isDefault?: boolean; // 대표설비 여부 (Swagger 기준)
}

export const IniItemProgressMachineRegisterPage: React.FC<
	IniItemProgressMachineRegisterPageProps
> = ({
	onClose,
	progressId,
	productName,
	progressName,
	mode = 'create',
	selectedMachineData,
}) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [formMethods, setFormMethods] = useState<any>(null);
	const [selectedMachineInfo, setSelectedMachineInfo] = useState<any>(null);
	const { t } = useTranslation('common');
	const { t: tDataTable } = useTranslation('dataTable');

	// ProgressMachine 훅들
	const createMutation = useCreateProgressMachine();
	const updateMutation = useUpdateProgressMachine();

	// 설비 선택 시 정보 자동 적용
	const handleMachineSelect = (machineData: any) => {
		if (machineData) {
			setSelectedMachineInfo(machineData);
		}
	};

	// 폼 메서드가 준비되면 설정
	const handleFormReady = (methods: any) => {
		setFormMethods(methods);

		// 수정 모드일 때 기존 데이터로 폼 초기화
		if (mode === 'edit' && selectedMachineData && methods) {
			const defaultValues = {
				machineId: selectedMachineData.machineId || '',
				isDefault: selectedMachineData.isDefault || false,
			};

			methods.reset(defaultValues);
			// 수정 모드에서는 선택된 설비 정보도 설정
			setSelectedMachineInfo(selectedMachineData);
		}
	};

	// 폼 필드 정의 (Swagger 기준으로 단순화)
	const formFields: FormField[] = [
		{
			name: 'machineId',
			label: '설비 선택',
			type: 'machineSelect',
			required: true,
			placeholder: '설비를 선택하세요',
		},
		{
			name: 'isDefault',
			label: '대표설비 여부',
			type: 'checkbox',
			required: false,
			defaultValue: false,
		},
	];

	// 커스텀 컴포넌트 정의
	const otherTypeElements = {
		codeSelect: CodeSelectComponent,
		machineSelect: MachineSelectComponent,
	};

	const handleSubmit = async (data: Record<string, unknown>) => {
		if (isSubmitting) return;

		setIsSubmitting(true);
		try {
			if (mode === 'create') {
				// 생성 모드 (Swagger 기준)
				await createMutation.mutateAsync([
					{
						progressId: Number(progressId),
						machineId: Number(data.machineId),
						isDefault: Boolean(data.isDefault) || false,
					},
				]);
				toast.success('ProgressMachine이 성공적으로 생성되었습니다.');
			} else {
				// 수정 모드 (Swagger 기준)
				if (!selectedMachineData?.id) {
					toast.error('수정할 데이터가 없습니다.');
					return;
				}

				await updateMutation.mutateAsync({
					id: selectedMachineData.id,
					data: {
						isDefault: Boolean(data.isDefault) || false,
					},
				});
				toast.success('ProgressMachine이 성공적으로 수정되었습니다.');
			}

			// 성공 시 모달 닫기
			onClose && onClose();
		} catch (error) {
			console.error('ProgressMachine 처리 중 오류:', error);
			toast.error(
				mode === 'create'
					? 'ProgressMachine 생성에 실패했습니다.'
					: 'ProgressMachine 수정에 실패했습니다.'
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-full mx-auto">
			{/* 폼 */}
			<DynamicForm
				fields={formFields}
				onSubmit={handleSubmit}
				onFormReady={handleFormReady}
				submitButtonText={mode === 'edit' ? t('edit') : t('add')}
				otherTypeElements={otherTypeElements}
			/>
		</div>
	);
};
