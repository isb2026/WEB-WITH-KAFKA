import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@repo/radix-ui/hook';
import { useTranslation } from '@repo/i18n';

import { MoldOrderMasterDto } from '@primes/types/mold';

export const moldOrderSearchFields: FormField[] = [
	{
		name: 'orderCode',
		label: '주문 코드',
		type: 'text',
		placeholder: '주문 코드를 입력하세요',
	},
	{
		name: 'progressName',
		label: '공정명',
		type: 'text',
		placeholder: '공정명을 입력하세요',
	},
	{ name: 'orderDate', label: '주문일', type: 'date' },
	{
		name: 'isEnd',
		label: '완료 여부',
		type: 'select',
		options: [
			{ label: '완료', value: 'true' },
			{ label: '진행중', value: 'false' },
		],
	},
];

// Mold Order 테이블 컬럼 정의
export const moldOrderColumns: ColumnConfig<MoldOrderMasterDto>[] = [
	{
		accessorKey: 'orderCode',
		header: '주문 코드',
		size: 120,
	},
	{
		accessorKey: 'accountMonth',
		header: '회계월',
		size: 150,
	},
	{
		accessorKey: 'orderDate',
		header: '주문일',
		size: 120,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
		},
	},
	{
		accessorKey: 'moldType',
		header: '금형 유형',
		size: 150,
	},
	{
		accessorKey: 'progressName',
		header: '공정명',
		size: 150,
	},
	{
		accessorKey: 'inRequestDate',
		header: '입고 요청일',
		size: 120,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
		},
	},
	{
		accessorKey: 'inType',
		header: '입고 유형',
		size: 150,
	},
	{
		accessorKey: 'isDev',
		header: '개발 여부',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? '개발' : '일반';
		},
	},
	{
		accessorKey: 'isChange',
		header: '변경 여부',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? '변경' : '일반';
		},
	},
	{
		accessorKey: 'isEnd',
		header: '종료 여부',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? '종료' : '진행중';
		},
	},
	{
		accessorKey: 'isClose',
		header: '마감 여부',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? '마감' : '진행중';
		},
	},
	{
		accessorKey: 'isAdmit',
		header: '승인 여부',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? '승인' : '대기';
		},
	},
	{
		accessorKey: 'isUse',
		header: '사용 여부',
		size: 150,
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
			return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
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
			return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
		},
	},
];

// Quick Search 필드 정의
export const moldOrderQuickSearchFields = [
	{ key: 'orderCode', value: '주문 코드', active: true },
	{ key: 'progressName', value: '공정명', active: false },
	{ key: 'moldType', value: '금형 유형', active: false },
	{ key: 'accountMonth', value: '회계월', active: false },
];

// Data table columns configuration with translations
export const useMoldOrderColumns = (): ColumnConfig<MoldOrderMasterDto>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'orderCode',
			header: t('columns.orderCode'),
			size: 120,
		},
		{
			accessorKey: 'accountMonth',
			header: t('columns.accountMonth'),
			size: 100,
		},
		{
			accessorKey: 'moldType',
			header: t('columns.moldType'),
			size: 100,
		},
		{
			accessorKey: 'orderDate',
			header: t('columns.orderDate'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
			},
		},
		{
			accessorKey: 'progressName',
			header: t('columns.progressName'),
			size: 120,
		},
		{
			accessorKey: 'inRequestDate',
			header: t('columns.inRequestDate'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
			},
		},
		{
			accessorKey: 'inType',
			header: t('columns.inType'),
			size: 100,
		},
		{
			accessorKey: 'isDev',
			header: t('columns.isDev'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? '개발' : '일반';
			},
		},
		{
			accessorKey: 'isChange',
			header: t('columns.isChange'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? '변경' : '일반';
			},
		},
		{
			accessorKey: 'isEnd',
			header: t('columns.isEnd'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? '종료' : '진행중';
			},
		},
		{
			accessorKey: 'isClose',
			header: t('columns.isClose'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? '마감' : '진행중';
			},
		},
		{
			accessorKey: 'isAdmit',
			header: t('columns.isAdmit'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? '승인' : '대기';
			},
		},
		{
			accessorKey: 'isUse',
			header: t('columns.isUse'),
			size: 100,
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
				return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
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
				return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
			},
		},
	];
};
