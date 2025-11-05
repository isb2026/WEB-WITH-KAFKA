import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { useTranslation } from '@repo/i18n';
import { PurchaseMaster } from '@primes/types/purchase/purchaseMaster';

// Form schema for adding new purchase details
export const purchaseMasterFormSchema = (): FormField[] => {
	const { t } = useTranslation('common');
	
	return [
		{
			name: 'requestDate',
			label: t('pages.form.requestDate'),
			type: 'date',
			placeholder: t('pages.form.requestDatePlaceholder'),
			required: true,
			disabled: false,
		},
		{
			name: 'number',
			label: t('pages.form.purchaseQuantity'),
			type: 'text',
			placeholder: t('pages.form.purchaseQuantityPlaceholder'),
			required: true,
			disabled: false,
		},
		{
			name: 'unit',
			label: t('pages.form.purchaseUnit'),
			type: 'select',
			placeholder: t('pages.form.purchaseUnitPlaceholder'),
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
	];
};

// Edit form schema for editing purchase details
export const purchaseMasterEditFormSchema = (): FormField[] => {
	const { t } = useTranslation('common');
	
	return [
		{
			name: 'requestDate',
			label: t('pages.form.requestDate'),
			type: 'date',
			placeholder: t('pages.form.requestDatePlaceholder'),
			required: true,
			disabled: false,
		},
		{
			name: 'number',
			label: t('pages.form.purchaseQuantity'),
			type: 'text',
			placeholder: t('pages.form.purchaseQuantityPlaceholder'),
			required: true,
			disabled: false,
		},
		{
			name: 'unit',
			label: t('pages.form.purchaseUnit'),
			type: 'select',
			placeholder: t('pages.form.purchaseUnitPlaceholder'),
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
	];
};

// Data table columns configuration
export const usePurchaseMasterColumns = (): ColumnConfig<PurchaseMaster>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'vendorName',
			header: t('columns.vendorName'),
			size: 120,
		},
		{
			accessorKey: 'itemId',
			header: t('columns.item'),
			size: 120,
			minSize: 100,
		},
		{
			accessorKey: 'number',
			header: t('columns.purchaseQuantity'),
			size: 120,
			minSize: 100,
		},
		{
			accessorKey: 'unit',
			header: t('columns.purchaseUnit'),
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
			header: t('columns.totalOrderAmount'),
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
			accessorKey: 'requestDate',
			header: t('columns.requestDate'),
			size: 160,
			minSize: 120,
		},
	];
}; 

export const PurchaseMasterSearchFields = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'purchaseCode',
			label: t('columns.purchaseCode'),
			type: 'text',
			placeholder: t('columns.purchaseCode') + '을(를) 검색',
			required: false,
			disabled: false,
		},
		{
			name: 'itemName',
			label: t('columns.itemName'),
			type: 'text',
			placeholder: t('columns.itemName') + '을(를) 검색',
			required: false,
			disabled: false,
		},
		{
			name: 'vendorItemName',
			label: t('columns.vendorItemName'),
			type: 'text',
			placeholder: t('columns.vendorItemName') + '을(를) 검색',
			required: false,
			disabled: false,
		},
		{
			name: 'vendorItemNumber',
			label: t('columns.vendorItemNumber'),
			type: 'text',
			placeholder: t('columns.vendorItemNumber') + '을(를) 검색',
			required: false,
			disabled: false,
		},
		{
			name: 'isDefault',
			label: t('columns.isDefault'),
			type: 'select',
			required: false,
			disabled: false,
			options: [
				{ label: '전체', value: '' },
				{ label: '지정', value: 'true' },
				{ label: '지정안함', value: 'false' },
			],
		}
	]
};