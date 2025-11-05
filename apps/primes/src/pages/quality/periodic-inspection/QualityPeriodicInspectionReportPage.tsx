import React, { useMemo, useState } from 'react';
import PageTemplate from '@primes/templates/PageTemplate';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import { EchartComponent } from '@repo/echart/components';
import {
	Calendar,
	BarChart3,
	Activity,
	CheckCircle,
	AlertTriangle,
} from 'lucide-react';
import {
	RadixSelect,
	RadixSelectGroup,
	RadixSelectItem,
} from '@repo/radix-ui/components';

type TableCellContext<TData, TValue> = {
	getValue: () => TValue;
	row: { original: TData };
};

interface PeriodTrendData {
	date: string;
	planned: number;
	completed: number;
	overdue: number;
	completionRate: number; // %
}

interface EquipmentSummary {
	id: number;
	equipmentCode: string;
	equipmentName: string;
	planned: number;
	completed: number;
	overdue: number;
	completionRate: number; // %
	avgInspectionTime: number; // hours
}

const QualityPeriodicInspectionReportPage: React.FC = () => {
	const [selectedPeriod, setSelectedPeriod] = useState('month');
	const [selectedType, setSelectedType] = useState('all');

	// 목업 트렌드 데이터 (기간별 계획/완료/지연 및 완료율)
	const trendData: PeriodTrendData[] = [
		{
			date: '2024-01',
			planned: 48,
			completed: 42,
			overdue: 3,
			completionRate: 87.5,
		},
		{
			date: '2024-02',
			planned: 50,
			completed: 47,
			overdue: 2,
			completionRate: 94.0,
		},
		{
			date: '2024-03',
			planned: 52,
			completed: 49,
			overdue: 1,
			completionRate: 94.2,
		},
		{
			date: '2024-04',
			planned: 46,
			completed: 41,
			overdue: 4,
			completionRate: 89.1,
		},
	];

	// 설비별 요약 데이터
	const equipmentSummary: EquipmentSummary[] = [
		{
			id: 1,
			equipmentCode: 'INJ-001',
			equipmentName: '사출성형기 #001',
			planned: 12,
			completed: 11,
			overdue: 1,
			completionRate: 91.7,
			avgInspectionTime: 3.8,
		},
		{
			id: 2,
			equipmentCode: 'CNV-A01',
			equipmentName: '컨베이어 라인 A',
			planned: 10,
			completed: 9,
			overdue: 0,
			completionRate: 90.0,
			avgInspectionTime: 4.1,
		},
		{
			id: 3,
			equipmentCode: 'PRS-003',
			equipmentName: '프레스 #003',
			planned: 11,
			completed: 9,
			overdue: 2,
			completionRate: 81.8,
			avgInspectionTime: 3.3,
		},
	];

	// 차트 옵션 - 완료율/지연 추이
	const createCompletionTrendChart = () => {
		const labels = trendData.map((d) => d.date);
		const completionRates = trendData.map((d) => d.completionRate);
		const overdueCounts = trendData.map((d) => d.overdue);
		return {
			tooltip: { trigger: 'axis' as const },
			legend: { data: ['완료율', '지연 건수'], top: '10%' },
			xAxis: { type: 'category' as const, data: labels },
			yAxis: [
				{
					type: 'value' as const,
					min: 0,
					max: 100,
					axisLabel: { formatter: '{value}%' },
				},
				{
					type: 'value' as const,
					min: 0,
					axisLabel: { formatter: '{value}건' },
				},
			],
			series: [
				{
					name: '완료율',
					type: 'line',
					data: completionRates,
					smooth: true,
					yAxisIndex: 0,
					lineStyle: { width: 3, color: '#10B981' },
				},
				{
					name: '지연 건수',
					type: 'bar',
					data: overdueCounts,
					yAxisIndex: 1,
					itemStyle: { color: '#EF4444' },
				},
			],
		};
	};

	// 차트 옵션 - 계획 대비 완료
	const createPlanVsCompleteChart = () => {
		const labels = trendData.map((d) => d.date);
		const planned = trendData.map((d) => d.planned);
		const completed = trendData.map((d) => d.completed);
		return {
			tooltip: { trigger: 'axis' as const },
			legend: { data: ['계획', '완료'] },
			xAxis: { type: 'category' as const, data: labels },
			yAxis: {
				type: 'value' as const,
				axisLabel: { formatter: '{value}건' },
			},
			series: [
				{
					name: '계획',
					type: 'bar',
					data: planned,
					itemStyle: { color: '#3B82F6' },
				},
				{
					name: '완료',
					type: 'bar',
					data: completed,
					itemStyle: { color: '#10B981' },
				},
			],
		};
	};

	// 테이블 컬럼
	const summaryColumns = [
		{ accessorKey: 'equipmentCode', header: '설비코드', size: 120 },
		{ accessorKey: 'equipmentName', header: '설비명', size: 180 },
		{ accessorKey: 'planned', header: '계획', size: 80 },
		{ accessorKey: 'completed', header: '완료', size: 80 },
		{ accessorKey: 'overdue', header: '지연', size: 80 },
		{
			accessorKey: 'completionRate',
			header: '완료율',
			size: 100,
			cell: (info: TableCellContext<EquipmentSummary, number>) => {
				const value = info.getValue();
				const color =
					value >= 95
						? 'text-green-600'
						: value >= 85
							? 'text-yellow-600'
							: 'text-red-600';
				return <span className={`font-medium ${color}`}>{value}%</span>;
			},
		},
		{
			accessorKey: 'avgInspectionTime',
			header: '평균 검사시간',
			size: 140,
			cell: (info: TableCellContext<EquipmentSummary, number>) =>
				`${info.getValue()}시간`,
		},
	];

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		equipmentSummary,
		summaryColumns,
		10,
		1,
		0,
		equipmentSummary.length,
		() => {}
	);

	// KPI 데이터
	const totalPlanned = useMemo(
		() => trendData.reduce((s, d) => s + d.planned, 0),
		[]
	);
	const totalCompleted = useMemo(
		() => trendData.reduce((s, d) => s + d.completed, 0),
		[]
	);
	const totalOverdue = useMemo(
		() => trendData.reduce((s, d) => s + d.overdue, 0),
		[]
	);
	const avgCompletionRate = useMemo(
		() =>
			Math.round(
				(trendData.reduce((s, d) => s + d.completionRate, 0) /
					trendData.length) *
					10
			) / 10,
		[]
	);

	const KPICard: React.FC<{
		title: string;
		value: string | number;
		icon: React.ReactNode;
		color: string;
	}> = ({ title, value, icon, color }) => (
		<div className="bg-white rounded-lg shadow p-6">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-gray-600">{title}</p>
					<p className="text-2xl font-bold text-gray-900">{value}</p>
				</div>
				<div className={`p-3 rounded-full ${color}`}>{icon}</div>
			</div>
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
						<BarChart3
							size={16}
							className="text-gray-500 shrink-0"
						/>
						<span className="text-sm font-medium shrink-0">
							유형:
						</span>
						<div className="min-w-[160px]">
							<RadixSelect
								value={selectedType}
								onValueChange={setSelectedType}
							>
								<RadixSelectGroup>
									<RadixSelectItem value="all">
										전체 유형
									</RadixSelectItem>
									<RadixSelectItem value="monthly">
										월간정기검사
									</RadixSelectItem>
									<RadixSelectItem value="quarterly">
										분기정기검사
									</RadixSelectItem>
									<RadixSelectItem value="semi-annual">
										반기정기검사
									</RadixSelectItem>
									<RadixSelectItem value="annual">
										연간정기검사
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
					title="총 계획"
					value={`${totalPlanned}건`}
					icon={<Activity size={24} className="text-white" />}
					color="bg-blue-500"
				/>
				<KPICard
					title="총 완료"
					value={`${totalCompleted}건`}
					icon={<CheckCircle size={24} className="text-white" />}
					color="bg-green-500"
				/>
				<KPICard
					title="지연"
					value={`${totalOverdue}건`}
					icon={<AlertTriangle size={24} className="text-white" />}
					color="bg-red-500"
				/>
				<KPICard
					title="평균 완료율"
					value={`${avgCompletionRate}%`}
					icon={<BarChart3 size={24} className="text-white" />}
					color="bg-purple-500"
				/>
			</div>

			{/* 차트 섹션 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				<div className="bg-white rounded-lg shadow p-6">
					<EchartComponent
						options={createCompletionTrendChart()}
						height="400px"
					/>
				</div>
				<div className="bg-white rounded-lg shadow p-6">
					<EchartComponent
						options={createPlanVsCompleteChart()}
						height="400px"
					/>
				</div>
			</div>

			{/* 요약 테이블 */}
			<div className="bg-white rounded-lg shadow">
				<DatatableComponent
					table={table}
					columns={summaryColumns}
					data={equipmentSummary}
					tableTitle="설비별 정기검사 요약"
					rowCount={equipmentSummary.length}
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

export default QualityPeriodicInspectionReportPage;
