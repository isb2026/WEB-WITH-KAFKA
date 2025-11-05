import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { useTranslation } from '@repo/i18n';
import { useItemFieldQuery } from '@primes/hooks/init/item/useItemFieldQuery';
import { ItemDto } from '@primes/types/item';

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

// Hook to get item options for select dropdown
export const useItemOptions = () => {
	const {
		data: itemList,
		isLoading,
		error,
	} = useItemFieldQuery('itemName', { isUse: true });

	// Create item options for select dropdown with both itemId and itemNo info
	const itemOptions = Array.isArray(itemList)
		? itemList.map((item: ItemDto) => ({
				value: `${item.id}_${item.itemNo}`, // Store both itemId and itemNo in value
				label: `${item.itemName} - ${item.itemNumber} - ${item.itemSpec || 'No Spec'}`,
			}))
		: [];

	return {
		itemOptions,
		isLoading,
		error,
	};
};

// Form schema for adding new incoming details
export const incomingDetailFormSchema = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'itemId',
			label: t('columns.itemName'),
			type: 'select',
			placeholder: t('columns.itemName') + '을(를) 선택하세요.',
			required: true,
			disabled: false,
			options: [],
		},
		{
			name: 'number',
			label: t('columns.incomingQuantity'),
			type: 'text',
			placeholder: t('columns.incomingQuantity') + '을(를) 입력하세요.',
			required: true,
			disabled: false,
		},
		{
			name: 'unit',
			label: t('columns.incomingUnit'),
			type: 'select',
			placeholder: t('columns.incomingUnit') + '을(를) 입력하세요.',
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
			label: t('columns.grossPrice'),
			type: 'text',
			placeholder: t('columns.grossPrice') + '을(를) 입력하세요.',
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
		{
			name: 'memo',
			label: t('columns.memo'),
			type: 'text',
			placeholder: t('columns.memo') + '을(를) 입력하세요.',
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
			name: 'itemId',
			label: t('columns.itemName'),
			type: 'select',
			placeholder: t('columns.itemName') + '을(를) 선택하세요.',
			required: true,
			disabled: false,
			options: [],
		},
		{
			name: 'number',
			label: t('columns.incomingQuantity'),
			type: 'text',
			placeholder: t('columns.incomingQuantity') + '을(를) 입력하세요.',
			required: true,
			disabled: false,
		},
		{
			name: 'unit',
			label: t('columns.incomingUnit'),
			type: 'select',
			placeholder: t('columns.incomingUnit') + '을(를) 입력하세요.',
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
			label: t('columns.grossPrice'),
			type: 'text',
			placeholder: t('columns.grossPrice') + '을(를) 입력하세요.',
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
		{
			name: 'memo',
			label: t('columns.memo'),
			type: 'text',
			placeholder: t('columns.memo') + '을(를) 입력하세요.',
			required: false,
			disabled: false,
		},
	];
};

// Data table columns configuration
export const useIncomingDetailColumns =
	(): ColumnConfig<IncomingDataTableDataType>[] => {
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
				accessorKey: 'number',
				header: t('columns.incomingQuantity'),
				size: 120,
				minSize: 100,
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return new Intl.NumberFormat('en-US').format(value || 0);
				},
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
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return new Intl.NumberFormat('en-US').format(value || 0);
				},
			},
			{
				accessorKey: 'netPrice',
				header: t('columns.netPrice'),
				size: 120,
				minSize: 100,
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return new Intl.NumberFormat('en-US').format(value || 0);
				},
			},
			{
				accessorKey: 'grossPrice',
				header: t('columns.totalIncomingAmount'),
				size: 120,
				minSize: 100,
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return new Intl.NumberFormat('en-US').format(value || 0);
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
