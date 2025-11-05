import React, { useState } from 'react';
import { useTranslation } from '@repo/i18n';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { EchartComponent } from '@repo/echart/components';
import {
	AlertTriangle,
	TrendingDown,
	BarChart3,
	PieChart,
	Activity,
	Target,
} from 'lucide-react';
import {
	RadixSelect,
	RadixSelectGroup,
	RadixSelectItem,
} from '@radix-ui/components';

// 불량률 분석 데이터 타입
interface DefectTrendData {
	date: string;
	totalDefects: number;
	defectRate: number;
	dimensionalDefects: number;
	functionalDefects: number;
	appearanceDefects: number;
}

interface DefectTypeData {
	defectType: string;
	count: number;
	percentage: number;
	trend: 'up' | 'down' | 'stable';
}

interface DefectDetailData {
	id: number;
	itemNumber: string;
	itemName: string;
	defectType: string;
	defectDescription: string;
	occurrence: number;
	defectRate: number;
	trend: string;
	severity: 'high' | 'medium' | 'low';
}

const ProductionDefectsAnalysisPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [selectedPeriod, setSelectedPeriod] = useState('week');
	const [selectedSeverity, setSelectedSeverity] = useState('all');

	// 목업 불량률 트렌드 데이터
	const defectTrendData: DefectTrendData[] = [
		{
			date: '2024-01-15',
			totalDefects: 7,
			defectRate: 8.2,
			dimensionalDefects: 3,
			functionalDefects: 2,
			appearanceDefects: 2,
		},
		{
			date: '2024-01-16',
			totalDefects: 8,
			defectRate: 8.7,
			dimensionalDefects: 4,
			functionalDefects: 2,
			appearanceDefects: 2,
		},
		{
			date: '2024-01-17',
			totalDefects: 6,
			defectRate: 7.7,
			dimensionalDefects: 2,
			functionalDefects: 2,
			appearanceDefects: 2,
		},
		{
			date: '2024-01-18',
			totalDefects: 6,
			defectRate: 6.8,
			dimensionalDefects: 3,
			functionalDefects: 1,
			appearanceDefects: 2,
		},
		{
			date: '2024-01-19',
			totalDefects: 6,
			defectRate: 6.3,
			dimensionalDefects: 2,
			functionalDefects: 2,
			appearanceDefects: 2,
		},
	];

	// 불량 유형별 데이터
	const defectTypeData: DefectTypeData[] = [
		{
			defectType: '치수 불량',
			count: 14,
			percentage: 42.4,
			trend: 'down',
		},
		{
			defectType: '기능 불량',
			count: 9,
			percentage: 27.3,
			trend: 'stable',
		},
		{
			defectType: '외관 불량',
			count: 10,
			percentage: 30.3,
			trend: 'up',
		},
	];

	// 상세 불량 데이터
	const defectDetailData: DefectDetailData[] = [
		{
			id: 1,
			itemNumber: 'SP-CASE-001',
			itemName: '갤럭시 S24 프로텍터 케이스',
			defectType: '치수 불량',
			defectDescription: '전체 길이 초과',
			occurrence: 8,
			defectRate: 5.1,
			trend: '↓ 2.3%',
			severity: 'high',
		},
		{
			id: 2,
			itemNumber: 'AUTO-GEAR-205',
			itemName: '변속기 기어 샤프트',
			defectType: '기능 불량',
			defectDescription: '경도 부족',
			occurrence: 3,
			defectRate: 3.8,
			trend: '↑ 1.2%',
			severity: 'high',
		},
		{
			id: 3,
			itemNumber: 'BRAKE-PAD-301',
			itemName: '브레이크 패드',
			defectType: '외관 불량',
			defectDescription: '표면 거칠기 초과',
			occurrence: 6,
			defectRate: 3.0,
			trend: '→ 0.1%',
			severity: 'medium',
		},
		{
			id: 4,
			itemNumber: 'SP-CASE-001',
			itemName: '갤럭시 S24 프로텍터 케이스',
			defectType: '외관 불량',
			defectDescription: '투명도 부족',
			occurrence: 4,
			defectRate: 2.6,
			trend: '↓ 0.8%',
			severity: 'low',
		},
	];

	// 불량률 트렌드 차트 생성
	const createDefectTrendChart = () => {
		const dates = defectTrendData.map((item) => item.date);
		const defectRates = defectTrendData.map((item) => item.defectRate);

		return {
			tooltip: {
				trigger: 'axis' as const,
				formatter: (params: any) => {
					const date = params[0].axisValue;
					const rate = params[0].value;
					return `<strong>${date}</strong><br/>불량률: ${rate}%`;
				},
			},
			xAxis: {
				type: 'category' as const,
				data: dates,
			},
			yAxis: {
				type: 'value' as const,
				min: 0,
				max: 15,
				axisLabel: {
					formatter: '{value}%',
				},
			},
			series: [
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
					areaStyle: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{
									offset: 0,
									color: 'rgba(239, 68, 68, 0.3)',
								},
								{
									offset: 1,
									color: 'rgba(239, 68, 68, 0.1)',
								},
							],
						},
					},
				},
			],
		};
	};

	// 불량 유형별 파이 차트 생성
	const createDefectTypeChart = () => {
		const data = defectTypeData.map((item) => ({
			name: item.defectType,
			value: item.count,
		}));

		return {
			tooltip: {
				trigger: 'item' as const,
				formatter: (params: any) => {
					return `${params.name}<br/>건수: ${params.value}건 (${params.percent}%)`;
				},
			},
			legend: {
				orient: 'vertical' as const,
				left: 'left',
				top: 'middle',
			},
			series: [
				{
					name: '불량 유형',
					type: 'pie',
					radius: ['40%', '70%'],
					avoidLabelOverlap: false,
					data: data,
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)',
						},
					},
					itemStyle: {
						color: (params: any) => {
							const colors = ['#EF4444', '#F97316', '#EAB308'];
							return colors[params.dataIndex % colors.length];
						},
					},
				},
			],
		};
	};

	// 불량 유형별 스택 차트 생성
	const createDefectStackChart = () => {
		const dates = defectTrendData.map((item) => item.date);
		const dimensionalData = defectTrendData.map(
			(item) => item.dimensionalDefects
		);
		const functionalData = defectTrendData.map(
			(item) => item.functionalDefects
		);
		const appearanceData = defectTrendData.map(
			(item) => item.appearanceDefects
		);

		return {
			tooltip: {
				trigger: 'axis' as const,
			},
			legend: {
				data: ['치수 불량', '기능 불량', '외관 불량'],
				top: '10%',
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
					name: '치수 불량',
					type: 'bar',
					stack: 'total',
					data: dimensionalData,
					itemStyle: {
						color: '#EF4444',
					},
				},
				{
					name: '기능 불량',
					type: 'bar',
					stack: 'total',
					data: functionalData,
					itemStyle: {
						color: '#F97316',
					},
				},
				{
					name: '외관 불량',
					type: 'bar',
					stack: 'total',
					data: appearanceData,
					itemStyle: {
						color: '#EAB308',
					},
				},
			],
		};
	};

	// 테이블 컬럼 정의
	const detailColumns = [
		{
			accessorKey: 'itemNumber',
			header: '제품코드',
			size: 120,
		},
		{
			accessorKey: 'itemName',
			header: '제품명',
			size: 180,
		},
		{
			accessorKey: 'defectType',
			header: '불량 유형',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				const colorMap: { [key: string]: string } = {
					'치수 불량': 'bg-red-100 text-red-800',
					'기능 불량': 'bg-orange-100 text-orange-800',
					'외관 불량': 'bg-yellow-100 text-yellow-800',
				};
				return (
					<span
						className={`px-2 py-1 rounded text-xs ${colorMap[value] || 'bg-gray-100 text-gray-800'}`}
					>
						{value}
					</span>
				);
			},
		},
		{
			accessorKey: 'defectDescription',
			header: '불량 내용',
			size: 150,
		},
		{
			accessorKey: 'occurrence',
			header: '발생 건수',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return `${value}건`;
			},
		},
		{
			accessorKey: 'defectRate',
			header: '불량률',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				const color =
					value >= 5
						? 'text-red-600'
						: value >= 3
							? 'text-orange-600'
							: 'text-yellow-600';
				return <span className={`font-medium ${color}`}>{value}%</span>;
			},
		},
		{
			accessorKey: 'trend',
			header: '추이',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				const color = value.includes('↓')
					? 'text-green-600'
					: value.includes('↑')
						? 'text-red-600'
						: 'text-gray-600';
				return <span className={`font-medium ${color}`}>{value}</span>;
			},
		},
		{
			accessorKey: 'severity',
			header: '심각도',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				const colorMap: { [key: string]: string } = {
					high: 'bg-red-100 text-red-800',
					medium: 'bg-yellow-100 text-yellow-800',
					low: 'bg-green-100 text-green-800',
				};
				const labelMap: { [key: string]: string } = {
					high: '높음',
					medium: '중간',
					low: '낮음',
				};
				return (
					<span
						className={`px-2 py-1 rounded text-xs ${colorMap[value] || 'bg-gray-100 text-gray-800'}`}
					>
						{labelMap[value] || value}
					</span>
				);
			},
		},
	];

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		defectDetailData,
		detailColumns,
		10,
		1,
		0,
		defectDetailData.length,
		() => {}
	);

	// KPI 데이터 계산
	const kpiData = {
		totalDefects: defectTrendData.reduce(
			(sum, item) => sum + item.totalDefects,
			0
		),
		averageDefectRate:
			Math.round(
				(defectTrendData.reduce(
					(sum, item) => sum + item.defectRate,
					0
				) /
					defectTrendData.length) *
					10
			) / 10,
		highSeverityDefects: defectDetailData.filter(
			(item) => item.severity === 'high'
		).length,
		improvingTrends: defectDetailData.filter((item) =>
			item.trend.includes('↓')
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
							trend === 'up' ? 'text-red-600' : 'text-green-600'
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
						<BarChart3
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
						<AlertTriangle
							size={16}
							className="text-gray-500 shrink-0"
						/>
						<span className="text-sm font-medium shrink-0">
							심각도:
						</span>
						<div className="min-w-[100px]">
							<RadixSelect
								value={selectedSeverity}
								onValueChange={setSelectedSeverity}
							>
								<RadixSelectGroup>
									<RadixSelectItem value="all">
										전체
									</RadixSelectItem>
									<RadixSelectItem value="high">
										높음
									</RadixSelectItem>
									<RadixSelectItem value="medium">
										중간
									</RadixSelectItem>
									<RadixSelectItem value="low">
										낮음
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
					title="총 불량수"
					value={`${kpiData.totalDefects}건`}
					icon={<AlertTriangle size={24} className="text-white" />}
					trend="down"
					trendValue="-5%"
					color="bg-red-500"
				/>
				<KPICard
					title="평균 불량률"
					value={`${kpiData.averageDefectRate}%`}
					icon={<TrendingDown size={24} className="text-white" />}
					trend="down"
					trendValue="-1.2%"
					color="bg-orange-500"
				/>
				<KPICard
					title="심각 불량"
					value={`${kpiData.highSeverityDefects}건`}
					icon={<Activity size={24} className="text-white" />}
					trend="down"
					trendValue="-2건"
					color="bg-red-600"
				/>
				<KPICard
					title="개선 추세"
					value={`${kpiData.improvingTrends}개`}
					icon={<Target size={24} className="text-white" />}
					trend="up"
					trendValue="+3개"
					color="bg-green-500"
				/>
			</div>

			{/* 차트 섹션 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				<div className="bg-white rounded-lg shadow p-6">
					<EchartComponent
						options={createDefectTrendChart()}
						height="400px"
					/>
				</div>
				<div className="bg-white rounded-lg shadow p-6">
					<EchartComponent
						options={createDefectTypeChart()}
						height="400px"
					/>
				</div>
			</div>

			{/* 스택 차트 */}
			<div className="bg-white rounded-lg shadow p-6 mb-6">
				<EchartComponent
					options={createDefectStackChart()}
					height="400px"
				/>
			</div>

			{/* 상세 테이블 */}
			<div className="bg-white rounded-lg shadow">
				<DatatableComponent
					table={table}
					columns={detailColumns}
					data={defectDetailData}
					tableTitle="불량 상세 분석"
					rowCount={defectDetailData.length}
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

export default ProductionDefectsAnalysisPage;
