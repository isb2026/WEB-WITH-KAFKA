type ColumnDef<T = any, V = any> = any;
import { useTranslation } from '@repo/i18n';

export interface MoldOrderDetailDataType {
	id: number;
	moldCode: string;
	moldName: string;
	moldStandard?: string;
	moldMasterId: number;
	moldMaster?: {
		moldCode: string;
		moldName: string;
		moldStandard: string;
	};
	num: number;
	orderPrice: number;
	orderAmount: number;
	isIn: boolean;
	vendorId: number;
	vendorName: string;
	inDate?: string;
}

export const moldOrderDetailColumns: ColumnDef<MoldOrderDetailDataType>[] = [
	{
		accessorKey: 'moldMaster.moldCode',
		header: '금형코드',
		size: 120,
		cell: ({ row }: { row: any }) => {
			return row.original.moldMaster?.moldCode || '-';
		},
	},
	{
		accessorKey: 'moldMaster.moldName',
		header: '금형명',
		size: 120,
		cell: ({ row }: { row: any }) => {
			return row.original.moldMaster?.moldName || '-';
		},
	},
	{
		accessorKey: 'moldMaster.moldStandard',
		header: '금형규격',
		size: 120,
		cell: ({ row }: { row: any }) => {
			return row.original.moldMaster?.moldStandard || '-';
		},
	},
	{
		accessorKey: 'num',
		header: '발주수량',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? value.toLocaleString() : '-';
		},
	},
	{
		accessorKey: 'orderPrice',
		header: '발주단가',
		size: 120,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? value.toLocaleString() : '-';
		},
	},
	{
		accessorKey: 'orderAmount',
		header: '발주금액',
		size: 120,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? value.toLocaleString() : '-';
		},
	},
	{
		accessorKey: 'isIn',
		header: '입고여부',
		size: 100,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			return value ? '입고완료' : '미입고';
		},
	},
];

// Form schema with translations
export const useMoldOrderDetailFormSchema = () => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'itemId',
			label: t('columns.itemId') || '제품번호',
			type: 'number' as const,
			required: false,
			placeholder: t('placeholders.enterItemId') || 'Enter item ID',
		},
		{
			name: 'moldMasterId',
			label: t('columns.moldMasterId') || '금형번호',
			type: 'number' as const,
			required: true,
			placeholder:
				t('placeholders.enterMoldMasterId') || 'Enter mold master ID',
		},
		{
			name: 'progressId',
			label: t('columns.progressId') || '공정번호',
			type: 'number' as const,
			required: false,
			placeholder:
				t('placeholders.enterProgressId') || 'Enter process ID',
		},
		{
			name: 'moldCode',
			label: t('columns.moldCode') || '금형코드',
			type: 'text' as const,
			required: true,
			placeholder: t('placeholders.enterMoldCode') || 'Enter mold code',
		},
		{
			name: 'moldName',
			label: t('columns.moldName') || '금형명',
			type: 'text' as const,
			required: true,
			placeholder: t('placeholders.enterMoldName') || 'Enter mold name',
		},
		{
			name: 'moldStandard',
			label: t('columns.moldStandard') || '금형규격',
			type: 'text' as const,
			required: false,
			placeholder:
				t('placeholders.enterMoldStandard') || 'Enter mold standard',
		},
		{
			name: 'num',
			label: t('columns.num') || '발주수량',
			type: 'number' as const,
			required: true,
			placeholder:
				t('placeholders.enterOrderQuantity') || 'Enter order quantity',
		},
		{
			name: 'orderPrice',
			label: t('columns.orderPrice') || '발주단가',
			type: 'number' as const,
			required: true,
			placeholder:
				t('placeholders.enterOrderUnitPrice') ||
				'Enter order unit price',
		},
		{
			name: 'orderAmount',
			label: t('columns.orderAmount') || '발주금액',
			type: 'number' as const,
			required: false,
			placeholder:
				t('placeholders.enterOrderAmount') ||
				'Enter order amount (auto-calculated)',
			disabled: true,
		},
		{
			name: 'vendorName',
			label: t('columns.vendorName') || '업체명',
			type: 'text' as const,
			required: false,
			placeholder:
				t('placeholders.enterVendorName') || 'Enter vendor name',
		},
		{
			name: 'inDate',
			label: t('columns.inDate') || '입고일자',
			type: 'date' as const,
			required: false,
		},
	];
};

// Edit form schema with translations
export const useMoldOrderDetailEditFormSchema = () => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'moldCode',
			label: t('columns.moldCode') || '금형코드',
			type: 'text' as const,
			required: true,
			placeholder: t('placeholders.enterMoldCode') || 'Enter mold code',
		},
		{
			name: 'moldName',
			label: t('columns.moldName') || '금형명',
			type: 'text' as const,
			required: true,
			placeholder: t('placeholders.enterMoldName') || 'Enter mold name',
		},
		{
			name: 'moldStandard',
			label: t('columns.moldStandard') || '금형규격',
			type: 'text' as const,
			required: false,
			placeholder:
				t('placeholders.enterMoldStandard') || 'Enter mold standard',
		},
		{
			name: 'num',
			label: t('columns.num') || '수량',
			type: 'text' as const,
			required: true,
			placeholder:
				t('placeholders.enterOrderQuantity') || 'Enter order quantity',
		},
		{
			name: 'orderPrice',
			label: t('columns.orderPrice') || '발주단가',
			type: 'text' as const,
			required: true,
			placeholder:
				t('placeholders.enterOrderUnitPrice') ||
				'Enter order unit price',
		},
		{
			name: 'orderAmount',
			label: t('columns.orderAmount') || '발주금액',
			type: 'text' as const,
			required: false,
			placeholder:
				t('placeholders.enterOrderAmount') ||
				'Enter order amount (auto-calculated)',
			disabled: true,
		},
		{
			name: 'vendorName',
			label: t('columns.vendorName') || '업체명',
			type: 'text' as const,
			required: false,
			placeholder:
				t('placeholders.enterVendorName') || 'Enter vendor name',
		},
		{
			name: 'isIn',
			label: t('columns.isIn') || '입고여부',
			type: 'checkbox' as const,
			required: false,
		},
		{
			name: 'inDate',
			label: t('columns.inDate') || '입고일자',
			type: 'date' as const,
			required: false,
		},
	];
};

export const useMoldOrderDetailColumns =
	(): ColumnDef<MoldOrderDetailDataType>[] => {
		const { t } = useTranslation('dataTable');

		return [
			{
				accessorKey: 'moldMaster.moldCode',
				header: t('columns.moldCode'),
				size: 120,
				cell: ({ row }: { row: any }) => {
					return row.original.moldMaster?.moldCode || '-';
				},
			},
			{
				accessorKey: 'moldMaster.moldName',
				header: t('columns.moldName'),
				size: 150,
				cell: ({ row }: { row: any }) => {
					return row.original.moldMaster?.moldName || '-';
				},
			},
			{
				accessorKey: 'moldMaster.moldStandard',
				header: t('columns.moldStandard'),
				size: 150,
				cell: ({ row }: { row: any }) => {
					return row.original.moldMaster?.moldStandard || '-';
				},
			},
			{
				accessorKey: 'vendorName',
				header: t('columns.vendorName'),
				size: 120,
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return value || '-';
				},
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
				accessorKey: 'orderPrice',
				header: t('columns.orderPrice'),
				size: 120,
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return value ? value.toLocaleString() : '-';
				},
			},
			{
				accessorKey: 'orderAmount',
				header: t('columns.orderAmount'),
				size: 120,
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return value ? value.toLocaleString() : '-';
				},
			},
			{
				accessorKey: 'isIn',
				header: t('columns.isIn'),
				size: 100,
				cell: ({ getValue }: { getValue: () => any }) => {
					const value = getValue();
					return value ? '입고완료' : '미입고';
				},
			},
		];
	};
