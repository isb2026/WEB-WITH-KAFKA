import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@repo/radix-ui/hook';
import { useTranslation } from '@repo/i18n';

import { MoldRepairDto } from '@primes/types/mold';

export const moldRepairSearchFields: FormField[] = [
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
		name: 'repairContents',
		label: '수리 내용',
		type: 'text',
		placeholder: '수리 내용을 입력하세요',
	},
	{ name: 'outDate', label: '출고일', type: 'date' },
	{ name: 'inDate', label: '입고일', type: 'date' },
	{
		name: 'cost',
		label: '수리 비용',
		type: 'number',
		placeholder: '수리 비용을 입력하세요',
	},
	{
		name: 'isEnd',
		label: '완료 여부',
		type: 'select',
		options: [
			{ label: '완료', value: 'true' },
			{ label: '진행중', value: 'false' },
		],
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

export const useMoldRepairColumns = () => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'moldCode',
			header: t('columns.moldCode'),
			size: 120,
		},
		{
			accessorKey: 'moldName',
			header: t('columns.moldName'),
			size: 140,
		},
		{
			accessorKey: 'moldNumber',
			header: t('columns.moldNumber'),
			size: 120,
		},
		{
			accessorKey: 'moldStandard',
			header: t('columns.moldStandard'),
			size: 120,
		},
		{
			accessorKey: 'repairContents',
			header: t('columns.repairContents'),
			size: 200,
		},
		{
			accessorKey: 'cost',
			header: t('columns.cost'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'accountMonth',
			header: t('columns.accountMonth'),
			size: 120,
		},
		{
			accessorKey: 'previousMoldLife',
			header: t('columns.previousMoldLife'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'afterMoldLife',
			header: t('columns.afterMoldLife'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'outDate',
			header: t('columns.repairOutDate'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
			},
		},
		{
			accessorKey: 'inDate',
			header: t('columns.inDate'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
			},
		},
		{
			accessorKey: 'repairPicture',
			header: t('columns.repairPicture'),
			size: 150,
		},
		{
			accessorKey: 'isEnd',
			header: t('columns.isEnd'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? '완료' : '진행중';
			},
		},
		{
			accessorKey: 'endRequestDate',
			header: t('columns.endRequestDate'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
			},
		},
		{
			accessorKey: 'isClose',
			header: t('columns.isClose'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? '마감' : '미마감';
			},
		},
		{
			accessorKey: 'closeName',
			header: t('columns.closeName'),
			size: 120,
		},
		{
			accessorKey: 'closeTime',
			header: t('columns.closeTime'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
			},
		},
		{
			accessorKey: 'isAdmit',
			header: t('columns.isAdmit'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? '승인' : '미승인';
			},
		},
		{
			accessorKey: 'admitName',
			header: t('columns.admitName'),
			size: 120,
		},
		{
			accessorKey: 'admitTime',
			header: t('columns.admitTime'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
			},
		},
	] as ColumnConfig<MoldRepairDto>[];
};

// Legacy export for backward compatibility
export const moldRepairColumns: ColumnConfig<MoldRepairDto>[] = [
	{
		accessorKey: 'isUse',
		header: '사용 여부',
		size: 150,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? '사용' : '미사용';
		},
	},

	{
		accessorKey: 'moldCode',
		header: '금형 코드',
		size: 120,
	},
	{
		accessorKey: 'moldName',
		header: '금형명',
		size: 150,
	},
	{
		accessorKey: 'moldNumber',
		header: '금형 번호',
		size: 150,
	},
	{
		accessorKey: 'moldStandard',
		header: '금형 규격',
		size: 150,
	},
	{
		accessorKey: 'outDate',
		header: '출고일',
		size: 120,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
		},
	},
	{
		accessorKey: 'inDate',
		header: '입고일',
		size: 120,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
		},
	},
	{
		accessorKey: 'cost',
		header: '수리 비용',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? value.toLocaleString() : '-';
		},
	},
	{
		accessorKey: 'isEnd',
		header: '완료 여부',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? '완료' : '진행중';
		},
	},

	{
		accessorKey: 'repairContents',
		header: '수리 내용',
		size: 200,
	},
	{
		accessorKey: 'accountMonth',
		header: '회계월',
		size: 120,
	},
	{
		accessorKey: 'inMonth',
		header: '입고월',
		size: 120,
	},
	{
		accessorKey: 'isClose',
		header: '마감 여부',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? '마감' : '미마감';
		},
	},
	{
		accessorKey: 'closeName',
		header: '마감자',
		size: 120,
	},
	{
		accessorKey: 'closeTime',
		header: '마감일시',
		size: 120,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
		},
	},
	{
		accessorKey: 'isAdmit',
		header: '승인 여부',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? '승인' : '미승인';
		},
	},
	{
		accessorKey: 'admitName',
		header: '승인자',
		size: 120,
	},
	{
		accessorKey: 'admitTime',
		header: '승인일시',
		size: 120,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
		},
	},
	{
		accessorKey: 'repairPicture',
		header: '수리 사진',
		size: 150,
	},
	{
		accessorKey: 'endRequestDate',
		header: '완료 요청일',
		size: 120,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
		},
	},
	{
		accessorKey: 'previousMoldLife',
		header: '수리 전 금형 수명',
		size: 120,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? value.toLocaleString() : '-';
		},
	},
	{
		accessorKey: 'afterMoldLife',
		header: '수리 후 금형 수명',
		size: 120,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? value.toLocaleString() : '-';
		},
	},
];

export const moldRepairQuickSearchFields = [
	{ key: 'moldCode', value: '금형 코드', active: true },
	{ key: 'moldName', value: '금형명', active: false },
	{ key: 'repairContents', value: '수리 내용', active: false },
	{ key: 'admitName', value: '승인자', active: false },
];
