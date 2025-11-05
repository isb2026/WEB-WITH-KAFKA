import React, { useState, useRef } from 'react';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from '@repo/i18n';

interface PurchaseReturnsRegisterPageProps {
	onClose?: () => void;
}

// Mock form schema for purchase returns
const purchaseReturnFormSchema = [
	{
		name: 'purchaseOrderCode',
		label: 'purchaseOrderCode',
		type: 'select',
		placeholder: 'purchaseOrderCodePlaceholder',
		required: true,
		disabled: false,
		options: [
			{ value: 'PO-2024-001', label: 'PO-2024-001 - ABC Company' },
			{ value: 'PO-2024-002', label: 'PO-2024-002 - XYZ Corp' },
			{ value: 'PO-2024-003', label: 'PO-2024-003 - DEF Ltd' },
		],
	},
	{
		name: 'vendorName',
		label: 'vendorName',
		type: 'text',
		placeholder: 'vendorNamePlaceholder',
		required: true,
		disabled: true,
	},
	{
		name: 'returnDate',
		label: 'returnDate',
		type: 'date',
		placeholder: 'returnDatePlaceholder',
		required: true,
		disabled: false,
	},
	{
		name: 'returnReason',
		label: 'returnReason',
		type: 'select',
		placeholder: 'returnReasonPlaceholder',
		required: true,
		disabled: false,
		options: [
			{ value: 'Defective Product', label: 'Defective Product' },
			{ value: 'Wrong Item', label: 'Wrong Item' },
			{ value: 'Damaged in Transit', label: 'Damaged in Transit' },
			{ value: 'Quality Issue', label: 'Quality Issue' },
			{ value: 'Late Delivery', label: 'Late Delivery' },
			{ value: 'Other', label: 'Other' },
		],
	},
	{
		name: 'returnStatus',
		label: 'returnStatus',
		type: 'select',
		placeholder: 'returnStatusPlaceholder',
		required: true,
		disabled: false,
		options: [
			{ value: 'Pending', label: 'Pending' },
			{ value: 'Approved', label: 'Approved' },
			{ value: 'Rejected', label: 'Rejected' },
			{ value: 'Completed', label: 'Completed' },
		],
	},
	{
		name: 'totalAmount',
		label: 'totalAmount',
		type: 'text',
		placeholder: 'totalAmountPlaceholder',
		required: true,
		disabled: false,
	},
	{
		name: 'currencyUnit',
		label: 'currencyUnit',
		type: 'select',
		placeholder: 'currencyUnitPlaceholder',
		required: true,
		disabled: false,
		options: [
			{ value: 'KRW', label: 'KRW' },
			{ value: 'USD', label: 'USD' },
		],
	},
	{
		name: 'notes',
		label: 'notes',
		type: 'textarea',
		placeholder: 'notesPlaceholder',
		required: false,
		disabled: false,
	},
];

export const PurchaseReturnsRegisterPage: React.FC<PurchaseReturnsRegisterPageProps> = ({ onClose }) => {
	const { t: tCommon } = useTranslation('common');
	const { t: tDataTable } = useTranslation('dataTable');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const formMethodsRef = useRef<UseFormReturn<Record<string, unknown>> | null>(null);

	const handleFormReady = (methods: UseFormReturn<Record<string, unknown>>) => {
		formMethodsRef.current = methods;
	};

	const handleSubmit = (formData: Record<string, unknown>) => {
		setIsSubmitting(true);

		// Mock API call - in real implementation, this would call an API
		setTimeout(() => {
			console.log('Creating purchase return:', formData);
			setIsSubmitting(false);
			if (onClose) onClose();
		}, 1000);
	};

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm
				onFormReady={handleFormReady}
				fields={purchaseReturnFormSchema.map((field) => ({
					...field,
					label: tDataTable(`columns.${field.label}`),
					placeholder: field.placeholder ? tDataTable(`placeholders.${field.placeholder}`) : '',
					disabled: isSubmitting || field.disabled,
				}))}
				onSubmit={handleSubmit}
				submitButtonText={
					isSubmitting ? tCommon('pages.form.saving') : tCommon('pages.form.save')
				}
				visibleSaveButton={true}
			/>
		</div>
	);
};

export default PurchaseReturnsRegisterPage;
