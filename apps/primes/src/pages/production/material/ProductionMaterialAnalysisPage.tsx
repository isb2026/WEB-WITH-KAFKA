import React, { useState } from 'react';
import { useTranslation } from '@repo/i18n';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import {
	BarChart3,
	TrendingUp,
	TrendingDown,
	Package,
	Target,
	AlertTriangle,
	CheckCircle,
} from 'lucide-react';

// 자재 분석 데이터 타입
interface MaterialAnalysisData {
	id: number;
	materialCode: string;
	materialName: string;
	supplier: string;
	currentStock: number;
	safetyStock: number;
	stockLevel: number; // 재고 수준 %
	usageQuantity: number; // 사용량
	costPerUnit: number; // 단가
	totalCost: number; // 총 비용
	lastOrderDate: string;
	status: string;
}

// 자재 KPI 데이터
interface MaterialKPIData {
	totalMaterials: number;
	lowStockItems: number;
	averageStockLevel: number;
	totalInventoryValue: number;
}

export const ProductionMaterialAnalysisPage: React.FC = () => {
	const { t } = useTranslation('common');
	const { t: tDataTable } = useTranslation('dataTable');

	// 임시 KPI 데이터
	const [kpiData] = useState<MaterialKPIData>({
		totalMaterials: 245,
		lowStockItems: 18,
		averageStockLevel: 78,
		totalInventoryValue: 15420000,
	});

	// 임시 분석 데이터 (더 현실적인 자재 투입 분석)
	const [analysisData] = useState<MaterialAnalysisData[]>([
		{
			id: 1,
			materialCode: 'MAT-STL-001',
			materialName: '스테인리스 스틸 판재 SUS304',
			supplier: '포스코스테인리스',
			currentStock: 150,
			safetyStock: 200,
			stockLevel: 75,
			usageQuantity: 45,
			costPerUnit: 25000,
			totalCost: 3750000,
			lastOrderDate: '2024-01-15',
			status: '정상',
		},
		{
			id: 2,
			materialCode: 'MAT-ALU-002',
			materialName: '알루미늄 압출재 6063',
			supplier: '현대알루미늄',
			currentStock: 80,
			safetyStock: 150,
			stockLevel: 53,
			usageQuantity: 32,
			costPerUnit: 18500,
			totalCost: 1480000,
			lastOrderDate: '2024-01-12',
			status: '부족',
		},
		{
			id: 3,
			materialCode: 'MAT-PLA-003',
			materialName: 'ABS 플라스틱 원료',
			supplier: 'LG화학',
			currentStock: 300,
			safetyStock: 250,
			stockLevel: 120,
			usageQuantity: 78,
			costPerUnit: 4200,
			totalCost: 1260000,
			lastOrderDate: '2024-01-18',
			status: '과잉',
		},
		{
			id: 4,
			materialCode: 'MAT-ELE-004',
			materialName: '마이크로컨트롤러 STM32',
			supplier: '삼성전기',
			currentStock: 25,
			safetyStock: 50,
			stockLevel: 50,
			usageQuantity: 15,
			costPerUnit: 8500,
			totalCost: 212500,
			lastOrderDate: '2024-01-10',
			status: '주의',
		},
		{
			id: 5,
			materialCode: 'MAT-RUB-005',
			materialName: 'NBR 고무 가스켓',
			supplier: '금양',
			currentStock: 420,
			safetyStock: 300,
			stockLevel: 140,
			usageQuantity: 89,
			costPerUnit: 2200,
			totalCost: 924000,
			lastOrderDate: '2024-01-20',
			status: '과잉',
		},
		{
			id: 6,
			materialCode: 'MAT-COP-006',
			materialName: '구리선 14AWG',
			supplier: 'LS전선',
			currentStock: 500,
			safetyStock: 400,
			stockLevel: 125,
			usageQuantity: 120,
			costPerUnit: 3800,
			totalCost: 1900000,
			lastOrderDate: '2024-01-22',
			status: '과잉',
		},
		{
			id: 7,
			materialCode: 'MAT-SCR-007',
			materialName: 'M6 육각볼트 SUS304',
			supplier: '동일금속',
			currentStock: 2000,
			safetyStock: 3000,
			stockLevel: 67,
			usageQuantity: 450,
			costPerUnit: 150,
			totalCost: 300000,
			lastOrderDate: '2024-01-14',
			status: '부족',
		},
		{
			id: 8,
			materialCode: 'MAT-BEA-008',
			materialName: '볼베어링 6204ZZ',
			supplier: 'NTN베어링',
			currentStock: 180,
			safetyStock: 200,
			stockLevel: 90,
			usageQuantity: 35,
			costPerUnit: 12000,
			totalCost: 2160000,
			lastOrderDate: '2024-01-16',
			status: '정상',
		},
	]);

	// 컬럼 정의 함수
	const getAnalysisColumns = () => [
		{
			accessorKey: 'materialCode',
			header: '자재코드',
			size: 120,
		},
		{
			accessorKey: 'materialName',
			header: '자재명',
			size: 180,
		},
		{
			accessorKey: 'supplier',
			header: '공급업체',
			size: 120,
		},
		{
			accessorKey: 'currentStock',
			header: '현재고',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value?.toLocaleString() || '-';
			},
		},
		{
			accessorKey: 'safetyStock',
			header: '안전재고',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value?.toLocaleString() || '-';
			},
		},
		{
			accessorKey: 'stockLevel',
			header: '재고수준(%)',
			size: 110,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				const color =
					value >= 100
						? 'text-blue-600'
						: value >= 80
							? 'text-green-600'
							: value >= 60
								? 'text-yellow-600'
								: 'text-red-600';
				return <span className={color}>{value}%</span>;
			},
		},
		{
			accessorKey: 'usageQuantity',
			header: '사용량',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value?.toLocaleString() || '-';
			},
		},
		{
			accessorKey: 'costPerUnit',
			header: '단가',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? `₩${value.toLocaleString()}` : '-';
			},
		},
		{
			accessorKey: 'totalCost',
			header: '총비용',
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? `₩${value.toLocaleString()}` : '-';
			},
		},
		{
			accessorKey: 'lastOrderDate',
			header: '최근주문일',
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue() as string;
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'status',
			header: '상태',
			size: 80,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue() as string;
				const statusColors: Record<string, string> = {
					정상: 'bg-green-100 text-green-800',
					부족: 'bg-red-100 text-red-800',
					주의: 'bg-yellow-100 text-yellow-800',
					과잉: 'bg-blue-100 text-blue-800',
				};
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}
					>
						{value}
					</span>
				);
			},
		},
	];

	// 컬럼 생성
	const columns = getAnalysisColumns();

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		analysisData,
		columns,
		10, // defaultPageSize
		Math.ceil(analysisData.length / 10), // pageCount
		0, // page
		analysisData.length // totalElements
	);

	// KPI 카드 컴포넌트
	const KPICard = ({
		title,
		value,
		icon,
		trend,
		trendValue,
		color = 'bg-blue-500',
	}: {
		title: string;
		value: string | number;
		icon: React.ReactNode;
		trend?: 'up' | 'down';
		trendValue?: string;
		color?: string;
	}) => (
		<div className="bg-white rounded-lg shadow p-6">
			<div className="flex items-center">
				<div className={`${color} rounded-lg p-3 text-white mr-4`}>
					{icon}
				</div>
				<div className="flex-1">
					<h3 className="text-sm font-medium text-gray-500">
						{title}
					</h3>
					<p className="text-2xl font-bold text-gray-900">{value}</p>
					{trend && trendValue && (
						<div className="flex items-center mt-1">
							{trend === 'up' ? (
								<TrendingUp className="h-4 w-4 text-green-500 mr-1" />
							) : (
								<TrendingDown className="h-4 w-4 text-red-500 mr-1" />
							)}
							<span
								className={`text-sm ${
									trend === 'up'
										? 'text-green-500'
										: 'text-red-500'
								}`}
							>
								{trendValue}
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);

	return (
		<PageTemplate>
			{/* KPI Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
				<KPICard
					title="총 자재 종류"
					value={kpiData.totalMaterials}
					icon={<Package size={24} />}
					trend="up"
					trendValue="+15개"
					color="bg-blue-500"
				/>
				<KPICard
					title="재고 부족 품목"
					value={kpiData.lowStockItems}
					icon={<AlertTriangle size={24} />}
					trend="down"
					trendValue="-3개"
					color="bg-red-500"
				/>
				<KPICard
					title="평균 재고 수준"
					value={`${kpiData.averageStockLevel}%`}
					icon={<Target size={24} />}
					trend="up"
					trendValue="+5%"
					color="bg-yellow-500"
				/>
				<KPICard
					title="총 재고 가치"
					value={`₩${(kpiData.totalInventoryValue / 10000).toFixed(0)}만원`}
					icon={<CheckCircle size={24} />}
					trend="up"
					trendValue="+8%"
					color="bg-green-500"
				/>
			</div>

			{/* 차트 영역 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-lg font-semibold mb-4 flex items-center">
						<BarChart3 className="mr-2 h-5 w-5" />
						자재 사용량 추이
					</h3>
					<div className="h-64 flex items-center justify-center text-gray-500">
						자재 사용량 차트 영역
						<br />
						(실제 프로젝트에서는 Chart.js 또는 Recharts 등 사용)
					</div>
				</div>
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-lg font-semibold mb-4 flex items-center">
						<Target className="mr-2 h-5 w-5" />
						재고 수준 분석
					</h3>
					<div className="h-64 flex items-center justify-center text-gray-500">
						재고 수준 분석 차트 영역
						<br />
						(재고 부족/과잉 분석)
					</div>
				</div>
			</div>

			{/* 상세 데이터 테이블 */}
			<div className="bg-white rounded-lg shadow">
				<DatatableComponent
					table={table}
					columns={columns}
					data={analysisData}
					tableTitle="자재 상세 분석"
					rowCount={analysisData.length}
					useSearch={true}
					usePageNation={false}
					useSummary={true}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
				/>
			</div>
		</PageTemplate>
	);
};

export default ProductionMaterialAnalysisPage;
