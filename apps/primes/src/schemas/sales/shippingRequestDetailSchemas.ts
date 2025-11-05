import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { useTranslation } from '@repo/i18n';

export type DataTableDataType = {
	id: number;
	itemNumber: string;
	itemName: string;
	itemSpec: string;
	requestUnit: string;
	requestNumber: number;
	unitPrice: number;
	netPrice: number;
	grossPrice: number;
	currencyUnit: string;
	vendorName?: string;
	memo?: string;
};

// Form schema for adding new shipping request details
export const shippingRequestDetailFormSchema: FormField[] = [
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
		placeholder: '품명을 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'itemSpec',
		label: '제품규격',
		type: 'text',
		placeholder: '제품규격을 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'requestNumber',
		label: '요청 수량',
		type: 'text',
		placeholder: '요청수량을 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'requestUnit',
		label: '요청 단위',
		type: 'text',
		placeholder: '요청단위를 입력해주세요 (3자 이내)',
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
		name: 'netPrice',
		label: '공급가액',
		type: 'text',
		required: true,
		disabled: false,
	},
	{
		name: 'grossPrice',
		label: '총금액',
		type: 'text',
		required: true,
		disabled: true,
	},
	{
		name: 'currencyUnit',
		label: '통화',
		type: 'select',
		options: [
			{ label: 'KRW', value: 'KRW' },
			{ label: 'USD', value: 'USD' },
		],
		defaultValue: 'USD',
		required: true,
		disabled: false,
	},
	{
		name: 'memo',
		label: '메모',
		type: 'text',
		placeholder: '메모를 입력해주세요',
		required: false,
		disabled: false,
	},
];

// Edit form schema for editing shipping request details
export const shippingRequestDetailEditFormSchema: FormField[] = [
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
		placeholder: '품명을 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'itemSpec',
		label: '제품규격',
		type: 'text',
		placeholder: '제품규격을 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'requestNumber',
		label: '요청 수량',
		type: 'text',
		placeholder: '요청수량을 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'requestUnit',
		label: '요청 단위',
		type: 'text',
		placeholder: '요청단위를 입력해주세요 (3자 이내)',
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
		name: 'netPrice',
		label: '공급가액',
		type: 'text',
		required: true,
		disabled: false,
	},
	{
		name: 'grossPrice',
		label: '총금액',
		type: 'text',
		required: true,
		disabled: true,
	},
	{
		name: 'currencyUnit',
		label: '통화',
		type: 'select',
		options: [
			{ label: 'KRW', value: 'KRW' },
			{ label: 'USD', value: 'USD' },
		],
		defaultValue: 'USD',
		required: true,
		disabled: false,
	},
	{
		name: 'memo',
		label: '메모',
		type: 'text',
		placeholder: '메모를 입력해주세요',
		required: false,
		disabled: false,
	},
];

// Data table columns configuration with translations
export const useShippingRequestDetailColumns =
	(): ColumnConfig<DataTableDataType>[] => {
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
				size: 200,
				minSize: 160,
			},
			{
				accessorKey: 'itemSpec',
				header: t('columns.itemSpec'),
				size: 150,
				minSize: 120,
			},
			{
				accessorKey: 'requestNumber',
				header: t('columns.requestQuantity'),
				size: 120,
				minSize: 100,
				enableSummary: true,
				cell: ({ getValue }: any) => {
					const value = getValue();
					return value ? value.toLocaleString() : '';
				},
			},
			{
				accessorKey: 'requestUnit',
				header: t('columns.requestUnit'),
				size: 80,
				minSize: 60,
			},
			{
				accessorKey: 'unitPrice',
				header: t('columns.unitPrice'),
				size: 120,
				minSize: 100,
				enableSummary: true,
				cell: ({ getValue }: any) => {
					const value = getValue();
					return value ? value.toLocaleString() : '';
				},
			},
			{
				accessorKey: 'netPrice',
				header: t('columns.netPrice'),
				size: 120,
				minSize: 100,
				enableSummary: true,
				cell: ({ getValue }: any) => {
					const value = getValue();
					return value ? value.toLocaleString() : '';
				},
			},
			{
				accessorKey: 'grossPrice',
				header: t('columns.grossPrice'),
				size: 120,
				minSize: 100,
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
				minSize: 60,
			},
			{
				accessorKey: 'memo',
				header: t('columns.memo'),
				size: 150,
				minSize: 120,
			},
		];
	};
