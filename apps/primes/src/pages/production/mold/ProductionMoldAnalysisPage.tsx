import React, { useState } from 'react';
import { useTranslation } from '@repo/i18n';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import {
	BarChart3,
	TrendingUp,
	TrendingDown,
	Settings,
	Target,
	AlertTriangle,
	CheckCircle,
} from 'lucide-react';

// 금형 분석 데이터 타입
interface MoldAnalysisData {
	id: number;
	moldCode: string;
	moldName: string;
	moldType: string;
	supplier: string;
	totalShots: number; // 총 샷수
	currentShots: number; // 현재 샷수
	remainingShots: number; // 잔여 샷수
	usageRate: number; // 사용률 %
	maintenanceDate: string; // 마지막 점검일
	nextMaintenanceDate: string; // 다음 점검 예정일
	status: string;
	productName: string; // 생산 제품
	location: string; // 금형 위치
	condition: string; // 상태
}

// 금형 KPI 데이터
interface MoldKPIData {
	totalMolds: number;
	activeMolds: number;
	maintenanceRequired: number;
	averageUsageRate: number;
}

export const ProductionMoldAnalysisPage: React.FC = () => {
	const { t } = useTranslation('common');
	const { t: tDataTable } = useTranslation('dataTable');

	// 임시 KPI 데이터
	const [kpiData] = useState<MoldKPIData>({
		totalMolds: 58,
		activeMolds: 42,
		maintenanceRequired: 8,
		averageUsageRate: 73,
	});

	// 임시 분석 데이터
	const [analysisData] = useState<MoldAnalysisData[]>([
		{
			id: 1,
			moldCode: 'MLD-001',
			moldName: '스마트폰 케이스 금형',
			moldType: 'Injection',
			supplier: '정밀금형',
			totalShots: 100000,
			currentShots: 75000,
			remainingShots: 25000,
			usageRate: 75,
			maintenanceDate: '2024-01-10',
			nextMaintenanceDate: '2024-02-10',
			status: '사용중',
			productName: '스마트폰 케이스',
			location: '라인-1',
			condition: '양호',
		},
		{
			id: 2,
			moldCode: 'MLD-002',
			moldName: '자동차 부품 금형',
			moldType: 'Compression',
			supplier: '대한금형',
			totalShots: 150000,
			currentShots: 140000,
			remainingShots: 10000,
			usageRate: 93,
			maintenanceDate: '2023-12-15',
			nextMaintenanceDate: '2024-01-25',
			status: '점검필요',
			productName: '브레이크 패드',
			location: '라인-2',
			condition: '주의',
		},
		{
			id: 3,
			moldCode: 'MLD-003',
			moldName: '전자부품 금형',
			moldType: 'Transfer',
			supplier: '정밀금형',
			totalShots: 80000,
			currentShots: 45000,
			remainingShots: 35000,
			usageRate: 56,
			maintenanceDate: '2024-01-20',
			nextMaintenanceDate: '2024-03-20',
			status: '사용중',
			productName: 'IC 하우징',
			location: '라인-3',
			condition: '양호',
		},
		{
			id: 4,
			moldCode: 'MLD-004',
			moldName: '의료기기 금형',
			moldType: 'Injection',
			supplier: '메디컬금형',
			totalShots: 200000,
			currentShots: 180000,
			remainingShots: 20000,
			usageRate: 90,
			maintenanceDate: '2023-11-30',
			nextMaintenanceDate: '2024-01-30',
			status: '점검필요',
			productName: '주사기 부품',
			location: '라인-4',
			condition: '주의',
		},
		{
			id: 5,
			moldCode: 'MLD-005',
			moldName: '가전제품 금형',
			moldType: 'Blow',
			supplier: '산업금형',
			totalShots: 120000,
			currentShots: 30000,
			remainingShots: 90000,
			usageRate: 25,
			maintenanceDate: '2024-01-18',
			nextMaintenanceDate: '2024-04-18',
			status: '대기중',
			productName: '세탁기 부품',
			location: '창고-A',
			condition: '양호',
		},
	]);

	// 컬럼 정의 함수
	const getAnalysisColumns = () => [
		{
			accessorKey: 'moldCode',
			header: '금형코드',
			size: 120,
		},
		{
			accessorKey: 'moldName',
			header: '금형명',
			size: 180,
		},
		{
			accessorKey: 'moldType',
			header: '금형타입',
			size: 120,
		},
		{
			accessorKey: 'supplier',
			header: '공급업체',
			size: 120,
		},
		{
			accessorKey: 'productName',
			header: '생산제품',
			size: 150,
		},
		{
			accessorKey: 'totalShots',
			header: '총 샷수',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value?.toLocaleString() || '-';
			},
		},
		{
			accessorKey: 'currentShots',
			header: '현재 샷수',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value?.toLocaleString() || '-';
			},
		},
		{
			accessorKey: 'usageRate',
			header: '사용률(%)',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				const color =
					value >= 90
						? 'text-red-600'
						: value >= 70
							? 'text-yellow-600'
							: value >= 50
								? 'text-green-600'
								: 'text-blue-600';
				return <span className={color}>{value}%</span>;
			},
		},
		{
			accessorKey: 'location',
			header: '위치',
			size: 100,
		},
		{
			accessorKey: 'maintenanceDate',
			header: '최근점검일',
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue() as string;
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'nextMaintenanceDate',
			header: '다음점검일',
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue() as string;
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'condition',
			header: '상태',
			size: 80,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue() as string;
				const conditionColors: Record<string, string> = {
					양호: 'bg-green-100 text-green-800',
					주의: 'bg-yellow-100 text-yellow-800',
					불량: 'bg-red-100 text-red-800',
					점검중: 'bg-blue-100 text-blue-800',
				};
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs ${conditionColors[value] || 'bg-gray-100 text-gray-800'}`}
					>
						{value}
					</span>
				);
			},
		},
		{
			accessorKey: 'status',
			header: '운영상태',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue() as string;
				const statusColors: Record<string, string> = {
					사용중: 'bg-green-100 text-green-800',
					점검필요: 'bg-red-100 text-red-800',
					대기중: 'bg-gray-100 text-gray-800',
					점검중: 'bg-blue-100 text-blue-800',
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
					title="총 금형 수"
					value={kpiData.totalMolds}
					icon={<Settings size={24} />}
					trend="up"
					trendValue="+3개"
					color="bg-blue-500"
				/>
				<KPICard
					title="가동 중인 금형"
					value={kpiData.activeMolds}
					icon={<CheckCircle size={24} />}
					trend="up"
					trendValue="+2개"
					color="bg-green-500"
				/>
				<KPICard
					title="점검 필요 금형"
					value={kpiData.maintenanceRequired}
					icon={<AlertTriangle size={24} />}
					trend="down"
					trendValue="-1개"
					color="bg-red-500"
				/>
				<KPICard
					title="평균 사용률"
					value={`${kpiData.averageUsageRate}%`}
					icon={<Target size={24} />}
					trend="up"
					trendValue="+5%"
					color="bg-yellow-500"
				/>
			</div>

			{/* 차트 영역 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-lg font-semibold mb-4 flex items-center">
						<BarChart3 className="mr-2 h-5 w-5" />
						금형 사용률 추이
					</h3>
					<div className="h-64 flex items-center justify-center text-gray-500">
						금형 사용률 차트 영역
						<br />
						(사용률별 금형 분포 및 추이)
					</div>
				</div>
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-lg font-semibold mb-4 flex items-center">
						<Target className="mr-2 h-5 w-5" />
						점검 스케줄 현황
					</h3>
					<div className="h-64 flex items-center justify-center text-gray-500">
						점검 스케줄 차트 영역
						<br />
						(월별 점검 예정 금형)
					</div>
				</div>
			</div>

			{/* 상세 데이터 테이블 */}
			<div className="bg-white rounded-lg shadow">
				<DatatableComponent
					table={table}
					columns={columns}
					data={analysisData}
					tableTitle="금형 상세 분석"
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

export default ProductionMoldAnalysisPage;
