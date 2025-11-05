import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@repo/radix-ui/hook';
import { useTranslation } from '@repo/i18n';

import { MoldDisposeDto } from '@primes/types/mold';

export const moldDisposeSearchFields: FormField[] = [
	{
		name: 'moldMasterId',
		label: '금형마스터',
		type: 'text',
		placeholder: '금형마스터ID를 입력하세요',
	},
	{
		name: 'commandId',
		label: '작업지시번호',
		type: 'text',
		placeholder: '작업지시번호를 입력하세요',
	},
	{
		name: 'itemId',
		label: '품목',
		type: 'text',
		placeholder: '품목을 입력하세요',
	},
	{
		name: 'progressId',
		label: '공정',
		type: 'text',
		placeholder: '공정을 입력하세요',
	},
	{
		name: 'machineName',
		label: '설비명',
		type: 'text',
		placeholder: '설비명을 입력하세요',
	},
	{ name: 'reduceDate', label: '폐기일', type: 'date' },
	{
		name: 'reduceNum',
		label: '폐기 수량',
		type: 'number',
		placeholder: '폐기 수량을 입력하세요',
	},
	{
		name: 'useName',
		label: '사용자명',
		type: 'text',
		placeholder: '사용자명을 입력하세요',
	},
];

export const moldDisposeColumns: ColumnConfig<MoldDisposeDto>[] = [
	{
		accessorKey: 'moldMasterId',
		header: '금형마스터ID',
		size: 120,
	},
	{
		accessorKey: 'commandId',
		header: '작업지시번호',
		size: 120,
	},
	{
		accessorKey: 'itemId',
		header: '품목',
		size: 120,
	},
	{
		accessorKey: 'progressId',
		header: '공정',
		size: 120,
	},
	{
		accessorKey: 'machineName',
		header: '설비명',
		size: 120,
	},
	{
		accessorKey: 'reduceDate',
		header: '폐기일',
		size: 120,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
		},
	},
	{
		accessorKey: 'reduceNum',
		header: '폐기 수량',
		size: 120,
	},
	{
		accessorKey: 'useName',
		header: '사용자명',
		size: 120,
	},
];

// Data table columns configuration with translations
export const useMoldDisposeColumns = (): ColumnConfig<MoldDisposeDto>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'moldMasterId',
			header: t('columns.moldMaster') || '금형마스터ID',
			size: 120,
		},
		{
			accessorKey: 'commandId',
			header: t('columns.command') || '작업지시번호',
			size: 120,
		},
		{
			accessorKey: 'itemId',
			header: t('columns.item') || '품목',
			size: 120,
		},
		{
			accessorKey: 'progressId',
			header: t('columns.progress') || '공정',
			size: 120,
		},
		{
			accessorKey: 'machineName',
			header: t('columns.machineName') || '설비명',
			size: 120,
		},
		{
			accessorKey: 'reduceDate',
			header: t('columns.reduceDate') || '폐기일',
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
			},
		},
		{
			accessorKey: 'reduceNum',
			header: t('columns.reduceNum') || '폐기 수량',
			size: 120,
		},
		{
			accessorKey: 'useName',
			header: t('columns.useName') || '사용자명',
			size: 120,
		},
	];
};

export const moldDisposeQuickSearchFields = [
	{ key: 'moldMasterId', value: '금형마스터', active: true },
	{ key: 'commandId', value: '작업지시번호', active: false },
	{ key: 'itemId', value: '품목', active: false },
	{ key: 'progressId', value: '공정', active: false },
	{ key: 'machineName', value: '설비명', active: false },
	{ key: 'useName', value: '사용자명', active: false },
	{ key: 'reduceDate', value: '폐기일', active: false },
	{ key: 'reduceNum', value: '폐기 수량', active: false },
];
