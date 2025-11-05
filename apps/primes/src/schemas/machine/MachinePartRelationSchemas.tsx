import { useTranslation } from '@repo/i18n';
import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { MachinePartRelation } from '@primes/types/machine';

export const MachinePartRelationListColumns = (): ColumnConfig<MachinePartRelation>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'machineCode',
			header: t('columns.machineCode'),
			size: 120,
			cell: ({ row }) => {
				const machine = row.original.machine;
				return machine?.machineCode || '-';
			},
			align: 'center',
		},
		{
			accessorKey: 'machineId',
			header: t('columns.machineName'),
			size: 120,
			cell: ({ row }) => {
				const machine = row.original.machine;
				return machine?.machineName || '-';
			},
		},
		{
			accessorKey: 'machineSpec',
			header: t('columns.machineSpec'),
			size: 100,
			cell: ({ row }) => {
				const machine = row.original.machine;
				return machine?.machineSpec || '-';
			},
		},
		{
			accessorKey: 'machinePartId',
			header: t('columns.partName'),
			size: 150,
			cell: ({ row }) => {
				const machinePart = row.original.machinePart;
				return machinePart?.partName || '-';
			},
		},
		{
			accessorKey: 'machinePartSpec',
			header: t('columns.partSpec'),
			size: 120,
			cell: ({ row }) => {
				const machinePart = row.original.machinePart;
				return machinePart?.partStandard || '-';
			},
		},
		{
			accessorKey: 'isUse',
			header: t('columns.isUse'),
			size: 100,
			cell: ({ getValue }: { getValue: () => boolean }) => {
				const value = getValue();
				return value ? (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
						사용
					</span>
				) : (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
						미사용
					</span>
				);
			},
			align: 'center',
		},

	];
};

export const MachinePartRelationFormFields = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'machineId',
			label: t('columns.machineName'),
			type: 'machineName',
			placeholder: t('columns.machineName') + '을(를) 선택하세요',
			required: true,
		},
		{
			name: 'machinePartId',
			label: t('columns.partName'),
			type: 'partName',
			placeholder: t('columns.partName') + '을(를) 선택하세요',
			required: true,
		},
		{
			name: 'isUse',
			label: t('columns.isUse'),
			type: 'isUse',
			placeholder: t('columns.isUse') + '을(를) 선택하세요',
			required: true,
			defaultValue: true,
		},
	];
};

export const MachinePartRelationSearchFields = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'machineId',
			label: t('columns.machineName'),
			type: 'machineName',
			placeholder: t('columns.machineName') + '을(를) 선택하세요',
			required: false,
		},
		{
			name: 'machinePartId',
			label: t('columns.partName'),
			type: 'partName',
			placeholder: t('columns.partName') + '을(를) 선택하세요',
			required: false,
		},
		{
			name: 'isUse',
			label: t('columns.isUse'),
			type: 'isUse',
			placeholder: t('columns.isUse') + '을(를) 선택하세요',
			required: false,
		},
	];
};
