import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@repo/radix-ui/hook';
import { useTranslation } from '@repo/i18n';

import { MoldSetMasterDto } from '@primes/types/mold';

export const moldSetMasterSearchFields: FormField[] = [
	{ name: 'id', label: 'ID', type: 'number' },
	{ name: 'itemId', label: '품목 ID', type: 'number' },
	{ name: 'progressId', label: '공정 ID', type: 'number' },
	{
		name: 'moldSetCode',
		label: '세트 코드',
		type: 'text',
		placeholder: '세트 코드를 입력하세요',
	},
	{
		name: 'moldSetName',
		label: '세트명',
		type: 'text',
		placeholder: '세트명을 입력하세요',
	},
	{ name: 'moldSetDate', label: '세트일', type: 'date' },
	{
		name: 'place',
		label: '장소',
		type: 'text',
		placeholder: '장소를 입력하세요',
	},
	{
		name: 'isDefault',
		label: '기본 여부',
		type: 'select',
		options: [
			{ label: '기본', value: 'true' },
			{ label: '일반', value: 'false' },
		],
	},
	{ name: 'refItemId', label: '참조 품목 ID', type: 'number' },
	{ name: 'refProgressId', label: '참조 공정 ID', type: 'number' },
	{
		name: 'machineName',
		label: '기계명',
		type: 'text',
		placeholder: '기계명을 입력하세요',
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
	{ name: 'createdBy', label: '생성자', type: 'text' },
	{ name: 'createdAtStart', label: '생성일 시작', type: 'date' },
	{ name: 'createdAtEnd', label: '생성일 종료', type: 'date' },
	{ name: 'updatedBy', label: '수정자', type: 'text' },
	{ name: 'updatedAtStart', label: '수정일 시작', type: 'date' },
	{ name: 'updatedAtEnd', label: '수정일 종료', type: 'date' },
];

export const moldSetMasterColumns: ColumnConfig<MoldSetMasterDto>[] = [
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
		accessorKey: 'moldSetCode',
		header: '세트 코드',
		size: 120,
	},
	{
		accessorKey: 'moldSetName',
		header: '세트명',
		size: 150,
	},
	{
		accessorKey: 'moldSetDate',
		header: '세트일',
		size: 120,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
		},
	},
	{
		accessorKey: 'place',
		header: '장소',
		size: 150,
	},
	{
		accessorKey: 'isDefault',
		header: '기본 여부',
		size: 150,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? '기본' : '일반';
		},
	},

	{
		accessorKey: 'machineName',
		header: '기계명',
		size: 150,
	},
];

export const moldSetMasterQuickSearchFields = [
	{ key: 'moldSetCode', value: '세트 코드', active: true },
	{ key: 'moldSetName', value: '세트명', active: false },
	{ key: 'place', value: '장소', active: false },
	{ key: 'machineName', value: '기계명', active: false },
];

// Data table columns configuration with translations
export const useMoldSetMasterColumns = (): ColumnConfig<MoldSetMasterDto>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'isUse',
			header: t('columns.isUse') || 'Use Status',
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? '사용' : '미사용';
			},
		},
		{
			accessorKey: 'moldSetCode',
			header: t('columns.moldSetCode') || 'Set Code',
			size: 120,
		},
		{
			accessorKey: 'moldSetName',
			header: t('columns.moldSetName') || 'Set Name',
			size: 150,
		},
		{
			accessorKey: 'moldSetDate',
			header: t('columns.moldSetDate') || 'Set Date',
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
			},
		},
		{
			accessorKey: 'place',
			header: t('columns.place') || 'Place',
			size: 150,
		},
		{
			accessorKey: 'isDefault',
			header: t('columns.isDefault') || 'Default',
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? '기본' : '일반';
			},
		},
		{
			accessorKey: 'machineName',
			header: t('columns.machineName') || 'Machine Name',
			size: 150,
		},
	];
};
