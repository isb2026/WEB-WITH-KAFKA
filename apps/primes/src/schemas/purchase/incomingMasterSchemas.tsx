import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { useTranslation } from '@repo/i18n';

export type IncomingDataTableDataType = {
	id: number;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	number: number;
	unit: string;
	unitPrice: number;
	netPrice: number;
	grossPrice: number;
	currencyUnit: string;
	memo: string;
};

// Form schema for adding new incoming details
export const incomingDetailFormSchema = (): FormField[] => {
	const { t } = useTranslation('common');
	
	return [
		{
			name: 'number',
			label: t('pages.form.incomingQuantity'),
			type: 'text',
			placeholder: t('pages.form.incomingQuantityPlaceholder'),
			required: true,
			disabled: false,
		},
		{
			name: 'unit',
			label: t('pages.form.incomingUnit'),
			type: 'select',
			placeholder: t('pages.form.incomingUnitPlaceholder'),
			required: true,
			disabled: false,
			options: [
				{ label: 'T', value: 'T' },
				{ label: 'KG', value: 'KG' },
				{ label: 'EA', value: 'EA' },
			],
		},
		{
			name: 'unitPrice',
			label: t('pages.form.unitPrice'),
			type: 'text',
			placeholder: t('pages.form.unitPricePlaceholder'),
			required: true,
			defaultValue: null,
			disabled: false,
		},
		{
			name: 'netPrice',
			label: t('pages.form.netPrice'),
			type: 'text',
			placeholder: t('pages.form.netPricePlaceholder'),
			required: true,
			disabled: true,
			readOnly: true,
		},
		{
			name: 'grossPrice',
			label: t('pages.form.grossPrice'),
			type: 'text',
			placeholder: t('pages.form.grossPricePlaceholder'),
			required: true,
			disabled: true,
			readOnly: true,
		},
		{
			name: 'currencyUnit',
			label: t('pages.form.currencyUnit'),
			type: 'select',
			options: [
				{ label: 'KRW', value: 'KRW' },
				{ label: 'USD', value: 'USD' },
			],
			defaultValue: 'KRW',
			required: true,
			disabled: false,
		},
		{
			name: 'memo',
			label: t('pages.form.memo'),
			type: 'text',
			placeholder: t('pages.form.memoPlaceholder'),
			required: false,
			disabled: false,
		},
	];
};

// Edit form schema for editing incoming details
export const incomingDetailEditFormSchema = (): FormField[] => {
	const { t } = useTranslation('common');
	
	return [
		{
			name: 'number',
			label: t('pages.form.incomingQuantity'),
			type: 'text',
			placeholder: t('pages.form.incomingQuantityPlaceholder'),
			required: true,
			disabled: false,
		},
		{
			name: 'unit',
			label: t('pages.form.incomingUnit'),
			type: 'select',
			placeholder: t('pages.form.incomingUnitPlaceholder'),
			required: true,
			disabled: false,
			options: [
				{ label: 'T', value: 'T' },
				{ label: 'KG', value: 'KG' },
				{ label: 'EA', value: 'EA' },
			],
		},
		{
			name: 'unitPrice',
			label: t('pages.form.unitPrice'),
			type: 'text',
			placeholder: t('pages.form.unitPricePlaceholder'),
			required: true,
			defaultValue: null,
			disabled: false,
		},
		{
			name: 'netPrice',
			label: t('pages.form.netPrice'),
			type: 'text',
			placeholder: t('pages.form.netPricePlaceholder'),
			required: true,
			disabled: true,
			readOnly: true,
		},
		{
			name: 'grossPrice',
			label: t('pages.form.grossPrice'),
			type: 'text',
			placeholder: t('pages.form.grossPricePlaceholder'),
			required: true,
			disabled: true,
			readOnly: true,
		},
		{
			name: 'currencyUnit',
			label: t('pages.form.currencyUnit'),
			type: 'select',
			options: [
				{ label: 'KRW', value: 'KRW' },
				{ label: 'USD', value: 'USD' },
			],
			defaultValue: 'KRW',
			required: true,
			disabled: false,
		},
		{
			name: 'memo',
			label: t('pages.form.memo'),
			type: 'text',
			placeholder: t('pages.form.memoPlaceholder'),
			required: false,
			disabled: false,
		},
	];
};

// Data table columns configuration
export const useIncomingDetailColumns = (): ColumnConfig<IncomingDataTableDataType>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'itemId',
			header: t('columns.itemNumber'),
			size: 120,
			minSize: 100,
		},
		{
			accessorKey: 'itemNo',
			header: t('columns.itemName'),
			size: 180,
			minSize: 140,
		},
		{
			accessorKey: 'number',
			header: t('columns.incomingQuantity'),
			size: 120,
			minSize: 100,
		},
		{
			accessorKey: 'unit',
			header: t('columns.incomingUnit'),
			size: 100,
			minSize: 80,
		},
		{
			accessorKey: 'unitPrice',
			header: t('columns.unitPrice'),
			size: 120,
			minSize: 100,
		},
		{
			accessorKey: 'netPrice',
			header: t('columns.netPrice'),
			size: 120,
			minSize: 100,
		},
		{
			accessorKey: 'grossPrice',
			header: t('columns.totalIncomingAmount'),
			size: 120,
			minSize: 100,
		},
		{
			accessorKey: 'currencyUnit',
			header: t('columns.currencyUnit'),
			size: 100,
			minSize: 80,
		},
		{
			accessorKey: 'memo',
			header: t('columns.memo'),
			size: 160,
			minSize: 120,
		},
	];
}; 