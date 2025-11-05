import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@repo/radix-ui/hook';
import { MoldItemRelationDto } from '@primes/types/mold';

export const moldItemRelationSearchFields: FormField[] = [
	{
		name: 'moldMasterId',
		label: '금형 마스터 ID',
		type: 'number',
		placeholder: '금형 마스터 ID를 입력하세요',
	},
	{
		name: 'itemId',
		label: '품목 ID',
		type: 'number',
		placeholder: '품목 ID를 입력하세요',
	},
	{
		name: 'itemNo',
		label: '품목 번호',
		type: 'number',
		placeholder: '품목 번호를 입력하세요',
	},
	{
		name: 'itemName',
		label: '품목명',
		type: 'text',
		placeholder: '품목명을 입력하세요',
	},
	{
		name: 'itemNumber',
		label: '품번',
		type: 'text',
		placeholder: '품번을 입력하세요',
	},
	{
		name: 'itemStandard',
		label: '품목 규격',
		type: 'text',
		placeholder: '품목 규격을 입력하세요',
	},
	{
		name: 'itemProgressId',
		label: '품목 공정 ID',
		type: 'number',
		placeholder: '품목 공정 ID를 입력하세요',
	},
	{
		name: 'progressName',
		label: '공정명',
		type: 'text',
		placeholder: '공정명을 입력하세요',
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

export const moldItemRelationColumns: ColumnConfig<MoldItemRelationDto>[] = [
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
		accessorKey: 'itemNo',
		header: '품목 번호',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? value.toLocaleString() : '-';
		},
	},
	{
		accessorKey: 'itemName',
		header: '품목명',
		size: 150,
	},
	{
		accessorKey: 'itemNumber',
		header: '품번',
		size: 150,
	},
	{
		accessorKey: 'itemStandard',
		header: '품목 규격',
		size: 150,
	},

	{
		accessorKey: 'progressName',
		header: '공정명',
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

export const moldItemRelationQuickSearchFields = [
	{ key: 'itemName', value: '품목명', active: true },
	{ key: 'itemNumber', value: '품번', active: false },
	{ key: 'progressName', value: '공정명', active: false },
	{ key: 'moldMasterId', value: '금형 ID', active: false },
];
