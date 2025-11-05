import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { useTranslation } from '@repo/i18n';

export type PurchaseDataTableDataType = {
	id: number;
	itemId: number;
	itemNo: number;
	itemNumber?: string;
	itemName?: string;
	itemSpec?: string;
	number: number;
	unit: string;
	unitPrice: number;
	netPrice: number;
	grossPrice: number;
	currencyUnit: string;
	requestDate: string;
};

// Form schema for adding new purchase details
export const purchaseDetailFormSchema = (): FormField[] => {
	const { t } = useTranslation('dataTable');
	
	return [
		{
			name: 'requestDate',
			label: t('columns.requestDate'),
			type: 'date',
			required: true,
			disabled: false,
		},
		{
			name: 'itemId',
			label: t('columns.itemName'),
			type: 'itemId',
			placeholder: t('columns.itemName') + '을(를) 선택하세요.',
			required: true,
			disabled: false,
			displayFields: ['itemName', 'itemNumber', 'itemSpec'],
			displayTemplate: '{itemName} [{itemNumber}] - {itemSpec}',
		},
		{
			name: 'number',
			label: t('columns.purchaseNumber'),
			type: 'text',
			placeholder: t('columns.purchaseNumber') + '을(를) 입력하세요.',
			required: true,
			disabled: false,
		},
		{
			name: 'unit',
			label: t('columns.purchaseUnit'),
			type: 'select',
			placeholder: t('columns.purchaseUnit') + '을(를) 입력하세요.',
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
			label: t('columns.unitPrice'),
			type: 'text',
			placeholder: t('columns.unitPrice') + '을(를) 입력하세요.',
			required: true,
			defaultValue: null,
			disabled: false,
		},
		{
			name: 'netPrice',
			label: t('columns.netPrice'),
			type: 'text',
			placeholder: t('columns.netPrice') + '을(를) 입력하세요.',
			required: true,
			disabled: true,
			readOnly: true,
		},
		{
			name: 'grossPrice',
			label: t('columns.totalOrderAmount'),
			type: 'text',
			placeholder: t('columns.totalOrderAmount') + '을(를) 입력하세요.',
			required: true,
			disabled: true,
			readOnly: true,
		},
		{
			name: 'currencyUnit',
			label: t('columns.currencyUnit'),
			type: 'select',
			options: [
				{ label: 'KRW', value: 'KRW' },
				{ label: 'USD', value: 'USD' },
			],
			defaultValue: 'KRW',
			required: true,
			disabled: false,
		},
	] as FormField[];
};

// Edit form schema for editing purchase details
export const purchaseDetailEditFormSchema = (): FormField[] => {
	const { t } = useTranslation('dataTable');
	
	return [
		{
			name: 'requestDate',
			label: t('columns.requestDate'),
			type: 'date',
			placeholder: t('columns.requestDate') + '을(를) 입력하세요.',
			required: true,
			disabled: false,
		},
		{
			name: 'itemId',
			label: t('columns.itemName'),
			type: 'itemId',
			placeholder: t('columns.itemName') + '을(를) 선택하세요.',
			required: true,
			disabled: false,
			displayFields: ['itemName', 'itemNumber', 'itemSpec'],
			displayTemplate: '{itemName} [{itemNumber}] - {itemSpec}',
		},
		{
			name: 'number',
			label: t('columns.purchaseNumber'),
			type: 'text',
			placeholder: t('columns.purchaseNumber') + '을(를) 입력하세요.',
			required: true,
			disabled: false,
		},
		{
			name: 'unit',
			label: t('columns.purchaseUnit'),
			type: 'select',
			placeholder: t('columns.purchaseUnit') + '을(를) 입력하세요.',
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
			label: t('columns.unitPrice'),
			type: 'text',
			placeholder: t('columns.unitPrice') + '을(를) 입력하세요.',
			required: true,
			defaultValue: null,
			disabled: false,
		},
		{
			name: 'netPrice',
			label: t('columns.netPrice'),
			type: 'text',
			placeholder: t('columns.netPrice') + '을(를) 입력하세요.',
			required: true,
			disabled: true,
			readOnly: true,
		},
		{
			name: 'grossPrice',
			label: t('columns.totalOrderAmount'),
			type: 'text',
			placeholder: t('columns.totalOrderAmount') + '을(를) 입력하세요.',
			required: true,
			disabled: true,
			readOnly: true,
		},
		{
			name: 'currencyUnit',
			label: t('columns.currencyUnit'),
			type: 'select',
			options: [
				{ label: 'KRW', value: 'KRW' },
				{ label: 'USD', value: 'USD' },
			],
			defaultValue: 'KRW',
			required: true,
			disabled: false,
		},
	] as FormField[];
};

// Data table columns configuration
export const usePurchaseDetailColumns = (): ColumnConfig<PurchaseDataTableDataType>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'itemNumber',
			header: t('columns.itemNumber'),
			size: 100,
		},
		{
			accessorKey: 'itemName',
			header: t('columns.itemName'),
			size: 150,
		},
		{
			accessorKey: 'itemSpec',
			header: t('columns.itemSpec'),
			size: 100,
		},
		{
			accessorKey: 'number',
			header: t('columns.purchaseNumber'),
			size: 90,
			align: 'right',
			cell: ({ getValue }: { getValue: () => number | null }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'requestDate',
			header: t('columns.requestDate'),
			size: 160,
			align: 'center',
		},
		{
			accessorKey: 'unit',
			header: t('columns.purchaseUnit'),
			size: 90,
			align: 'center',
		},
		{
			accessorKey: 'unitPrice',
			header: t('columns.unitPrice'),
			size: 100,
			align: 'right',
			cell: ({ getValue }: { getValue: () => number | null }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'netPrice',
			header: t('columns.netPrice'),
			size: 120,
			align: 'right',
			cell: ({ getValue }: { getValue: () => number | null }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'grossPrice',
			header: t('columns.totalOrderAmount'),
			size: 120,
			align: 'right',
			cell: ({ getValue }: { getValue: () => number | null }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'currencyUnit',
			header: t('columns.currencyUnit'),
			size: 90,
			align: 'center',
		},
	];
}; 