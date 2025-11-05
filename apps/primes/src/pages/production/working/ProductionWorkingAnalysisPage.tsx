import React, { useState } from 'react';
import { useTranslation } from '@repo/i18n';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import {
	BarChart3,
	TrendingUp,
	TrendingDown,
	Activity,
	Target,
	Clock,
	CheckCircle,
} from 'lucide-react';

// 생산실적 분석 데이터 타입
interface ProductionAnalysisData {
	id: number;
	workOrderNo: string;
	itemName: string;
	itemCode: string;
	planQuantity: number;
	actualQuantity: number;
	achievementRate: number;
	productionTime: number; // 생산 시간 (시간)
	productivity: number; // 생산성 %
	status: string;
	productionDate: string;
	worker: string;
	machineNo: string;
}

// 생산실적 KPI 데이터
interface ProductionKPIData {
	totalProduction: number;
	completedProduction: number;
	averageProductivity: number;
	qualityRate: number;
}

export const ProductionWorkingAnalysisPage: React.FC = () => {
	const { t } = useTranslation('common');
	const { t: tDataTable } = useTranslation('dataTable');

	// 임시 KPI 데이터
	const [kpiData] = useState<ProductionKPIData>({
		totalProduction: 156,
		completedProduction: 142,
		averageProductivity: 91,
		qualityRate: 96,
	});

	// 임시 분석 데이터
	const [analysisData] = useState<ProductionAnalysisData[]>([
		{
			id: 1,
			workOrderNo: 'WO-2024-001',
			itemName: '프레임 조립품',
			itemCode: 'FRAME-001',
			planQuantity: 100,
			actualQuantity: 95,
			achievementRate: 95,
			productionTime: 8.5,
			productivity: 89,
			status: '완료',
			productionDate: '2024-01-15',
			worker: '김철수',
			machineNo: 'MC-001',
		},
		{
			id: 2,
			workOrderNo: 'WO-2024-002',
			itemName: '모터 하우징',
			itemCode: 'MOTOR-H01',
			planQuantity: 50,
			actualQuantity: 52,
			achievementRate: 104,
			productionTime: 6.2,
			productivity: 105,
			status: '완료',
			productionDate: '2024-01-15',
			worker: '박영희',
			machineNo: 'MC-002',
		},
		{
			id: 3,
			workOrderNo: 'WO-2024-003',
			itemName: '기어박스',
			itemCode: 'GEAR-B01',
			planQuantity: 75,
			actualQuantity: 68,
			achievementRate: 91,
			productionTime: 9.8,
			productivity: 83,
			status: '완료',
			productionDate: '2024-01-14',
			worker: '이민수',
			machineNo: 'MC-003',
		},
		{
			id: 4,
			workOrderNo: 'WO-2024-004',
			itemName: '센서 모듈',
			itemCode: 'SENSOR-M01',
			planQuantity: 200,
			actualQuantity: 198,
			achievementRate: 99,
			productionTime: 4.5,
			productivity: 110,
			status: '완료',
			productionDate: '2024-01-14',
			worker: '정수진',
			machineNo: 'MC-004',
		},
	]);

	// 컬럼 정의 함수
	const getAnalysisColumns = () => [
		{
			accessorKey: 'workOrderNo',
			header: '작업지시번호',
			size: 120,
		},
		{
			accessorKey: 'itemName',
			header: '품목명',
			size: 150,
		},
		{
			accessorKey: 'itemCode',
			header: '품목코드',
			size: 120,
		},
		{
			accessorKey: 'planQuantity',
			header: '계획수량',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value?.toLocaleString() || '-';
			},
		},
		{
			accessorKey: 'actualQuantity',
			header: '실적수량',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value?.toLocaleString() || '-';
			},
		},
		{
			accessorKey: 'achievementRate',
			header: '달성률(%)',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				const color =
					value >= 100
						? 'text-green-600'
						: value >= 90
							? 'text-yellow-600'
							: 'text-red-600';
				return <span className={color}>{value}%</span>;
			},
		},
		{
			accessorKey: 'productionTime',
			header: '생산시간(h)',
			size: 100,
		},
		{
			accessorKey: 'productivity',
			header: '생산성(%)',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				const color =
					value >= 100
						? 'text-green-600'
						: value >= 85
							? 'text-yellow-600'
							: 'text-red-600';
				return <span className={color}>{value}%</span>;
			},
		},
		{
			accessorKey: 'worker',
			header: '작업자',
			size: 100,
		},
		{
			accessorKey: 'machineNo',
			header: '설비번호',
			size: 100,
		},
		{
			accessorKey: 'status',
			header: '상태',
			size: 80,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return (
					<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
					title="총 생산 실적"
					value={kpiData.totalProduction}
					icon={<Activity size={24} />}
					trend="up"
					trendValue="+12%"
					color="bg-blue-500"
				/>
				<KPICard
					title="완료된 작업"
					value={kpiData.completedProduction}
					icon={<CheckCircle size={24} />}
					trend="up"
					trendValue="+8%"
					color="bg-green-500"
				/>
				<KPICard
					title="평균 생산성"
					value={`${kpiData.averageProductivity}%`}
					icon={<Target size={24} />}
					trend="up"
					trendValue="+5%"
					color="bg-yellow-500"
				/>
				<KPICard
					title="품질 달성률"
					value={`${kpiData.qualityRate}%`}
					icon={<BarChart3 size={24} />}
					trend="up"
					trendValue="+3%"
					color="bg-purple-500"
				/>
			</div>

			{/* 차트 영역 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-lg font-semibold mb-4 flex items-center">
						<BarChart3 className="mr-2 h-5 w-5" />
						생산 실적 추이
					</h3>
					<div className="h-64 flex items-center justify-center text-gray-500">
						생산 실적 차트 영역
						<br />
						(실제 프로젝트에서는 Chart.js 또는 Recharts 등 사용)
					</div>
				</div>
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-lg font-semibold mb-4 flex items-center">
						<Target className="mr-2 h-5 w-5" />
						생산성 분석
					</h3>
					<div className="h-64 flex items-center justify-center text-gray-500">
						생산성 분석 차트 영역
						<br />
						(달성률, 효율성 등 분석)
					</div>
				</div>
			</div>

			{/* 상세 데이터 테이블 */}
			<div className="bg-white rounded-lg shadow">
				<DatatableComponent
					table={table}
					columns={columns}
					data={analysisData}
					tableTitle="생산 실적 상세 분석"
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

export default ProductionWorkingAnalysisPage;
