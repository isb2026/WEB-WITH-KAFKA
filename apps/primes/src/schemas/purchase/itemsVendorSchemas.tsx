import React from 'react';
import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook';
import { useTranslation } from '@repo/i18n';
import { ItemsVendor } from '@primes/types/purchase/itemsVendor';

export const ItemsVendorListColumns = (): ColumnConfig<ItemsVendor>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'vendorName',
			header: t('columns.vendorName'),
			size: 100,
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'itemNo',
			header: t('columns.itemNo'),
			size: 100,
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'vendorItemName',
			header: t('columns.vendorItemName'),
			size: 150,
		},
		{
			accessorKey: 'vendorItemNumber',
			header: t('columns.vendorItemNumber'),
			size: 150,
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'price',
			header: t('columns.purchasePrice'),
			size: 100,
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'isDefault',
			header: t('columns.isDefault'),
			size: 80,
			cell: ({ getValue }: { getValue: () => string | boolean }) => {
				const value = getValue();
				return value === 'true' || value === true ? 
				<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
					지정
				</span> : 
				<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
					지정안함
				</span>;
			},
		},
		{
			accessorKey: 'boxType',
			header: t('columns.boxType'),
			size: 150,
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'boxLabel',
			header: t('columns.boxLabel'),
			size: 150,
		},
		{
			accessorKey: 'boxSize',
			header: t('columns.boxSize'),
			size: 100,
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'sboxSize',
			header: t('columns.sboxSize'),
			size: 100,
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'sboxCount',
			header: t('columns.sboxCnt'),
			size: 100,
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'memo',
			header: t('columns.memo'),
			size: 200,
		},
	]
};

// Form schema for adding new items vendor
export const itemsVendorFormSchema = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'vendorId',
			label: t('vendorName'),
			type: 'select',
			placeholder: 'vendorPlaceholder',
			required: true,
			disabled: false,
			options: [],
		},
		{
			name: 'itemId',
			label: t('itemName'),
			type: 'select',
			placeholder: 'itemPlaceholder',
			required: true,
			disabled: false,
			options: [],
		},
		{
			name: 'vendorItemName',
			label: t('vendorItemName'),
			type: 'text',
			placeholder: 'vendorItemNamePlaceholder',
			required: true,
			disabled: false,
		},
		{
			name: 'vendorItemNumber',
			label: t('vendorItemNumber'),
			type: 'text',
			placeholder: 'vendorItemNumberPlaceholder',
			required: true,
			disabled: false,
		},
		{
			name: 'price',
			label: t('purchasePrice'),
			type: 'text',
			pattern: /^\d+$/,
			placeholder: 'pricePlaceholder',
			required: true,
			disabled: false,
		},
		{
			name: 'isDefault',
			label: t('isDefault'),
			type: 'isDefault',
			placeholder: '',
			required: true,
			disabled: false,
		},
		{
			name: 'boxType',
			label: t('boxType'),
			type: 'select',
			placeholder: 'boxTypePlaceholder',
			required: false,
			disabled: false,
			options: [],
		},
		{
			name: 'boxLabel',
			label: t('boxLabel'),
			type: 'select',
			placeholder: 'boxLabelPlaceholder',
			required: false,
			disabled: false,
			options: [],
		},
		{
			name: 'boxSize',
			label: t('boxSize'),
			type: 'text',
			pattern: /^\d+$/,
			placeholder: 'boxSizePlaceholder',
			required: false,
			disabled: false,
		},
		{
			name: 'sboxSize',
			label: t('sboxSize'),
			type: 'text',
			pattern: /^\d+$/,
			placeholder: 'sboxSizePlaceholder',
			required: false,
			disabled: false,
		},
		{
			name: 'sboxCnt',
			label: t('sboxCnt'),
			type: 'text',
			pattern: /^\d+$/,
			placeholder: 'sboxCntPlaceholder',
			required: false,
			disabled: false,
		},
		{
			name: 'memo',
			label: t('memo'),
			type: 'textarea',
			placeholder: 'memoPlaceholder',
			required: false,
			disabled: false,
		},
	]
};

// Edit form schema for editing items vendor
export const itemsVendorEditFormSchema = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'vendorId',
			label: t('vendorName'),
			type: 'select',
			placeholder: 'vendorPlaceholder',
			required: true,
			disabled: false,
			options: [],
		},
		{
			name: 'itemId',
			label: t('itemName'),
			type: 'select',
			placeholder: 'itemPlaceholder',
			required: true,
			disabled: false,
			options: [],
		},
		{
			name: 'vendorItemName',
			label: t('vendorItemName'),
			type: 'text',
			placeholder: 'vendorItemNamePlaceholder',
			required: true,
			disabled: false,
		},
		{
			name: 'vendorItemNumber',
			label: t('vendorItemNumber'),
			type: 'text',
			placeholder: 'vendorItemNumberPlaceholder',
			required: true,
			disabled: false,
		},
		{
			name: 'price',
			label: t('purchasePrice'),
			type: 'text',
			pattern: /^\d+$/,
			placeholder: 'pricePlaceholder',
			required: true,
			disabled: false,
		},
		{
			name: 'isDefault',
			label: t('isDefault'),
			type: 'isDefault',
			placeholder: '',
			required: true,
			disabled: false,
		},
		{
			name: 'boxType',
			label: t('boxType'),
			type: 'select',
			placeholder: 'boxTypePlaceholder',
			required: false,
			disabled: false,
			options: [],
		},
		{
			name: 'boxLabel',
			label: t('boxLabel'),
			type: 'select',
			placeholder: 'boxLabelPlaceholder',
			required: false,
			disabled: false,
			options: [],
		},
		{
			name: 'boxSize',
			label: t('boxSize'),
			type: 'text',
			pattern: /^\d+$/,
			placeholder: 'boxSizePlaceholder',
			required: false,
			disabled: false,
		},
		{
			name: 'sboxSize',
			label: t('sboxSize'),
			type: 'text',
			pattern: /^\d+$/,
			placeholder: 'sboxSizePlaceholder',
			required: false,
			disabled: false,
		},
		{
			name: 'sboxCnt',
			label: t('sboxCnt'),
			type: 'text',
			pattern: /^\d+$/,
			placeholder: 'sboxCntPlaceholder',
			required: false,
			disabled: false,
		},
		{
			name: 'memo',
			label: t('memo'),
			type: 'textarea',
			placeholder: 'memoPlaceholder',
			required: false,
			disabled: false,
		},
	]
};

export const ItemsVendorSearchFields = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'vendorName',
			label: t('columns.vendorName'),
			type: 'text',
			placeholder: t('columns.vendorName') + '을(를) 검색',
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