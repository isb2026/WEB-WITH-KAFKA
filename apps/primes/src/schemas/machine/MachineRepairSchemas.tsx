import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { MachineRepair } from '@primes/types/machine';
import { useTranslation } from '@repo/i18n';

export const MachineRepairListColumns = (): ColumnConfig<MachineRepair>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'subject',
			header: t('columns.repairSubject'),
			size: 200,
		},
		{
			accessorKey: 'machineId',
			header: t('columns.machineName'),
			size: 150,
			cell: ({ row }: { row: any }) => {
				const machine = row.original.machine;
				return machine?.machineName || '-';
			},
		},
		{
			accessorKey: 'repairPart',
			header: t('columns.repairPart'),
			size: 150,
		},
		{
			accessorKey: 'repairCost',
			header: t('columns.repairCost'),
			size: 120,
			align: 'right',
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'machineVendorName',
			header: t('columns.machineVendorName'),
			size: 150,
		},
		{
			accessorKey: 'repairVendorName',
			header: t('columns.repairVendorName'),
			size: 150,
		},
		{
			accessorKey: 'machinePartId',
			header: t('columns.partName'),
			size: 150,
			cell: ({ row }: { row: any }) => {
				const machinePart = row.original.machinePart;
				return machinePart?.partName || '-';
			},
		},
		{
			accessorKey: 'partAmount',
			header: t('columns.partAmount'),
			size: 150,
		},
		{
			accessorKey: 'repairStartDt',
			header: t('columns.repairStartDt'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'repairEndDt',
			header: t('columns.repairEndDt'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'brokenAt',
			header: t('columns.brokenAt'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'repairWorker',
			header: t('columns.repairWorker'),
			size: 120,
		},
		{
			accessorKey: 'description',
			header: t('columns.description'),
			size: 120,
		},
		{
			accessorKey: 'isClose',
			header: t('columns.isClose'),
			size: 110,
			align: 'center',
			cell: ({ getValue }: { getValue: () => boolean }) => {
				const value = getValue();
				return value ? (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
						마감완료
					</span>
				) : (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
						마감대기
					</span>
				);
			},
		},
		{
			accessorKey: 'isAdmit',
			header: t('columns.isAdmit'),
			size: 110,
			cell: ({ getValue }: { getValue: () => boolean }) => {
				const value = getValue();
				return value ? (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
						승인완료
					</span>
				) : (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
						승인대기
					</span>
				);
			},
			align: 'center',
		},
	];
};

export const MachineRepairFormFields = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'subject',
			label: t('columns.subject'),
			type: 'text',
			placeholder: t('columns.subject') + '을 입력하세요',
			required: true,
		},
		{
			name: 'machineId',
			label: t('columns.machineName'),
			type: 'machineName',
			placeholder: t('columns.machineName') + '을 입력하세요',
			required: true,
		},
		{
			name: 'machinePartId',
			label: t('columns.partName'),
			type: 'partName',
			placeholder: t('columns.partName') + '을 입력하세요',
			required: false,
		},
		{
			name: 'partAmount',
			label: t('columns.partAmount'),
			type: 'text',
			pattern: /^[0-9]*$/,
			placeholder: t('columns.partAmount') + '을 입력하세요',
			required: false,
		},
		{
			name: 'repairPart',
			label: t('columns.repairPart'),
			type: 'text',
			placeholder: t('columns.repairPart') + '을 입력하세요',
			required: true,
		},
		{
			name: 'repairCost',
			label: t('columns.repairCost'),
			type: 'text',
			pattern: /^[0-9]*$/,
			placeholder: t('columns.repairCost') + '을 입력하세요',
			required: true,
		},
		{
			name: 'brokenAt',
			label: t('columns.brokenAt'),
			type: 'text',
			pattern: /^[0-9]*$/,
			placeholder: t('columns.brokenAt') + '을 입력하세요',
			required: false,
		},
		{
			name: 'repairStartDt',
			label: t('columns.repairStartDt'),
			type: 'date',
			required: false,
		},
		{
			name: 'repairEndDt',
			label: t('columns.repairEndDt'),
			type: 'date',
			required: false,
		},
		{
			name: 'description',
			label: t('columns.description'),
			type: 'textarea',
			placeholder: t('columns.description') + '을 입력하세요',
			required: false,
		},
		{
			name: 'machineVendorId',
			label: t('columns.machineVendorName'),
			type: 'machineVendorId',
			placeholder: t('columns.machineVendorName') + '을 입력하세요',
			required: true,
			fieldKey: 'compName',
		},
		{
			name: 'repairVendorId',
			label: t('columns.repairVendorName'),
			type: 'repairVendorId',
			placeholder: t('columns.repairVendorName') + '을 입력하세요',
			required: true,
			fieldKey: 'compName',
		},
		{
			name: 'repairWorker',
			label: t('columns.repairWorker'),
			type: 'text',
			placeholder: t('columns.repairWorker') + '을 입력하세요',
			required: false,
		},
		{
			name: 'repairVendorTel',
			label: t('columns.repairVendorTel'),
			type: 'text',
			placeholder: t('columns.repairVendorTel') + '을 입력하세요',
			required: false,
		},
		{
			name: 'isClose',
			label: t('columns.isClose'),
			type: 'isClose',
			required: true,
			defaultValue: false,
		},
		{
			name: 'closeName',
			label: t('columns.closeName'),
			type: 'text',
			placeholder: t('columns.closeName') + '을 입력하세요',
			required: false,
		},
		{
			name: 'closeAt',
			label: t('columns.closeAt'),
			type: 'date',
			required: false,
		},
		{
			name: 'isAdmit',
			label: t('columns.isAdmit'),
			type: 'isAdmit',
			required: true,
			defaultValue: false,
		},
		{
			name: 'admitName',
			label: t('columns.admitName'),
			type: 'text',
			placeholder: t('columns.admitName') + '을 입력하세요',
			required: false,
		},
		{
			name: 'admitAt',
			label: t('columns.admitAt'),
			type: 'date',
			required: false,
		},
	];
};

export const MachineRepairSearchFields = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'subject',
			label: '수리 제목',
			type: 'text',
			placeholder: '수리 제목으로 검색',
			required: false,
		},
		{
			name: 'machineName',
			label: '설비명',
			type: 'text',
			placeholder: '설비명으로 검색',
			required: false,
		},
		{
			name: 'repairPart',
			label: '수리 부품',
			type: 'text',
			placeholder: '수리 부품으로 검색',
			required: false,
		},
		{
			name: 'isAdmit',
			label: t('columns.isAdmit'),
			type: 'isAdmit',
			placeholder: t('columns.isAdmit') + '으로 검색',
			required: false,
		},
	];
};
