import React from 'react';
import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { MachinePart } from '@primes/types/machine';
import { useTranslation } from '@repo/i18n';

export const MachinePartListColumns = (): ColumnConfig<MachinePart>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'partName',
			header: t('columns.partName'),
			size: 150,
		},
		{
			accessorKey: 'partStandard',
			header: t('columns.partSpec'),
			size: 150,
		},
		{
			accessorKey: 'partGrade',
			header: t('columns.partGrade'),
			size: 120,
			align: 'center',
		},
		{
			accessorKey: 'optimum',
			header: t('columns.optimalInventoryQty'),
			size: 120,
			align: 'right',
		},
		{
			accessorKey: 'realStock',
			header: t('columns.currentStock'),
			size: 100,
			align: 'right',
		},
		{
			accessorKey: 'machineId',
			header: t('columns.machineName'),
			size: 80,
			cell: ({ row }: { row: any }) => {
				const machine = row.original.machine;
				return machine?.machineName || '-';
			},
			align: 'center',
		},
		{
			accessorKey: 'storeName',
			header: t('columns.storeName'),
			size: 80,
			align: 'center',
		},
		{
			accessorKey: 'storeTel',
			header: t('columns.storeTel'),
			size: 80,
			align: 'center',
		},
		{
			accessorKey: 'productionTime',
			header: t('columns.productionTime'),
			size: 80,
			align: 'center',
		},
		{
			accessorKey: 'cost',
			header: t('columns.cost'),
			size: 80,
			cell: ({ row }) => {
				const cost = Number(row.original.cost) || 0;
				return cost > 0 ? cost.toLocaleString() : '-';
			},
			align: 'right',
		},
		{
			accessorKey: 'keepPlace',
			header: t('columns.keepPlace'),
			size: 120,
			align: 'center',
		},
		{
			accessorKey: 'etc',
			header: t('columns.memo'),
			size: 120,
		},
	];
};

export const MachinePartFormFields = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'partName',
			label: t('columns.partName'),
			type: 'text',
			placeholder: t('columns.partName') + '을(를) 입력하세요',
			required: true,
		},
		{
			name: 'partStandard',
			label: t('columns.partSpec'),
			type: 'text',
			placeholder: t('columns.partSpec') + '을(를) 입력하세요',
			required: false,
		},
		{
			name: 'partGrade',
			label: t('columns.partGrade'),
			type: 'text',
			placeholder: t('columns.partGrade') + '을(를) 입력하세요',
			required: false,
		},
		{
			name: 'optimum',
			label: t('columns.optimalInventoryQty'),
			type: 'text',
			pattern: /^[0-9]*$/,
			placeholder: t('columns.optimalInventoryQty') + '을(를) 입력하세요',
			required: false,
		},
		{
			name: 'realStock',
			label: t('columns.currentStock'),
			type: 'text',
			pattern: /^[0-9]*$/,
			placeholder: t('columns.currentStock') + '을(를) 입력하세요',
			required: false,
		},
		{
			name: 'machineId',
			label: t('columns.machineName'),
			type: 'machineId',
			placeholder: t('columns.machineName') + '을(를) 입력하세요',
			required: false,
		},
		{
			name: 'storeName',
			label: t('columns.storeName'),
			type: 'text',
			placeholder: t('columns.storeName') + '을(를) 입력하세요',
			required: false,
		},
		{
			name: 'storeTel',
			label: t('columns.storeTel'),
			type: 'text',
			placeholder: t('columns.storeTel') + '을(를) 입력하세요',
			required: false,
		},
		{
			name: 'productionTime',
			label: t('columns.productionTime'),
			type: 'text',
			pattern: /^[0-9]*$/,
			placeholder: t('columns.productionTime') + '을(를) 입력하세요',
			required: false,
		},
		{
			name: 'cost',
			label: t('columns.cost'),
			type: 'text',
			pattern: /^[0-9]*$/,
			placeholder: t('columns.cost') + '을(를) 입력하세요',
			required: false,
		},
		{
			name: 'keepPlace',
			label: t('columns.keepPlace'),
			type: 'text',
			placeholder: t('columns.keepPlace') + '을(를) 입력하세요',
			required: false,
		},
		{
			name: 'etc',
			label: t('columns.memo'),
			type: 'textarea',
			placeholder: t('columns.memo') + '을(를) 입력하세요',
			required: false,
		},
	];
};

export const MachinePartSearchFields = (): FormField[] => {
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
			name: 'machineId',
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
