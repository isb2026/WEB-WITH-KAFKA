import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { useTranslation } from '@repo/i18n';

export type LotDataTableType = {
	id: number;
	commandId?: number;
	command?: string;
	lotNo: string;
	itemNo?: number;
	itemNumber?: string;
	itemName?: string;
	itemSpec?: string;
	lotAmt?: number;
	lotWt?: number;
	createDate?: string;
};

// LOT 등록/수정 Form Schema
export const lotFormSchema: FormField[] = [
	{
		name: 'commandId',
		label: '지시 ID',
		type: 'number',
		placeholder: '1',
		required: false,
	},
	{
		name: 'lotNo',
		label: 'LOT 번호',
		type: 'text',
		placeholder: 'LOT-001',
		required: true,
	},
	{
		name: 'itemNo',
		label: '품목 번호',
		type: 'number',
		placeholder: '1',
		required: false,
	},
	{
		name: 'itemNumber',
		label: '품번',
		type: 'text',
		placeholder: 'ITEM-001',
		required: false,
	},
	{
		name: 'itemName',
		label: '품명',
		type: 'text',
		placeholder: '제품명',
		required: false,
	},
	{
		name: 'itemSpec',
		label: '규격',
		type: 'text',
		placeholder: '제품 규격',
		required: false,
	},
	{
		name: 'lotAmt',
		label: 'LOT 수량',
		type: 'number',
		placeholder: '100',
		required: false,
	},
	{
		name: 'lotWt',
		label: 'LOT 중량',
		type: 'number',
		placeholder: '1000',
		required: false,
	},
	{
		name: 'createDate',
		label: '생성일자',
		type: 'date',
		placeholder: '2024-01-01',
		required: false,
	},
];

// LOT 검색 필드
export const lotSearchFields: FormField[] = [
	{
		name: 'lotNo',
		label: 'LOT 번호',
		type: 'text',
		placeholder: 'LOT-001',
	},
	{
		name: 'itemNumber',
		label: '품번',
		type: 'text',
		placeholder: 'ITEM-001',
	},
	{
		name: 'itemName',
		label: '품명',
		type: 'text',
		placeholder: '제품명',
	},
	{
		name: 'createDate',
		label: '생성일자',
		type: 'date',
		placeholder: '2024-01-01',
	},
];

// LOT 테이블 컬럼
export const lotColumns: ColumnConfig<LotDataTableType>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		size: 80,
		minSize: 60,
	},
	{
		accessorKey: 'commandId',
		header: '지시 ID',
		size: 80,
	},
	{
		accessorKey: 'command',
		header: '지시서',
		size: 150,
	},
	{
		accessorKey: 'lotNo',
		header: 'LOT 번호',
		size: 150,
	},
	{
		accessorKey: 'itemNo',
		header: '품목 번호',
		size: 100,
	},
	{
		accessorKey: 'itemNumber',
		header: '품번',
		size: 150,
	},
	{
		accessorKey: 'itemName',
		header: '품명',
		size: 150,
	},
	{
		accessorKey: 'itemSpec',
		header: '규격',
		size: 150,
	},
	{
		accessorKey: 'lotAmt',
		header: 'LOT 수량',
		size: 100,
		cell: ({ getValue }: { getValue: () => number | null }) => {
			const value = getValue();
			return value ? value.toLocaleString() : '-';
		},
	},
	{
		accessorKey: 'lotWt',
		header: 'LOT 중량',
		size: 100,
		cell: ({ getValue }: { getValue: () => number | null }) => {
			const value = getValue();
			return value ? value.toLocaleString() : '-';
		},
	},
	{
		accessorKey: 'createDate',
		header: '생성일자',
		size: 120,
		cell: ({ getValue }: { getValue: () => string | null }) => {
			const value = getValue();
			return value ? new Date(value).toLocaleDateString() : '-';
		},
	},
];

// LOT 테이블 컬럼
export const useLotColumns = () => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'lotNo',
			header: t('columns.lotNo'),
			size: 150,
			align: 'center',
		},
		{
			accessorKey: 'itemNumber',
			header: t('columns.itemNumber'),
			size: 120,
			align: 'center',
		},
		{
			accessorKey: 'itemName',
			header: t('columns.itemName'),
			size: 150,
			align: 'left',
		},
		{
			accessorKey: 'itemSpec',
			header: t('columns.itemSpec'),
			size: 120,
			align: 'center',
		},
		{
			accessorKey: 'progressName',
			header: t('columns.progressName'),
			size: 120,
			align: 'center',
		},
		{
			accessorKey: 'lotAmount',
			header: t('columns.lotAmount'),
			size: 100,
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const value = getValue();
				return value ? (value as number).toLocaleString() : '-';
			},
			align: 'right',
		},
		{
			accessorKey: 'lotWeight',
			header: t('columns.lotWeight'),
			size: 100,
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const value = getValue();
				return value ? (value as number).toLocaleString() : '-';
			},
			align: 'right',
		},
		{
			accessorKey: 'lotUnit',
			header: t('columns.lotUnit'),
			size: 100,
			align: 'center',
		},
		{
			accessorKey: 'restAmount',
			header: t('columns.restAmount'),
			size: 100,
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const value = getValue();
				return value ? (value as number).toLocaleString() : '-';
			},
			align: 'right',
		},
		{
			accessorKey: 'restWeight',
			header: t('columns.restWeight'),
			size: 100,
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const value = getValue();
				return value ? (value as number).toLocaleString() : '-';
			},
			align: 'right',
		},
	]
};