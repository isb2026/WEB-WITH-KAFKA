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
	currencyUnit: string;
	unitPrice: number;
	netPrice: number;
	grossPrice: number;
	memo: string;
	requestDate?: string;
	isDelivered?: boolean;
};

// Form schema for adding new shipment details
export const shipmentDetailFormSchema: FormField[] = [
	{
		name: 'itemName',
		label: '품명/규격',
		type: 'text',
		placeholder: '입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'requestDate',
		label: '출하일자',
		type: 'date',
		placeholder: '출하일자를 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'requestNumber',
		label: '출하 수량',
		type: 'text',
		placeholder: '출하수량를 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'requestUnit',
		label: '출하 단위',
		type: 'text',
		placeholder: '출하단위를 입력해주세요 (3자 이내)',
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
];

// Edit form schema for editing shipment details
export const shipmentDetailEditFormSchema: FormField[] = [
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
		name: 'requestDate',
		label: '출하일자',
		type: 'date',
		placeholder: '출하일자를 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'requestNumber',
		label: '출하 수량',
		type: 'text',
		placeholder: '출하수량를 입력해주세요',
		required: true,
		disabled: false,
	},
	{
		name: 'requestUnit',
		label: '출하 단위',
		type: 'text',
		placeholder: '출하단위를 입력해주세요 (3자 이내)',
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
];

// Data table columns configuration
export const useShipmentDetailColumns =
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
				size: 120,
				minSize: 100,
			},
			{
				accessorKey: 'requestNumber',
				header: t('columns.requestNumber'),
				size: 120,
				minSize: 100,
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return value ? value.toLocaleString() : '0';
				},
			},
			{
				accessorKey: 'requestUnit',
				header: t('columns.requestUnit'),
				size: 100,
				minSize: 80,
			},
			{
				accessorKey: 'unitPrice',
				header: t('columns.unitPrice'),
				size: 120,
				minSize: 100,
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return value ? value.toLocaleString() : '0';
				},
			},
			{
				accessorKey: 'netPrice',
				header: t('columns.netPrice'),
				size: 120,
				minSize: 100,
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return value ? value.toLocaleString() : '0';
				},
			},
			{
				accessorKey: 'grossPrice',
				header: t('columns.grossPrice'),
				size: 120,
				minSize: 100,
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return value ? value.toLocaleString() : '0';
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
				size: 150,
				minSize: 120,
			},
		];
	};
