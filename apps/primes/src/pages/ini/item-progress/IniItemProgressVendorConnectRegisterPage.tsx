import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@repo/i18n';
import { DynamicForm, FormField } from '@primes/components/form/DynamicFormComponent';
import { useCreateProgressVendor } from '@primes/hooks/ini/progressVendor/useCreateProgressVendor';
import { useUpdateProgressVendor } from '@primes/hooks/ini/progressVendor/useUpdateProgressVendor';
import { VendorSelectComponent } from '@primes/components/customSelect/VendorSelectComponent';
import { BinaryToggleComponent } from '@primes/components/customSelect/BinaryToggleComponent';

interface IniItemProgressVendorConnectRegisterPageProps {
	onClose?: () => void;
	progressId?: number | string;
	mode?: 'create' | 'edit';
	selectedVendorData?: any; // 수정 시 기존 데이터
}

interface ProgressVendorConnectData {
	[key: string]: any;
}

export const IniItemProgressVendorConnectRegisterPage: React.FC<
	IniItemProgressVendorConnectRegisterPageProps
> = ({ onClose, progressId, mode = 'create', selectedVendorData }) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [formMethods, setFormMethods] = useState<any>(null);
	const [actualVendorId, setActualVendorId] = useState<number | null>(null);
	const { t } = useTranslation('common');
	const { t: tDataTable } = useTranslation('dataTable');
	
	const createProgressVendor = useCreateProgressVendor();
	const updateProgressVendor = useUpdateProgressVendor();

	// 폼 메서드가 준비되면 설정
	const handleFormReady = useCallback((methods: any) => {
		setFormMethods(methods);
	}, []);

	// 수정 모드일 때 기존 데이터로 폼 초기화
	useEffect(() => {
		if (mode === 'edit' && selectedVendorData && formMethods) {
			const vendorName = selectedVendorData.compName || selectedVendorData.vendorName || '거래처 정보 없음';
			const vendorId = selectedVendorData.vendorId || selectedVendorData.id;
			
			// vendorId를 컴포넌트 상태에 저장
			setActualVendorId(vendorId);
			
			const defaultValues = {
				vendorId: vendorName, // 수정 모드에서는 이름 표시
				quantity: selectedVendorData.quantity || '',
				unit: selectedVendorData.unit || '',
				unitCost: selectedVendorData.unitCost || '',
				isDefaultVendor: selectedVendorData.isDefaultVendor ? 'true' : 'false',
			};
			
			formMethods.reset(defaultValues);
		}
	}, [mode, selectedVendorData, formMethods, progressId]);

	// 폼 필드 정의
	const formSchema: FormField[] = [
		{
			name: 'vendorId',
			label: tDataTable('columns.progressVendor'),
			type: mode === 'edit' ? 'text' : 'vendorSelect',
			required: mode === 'edit' ? false : true,
			placeholder: mode === 'edit' ? '' : '거래처를 선택하세요',
			fieldKey: mode === 'edit' ? undefined : 'compName',
			disabled: mode === 'edit',
			readOnly: mode === 'edit',
			defaultValue: mode === 'edit' ? (selectedVendorData?.compName || selectedVendorData?.vendorName || '거래처 정보 없음') : undefined,
		},
        {
            name: 'quantity',
            label: tDataTable('columns.quantity'),
            type: 'number',
            required: false,
            placeholder: '공정 단중을 입력하세요',
        },
        {
            name: 'unit',
            label: tDataTable('columns.unit'),
            type: 'text',
            required: false,
            placeholder: '공정 단위를 입력하세요',
        },
		{
			name: 'unitCost',
			label: tDataTable('columns.unitCost'),
			type: 'number',
			required: false,
			placeholder: '공정 단가를 입력하세요',
		},
        {
            name: 'isDefaultVendor',
            label: tDataTable('columns.isDefaultVendor'),
            type: 'binaryToggle',
            required: false,
            placeholder: '기본 거래처 여부를 선택하세요',
            defaultValue: 'false',
        },
	];

	const handleSubmit = useCallback(async (data: ProgressVendorConnectData) => {
		if (isSubmitting) return;

		// 필수 필드 검증
		if (!progressId) {
			return;
		}

		// 수정 모드에서는 상태의 actualVendorId 사용, 생성 모드에서는 data.vendorId 사용
		const finalVendorId = mode === 'edit' ? actualVendorId : data.vendorId;
		
		if (!finalVendorId) {
			return;
		}

		setIsSubmitting(true);
		try {
			const {
				quantity,
				unit,
				unitCost,
				isDefaultVendor,
			} = data;

			if (mode === 'edit') {
				// 수정 모드 - PUT /progress-vendors/{progressId}/{vendorId}
				const updateData = {
					quantity,
					unit,
					unitCost,
					isDefaultVendor: isDefaultVendor === 'true' || isDefaultVendor === true,
				};
				
				await updateProgressVendor.mutateAsync({
					progressId: Number(progressId),
					vendorId: Number(finalVendorId),
					data: updateData,
				});
				
				onClose && onClose();
			} else {
				// 생성 모드 - POST /progress-vendors
				const submitData = {
					progressId: Number(progressId),
					vendorId: Number(finalVendorId),
					quantity,
					unit,
					unitCost,
					isDefaultVendor: isDefaultVendor === 'true' || isDefaultVendor === true,
				};
				
				await createProgressVendor.mutateAsync({
					data: submitData,
				});
				
				onClose && onClose();
			}
		} catch (error) {
			// 오류 처리는 React Query에서 자동으로 처리됨
		} finally {
			setIsSubmitting(false);
		}
	}, [isSubmitting, progressId, mode, actualVendorId, updateProgressVendor, createProgressVendor, onClose]);

	const handleCancel = useCallback(() => {
		onClose && onClose();
	}, [onClose]);

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm
				fields={formSchema}
				onSubmit={handleSubmit}
				onFormReady={handleFormReady}
				otherTypeElements={{
					vendorSelect: VendorSelectComponent,
					binaryToggle: (props: any) => (
						<BinaryToggleComponent
							{...props}
							falseLabel="일반"
							trueLabel="기본"
						/>
					),
				}}
				submitButtonText={mode === 'edit' ? '수정' : '연결'}
			/>
		</div>
	);
};
