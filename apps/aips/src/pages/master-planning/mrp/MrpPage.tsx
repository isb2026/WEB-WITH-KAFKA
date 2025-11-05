import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	Calculator,
	AlertCircle,
	Package,
	TrendingUp,
	Target,
	Factory,
} from 'lucide-react';
import { useDataTable } from '@radix-ui/hook';
import { useDataTableColumns, ColumnConfig } from '@radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';

interface MrpResult {
	id: number;
	productName: string;
	productCode: string;
	requiredQuantity: number;
	availableStock: number;
	shortage: number;
	plannedOrderQuantity: number;
	orderDate: string;
	deliveryDate: string;
	priority: 'high' | 'medium' | 'low';
	status: 'shortage' | 'planned' | 'ordered' | 'delivered';
	supplier: string;
	unitCost: number;
	totalCost: number;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// 더미 데이터
const mrpData: MrpResult[] = [
	{
		id: 1,
		productName: '원자재 A',
		productCode: 'RAW-001',
		requiredQuantity: 1000,
		availableStock: 200,
		shortage: 800,
		plannedOrderQuantity: 800,
		orderDate: '2024-02-01',
		deliveryDate: '2024-02-15',
		priority: 'high',
		status: 'shortage',
		supplier: '공급업체 A',
		unitCost: 5000,
		totalCost: 4000000,
		createdBy: '사용자1',
		createdAt: '2024-01-01',
		updatedBy: '사용자1',
		updatedAt: '2024-01-31',
	},
	{
		id: 2,
		productName: '부품 B',
		productCode: 'PART-001',
		requiredQuantity: 500,
		availableStock: 100,
		shortage: 400,
		plannedOrderQuantity: 400,
		orderDate: '2024-02-05',
		deliveryDate: '2024-02-20',
		priority: 'medium',
		status: 'planned',
		supplier: '공급업체 B',
		unitCost: 15000,
		totalCost: 6000000,
		createdBy: '사용자2',
		createdAt: '2024-01-01',
		updatedBy: '사용자2',
		updatedAt: '2024-01-31',
	},
	{
		id: 3,
		productName: '완제품 C',
		productCode: 'FIN-001',
		requiredQuantity: 200,
		availableStock: 50,
		shortage: 150,
		plannedOrderQuantity: 150,
		orderDate: '2024-02-10',
		deliveryDate: '2024-02-25',
		priority: 'low',
		status: 'ordered',
		supplier: '공급업체 C',
		unitCost: 50000,
		totalCost: 7500000,
		createdBy: '사용자3',
		createdAt: '2024-01-01',
		updatedBy: '사용자3',
		updatedAt: '2024-01-31',
	},
];

const MrpPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<MrpResult[]>([]);

	useEffect(() => {
		setData(mrpData);
	}, []);

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

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'shortage':
				return 'text-red-600 bg-red-100';
			case 'planned':
				return 'text-blue-600 bg-blue-100';
			case 'ordered':
				return 'text-yellow-600 bg-yellow-100';
			case 'delivered':
				return 'text-green-600 bg-green-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'shortage':
				return '부족';
			case 'planned':
				return '계획됨';
			case 'ordered':
				return '주문됨';
			case 'delivered':
				return '납품됨';
			default:
				return '알 수 없음';
		}
	};

	// DataTable columns configuration
	const columns = useMemo<ColumnConfig<MrpResult>[]>(
		() => [
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
				accessorKey: 'requiredQuantity',
				header: '필요 수량',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="font-medium">
						{row.original.requiredQuantity.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'availableStock',
				header: '가용 재고',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="font-medium">
						{row.original.availableStock.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'shortage',
				header: '부족량',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="font-medium text-red-600">
						{row.original.shortage.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'plannedOrderQuantity',
				header: '계획 주문량',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="font-medium">
						{row.original.plannedOrderQuantity.toLocaleString()}
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
				size: 100,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.original.status)}`}
					>
						{getStatusText(row.original.status)}
					</span>
				),
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

	const processedColumns = useDataTableColumns(columns);

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
						<Package className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">
								총 필요 수량
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{data
									.reduce(
										(sum, item) =>
											sum + item.requiredQuantity,
										0
									)
									.toLocaleString()}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Target className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">
								총 가용 재고
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{data
									.reduce(
										(sum, item) =>
											sum + item.availableStock,
										0
									)
									.toLocaleString()}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<AlertCircle className="h-8 w-8 text-red-600" />
						<div>
							<p className="text-sm text-gray-600">총 부족량</p>
							<p className="text-2xl font-bold text-gray-900">
								{data
									.reduce(
										(sum, item) => sum + item.shortage,
										0
									)
									.toLocaleString()}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<TrendingUp className="h-8 w-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600">
								총 계획 주문량
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{data
									.reduce(
										(sum, item) =>
											sum + item.plannedOrderQuantity,
										0
									)
									.toLocaleString()}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* MRP 결과 테이블 */}
			<div className="rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="MRP 결과 데이터"
					rowCount={data.length}
					useSearch={false}
					usePageNation={false}
					toggleRowSelection={toggleRowSelection}
					selectedRows={selectedRows}
					useEditable={false}
					headerOffset="300px"
				/>
			</div>
		</div>
	);
};

export default MrpPage;
