import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	ShoppingBag,
	Plus,
	CheckCircle,
	Clock,
	AlertCircle,
	TrendingUp,
	DollarSign,
} from 'lucide-react';
import { useDataTable } from '@radix-ui/hook';
import { useDataTableColumns, ColumnConfig } from '@radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { RadixIconButton } from '@radix-ui/components';

interface PurchaseRequest {
	id: number;
	requestNumber: string;
	productName: string;
	productCode: string;
	requestedQuantity: number;
	unitPrice: number;
	totalAmount: number;
	requestDate: string;
	requiredDate: string;
	status:
		| 'draft'
		| 'submitted'
		| 'approved'
		| 'rejected'
		| 'ordered'
		| 'delivered';
	priority: 'high' | 'medium' | 'low';
	requestedBy: string;
	approvedBy: string;
	approvedDate: string;
	supplier: string;
	notes: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// 더미 데이터
const purchaseRequestData: PurchaseRequest[] = [
	{
		id: 1,
		requestNumber: 'PR-2024-001',
		productName: '원자재 A',
		productCode: 'RAW-001',
		requestedQuantity: 800,
		unitPrice: 5000,
		totalAmount: 4000000,
		requestDate: '2024-01-31',
		requiredDate: '2024-02-15',
		status: 'approved',
		priority: 'high',
		requestedBy: '사용자1',
		approvedBy: '승인자1',
		approvedDate: '2024-02-01',
		supplier: '공급업체 A',
		notes: '긴급 주문 필요',
		createdBy: '사용자1',
		createdAt: '2024-01-31',
		updatedBy: '사용자1',
		updatedAt: '2024-01-31',
	},
	{
		id: 2,
		requestNumber: 'PR-2024-002',
		productName: '부품 B',
		productCode: 'PART-001',
		requestedQuantity: 400,
		unitPrice: 15000,
		totalAmount: 6000000,
		requestDate: '2024-01-31',
		requiredDate: '2024-02-20',
		status: 'submitted',
		priority: 'medium',
		requestedBy: '사용자2',
		approvedBy: '',
		approvedDate: '',
		supplier: '공급업체 B',
		notes: '일반 주문',
		createdBy: '사용자2',
		createdAt: '2024-01-31',
		updatedBy: '사용자2',
		updatedAt: '2024-01-31',
	},
	{
		id: 3,
		requestNumber: 'PR-2024-003',
		productName: '완제품 C',
		productCode: 'FIN-001',
		requestedQuantity: 150,
		unitPrice: 50000,
		totalAmount: 7500000,
		requestDate: '2024-01-31',
		requiredDate: '2024-02-25',
		status: 'draft',
		priority: 'low',
		requestedBy: '사용자3',
		approvedBy: '',
		approvedDate: '',
		supplier: '공급업체 C',
		notes: '계획 주문',
		createdBy: '사용자3',
		createdAt: '2024-01-31',
		updatedBy: '사용자3',
		updatedAt: '2024-01-31',
	},
];

const PurchaseRequestsPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<PurchaseRequest[]>([]);

	useEffect(() => {
		setData(purchaseRequestData);
	}, []);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'draft':
				return 'text-gray-600 bg-gray-100';
			case 'submitted':
				return 'text-blue-600 bg-blue-100';
			case 'approved':
				return 'text-green-600 bg-green-100';
			case 'rejected':
				return 'text-red-600 bg-red-100';
			case 'ordered':
				return 'text-purple-600 bg-purple-100';
			case 'delivered':
				return 'text-green-600 bg-green-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'draft':
				return '초안';
			case 'submitted':
				return '제출됨';
			case 'approved':
				return '승인됨';
			case 'rejected':
				return '거부됨';
			case 'ordered':
				return '주문됨';
			case 'delivered':
				return '납품됨';
			default:
				return '알 수 없음';
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'draft':
				return <Clock className="h-4 w-4" />;
			case 'submitted':
				return <Clock className="h-4 w-4" />;
			case 'approved':
				return <CheckCircle className="h-4 w-4" />;
			case 'rejected':
				return <AlertCircle className="h-4 w-4" />;
			case 'ordered':
				return <ShoppingBag className="h-4 w-4" />;
			case 'delivered':
				return <CheckCircle className="h-4 w-4" />;
			default:
				return <Clock className="h-4 w-4" />;
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high':
				return 'text-red-600 bg-red-100';
			case 'medium':
				return 'text-yellow-600 bg-yellow-100';
			case 'low':
				return 'text-green-600 bg-green-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getPriorityText = (priority: string) => {
		switch (priority) {
			case 'high':
				return '높음';
			case 'medium':
				return '보통';
			case 'low':
				return '낮음';
			default:
				return '알 수 없음';
		}
	};

	// DataTable columns configuration
	const columns = useMemo<ColumnConfig<PurchaseRequest>[]>(
		() => [
			{
				accessorKey: 'requestNumber',
				header: '요청 번호',
				size: 120,
				align: 'left' as const,
			},
			{
				accessorKey: 'productName',
				header: '제품명',
				size: 150,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div>
						<div className="text-sm font-medium text-gray-900">
							{row.original.productName}
						</div>
					</div>
				),
			},
			{
				accessorKey: 'requestedQuantity',
				header: '요청 수량',
				size: 100,
				align: 'right' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.requestedQuantity.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'unitPrice',
				header: '단가',
				size: 100,
				align: 'right' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						₩{row.original.unitPrice.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'totalAmount',
				header: '총 금액',
				size: 120,
				align: 'right' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						₩{row.original.totalAmount.toLocaleString()}
					</div>
				),
			},

			{
				accessorKey: 'priority',
				header: '우선순위',
				size: 100,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(row.original.priority)}`}
					>
						{getPriorityText(row.original.priority)}
					</span>
				),
			},
			{
				accessorKey: 'status',
				header: '상태',
				size: 120,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<div className="flex items-center justify-center gap-2">
						{getStatusIcon(row.original.status)}
						<span
							className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.original.status)}`}
						>
							{getStatusText(row.original.status)}
						</span>
					</div>
				),
			},
			{
				accessorKey: 'requestedBy',
				header: '요청자',
				size: 100,
				align: 'left' as const,
			},
			{
				accessorKey: 'supplier',
				header: '공급업체',
				size: 120,
				align: 'left' as const,
			},
		],
		[]
	);

	// Process columns using useDataTableColumns (same pattern as demand pages)
	const processedColumns = useDataTableColumns(columns);

	// Use useDataTable with all required parameters (same pattern as demand pages)
	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		processedColumns,
		30, // defaultPageSize
		0, // pageCount
		0, // page
		data.length, // totalElements
		undefined // onPageChange
	);

	return (
		<div className="space-y-4">
			{/* 통계 카드 */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<ShoppingBag className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">
								총 요청 건수
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{data.length}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<CheckCircle className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">승인된 요청</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'approved'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Clock className="h-8 w-8 text-yellow-600" />
						<div>
							<p className="text-sm text-gray-600">
								대기 중인 요청
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter((item) =>
										['draft', 'submitted'].includes(
											item.status
										)
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<DollarSign className="h-8 w-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600">
								총 요청 금액
							</p>
							<p className="text-2xl font-bold text-gray-900">
								₩
								{data
									.reduce(
										(sum, item) => sum + item.totalAmount,
										0
									)
									.toLocaleString()}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 구매 요청 테이블 */}
			<div className="rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="구매 요청 데이터"
					rowCount={data.length}
					useSearch={false}
					usePageNation={false}
					toggleRowSelection={toggleRowSelection}
					selectedRows={selectedRows}
					headerOffset="300px"
				/>
			</div>
		</div>
	);
};

export default PurchaseRequestsPage;
