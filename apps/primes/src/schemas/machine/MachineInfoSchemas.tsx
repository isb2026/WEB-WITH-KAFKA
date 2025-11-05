import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { Machine } from '@primes/types/machine';
import { useTranslation } from '@repo/i18n';

export const MachineListColumns = (): ColumnConfig<Machine>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'machineCode',
			header: t('columns.machineCode'),
			size: 120,
			align: 'center',
		},
		{
			accessorKey: 'machineName',
			header: t('columns.machineName'),
			size: 150,
			align: 'left',
		},
		{
			accessorKey: 'machineTypeValue',
			header: t('columns.machineType'),
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
			align: 'center',
		},
		{
			accessorKey: 'usingGroupValue',
			header: t('columns.usingGroup'),
			size: 150,
			align: 'center',
		},
		{
			accessorKey: 'isUse',
			header: t('columns.isUse'),
			size: 150,
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
		{
			accessorKey: 'isNotwork',
			header: t('columns.isCheckNoWorkMachine'),
			size: 150,
			cell: ({ getValue }: { getValue: () => boolean }) => {
				const value = getValue();
				return value ? (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
						비가동
					</span>
				) : (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
						가동
					</span>
				);
			},
			align: 'center',
		},
		{
			accessorKey: 'machineGrade',
			header: t('columns.machineGrade'),
			size: 150,
			align: 'center',
		},
		{
			accessorKey: 'machineSpec',
			header: t('columns.machineSpec'),
			size: 150,
		},
		{
			accessorKey: 'modelName',
			header: t('columns.modelName'),
			size: 150,
		},
		{
			accessorKey: 'madeYear',
			header: t('columns.makeYear'),
			size: 100,
			align: 'center',
		},
		{
			accessorKey: 'madeBy',
			header: t('columns.makeComp'),
			size: 150,
		},
		{
			accessorKey: 'buyDate',
			header: t('columns.buyDate'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'buyPrice',
			header: t('columns.buyPrice'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
			align: 'right',
		},
		{
			accessorKey: 'motorNumber',
			header: t('columns.motorNumber'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
			align: 'center',
		},
		{
			accessorKey: 'mainWorker',
			header: t('columns.mainWorker'),
			size: 150,
			align: 'center',
		},
		{
			accessorKey: 'subWorker',
			header: t('columns.subWorker'),
			size: 150,
			align: 'center',
		},
	];
};

export const MachineRegisterFormSchema = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'machineCode',
			label: t('columns.machineCode'),
			type: 'text',
			required: true,
		},
		{
			name: 'machineName',
			label: t('columns.machineName'),
			type: 'text',
			required: true,
		},
		{
			name: 'machineTypeCode',
			label: t('columns.machineType'),
			type: 'codeSelect',
			required: true,
			fieldKey: 'MCH-001',
		},
		{
			name: 'usingGroupCode',
			label: t('columns.usingGroup'),
			type: 'codeSelect',
			required: true,
			fieldKey: 'MCH-003',
		},
		{
			name: 'rph',
			label: t('columns.rph'),
			type: 'text',
			pattern: /^\d+$/,
			required: true,
		},
		{
			name: 'isNotwork',
			label: t('columns.isCheckNoWorkMachine'),
			type: 'isNotwork',
			required: true,
			defaultValue: true,
		},
		{
			name: 'isUse',
			label: t('columns.isUse'),
			type: 'isUse',
			required: true,
			defaultValue: true,
		},
		{
			name: 'machineGrade',
			label: t('columns.machineGrade'),
			type: 'text',
		},
		{
			name: 'machineSpec',
			label: t('columns.machineSpec'),
			type: 'text',
		},
		{
			name: 'modelName',
			label: t('columns.modelName'),
			type: 'text',
		},
		{
			name: 'madeYear',
			label: t('columns.madeYear'),
			type: 'text',
			pattern: /^[0-9]+$/,
		},
		{
			name: 'madeBy',
			label: t('columns.madeBy'),
			type: 'text',
		},
		{
			name: 'buyDate',
			label: t('columns.buyDate'),
			type: 'date',
		},
		{
			name: 'buyPrice',
			label: t('columns.buyPrice'),
			type: 'text',
			pattern: /^[0-9]+$/,
		},
		{
			name: 'motorNumber',
			label: t('columns.motorNumber'),
			type: 'text',
			pattern: /^[0-9]+$/,
		},
		{
			name: 'mainWorker',
			label: t('columns.mainWorker'),
			type: 'text',
		},
		{
			name: 'subWorker',
			label: t('columns.subWorker'),
			type: 'text',
		},
	];
};


export const MachineSearchFields = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'machineName',
			label: t('columns.machineName'),
			type: 'text',
			placeholder: t('columns.machineName') + '으로 검색',
			required: false,
		},
		{
			name: 'machineCode',
			label: t('columns.machineCode'),
			type: 'text',
			placeholder: t('columns.machineCode') + '으로 검색',
			required: false,
		},
		{
			name: 'machineTypeCode',
			label: t('columns.machineTypeCode'),
			type: 'text',
			placeholder: t('columns.machineTypeCode') + '으로 검색',
			required: false,
		},
	];
};
