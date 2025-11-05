import React, { useRef } from 'react';
import { useTranslation } from '@repo/i18n';
import { UseFormReturn } from 'react-hook-form';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { outsourcingVendorFormSchema } from '@primes/schemas/outsourcing/vendorFormSchema';
import { VendorSelectComponent } from '@primes/components/customSelect/VendorSelectComponent';

interface OutsourcingVendorRegisterPageProps {
	onClose?: () => void;
	onSuccess?: () => void;
	vendorData?: any; // TODO: 타입 정의 필요
	isEditMode?: boolean;
}

export const OutsourcingVendorRegisterPage: React.FC<OutsourcingVendorRegisterPageProps> = ({
	onClose,
	onSuccess,
	vendorData,
	isEditMode = false,
}) => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const formMethodsRef = useRef<UseFormReturn<Record<string, unknown>> | null>(null);

	const handleSubmit = async (data: Record<string, unknown>) => {
		console.log('협력업체 등록 데이터:', data);
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
				fields={outsourcingVendorFormSchema()}
				onSubmit={handleSubmit}
				onFormReady={handleFormReady}
				submitButtonText={"저장"}
				initialData={vendorData}
				visibleSaveButton={true}
				otherTypeElements={{
					vendorSelect: (props: any) => (
						<VendorSelectComponent
							{...props}
							onChange={(value: string | null, label?: string, vendorData?: { id: number; compName: string }) => {
								props.onChange(value);
								if (vendorData && formMethodsRef.current) {
									formMethodsRef.current.setValue('vendorId', vendorData.id);
									formMethodsRef.current.setValue('vendorName', vendorData.compName);
								}
							}}
						/>
					),
				}}
			/>
		</div>
	);
};

export default OutsourcingVendorRegisterPage;