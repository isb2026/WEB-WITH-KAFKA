import { useState } from 'react';

import { toast } from 'sonner';
import { useTranslation } from '@repo/i18n';
import { UseFormReturn } from 'react-hook-form';
import {
	DynamicForm,
	FormField,
} from '@aips/components/form/DynamicFormComponent';
import { DemandData } from './dummy-data';

interface MrpDemandRegisterPageProps {
	onClose?: () => void;
	itemsData?: DemandData;
	onFormReady?: (methods: UseFormReturn<DemandRegisterData>) => void;
}

interface DemandRegisterData {
	[key: string]: unknown;
}

export const MrpDemandRegisterPage: React.FC<MrpDemandRegisterPageProps> = ({
	onClose,
	itemsData,
	onFormReady,
}) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const editMode: boolean = !!itemsData;

	const formSchema: FormField[] = [
		{
			name: 'productCode',
			label: 'Product Code',
			type: 'text',
			required: true,
			maxLength: 20,
			placeholder: 'PRD001',
		},
		{
			name: 'productName',
			label: 'Product Name',
			type: 'text',
			required: true,
			maxLength: 100,
			placeholder: 'Steel Frame Assembly',
		},
		{
			name: 'customerName',
			label: 'Customer Name',
			type: 'text',
			required: true,
			maxLength: 100,
			placeholder: 'AutoTech Industries',
		},
		{
			name: 'category',
			label: 'Category',
			type: 'select',
			required: true,
			options: [
				{ label: 'Automotive', value: 'Automotive' },
				{ label: 'Electronics', value: 'Electronics' },
				{ label: 'Components', value: 'Components' },
				{ label: 'Mechanical', value: 'Mechanical' },
				{ label: 'Industrial', value: 'Industrial' },
			],
		},
		{
			name: 'demandDate',
			label: 'Demand Date',
			type: 'date',
			required: true,
		},
		{
			name: 'dueDate',
			label: 'Due Date',
			type: 'date',
			required: true,
		},
		{
			name: 'requiredQuantity',
			label: 'Required Quantity',
			type: 'number',
			required: true,
		},
		{
			name: 'forecastQuantity',
			label: 'Forecast Quantity',
			type: 'number',
			required: true,
		},
		{
			name: 'unitPrice',
			label: 'Unit Price ($)',
			type: 'number',
			required: true,
		},
		{
			name: 'priority',
			label: 'Priority',
			type: 'select',
			required: true,
			options: [
				{ label: 'High', value: 'High' },
				{ label: 'Medium', value: 'Medium' },
				{ label: 'Low', value: 'Low' },
			],
		},
		{
			name: 'status',
			label: 'Status',
			type: 'select',
			required: true,
			options: [
				{ label: 'Planned', value: 'Planned' },
				{ label: 'Confirmed', value: 'Confirmed' },
				{ label: 'In Production', value: 'In Production' },
				{ label: 'Completed', value: 'Completed' },
			],
		},
	];

	const handleSubmit = async (data: DemandRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			// For demo purposes, just show success message
			// In real implementation, this would call API
			console.log('Demand data:', data);

			if (editMode) {
				toast.success('Demand updated successfully!');
			} else {
				toast.success('Demand added successfully!');
			}

			onClose && onClose();
		} catch (error) {
			console.error('Submit error:', error);
			toast.error('An error occurred while saving.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-full mx-auto space-y-6">
			{/* Demand Form */}
			<DynamicForm
				onFormReady={onFormReady}
				fields={formSchema}
				onSubmit={handleSubmit}
				// defaultValues={itemsData}
			/>
		</div>
	);
};

export default MrpDemandRegisterPage;
