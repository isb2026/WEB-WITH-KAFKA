import React, { useState } from 'react';
import { useTranslation } from '@repo/i18n';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { EchartComponent } from '@repo/echart/components';
import {
	Search,
	Filter,
	Calendar,
	TrendingUp,
	BarChart3,
	CheckCircle,
	AlertTriangle,
	Activity,
} from 'lucide-react';
import {
	RadixSelect,
	RadixSelectGroup,
	RadixSelectItem,
} from '@radix-ui/components';

// 품질 분석 데이터 타입
interface QualityTrendData {
	date: string;
	totalInspections: number;
	okCount: number;
	warningCount: number;
	ngCount: number;
	okRate: number;
	defectRate: number;
}

interface InspectionSummary {
	id: number;
	productCode: string;
	productName: string;
	totalInspections: number;
	okCount: number;
	warningCount: number;
	ngCount: number;
	okRate: number;
	avgInspectionTime: number;
	lastInspectionDate: string;
}

const QualitySelfAnalysisPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [selectedPeriod, setSelectedPeriod] = useState('week');
	const [selectedProduct, setSelectedProduct] = useState('all');

	// 목업 품질 트렌드 데이터
	const qualityTrendData: QualityTrendData[] = [
		{
			date: '2024-01-15',
			totalInspections: 85,
			okCount: 78,
			warningCount: 5,
			ngCount: 2,
			okRate: 91.8,
			defectRate: 8.2,
		},
		{
			date: '2024-01-16',
			totalInspections: 92,
			okCount: 84,
			warningCount: 6,
			ngCount: 2,
			okRate: 91.3,
			defectRate: 8.7,
		},
		{
			date: '2024-01-17',
			totalInspections: 78,
			okCount: 72,
			warningCount: 4,
			ngCount: 2,
			okRate: 92.3,
			defectRate: 7.7,
		},
		{
			date: '2024-01-18',
			totalInspections: 88,
			okCount: 82,
			warningCount: 4,
			ngCount: 2,
			okRate: 93.2,
			defectRate: 6.8,
		},
		{
			date: '2024-01-19',
			totalInspections: 95,
			okCount: 89,
			warningCount: 4,
			ngCount: 2,
			okRate: 93.7,
			defectRate: 6.3,
		},
	];

	// 목업 검사 요약 데이터
	const inspectionSummaryData: InspectionSummary[] = [
		{
			id: 1,
			productCode: 'SP-CASE-001',
			productName: '갤럭시 S24 프로텍터 케이스',
			totalInspections: 156,
			okCount: 144,
			warningCount: 9,
			ngCount: 3,
			okRate: 92.3,
			avgInspectionTime: 8.5,
			lastInspectionDate: '2024-01-19',
		},
		{
			id: 2,
			productCode: 'AUTO-GEAR-205',
			productName: '변속기 기어 샤프트',
			totalInspections: 78,
			okCount: 74,
			warningCount: 3,
			ngCount: 1,
			okRate: 94.9,
			avgInspectionTime: 12.3,
			lastInspectionDate: '2024-01-19',
		},
		{
			id: 3,
			productCode: 'BRAKE-PAD-301',
			productName: '브레이크 패드',
			totalInspections: 203,
			okCount: 185,
			warningCount: 14,
			ngCount: 4,
			okRate: 91.1,
			avgInspectionTime: 6.8,
			lastInspectionDate: '2024-01-18',
		},
	];

	// 품질 트렌드 차트 생성
	const createQualityTrendChart = () => {
		const dates = qualityTrendData.map((item) => item.date);
		const okRates = qualityTrendData.map((item) => item.okRate);
		const defectRates = qualityTrendData.map((item) => item.defectRate);

		return {
			tooltip: {
				trigger: 'axis' as const,
				formatter: (params: any) => {
					const date = params[0].axisValue;
					let result = `<strong>${date}</strong><br/>`;
					params.forEach((param: any) => {
						result += `${param.seriesName}: ${param.value}%<br/>`;
					});
					return result;
				},
			},
			legend: {
				data: ['OK율', '불량률'],
				top: '10%',
			},
			xAxis: {
				type: 'category' as const,
				data: dates,
			},
			yAxis: {
				type: 'value' as const,
				min: 0,
				max: 100,
				axisLabel: {
					formatter: '{value}%',
				},
			},
			series: [
				{
					name: 'OK율',
					type: 'line',
					data: okRates,
					smooth: true,
					lineStyle: {
						color: '#10B981',
						width: 3,
					},
					itemStyle: {
						color: '#10B981',
					},
				},
				{
					name: '불량률',
					type: 'line',
					data: defectRates,
					smooth: true,
					lineStyle: {
						color: '#EF4444',
						width: 3,
					},
					itemStyle: {
						color: '#EF4444',
					},
				},
			],
		};
	};

	// 검사 건수 차트 생성
	const createInspectionVolumeChart = () => {
		const dates = qualityTrendData.map((item) => item.date);
		const totalInspections = qualityTrendData.map(
			(item) => item.totalInspections
		);

		return {
			tooltip: {
				trigger: 'axis' as const,
				formatter: (params: any) => {
					const date = params[0].axisValue;
					const count = params[0].value;
					return `<strong>${date}</strong><br/>검사 건수: ${count}건`;
				},
			},
			xAxis: {
				type: 'category' as const,
				data: dates,
			},
			yAxis: {
				type: 'value' as const,
				axisLabel: {
					formatter: '{value}건',
				},
			},
			series: [
				{
					name: '검사 건수',
					type: 'bar',
					data: totalInspections,
					itemStyle: {
						color: '#3B82F6',
					},
				},
			],
		};
	};

	// 테이블 컬럼 정의
	const summaryColumns = [
		{
			accessorKey: 'productCode',
			header: '제품코드',
			size: 150,
		},
		{
			accessorKey: 'productName',
			header: '제품명',
			size: 200,
		},
		{
			accessorKey: 'totalInspections',
			header: '총 검사수',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return `${value}건`;
			},
		},
		{
			accessorKey: 'okRate',
			header: 'OK율',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				const color =
					value >= 95
						? 'text-green-600'
						: value >= 90
							? 'text-yellow-600'
							: 'text-red-600';
				return <span className={`font-medium ${color}`}>{value}%</span>;
			},
		},
		{
			accessorKey: 'okCount',
			header: 'OK',
			size: 80,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return (
					<span className="text-green-600 font-medium">{value}</span>
				);
			},
		},
		{
			accessorKey: 'warningCount',
			header: 'WARNING',
			size: 80,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return (
					<span className="text-yellow-600 font-medium">{value}</span>
				);
			},
		},
		{
			accessorKey: 'ngCount',
			header: 'NG',
			size: 80,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return (
					<span className="text-red-600 font-medium">{value}</span>
				);
			},
		},
		{
			accessorKey: 'avgInspectionTime',
			header: '평균 검사시간',
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return `${value}분`;
			},
		},
		{
			accessorKey: 'lastInspectionDate',
			header: '최종 검사일',
			size: 120,
		},
	];

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		inspectionSummaryData,
		summaryColumns,
		10,
		1,
		0,
		inspectionSummaryData.length,
		() => {}
	);

	// KPI 데이터 계산
	const kpiData = {
		totalInspections: qualityTrendData.reduce(
			(sum, item) => sum + item.totalInspections,
			0
		),
		averageOkRate:
			Math.round(
				(qualityTrendData.reduce((sum, item) => sum + item.okRate, 0) /
					qualityTrendData.length) *
					10
			) / 10,
		totalDefects: qualityTrendData.reduce(
			(sum, item) => sum + item.ngCount + item.warningCount,
			0
		),
		trendingProducts: inspectionSummaryData.filter(
			(item) => item.okRate >= 95
		).length,
	};

	// KPI Card 컴포넌트
	const KPICard: React.FC<{
		title: string;
		value: string | number;
		icon: React.ReactNode;
		trend?: 'up' | 'down' | 'neutral';
		trendValue?: string;
		color: string;
	}> = ({ title, value, icon, trend = 'neutral', trendValue, color }) => (
		<div className="bg-white rounded-lg shadow p-6">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-gray-600">{title}</p>
					<p className="text-2xl font-bold text-gray-900">{value}</p>
				</div>
				<div className={`p-3 rounded-full ${color}`}>{icon}</div>
			</div>
			{trend !== 'neutral' && trendValue && (
				<div className="mt-2">
					<span
						className={`text-sm font-medium ${
							trend === 'up' ? 'text-green-600' : 'text-red-600'
						}`}
					>
						{trend === 'up' ? '↗' : '↘'} {trendValue}
					</span>
				</div>
			)}
		</div>
	);

	return (
		<PageTemplate>
			{/* 필터 섹션 */}
			<div className="bg-white rounded-lg border p-4 mb-6">
				<div className="flex flex-wrap items-center gap-6">
					<div className="flex items-center gap-2 min-w-0">
						<Calendar
							size={16}
							className="text-gray-500 shrink-0"
						/>
						<span className="text-sm font-medium shrink-0">
							기간:
						</span>
						<div className="min-w-[120px]">
							<RadixSelect
								value={selectedPeriod}
								onValueChange={setSelectedPeriod}
							>
								<RadixSelectGroup>
									<RadixSelectItem value="week">
										최근 7일
									</RadixSelectItem>
									<RadixSelectItem value="month">
										최근 30일
									</RadixSelectItem>
									<RadixSelectItem value="quarter">
										최근 3개월
									</RadixSelectItem>
								</RadixSelectGroup>
							</RadixSelect>
						</div>
					</div>

					<div className="flex items-center gap-2 min-w-0">
						<Filter size={16} className="text-gray-500 shrink-0" />
						<span className="text-sm font-medium shrink-0">
							제품:
						</span>
						<div className="min-w-[160px]">
							<RadixSelect
								value={selectedProduct}
								onValueChange={setSelectedProduct}
							>
								<RadixSelectGroup>
									<RadixSelectItem value="all">
										전체 제품
									</RadixSelectItem>
									<RadixSelectItem value="SP-CASE-001">
										갤럭시 S24 케이스
									</RadixSelectItem>
									<RadixSelectItem value="AUTO-GEAR-205">
										변속기 기어 샤프트
									</RadixSelectItem>
									<RadixSelectItem value="BRAKE-PAD-301">
										브레이크 패드
									</RadixSelectItem>
								</RadixSelectGroup>
							</RadixSelect>
						</div>
					</div>
				</div>
			</div>

			{/* KPI Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
				<KPICard
					title="총 검사수"
					value={`${kpiData.totalInspections}건`}
					icon={<Activity size={24} className="text-white" />}
					trend="up"
					trendValue="+12%"
					color="bg-blue-500"
				/>
				<KPICard
					title="평균 OK율"
					value={`${kpiData.averageOkRate}%`}
					icon={<CheckCircle size={24} className="text-white" />}
					trend="up"
					trendValue="+2.3%"
					color="bg-green-500"
				/>
				<KPICard
					title="총 불량수"
					value={`${kpiData.totalDefects}건`}
					icon={<AlertTriangle size={24} className="text-white" />}
					trend="down"
					trendValue="-8%"
					color="bg-red-500"
				/>
				<KPICard
					title="우수 제품수"
					value={`${kpiData.trendingProducts}개`}
					icon={<TrendingUp size={24} className="text-white" />}
					trend="up"
					trendValue="+1개"
					color="bg-purple-500"
				/>
			</div>

			{/* 차트 섹션 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				<div className="bg-white rounded-lg shadow p-6">
					<EchartComponent
						options={createQualityTrendChart()}
						height="400px"
					/>
				</div>
				<div className="bg-white rounded-lg shadow p-6">
					<EchartComponent
						options={createInspectionVolumeChart()}
						height="400px"
					/>
				</div>
			</div>

			{/* 요약 테이블 */}
			<div className="bg-white rounded-lg shadow">
				<DatatableComponent
					table={table}
					columns={summaryColumns}
					data={inspectionSummaryData}
					tableTitle="제품별 품질 분석 요약"
					rowCount={inspectionSummaryData.length}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					useSearch={true}
					usePageNation={false}
					useSummary={true}
				/>
			</div>
		</PageTemplate>
	);
};

export default QualitySelfAnalysisPage;
