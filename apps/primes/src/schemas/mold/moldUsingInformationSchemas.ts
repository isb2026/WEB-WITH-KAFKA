import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@repo/radix-ui/hook';
import { useTranslation } from '@repo/i18n';

import { MoldUsingInformationDto } from '@primes/types/mold';

export const moldUsingInformationSearchFields: FormField[] = [
	{
		name: 'commandId',
		label: '명령 ID',
		type: 'number',
		placeholder: '명령 ID를 입력하세요',
	},
	{
		name: 'commandNo',
		label: '명령 번호',
		type: 'text',
		placeholder: '명령 번호를 입력하세요',
	},
	{
		name: 'moldInstanceId',
		label: '실금형 ID',
		type: 'number',
		placeholder: '실금형 ID를 입력하세요',
	},
	{
		name: 'moldInstanceCode',
		label: '실금형 코드',
		type: 'text',
		placeholder: '실금형 코드를 입력하세요',
	},
	{
		name: 'moldMasterId',
		label: '금형 마스터 ID',
		type: 'number',
		placeholder: '금형 마스터 ID를 입력하세요',
	},
	{
		name: 'jobId',
		label: '작업 ID',
		type: 'number',
		placeholder: '작업 ID를 입력하세요',
	},
	{
		name: 'num',
		label: '수량',
		type: 'number',
		placeholder: '수량을 입력하세요',
	},
	{
		name: 'workerName',
		label: '작업자명',
		type: 'text',
		placeholder: '작업자명을 입력하세요',
	},
	{
		name: 'machineName',
		label: '기계명',
		type: 'text',
		placeholder: '기계명을 입력하세요',
	},
	{ name: 'workDate', label: '작업일', type: 'date' },
	{
		name: 'workCode',
		label: '작업 코드',
		type: 'text',
		placeholder: '작업 코드를 입력하세요',
	},
];

export const moldUsingInformationColumns: ColumnConfig<MoldUsingInformationDto>[] =
	[
		{
			accessorKey: 'moldInstanceCode',
			header: '실금형',
			size: 150,
		},
		
		{
			accessorKey: 'commandNo',
			header: '명령 번호',
			size: 150,
		},
		{
			accessorKey: 'moldInstanceCode',
			header: '인스턴스 코드',
			size: 120,
		},
		
		{
			accessorKey: 'num',
			header: '수량',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'workerName',
			header: '작업자명',
			size: 150,
		},
		{
			accessorKey: 'machineName',
			header: '기계명',
			size: 150,
		},
		{
			accessorKey: 'workDate',
			header: '작업일',
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'workCode',
			header: '작업 코드',
			size: 120,
		},
		{
			accessorKey: 'createdBy',
			header: '생성자',
			size: 120,
		},
		{
			accessorKey: 'createdAt',
			header: '생성일',
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'updatedBy',
			header: '수정자',
			size: 120,
		},
		{
			accessorKey: 'updatedAt',
			header: '수정일',
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
	];

// Data table columns configuration with translations
export const useMoldUsingInformationColumns = (): ColumnConfig<MoldUsingInformationDto>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'moldInstanceCode',
			header: t('columns.moldInstance'),
			size: 150,
		},
		{
			accessorKey: 'commandNo',
			header: t('columns.commandNo'),
			size: 150,
		},
		{
			accessorKey: 'moldInstanceCode',
			header: t('columns.instanceCode'),
			size: 120,
		},
		{
			accessorKey: 'num',
			header: t('columns.num'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'workerName',
			header: t('columns.workerName'),
			size: 150,
		},
		{
			accessorKey: 'machineName',
			header: t('columns.machineName'),
			size: 150,
		},
		{
			accessorKey: 'workDate',
			header: t('columns.workDate'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'workCode',
			header: t('columns.workCode'),
			size: 120,
		},
		{
			accessorKey: 'createdBy',
			header: t('columns.createdBy'),
			size: 120,
		},
		{
			accessorKey: 'createdAt',
			header: t('columns.createdAt'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'updatedBy',
			header: t('columns.updatedBy'),
			size: 120,
		},
		{
			accessorKey: 'updatedAt',
			header: t('columns.updatedAt'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
	];
};

export const moldUsingInformationQuickSearchFields = [
	{ key: 'commandNo', value: '명령 번호', active: true },
	{ key: 'workerName', value: '작업자명', active: false },
	{ key: 'machineName', value: '기계명', active: false },
	{ key: 'workCode', value: '작업 코드', active: false },
];
