import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { useTranslation } from '@repo/i18n';

// 출고 타입 정의
export interface Outgoing {
	id: number;
	outgoingNumber: string;
	lotNumber: string;
	itemName: string;
	itemNumber: string;
	itemSpec: string;
	quantity: number;
	vendorName: string;
	processName: string;
	outDate: Date;
	expectedReturnDate: Date;
	unitPrice: number;
	totalAmount: number;
	status: 'out' | 'processing' | 'completed';
	deliveryNote: string;
}

// 출고 목록 컬럼 정의
export const OutgoingListColumns = (): ColumnConfig<Outgoing>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'outgoingNumber',
			header: '출고번호',
			size: 150,
			align: 'center',
		},
		{
			accessorKey: 'lotNumber',
			header: 'LOT번호',
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
			accessorKey: 'quantity',
			header: t('columns.quantity'),
			size: 100,
			align: 'right',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? `${value.toLocaleString()}개` : '-';
			},
		},
		{
			accessorKey: 'vendorName',
			header: t('columns.vendorName'),
			size: 200,
			align: 'left',
		},
		{
			accessorKey: 'processName',
			header: t('columns.processName'),
			size: 150,
			align: 'center',
		},
		{
			accessorKey: 'outDate',
			header: '출고일',
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => Date }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
			},
		},
		{
			accessorKey: 'expectedReturnDate',
			header: '반입예정일',
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => Date }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
			},
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
			accessorKey: 'totalAmount',
			header: '총금액',
			size: 120,
			align: 'right',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? `${value.toLocaleString()}원` : '-';
			},
		},
		{
			accessorKey: 'status',
			header: t('columns.status'),
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => 'out' | 'processing' | 'completed' }) => {
				const status = getValue();
				const labels = {
					out: '출고완료',
					processing: '가공중',
					completed: '완료',
				};
				return labels[status] || '-';
			},
		},
		{
			accessorKey: 'deliveryNote',
			header: '출고증번호',
			size: 150,
			align: 'center',
		},
	];
};

// 출고 목록 검색 필드 정의
export const OutgoingSearchFields = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'outgoingNumber',
			label: '출고번호',
			type: 'text',
			placeholder: '출고번호로 검색',
			required: false,
		},
		{
			name: 'lotNumber',
			label: 'LOT번호',
			type: 'text',
			placeholder: 'LOT번호로 검색',
			required: false,
		},
		{
			name: 'itemName',
			label: t('columns.itemName'),
			type: 'text',
			placeholder: t('columns.itemName') + '으로 검색',
			required: false,
		},
		{
			name: 'vendorName',
			label: t('columns.vendorName'),
			type: 'text',
			placeholder: t('columns.vendorName') + '으로 검색',
			required: false,
		},
		{
			name: 'status',
			label: t('columns.status'),
			type: 'select',
			placeholder: '상태 선택',
			required: false,
			options: [
				{ label: '출고완료', value: 'out' },
				{ label: '가공중', value: 'processing' },
				{ label: '완료', value: 'completed' },
			],
		},
		{
			name: 'outDateFrom',
			label: '출고일 (시작)',
			type: 'date',
			placeholder: '출고일 시작일',
			required: false,
		},
		{
			name: 'outDateTo',
			label: '출고일 (종료)',
			type: 'date',
			placeholder: '출고일 종료일',
			required: false,
		},
	];
};
