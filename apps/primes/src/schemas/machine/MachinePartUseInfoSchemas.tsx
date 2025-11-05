import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { MachinePartUseInfo } from '@primes/types/machine';
import { useTranslation } from '@repo/i18n';

export const MachinePartUseInfoListColumns = (): ColumnConfig<MachinePartUseInfo>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'machineId',
			header: t('columns.machineName'),
			size: 150,
			cell: ({ row }: { row: any }) => {
				const machine = row.original.machine;
				return machine?.machineName || row.original.machineId || '-';
			},
			align: 'center',
		},
		{
			accessorKey: 'machinePartId',
			header: t('columns.partName'),
			size: 200,
			cell: ({ row }: { row: any }) => {
				const machinePart = row.original.machinePart;
				return machinePart?.partName || row.original.machinePartId || '-';
			},
		},
		{
			accessorKey: 'machineRepairId',
			header: t('columns.repairSubject'),
			size: 200,
			cell: ({ row }: { row: any }) => {
				const machineRepair = row.original.machineRepair;
				return machineRepair?.subject || row.original.subject || '-';
			},
		},
		{
			accessorKey: 'useDate',
			header: '사용 날짜',
			size: 130,
			align: 'center',
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'useStock',
			header: '사용 재고',
			size: 100,
			align: 'right',
		},
	];
};

export const MachinePartUseInfoFormFields = (): FormField[] => {
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
			name: 'machineRepairId',
			label: t('columns.repairSubject'),
			type: 'repairSubject',
			placeholder: t('columns.repairSubject') + '을(를) 선택하세요',
			required: false,
		},
		{
			name: 'useDate',
			label: t('columns.useDate'),
			type: 'date',
			required: false,
		},
		{
			name: 'useStock',
			label: t('columns.useStock'),
			type: 'text',
			pattern: /^[0-9]*$/,
			placeholder:  t('columns.useStock') + '을(를) 입력하세요',
			required: false,
		},
	];
};

export const MachinePartUseInfoSearchFields = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'machineId',
			label: t('columns.machineName'),
			type: 'text',
			placeholder: t('columns.machineName') +'로 검색',
			required: false,
		},
		{
			name: 'machinePartId',
			label: t('columns.partName'),
			type: 'text',
			placeholder: t('columns.partName') +'로 검색',
			required: false,
		},
		{
			name: 'machineRepairId',
			label: t('columns.repairSubject'),
			type: 'text',
			placeholder: t('columns.repairSubject') +'로 검색',
			required: false,
		},
		{
			name: 'useDate',
			label: t('columns.useDate'),
			type: 'date',
			placeholder: t('columns.useDate') +'로 검색',
			required: false,
		},
	];
};
