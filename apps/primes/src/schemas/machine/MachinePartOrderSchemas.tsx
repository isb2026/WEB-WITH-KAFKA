import React from 'react';
import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { MachinePartOrder } from '@primes/types/machine';
import { useTranslation } from '@repo/i18n';

export const MachinePartOrderListColumns = (): ColumnConfig<MachinePartOrder>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'orderCode',
			header: t('columns.orderCode'),
			size: 150,
			align: 'center',
		},
		{
			accessorKey: 'orderDate',
			header: t('columns.orderDate'),
			size: 150,
			align: 'center',
		},
		{
			accessorKey: 'partName',
			header: t('columns.partName'),
			size: 120,
			cell: ({ row }: { row: any }) => {
				const machinePart = row.original.machinePart;
				return machinePart?.partName || '-';
			},
			align: 'center',
		},
		{
			accessorKey: 'partStandard',
			header: t('columns.partSpec'),
			size: 120,
			cell: ({ row }: { row: any }) => {
				const machinePart = row.original.machinePart;
				return machinePart?.partStandard || '-';
			},
			align: 'center',
		},
		{
			accessorKey: 'number',
			header: t('columns.number'),
			size: 100,
			align: 'right',
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
			accessorKey: 'isEnd',
			header: t('columns.isEnd'),
			size: 80,
			cell: ({ getValue }: { getValue: () => boolean }) => {
				const value = getValue();
				return value ? (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
						완료
					</span>
				) : (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
						미완료
					</span>
				);
			},
			align: 'center',
		},
	];
};

export const MachinePartOrderFormFields = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'orderDate',
			label: t('columns.orderDate'),
			type: 'date',
			placeholder: t('columns.orderDate') + '을(를) 선택하세요',
			required: false,
		},
		{
			name: 'partId',
			label: t('columns.part'),
			type: 'machinePartSelect',
			placeholder: t('columns.part') + '을(를) 입력하세요',
			required: true,
		},
		{
			name: 'partName',
			label: '부품명',
			type: 'hidden',
			required: false,
		},
		{
			name: 'partStandard',
			label: '부품규격',
			type: 'hidden',
			required: false,
		},
		{
			name: 'number',
			label: t('columns.number'),
			type: 'text',
			pattern: /^[0-9]*$/,
			placeholder: t('columns.number') + '을(를) 입력하세요',
			required: true,
		},
		{
			name: 'vendorId',
			label: t('columns.vendor'),
			type: 'vendorSelect',
			placeholder: t('columns.vendor') + '을(를) 입력하세요',
			required: true,
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
			name: 'isEnd',
			label: t('columns.isEnd'),
			type: 'isEnd',
			placeholder: t('columns.isEnd') + '을(를) 선택하세요',
			required: false,
		},
	];
};

export const MachinePartOrderSearchFields = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'partName',
			label: t('columns.partName'),
			type: 'text',
			placeholder: t('columns.partName') + '으로 검색',
			required: false,
		},
		{
			name: 'partSpec',
			label: t('columns.partSpec'),
			type: 'text',
			placeholder: t('columns.partSpec') + '으로 검색',
			required: false,
		},
		{
			name: 'machineName',
			label: t('columns.machineName'),
			type: 'text',
			placeholder: t('columns.machineName') + '으로 검색',
			required: false,
		},
		{
			name: 'keepPlace',
			label: t('columns.keepPlace'),
			type: 'text',
			placeholder: t('columns.keepPlace') + '으로 검색',
			required: false,
		},
	];
};
