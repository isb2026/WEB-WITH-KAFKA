import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@repo/radix-ui/hook';
import { useTranslation } from '@repo/i18n';

import { MoldLifeChangeHistoryDto } from '@primes/types/mold';

export const moldLifeChangeHistorySearchFields: FormField[] = [
	{
		name: 'moldCode',
		label: '금형 코드',
		type: 'text',
		placeholder: '금형 코드를 입력하세요',
	},
	{
		name: 'moldName',
		label: '금형명',
		type: 'text',
		placeholder: '금형명을 입력하세요',
	},
	{
		name: 'beforeLife',
		label: '이전 수명',
		type: 'number',
		placeholder: '이전 수명을 입력하세요',
	},
	{
		name: 'afterLife',
		label: '이후 수명',
		type: 'number',
		placeholder: '이후 수명을 입력하세요',
	},
	{
		name: 'qcName',
		label: 'QC 담당자',
		type: 'text',
		placeholder: 'QC 담당자를 입력하세요',
	},
	{
		name: 'isUse',
		label: '사용 여부',
		type: 'select',
		options: [
			{ label: '사용', value: 'true' },
			{ label: '미사용', value: 'false' },
		],
	},
];

export const moldLifeChangeHistoryColumns: ColumnConfig<MoldLifeChangeHistoryDto>[] =
	[
		
		{
			accessorKey: 'beforeLife',
			header: '변경 전 수명',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'afterLife',
			header: '변경 후 수명',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'qcCheck',
			header: 'QC 검사',
			size: 150,
		},
		{
			accessorKey: 'qcName',
			header: 'QC 담당자',
			size: 150,
		},
		{
			accessorKey: 'qcCheckDate',
			header: 'QC 검사일',
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
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
export const useMoldLifeChangeHistoryColumns = (): ColumnConfig<MoldLifeChangeHistoryDto>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'beforeLife',
			header: t('columns.beforeLife'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'afterLife',
			header: t('columns.afterLife'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'qcCheck',
			header: t('columns.qcCheck'),
			size: 150,
		},
		{
			accessorKey: 'qcName',
			header: t('columns.qcName'),
			size: 150,
		},
		{
			accessorKey: 'qcCheckDate',
			header: t('columns.qcCheckDate'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
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

export const moldLifeChangeHistoryQuickSearchFields = [
	{ key: 'moldMasterId', value: '금형 ID', active: true },
	{ key: 'qcName', value: 'QC 담당자', active: false },
	{ key: 'qcCheck', value: 'QC 검사', active: false },
	{ key: 'createdBy', value: '생성자', active: false },
];
