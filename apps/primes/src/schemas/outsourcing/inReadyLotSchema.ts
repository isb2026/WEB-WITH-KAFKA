import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { useTranslation } from '@repo/i18n';

// 입고 대기 LOT 타입 정의
export interface InReadyLot {
	id: number;
	outgoingCode: string;
	lotNo: string;
	itemName: string;
	itemNumber: string;
	itemSpec: string;
	quantity: number;
	vendorName: string;
	progressName: string;
	outDate: Date;
	expectedInDate: Date;
	actualCompletionDate?: Date;
	status: 'processing' | 'completed' | 'quality_check';
	qualityStatus?: 'pending' | 'pass' | 'fail';
}

// 입고 대기 LOT 컬럼 정의
export const InReadyLotListColumns = (): ColumnConfig<InReadyLot>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'outgoingCode',
			header: t('columns.outgoingCode'),
			size: 150,
			align: 'center',
		},
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
			accessorKey: 'itemSpec',
			header: t('columns.itemSpec'),
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
			accessorKey: 'progressName',
			header: t('columns.progressName'),
			size: 150,
			align: 'center',
		},
		{
			accessorKey: 'outDate',
			header: t('columns.outgoingDate'),
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => Date }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
			},
		},
		{
			accessorKey: 'expectedInDate',
			header: t('columns.expectedInDate'),
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => Date }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
			},
		},
		{
			accessorKey: 'actualCompletionDate',
			header: t('columns.completeDate'),
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => Date | undefined }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
			},
		},
		{
			accessorKey: 'status',
			header: t('columns.status'),
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => 'processing' | 'completed' | 'quality_check' }) => {
				const status = getValue();
				const labels = {
					processing: '가공중',
					completed: '완료',
					quality_check: '품질검사',
				};
				return labels[status] || '-';
			},
		},
		{
			accessorKey: 'qualityStatus',
			header: '품질상태',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => 'pending' | 'pass' | 'fail' | undefined }) => {
				const status = getValue();
				if (!status) return '-';
				const labels = {
					pending: '대기',
					pass: '합격',
					fail: '불합격',
				};
				return labels[status] || '-';
			},
		},
	];
};

// 입고 대기 LOT 검색 필드 정의
export const InReadyLotSearchFields = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'outgoingCode',
			label: t('columns.outgoingCode'),
			type: 'text',
			placeholder: '출고코드로 검색',
			required: false,
		},
		{
			name: 'lotNumber',
			label: t('columns.lotNo'),
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
				{ label: '가공중', value: 'processing' },
				{ label: '완료', value: 'completed' },
				{ label: '품질검사', value: 'quality_check' },
			],
		},
		{
			name: 'qualityStatus',
			label: t('columns.qualityStatus'),
			type: 'select',
			placeholder: '품질상태 선택',
			required: false,
			options: [
				{ label: '대기', value: 'pending' },
				{ label: '합격', value: 'pass' },
				{ label: '불합격', value: 'fail' },
			],
		},
	];
};
