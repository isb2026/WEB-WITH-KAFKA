import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { useTranslation } from '@repo/i18n';

export type StatementDataTableDataType = {
	id: number;
	itemNumber: string;
	itemName: string;
	statementNumber: number;
	statementUnit: string;
	unitPrice: number;
	netPrice: number;
	grossPrice: number;
	currencyUnit: string;
	memo: string;
};

// Form schema for adding new statement details
export const statementDetailFormSchema: FormField[] = [
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
		label: '품명/규격',
		type: 'text',
		placeholder: '입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'itemSpec',
		label: '품목 규격',
		type: 'text',
		placeholder: '품목 규격을 입력해주세요',
		required: false,
		disabled: false,
	},
	{
		name: 'statementUnit',
		label: '명세서 단위',
		type: 'text',
		placeholder: '명세서 단위를 입력해주세요 (3자 이내)',
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

// Edit form schema for editing statement details
export const statementDetailEditFormSchema: FormField[] = [
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
		label: '품명/규격',
		type: 'text',
		placeholder: '입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'itemSpec',
		label: '품목 규격',
		type: 'text',
		placeholder: '품목 규격을 입력해주세요',
		required: false,
		disabled: false,
	},
	{
		name: 'statementUnit',
		label: '명세서 단위',
		type: 'text',
		placeholder: '명세서 단위를 입력해주세요 (3자 이내)',
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
export const useStatementDetailColumns =
	(): ColumnConfig<StatementDataTableDataType>[] => {
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
				accessorKey: 'statementNumber',
				header: t('columns.statementQuantity'),
				size: 120,
				minSize: 100,
				enableSummary: true,
				cell: ({ getValue }: any) => {
					const value = getValue();
					return value ? value.toLocaleString() : '';
				},
			},
			{
				accessorKey: 'statementUnit',
				header: t('columns.statementUnit'),
				size: 100,
				minSize: 80,
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
				header: t('columns.totalStatementAmount'),
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