import { FormField } from '@primes/components/form/DynamicFormComponent';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';
import { useTranslation } from '@repo/i18n';

// 출고 대기 LOT 타입 정의
export interface OutReadyLot {
	id: number;
	lotNo: string;
	itemId: number;
	itemName: string;
	itemNumber: string;
	itemSpec: string;
	quantity: number;
	vendorId: number;
	vendorName: string;
	progressName: string;
	expectedOutDate: Date;
	priority: 'high' | 'medium' | 'low';
	status: 'ready' | 'outgoing' | 'completed';
}

// 출고 대기 LOT 컬럼 정의
export const OutReadyLotListColumns = (): ColumnConfig<OutReadyLot>[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			accessorKey: 'lotNo',
			header: 'LOT번호',
			size: 120,
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
			size: 150,
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
			size: 150,
			align: 'left',
		},
		{
			accessorKey: 'progressName',
			header: t('columns.progressName'),
			size: 100,
			align: 'center',
		},
		{
			accessorKey: 'expectedOutDate',
			header: t('columns.expectedOutDate'),
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => Date }) => {
				const value = getValue();
				return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
			},
		},
		{
			accessorKey: 'priority',
			header: t('columns.priority'),
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => 'high' | 'medium' | 'low' }) => {
				const priority = getValue();
				const labels = {
					high: '높음',
					medium: '보통',
					low: '낮음',
				};
				return labels[priority] || '-';
			},
		},
		{
			accessorKey: 'status',
			header: t('columns.status'),
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => 'ready' | 'outgoing' | 'completed' }) => {
				const status = getValue();
				const labels = {	
					ready: '출고준비',
					outgoing: '출고중',
					completed: '출고완료',
				};
				return labels[status] || '-';
			},
		},
	];
};

// 출고 대기 LOT 검색 필드 정의
export const OutReadyLotSearchFields = (): FormField[] => {
	const { t } = useTranslation('dataTable');

	return [
		{
			name: 'lotNo',
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
			name: 'priority',
			label: '우선순위',
			type: 'select',
			placeholder: '우선순위 선택',
			required: false,
			options: [
				{ label: '높음', value: 'high' },
				{ label: '보통', value: 'medium' },
				{ label: '낮음', value: 'low' },
			],
		},
		{
			name: 'status',
			label: t('columns.status'),
			type: 'select',
			placeholder: '상태 선택',
			required: false,
			options: [
				{ label: '출고준비', value: 'ready' },
				{ label: '출고중', value: 'outgoing' },
				{ label: '출고완료', value: 'completed' },
			],
		},
	];
};
