import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { useTranslation } from '@repo/i18n';

// 입고 타입 정의
export interface Incoming {
	id: number;
	incomingNumber: string;
	outgoingNumber: string;
	lotNumber: string;
	itemName: string;
	itemCode: string;
	outQuantity: number;
	inQuantity: number;
	vendorName: string;
	processName: string;
	outDate: Date;
	inDate: Date;
	unitPrice: number;
	totalAmount: number;
	qualityStatus: 'pending' | 'pass' | 'fail';
	status: 'in' | 'quality_check' | 'completed';
	incomingNote: string;
}

// 입고 목록 컬럼 정의
export const IncomingListColumns = (): ColumnConfig<Incoming>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'incomingNumber',
			header: '입고번호',
			size: 150,
			align: 'center',
		},
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
			accessorKey: 'itemCode',
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
			accessorKey: 'outQuantity',
			header: '출고수량',
			size: 100,
			align: 'right',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? `${value.toLocaleString()}개` : '-';
			},
		},
		{
			accessorKey: 'inQuantity',
			header: '입고수량',
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
			accessorKey: 'inDate',
			header: '입고일',
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
			accessorKey: 'qualityStatus',
			header: '품질상태',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => 'pending' | 'pass' | 'fail' }) => {
				const status = getValue();
				const labels = {
					pending: '대기',
					pass: '합격',
					fail: '불합격',
				};
				return labels[status] || '-';
			},
		},
		{
			accessorKey: 'status',
			header: t('columns.status'),
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => 'in' | 'quality_check' | 'completed' }) => {
				const status = getValue();
				const labels = {
					in: '입고완료',
					quality_check: '품질검사',
					completed: '완료',
				};
				return labels[status] || '-';
			},
		},
		{
			accessorKey: 'incomingNote',
			header: '입고증번호',
			size: 150,
			align: 'center',
		},
	];
};

// 입고 목록 검색 필드 정의
export const IncomingSearchFields = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'incomingNumber',
			label: '입고번호',
			type: 'text',
			placeholder: '입고번호로 검색',
			required: false,
		},
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
			name: 'qualityStatus',
			label: '품질상태',
			type: 'select',
			placeholder: '품질상태 선택',
			required: false,
			options: [
				{ label: '대기', value: 'pending' },
				{ label: '합격', value: 'pass' },
				{ label: '불합격', value: 'fail' },
			],
		},
		{
			name: 'status',
			label: t('columns.status'),
			type: 'select',
			placeholder: '상태 선택',
			required: false,
			options: [
				{ label: '입고완료', value: 'in' },
				{ label: '품질검사', value: 'quality_check' },
				{ label: '완료', value: 'completed' },
			],
		},
		{
			name: 'inDateFrom',
			label: '입고일 (시작)',
			type: 'date',
			placeholder: '입고일 시작일',
			required: false,
		},
		{
			name: 'inDateTo',
			label: '입고일 (종료)',
			type: 'date',
			placeholder: '입고일 종료일',
			required: false,
		},
	];
};
