import { useState } from 'react';

import { toast } from 'sonner';
import { useTranslation } from '@repo/i18n';
import { UseFormReturn } from 'react-hook-form';
import {
	DynamicForm,
	FormField,
} from '@aips/components/form/DynamicFormComponent';

// Supply data interface
interface SupplyData {
	id: number;
	supplierName: string;
	supplierCode: string;
	materialName: string;
	materialCode: string;
	currentStock: number;
	reorderPoint: number;
	leadTime: number;
	unitPrice: number;
	lastOrderDate: string;
	nextDeliveryDate: string;
	status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'On Order';
	category: string;
}

interface MrpSupplyRegisterPageProps {
	onClose?: () => void;
	itemsData?: SupplyData;
	onFormReady?: (methods: UseFormReturn<SupplyRegisterData>) => void;
}

interface SupplyRegisterData {
	[key: string]: unknown;
}

export const MrpSupplyRegisterPage: React.FC<MrpSupplyRegisterPageProps> = ({
	onClose,
	itemsData,
	onFormReady,
}) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const editMode: boolean = !!itemsData;

	const formSchema: FormField[] = [
		{
			name: 'supplierCode',
			label: 'Supplier Code',
			type: 'text',
			required: true,
			maxLength: 20,
			placeholder: 'SUP001',
		},
		{
			name: 'supplierName',
			label: 'Supplier Name',
			type: 'text',
			required: true,
			maxLength: 100,
			placeholder: 'ABC Materials Co.',
		},
		{
			name: 'materialCode',
			label: 'Material Code',
			type: 'text',
			required: true,
			maxLength: 20,
			placeholder: 'MAT001',
		},
		{
			name: 'materialName',
			label: 'Material Name',
			type: 'text',
			required: true,
			maxLength: 100,
			placeholder: 'Steel Plate A4',
		},
		{
			name: 'category',
			label: 'Category',
			type: 'select',
			required: true,
			options: [
				{ label: 'Raw Materials', value: 'Raw Materials' },
				{ label: 'Electronics', value: 'Electronics' },
				{ label: 'Components', value: 'Components' },
				{ label: 'Hardware', value: 'Hardware' },
			],
		},
		{
			name: 'currentStock',
			label: 'Current Stock',
			type: 'number',
			required: true,
		},
		{
			name: 'reorderPoint',
			label: 'Reorder Point',
			type: 'number',
			required: true,
		},
		{
			name: 'leadTime',
			label: 'Lead Time (Days)',
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
			name: 'status',
			label: 'Status',
			type: 'select',
			required: true,
			options: [
				{ label: 'In Stock', value: 'In Stock' },
				{ label: 'Low Stock', value: 'Low Stock' },
				{ label: 'Out of Stock', value: 'Out of Stock' },
				{ label: 'On Order', value: 'On Order' },
			],
		},
		{
			name: 'nextDeliveryDate',
			label: 'Next Delivery Date',
			type: 'date',
			required: false,
		},
	];

	const handleSubmit = async (data: SupplyRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			// For demo purposes, just show success message
			// In real implementation, this would call API
			console.log('Supply data:', data);

			if (editMode) {
				toast.success('Supplier updated successfully!');
			} else {
				toast.success('Supplier added successfully!');
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
			{/* Supply Form */}
			<DynamicForm
				onFormReady={onFormReady}
				fields={formSchema}
				onSubmit={handleSubmit}
				// defaultValues={itemsData}
			/>
		</div>
	);
};

export default MrpSupplyRegisterPage;
