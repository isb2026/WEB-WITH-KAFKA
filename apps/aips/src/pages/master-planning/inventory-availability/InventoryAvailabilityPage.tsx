import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	Package,
	AlertCircle,
	CheckCircle,
	Clock,
	TrendingDown,
	TrendingUp,
} from 'lucide-react';
import { useDataTable } from '@radix-ui/hook';
import { useDataTableColumns, ColumnConfig } from '@radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';

interface InventoryItem {
	id: number;
	productName: string;
	productCode: string;
	category: string;
	currentStock: number;
	safetyStock: number;
	reorderPoint: number;
	availableStock: number;
	status: 'sufficient' | 'low' | 'critical' | 'out-of-stock';
	lastUpdated: string;
	nextDelivery: string;
	supplier: string;
	unitCost: number;
	totalValue: number;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// 더미 데이터
const inventoryData: InventoryItem[] = [
	{
		id: 1,
		productName: '원자재 A',
		productCode: 'RAW-001',
		category: '원자재',
		currentStock: 150,
		safetyStock: 100,
		reorderPoint: 120,
		availableStock: 50,
		status: 'low',
		lastUpdated: '2024-01-31',
		nextDelivery: '2024-02-15',
		supplier: '공급업체 A',
		unitCost: 5000,
		totalValue: 750000,
		createdBy: '사용자1',
		createdAt: '2024-01-01',
		updatedBy: '사용자1',
		updatedAt: '2024-01-31',
	},
	{
		id: 2,
		productName: '부품 B',
		productCode: 'PART-001',
		category: '부품',
		currentStock: 50,
		safetyStock: 80,
		reorderPoint: 100,
		availableStock: -30,
		status: 'critical',
		lastUpdated: '2024-01-31',
		nextDelivery: '2024-02-10',
		supplier: '공급업체 B',
		unitCost: 15000,
		totalValue: 750000,
		createdBy: '사용자2',
		createdAt: '2024-01-01',
		updatedBy: '사용자2',
		updatedAt: '2024-01-31',
	},
	{
		id: 3,
		productName: '완제품 C',
		productCode: 'FIN-001',
		category: '완제품',
		currentStock: 200,
		safetyStock: 50,
		reorderPoint: 60,
		availableStock: 150,
		status: 'sufficient',
		lastUpdated: '2024-01-31',
		nextDelivery: '2024-02-20',
		supplier: '공급업체 C',
		unitCost: 50000,
		totalValue: 10000000,
		createdBy: '사용자3',
		createdAt: '2024-01-01',
		updatedBy: '사용자3',
		updatedAt: '2024-01-31',
	},
	{
		id: 4,
		productName: '부품 D',
		productCode: 'PART-002',
		category: '부품',
		currentStock: 0,
		safetyStock: 20,
		reorderPoint: 25,
		availableStock: -20,
		status: 'out-of-stock',
		lastUpdated: '2024-01-31',
		nextDelivery: '2024-02-05',
		supplier: '공급업체 D',
		unitCost: 8000,
		totalValue: 0,
		createdBy: '사용자4',
		createdAt: '2024-01-01',
		updatedBy: '사용자4',
		updatedAt: '2024-01-31',
	},
];

const InventoryAvailabilityPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<InventoryItem[]>([]);

	useEffect(() => {
		setData(inventoryData);
	}, []);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'sufficient':
				return 'text-green-600 bg-green-100';
			case 'low':
				return 'text-yellow-600 bg-yellow-100';
			case 'critical':
				return 'text-orange-600 bg-orange-100';
			case 'out-of-stock':
				return 'text-red-600 bg-red-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'sufficient':
				return '충분';
			case 'low':
				return '부족';
			case 'critical':
				return '위험';
			case 'out-of-stock':
				return '재고 없음';
			default:
				return '알 수 없음';
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'sufficient':
				return <CheckCircle className="h-4 w-4" />;
			case 'low':
				return <Clock className="h-4 w-4" />;
			case 'critical':
				return <AlertCircle className="h-4 w-4" />;
			case 'out-of-stock':
				return <AlertCircle className="h-4 w-4" />;
			default:
				return <Package className="h-4 w-4" />;
		}
	};

	const getAvailableStockColor = (availableStock: number) => {
		if (availableStock >= 0) return 'text-green-600';
		return 'text-red-600';
	};

	// DataTable columns configuration
	const columns = useMemo<ColumnConfig<InventoryItem>[]>(
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
				accessorKey: 'category',
				header: '카테고리',
				size: 100,
				align: 'left' as const,
			},
			{
				accessorKey: 'currentStock',
				header: '현재 재고',
				size: 100,
				align: 'right' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.currentStock.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'safetyStock',
				header: '안전 재고',
				size: 100,
				align: 'right' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.safetyStock.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'reorderPoint',
				header: '재주문점',
				size: 100,
				align: 'right' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.reorderPoint.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'availableStock',
				header: '가용 재고',
				size: 100,
				align: 'right' as const,
				cell: ({ row }: { row: any }) => (
					<div
						className={`text-right font-medium ${getAvailableStockColor(row.original.availableStock)}`}
					>
						{row.original.availableStock.toLocaleString()}
					</div>
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
						<Package className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">
								총 재고 항목
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
							<p className="text-sm text-gray-600">충분한 재고</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'sufficient'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<AlertCircle className="h-8 w-8 text-red-600" />
						<div>
							<p className="text-sm text-gray-600">
								부족/위험 재고
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter((item) =>
										[
											'low',
											'critical',
											'out-of-stock',
										].includes(item.status)
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<TrendingDown className="h-8 w-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600">
								총 재고 가치
							</p>
							<p className="text-2xl font-bold text-gray-900">
								₩
								{data
									.reduce(
										(sum, item) => sum + item.totalValue,
										0
									)
									.toLocaleString()}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 재고 가용성 테이블 */}
			<div className="rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="재고 가용성 데이터"
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

export default InventoryAvailabilityPage;
