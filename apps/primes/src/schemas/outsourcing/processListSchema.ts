import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { useTranslation } from '@repo/i18n';

// 외주 공정 타입 정의
export interface OutsourcingProcess {
	id: number;
	itemId: number;
	itemName: string;
	itemNumber: string;
	itemSpec: string;
	processName: string;
	vendorId: number;
	vendorName: string;
	unitPrice: number;
	leadTime: number;
	minOrderQty: number;
	memo: string;
	isActive: boolean;
}

// 외주 공정 목록 컬럼 정의
export const OutsourcingProcessListColumns = (): ColumnConfig<OutsourcingProcess>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'itemNumber',
			header: t('columns.itemNumber'),
			size: 120,
			align: 'center',
		},
		{
			accessorKey: 'itemName',
			header: t('columns.itemName'),
			size: 180,
			align: 'left',
		},
		{
			accessorKey: 'itemSpec',
			header: t('columns.itemSpec'),
			size: 100,
			align: 'left',
		},
		{
			accessorKey: 'processName',
			header: t('columns.processName'),
			size: 150,
			align: 'center',
		},
		{
			accessorKey: 'vendorName',
			header: t('columns.vendorName'),
			size: 200,
			align: 'left',
		},
		{
			accessorKey: 'unitPrice',
			header: t('columns.unitPrice'),
			size: 120,
			align: 'right',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? `${value.toLocaleString()}원` : '-';
			},
		},
		{
			accessorKey: 'leadTime',
			header: '리드타임',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => `${getValue()}일`,
		},
		{
			accessorKey: 'minOrderQty',
			header: '최소주문량',
			size: 150,
			align: 'left',
		},
		{
			accessorKey: 'memo',
			header: '메모',
			size: 150,
			align: 'left',
		},
		{
			accessorKey: 'isActive',
			header: t('columns.isUse'),
			size: 80,
			align: 'center',
			cell: ({ getValue }: { getValue: () => boolean }) => {
				const value = getValue();
				return value ? '활성' : '비활성';
			},
		},
	];
};

// 외주 공정 검색 필드 정의
export const OutsourcingProcessSearchFields = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'itemName',
			label: t('columns.itemName'),
			type: 'text',
			placeholder: t('columns.itemName') + '으로 검색',
			required: false,
		},
		{
			name: 'itemCode',
			label: t('columns.itemNumber'),
			type: 'text',
			placeholder: t('columns.itemNumber') + '으로 검색',
			required: false,
		},
		{
			name: 'processName',
			label: t('columns.processName'),
			type: 'text',
			placeholder: t('columns.processName') + '으로 검색',
			required: false,
		},
		{
			name: 'vendorName',
			label: t('columns.vendorName'),
			type: 'text',
			placeholder: t('columns.vendorName') + '으로 검색',
			required: false,
		},
	];
};
