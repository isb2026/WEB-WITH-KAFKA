import React, { useRef } from 'react';
import { useTranslation } from '@repo/i18n';
import { UseFormReturn } from 'react-hook-form';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { outsourcingProcessFormSchema } from '@primes/schemas/outsourcing/processFormSchema';
import { ItemSelectComponent } from '@primes/components/customSelect/ItemSelectComponent';
import { VendorSelectComponent } from '@primes/components/customSelect/VendorSelectComponent';
import { CodeSelectComponent } from '@primes/components/customSelect/CodeSelectComponent';

interface OutsourcingProcessRegisterPageProps {
	onClose?: () => void;
	onSuccess?: () => void;
	processData?: any; // TODO: 타입 정의 필요
	isEditMode?: boolean;
}

export const OutsourcingProcessRegisterPage: React.FC<OutsourcingProcessRegisterPageProps> = ({
	onClose,
	onSuccess,
	processData,
	isEditMode = false,
}) => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const formMethodsRef = useRef<UseFormReturn<Record<string, unknown>> | null>(null);

	const handleSubmit = async (data: Record<string, unknown>) => {
		console.log('제품공정별 단가 등록 데이터:', data);
		// TODO: Service 레이어에서 구현 예정
		onSuccess && onSuccess();
	};

	const handleCancel = () => {
		onClose && onClose();
	};

	const handleFormReady = (methods: UseFormReturn<Record<string, unknown>>) => {
		formMethodsRef.current = methods;
	};

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm
				fields={outsourcingProcessFormSchema()}
				onSubmit={handleSubmit}
				onFormReady={handleFormReady}
				submitButtonText={"저장"}
				initialData={processData}
				visibleSaveButton={true}
				otherTypeElements={{
					itemSelect: (props: any) => (
						<ItemSelectComponent
							{...props}
							displayFields={['itemName', 'itemNumber']}
							displayTemplate='{itemName} [{itemNumber}]'
							placeholder="제품을 선택하세요"
							onItemDataChange={(itemData) => {
								// Call the original onChange
								props.onChange(itemData?.itemId?.toString() || '');
							}}
						/>
					),
					vendorSelect: (props: any) => (
						<VendorSelectComponent
							{...props}
							placeholder="협력업체를 선택하세요"
							onChange={(value: string | null, label?: string, vendorData?: { id: number; compName: string }) => {
								// Update vendorId field
								props.onChange(value);
								
								// Update additional vendor fields if vendorData is available
								if (vendorData && formMethodsRef.current) {
									formMethodsRef.current.setValue('vendorId', vendorData.id);
								}
							}}
						/>
					),
					processSelect: (props: any) => (
						<CodeSelectComponent
							{...props}
							placeholder="공정을 선택하세요"
							fieldKey="PRD-002"
							valueKey="codeValue"
							labelKey="codeName"
						/>
					),
				}}
			/>
		</div>
	);
};

export default OutsourcingProcessRegisterPage;