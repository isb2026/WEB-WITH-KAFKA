import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { useTranslation } from '@repo/i18n';

export type TaxInvoiceDataTableDataType = {
	id: number;
	itemNumber: string;
	itemName: string;
	itemSpec: string;
	taxUnit: string;
	taxNumber: number;
	currencyUnit: string;
	unitPrice: number;
	netPrice: number;
	grossPrice: number;
	memo: string;
};

// Form schema for adding new tax invoice details
export const taxInvoiceDetailFormSchema: FormField[] = [
	{
		name: 'itemNumber',
		label: '품번',
		type: 'text',
		placeholder: '입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'itemName',
		label: '품명',
		type: 'text',
		placeholder: '입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'itemSpec',
		label: '규격',
		type: 'text',
		placeholder: '입력해주세요',
		required: false,
		disabled: false,
	},
	{
		name: 'taxNumber',
		label: '세금계산서 수량',
		type: 'text',
		placeholder: '수량을 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'taxUnit',
		label: '세금계산서 단위',
		type: 'text',
		placeholder: '단위를 입력해주세요 (3자 이내)',
		required: true,
		disabled: false,
		maxLength: 3,
	},
	{
		name: 'unitPrice',
		label: '단가',
		type: 'text',
		required: true,
		defaultValue: null,
		disabled: false,
	},
	{
		name: 'currencyUnit',
		label: '통화 단위',
		type: 'select',
		options: [
			{ label: 'KRW', value: 'KRW' },
			{ label: 'USD', value: 'USD' },
		],
		required: true,
		disabled: false,
		defaultValue: 'KRW',
	},
];

// Edit form schema for editing tax invoice details
export const taxInvoiceDetailEditFormSchema: FormField[] = [
	{
		name: 'itemNumber',
		label: '품번',
		type: 'text',
		placeholder: '품번을 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'itemName',
		label: '품명',
		type: 'text',
		placeholder: '입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'itemSpec',
		label: '규격',
		type: 'text',
		placeholder: '입력해주세요',
		required: false,
		disabled: false,
	},
	{
		name: 'taxNumber',
		label: '세금계산서 수량',
		type: 'text',
		placeholder: '수량을 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'taxUnit',
		label: '세금계산서 단위',
		type: 'text',
		placeholder: '단위를 입력해주세요 (3자 이내)',
		required: true,
		disabled: false,
		maxLength: 3,
	},
	{
		name: 'unitPrice',
		label: '단가',
		type: 'text',
		required: true,
		defaultValue: null,
		disabled: false,
	},
	{
		name: 'currencyUnit',
		label: '통화 단위',
		type: 'select',
		options: [
			{ label: 'KRW', value: 'KRW' },
			{ label: 'USD', value: 'USD' },
		],
		required: true,
		disabled: false,
		defaultValue: 'KRW',
	},
];

// Data table columns configuration
export const useTaxInvoiceDetailColumns =
	(): ColumnConfig<TaxInvoiceDataTableDataType>[] => {
		const { t } = useTranslation('dataTable');

		return [
			{
				accessorKey: 'itemNumber',
				header: t('columns.itemNumber'),
				size: 120,
				minSize: 100,
			},
			{
				accessorKey: 'itemName',
				header: t('columns.itemName'),
				size: 180,
				minSize: 140,
			},
			{
				accessorKey: 'itemSpec',
				header: t('columns.itemSpec'),
				size: 120,
				minSize: 100,
			},
			{
				accessorKey: 'taxNumber',
				header: t('columns.taxNumber'),
				size: 100,
				minSize: 80,
				enableSummary: true,
				cell: ({ getValue }: any) => {
					const value = getValue();
					return value ? value.toLocaleString() : '';
				},
			},
			{
				accessorKey: 'taxUnit',
				header: t('columns.taxUnit'),
				size: 80,
				minSize: 80,
			},
			{
				accessorKey: 'unitPrice',
				header: t('columns.unitPrice'),
				size: 100,
				minSize: 80,
				enableSummary: true,
				cell: ({ getValue }: any) => {
					const value = getValue();
					return value ? value.toLocaleString() : '';
				},
			},
			{
				accessorKey: 'netPrice',
				header: t('columns.netPrice'),
				size: 100,
				minSize: 80,
				enableSummary: true,
				cell: ({ getValue }: any) => {
					const value = getValue();
					return value ? value.toLocaleString() : '';
				},
			},
			{
				accessorKey: 'grossPrice',
				header: t('columns.grossPrice'),
				size: 100,	
				minSize: 80,
				enableSummary: true,
				cell: ({ getValue }: any) => {
					const value = getValue();
					return value ? value.toLocaleString() : '';
				},
			},
			{
				accessorKey: 'currencyUnit',
				header: t('columns.currencyUnit'),
				size: 80,
				minSize: 100,
			},
			{
				accessorKey: 'memo',
				header: t('columns.memo'),
				size: 160,
				minSize: 120,
			},
		];
	};
