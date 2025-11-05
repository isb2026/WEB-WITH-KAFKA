import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@repo/radix-ui/hook';
import { useTranslation } from '@repo/i18n';

import { MoldMasterDto } from '@primes/types/mold';

export const moldSearchFields: FormField[] = [
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
		name: 'moldType',
		label: '금형 타입',
		type: 'text',
		placeholder: '금형 타입을 입력하세요',
	},
	{
		name: 'moldDesign',
		label: '금형 설계',
		type: 'text',
		placeholder: '금형 설계를 입력하세요',
	},
	{
		name: 'moldDesignCode',
		label: '금형 설계 코드',
		type: 'text',
		placeholder: '금형 설계 코드를 입력하세요',
	},
	{
		name: 'keepPlace',
		label: '보관 장소',
		type: 'text',
		placeholder: '보관 장소를 입력하세요',
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
	{
		name: 'manageType',
		label: '관리 유형',
		type: 'text',
		placeholder: '관리 유형을 입력하세요',
	},
];

export const useMoldColumns = () => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'moldTypeName',
			header: t('columns.moldType'),
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'moldCode',
			header: t('columns.moldCode'),
			size: 100,
		},
		{
			accessorKey: 'moldName',
			header: t('columns.moldName'),
			size: 150,
		},
		{
			accessorKey: 'moldStandard',
			header: t('columns.moldStandard'),
			size: 150,
		},
		{
			accessorKey: 'lifeCycle',
			header: t('columns.lifeCycle'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'moldPrice',
			header: t('columns.moldPrice'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'safeStock',
			header: t('columns.safeStock'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'currentStock',
			header: t('columns.currentStock'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'manageType',
			header: t('columns.manageType'),
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				if (value === '1') return '수명관리';
				if (value === '2') return '수량관리';
				return value || '-';
			},
		},
		{
			accessorKey: 'moldPicture',
			header: t('columns.moldPicture'),
			size: 150,
		},
		{
			accessorKey: 'keepPlace',
			header: t('columns.keepPlace'),
			size: 150,
		},
		{
			accessorKey: 'isUse',
			header: t('columns.isUse'),
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? 'Y' : 'N';
			},
		}
	] as ColumnConfig<MoldMasterDto>[];
};

// Legacy export for backward compatibility
export const moldColumns = [
	{
		accessorKey: 'moldType',
		header: '금형 유형',
		size: 150,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value || '-';
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
		accessorKey: 'moldStandard',
		header: '금형 규격',
		size: 150,
	},
	{
		accessorKey: 'lifeCycle',
		header: '수명 주기',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? value.toLocaleString() : '-';
		},
	},
	{
		accessorKey: 'moldPrice',
		header: '금형 가격',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? value.toLocaleString() : '-';
		},
	},
	{
		accessorKey: 'safeStock',
		header: '안전 재고',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? value.toLocaleString() : '-';
		},
	},
	{
		accessorKey: 'currentStock',
		header: '현재 재고',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? value.toLocaleString() : '-';
		},
	},
	{
		accessorKey: 'manageType',
		header: '관리 유형',
		size: 150,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value || '-';
		},
	},
	{
		accessorKey: 'moldDesign',
		header: '금형 설계',
		size: 150,
	},
	{
		accessorKey: 'moldDesignCode',
		header: '금형 설계 코드',
		size: 120,
	},
	{
		accessorKey: 'moldPicture',
		header: '금형 사진',
		size: 150,
	},
	{
		accessorKey: 'keepPlace',
		header: '보관 장소',
		size: 150,
	},
	{
		accessorKey: 'isUse',
		header: '사용 여부',
		size: 150,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? 'Y' : 'N';
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
			return value ? new Date(value).toLocaleDateString() : '-';
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
export const moldQuickSearchFields = [
	{ key: 'moldCode', value: '금형 코드', active: true },
	{ key: 'moldName', value: '금형명', active: false },
	{ key: 'moldType', value: '금형 유형', active: false },
];
