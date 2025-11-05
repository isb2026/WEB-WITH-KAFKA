import React from 'react';
import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { MachinePartOrderIn } from '@primes/types/machine';
import { useTranslation } from '@repo/i18n';

export const MachinePartOrderInListColumns = (): ColumnConfig<MachinePartOrderIn>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'inDate',
			header: t('columns.inDate'),
			size: 120,
			align: 'center',
		},
		{
			accessorKey: 'partName',
			header: t('columns.partName'),
			size: 150,
			align: 'center',
		},
		{
			accessorKey: 'orderCode',
			header: t('columns.orderCode'),
			size: 120,
			align: 'center',
		},
		{
			accessorKey: 'vendorCode',
			header: t('columns.vendorCode'),
			size: 100,
			align: 'center',
		},
		{
			accessorKey: 'vendorName',
			header: t('columns.vendorName'),
			size: 150,
			align: 'center',
		},
		{
			accessorKey: 'inNum',
			header: t('columns.inNum'),
			size: 80,
			align: 'right',
			cell: ({ row }) => {
				const inNum = row.original.inNum || 0;
				return inNum > 0 ? inNum.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'inPrice',
			header: t('columns.inPrice'),
			size: 100,
			align: 'right',
			cell: ({ row }) => {
				const inPrice = row.original.inPrice || 0;
				return inPrice > 0 ? inPrice.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'inAmount',
			header: t('columns.inAmount'),
			size: 100,
			align: 'right',
			cell: ({ row }) => {
				const inNum = row.original.inNum || 0;
				const inPrice = row.original.inPrice || 0;
				const amount = inNum * inPrice;
				return amount > 0 ? amount.toLocaleString() : 0;
			},
		},
	];
};

export const MachinePartOrderInFormFields = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'inDate',
			label: t('columns.inDate'),
			type: 'date',
			placeholder: t('columns.inDate') + '을(를) 선택하세요',
			required: true,
		},
		{
			name: 'machinePartId',
			label: t('columns.part'),
			type: 'machinePartSelect',
			placeholder: t('columns.part') + '을(를) 입력하세요',
			fieldKey: 'partName',
			required: true,
		},
		{
			name: 'machinePartOrderId',
			label: t('columns.partOrder'),
			type: 'machinePartOrderSelect',
			placeholder: t('columns.partOrder') + '을(를) 입력하세요',
			fieldKey: 'orderCode',
			required: true,
		},
		{
			name: 'vendorId',
			label: t('columns.storeName'),
			type: 'vendorSelect',
			placeholder: t('columns.storeName') + '을(를) 입력하세요',
			required: true,
			fieldKey: 'compName',
		},
		{
			name: 'vendorName',
			label: '거래처명',
			type: 'hidden',
			required: false,
		},
		{
			name: 'vendorCode',
			label: '거래처코드',
			type: 'hidden',
			required: false,
		},
		{
			name: 'inNum',
			label: t('columns.inNum'),
			type: 'text',
			pattern: /^[0-9]*$/,
			placeholder: t('columns.inNum') + '을(를) 입력하세요',
			required: true,
		},
		{
			name: 'inPrice',
			label: t('columns.inPrice'),
			type: 'text',
			pattern: /^[0-9]*$/,
			placeholder: t('columns.inPrice') + '을(를) 입력하세요',
			required: false,
		},
	];
};

export const MachinePartOrderInSearchFields = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'vendorName',
			label: t('columns.vendorName'),
			type: 'text',
			placeholder: t('columns.vendorName') + '으로 검색',
			required: false,
		},
	];
};
