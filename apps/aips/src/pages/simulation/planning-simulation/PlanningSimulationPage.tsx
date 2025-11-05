import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import { Play, TrendingUp, Clock, Zap } from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { toast } from 'sonner';
import { RadixIconButton } from '@radix-ui/components';

interface PlanningSimulation {
	id: number;
	scenarioName: string;
	scenarioType: 'production' | 'capacity' | 'resource' | 'demand';
	status: 'draft' | 'running' | 'completed' | 'failed';
	startDate: string;
	endDate: string;
	duration: number; // hours
	products: number;
	lines: number;
	machines: number;
	expectedOutput: number;
	actualOutput: number;
	efficiency: number;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// 더미 데이터
const planningSimulationData: PlanningSimulation[] = [
	{
		id: 1,
		scenarioName: '2024년 1분기 생산 계획 시뮬레이션',
		scenarioType: 'production',
		status: 'completed',
		startDate: '2024-01-01',
		endDate: '2024-03-31',
		duration: 24,
		products: 15,
		lines: 8,
		machines: 45,
		expectedOutput: 50000,
		actualOutput: 48500,
		efficiency: 97.0,
		createdBy: '시스템관리자',
		createdAt: '2024-01-01',
		updatedBy: '시스템관리자',
		updatedAt: '2024-01-01',
	},
	{
		id: 2,
		scenarioName: '신규 제품 라인 추가 시뮬레이션',
		scenarioType: 'capacity',
		status: 'running',
		startDate: '2024-02-01',
		endDate: '2024-06-30',
		duration: 12,
		products: 8,
		lines: 3,
		machines: 20,
		expectedOutput: 25000,
		actualOutput: 0,
		efficiency: 0,
		createdBy: '생산계획팀',
		createdAt: '2024-02-01',
		updatedBy: '생산계획팀',
		updatedAt: '2024-02-01',
	},
	{
		id: 3,
		scenarioName: '설비 점검 일정 최적화 시뮬레이션',
		scenarioType: 'resource',
		status: 'draft',
		startDate: '2024-03-01',
		endDate: '2024-05-31',
		duration: 8,
		products: 12,
		lines: 6,
		machines: 35,
		expectedOutput: 35000,
		actualOutput: 0,
		efficiency: 0,
		createdBy: '설비관리팀',
		createdAt: '2024-03-01',
		updatedBy: '설비관리팀',
		updatedAt: '2024-03-01',
	},
];

const PlanningSimulationPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<PlanningSimulation[]>([]);

	useEffect(() => {
		setData(planningSimulationData);
	}, []);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'draft':
				return 'text-gray-600 bg-gray-100';
			case 'running':
				return 'text-blue-600 bg-blue-100';
			case 'completed':
				return 'text-green-600 bg-green-100';
			case 'failed':
				return 'text-red-600 bg-red-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'draft':
				return '초안';
			case 'running':
				return '실행중';
			case 'completed':
				return '완료';
			case 'failed':
				return '실패';
			default:
				return '알 수 없음';
		}
	};

	const getScenarioTypeColor = (type: string) => {
		switch (type) {
			case 'production':
				return 'text-blue-600 bg-blue-100';
			case 'capacity':
				return 'text-green-600 bg-green-100';
			case 'resource':
				return 'text-purple-600 bg-purple-100';
			case 'demand':
				return 'text-orange-600 bg-orange-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getScenarioTypeText = (type: string) => {
		switch (type) {
			case 'production':
				return '생산';
			case 'capacity':
				return '능력';
			case 'resource':
				return '자원';
			case 'demand':
				return '수요';
			default:
				return '알 수 없음';
		}
	};

	// 차트 데이터
	const chartData = useMemo(() => {
		if (!data || data.length === 0) {
			return {
				efficiencyData: [],
				outputData: [],
				scenarios: [],
			};
		}

		const efficiencyData = data.map((item) => item.efficiency);
		const outputData = data.map((item) => item.expectedOutput / 1000); // Convert to thousands
		const scenarios = data.map(
			(item) => item.scenarioName.substring(0, 20) + '...'
		);

		return {
			efficiencyData,
			outputData,
			scenarios,
		};
	}, [data]);

	// DataTable columns configuration
	const columns = useMemo<ColumnConfig<PlanningSimulation>[]>(
		() => [
			{
				accessorKey: 'scenarioName',
				header: '시나리오명',
				size: 250,
				align: 'left' as const,
			},
			{
				accessorKey: 'scenarioType',
				header: '시나리오 유형',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getScenarioTypeColor(row.original.scenarioType)}`}
					>
						{getScenarioTypeText(row.original.scenarioType)}
					</span>
				),
			},
			{
				accessorKey: 'status',
				header: '상태',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.original.status)}`}
					>
						{getStatusText(row.original.status)}
					</span>
				),
			},
			{
				accessorKey: 'startDate',
				header: '시작일',
				size: 100,
				align: 'left' as const,
			},
			{
				accessorKey: 'endDate',
				header: '종료일',
				size: 100,
				align: 'left' as const,
			},
			{
				accessorKey: 'duration',
				header: '소요시간(시간)',
				size: 120,
				align: 'left' as const,
			},
			{
				accessorKey: 'expectedOutput',
				header: '예상 생산량',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.expectedOutput.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'actualOutput',
				header: '실제 생산량',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.actualOutput.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'efficiency',
				header: '효율성(%)',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.efficiency.toFixed(1)}%
					</div>
				),
			},
		],
		[]
	);

	const processedColumns = useDataTableColumns(columns);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		processedColumns,
		30,
		0,
		0,
		data.length,
		undefined // onPageChange
	);

	const efficiencyChartOption = {
		title: {
			text: '시나리오별 효율성',
			left: 'center',
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			data:
				chartData.scenarios.length > 0
					? chartData.scenarios
					: ['데이터 없음'],
			axisLabel: {
				rotate: 45,
			},
		},
		yAxis: {
			type: 'value',
			name: '효율성 (%)',
			max: 100,
		},
		series: [
			{
				name: '효율성',
				type: 'bar',
				data:
					chartData.efficiencyData.length > 0
						? chartData.efficiencyData
						: [0],
				itemStyle: {
					color: '#10B981',
				},
			},
		],
	};

	const outputChartOption = {
		title: {
			text: '시나리오별 예상 생산량 (천 단위)',
			left: 'center',
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			data:
				chartData.scenarios.length > 0
					? chartData.scenarios
					: ['데이터 없음'],
			axisLabel: {
				rotate: 45,
			},
		},
		yAxis: {
			type: 'value',
			name: '생산량 (천)',
		},
		series: [
			{
				name: '예상 생산량',
				type: 'line',
				data:
					chartData.outputData.length > 0
						? chartData.outputData
						: [0],
				itemStyle: {
					color: '#3B82F6',
				},
				smooth: true,
			},
		],
	};

	const handleRunSimulation = (id: number) => {
		toast.success(`시뮬레이션 ${id} 실행을 시작합니다.`);
		// 실제 시뮬레이션 실행 로직
	};

	const handleViewResults = (id: number) => {
		toast.info(`시뮬레이션 ${id} 결과를 확인합니다.`);
		// 결과 보기 로직
	};

	return (
		<div className="space-y-4">
			{/* 통계 카드 */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Play className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">총 시나리오</p>
							<p className="text-2xl font-bold text-gray-900">
								{data.length}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Clock className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">
								실행중인 시뮬레이션
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'running'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<TrendingUp className="h-8 w-8 text-yellow-600" />
						<div>
							<p className="text-sm text-gray-600">평균 효율성</p>
							<p className="text-2xl font-bold text-gray-900">
								{Math.round(
									data.reduce(
										(sum, item) => sum + item.efficiency,
										0
									) / data.length
								)}
								%
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Zap className="h-8 w-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600">
								총 예상 생산량
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{data
									.reduce(
										(sum, item) =>
											sum + item.expectedOutput,
										0
									)
									.toLocaleString()}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 차트 섹션 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="p-6 rounded-lg border">
					{efficiencyChartOption && (
						<EchartComponent
							options={efficiencyChartOption}
							styles={{ height: '400px' }}
						/>
					)}
				</div>
				<div className="p-6 rounded-lg border">
					{outputChartOption && (
						<EchartComponent
							options={outputChartOption}
							styles={{ height: '400px' }}
						/>
					)}
				</div>
			</div>

			{/* 데이터 테이블 */}
			<div className="rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="계획 시뮬레이션 시나리오"
					rowCount={data.length}
					useSearch={true}
					usePageNation={true}
					toggleRowSelection={toggleRowSelection}
					selectedRows={selectedRows}
					useEditable={false}
					actionButtons={
						<div className="flex gap-2">
							<RadixIconButton
								onClick={() => {
									const selectedId =
										Array.from(selectedRows)[0];
									if (selectedId) {
										handleRunSimulation(
											parseInt(selectedId)
										);
									}
								}}
								disabled={selectedRows.size !== 1}
								className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-700 hover:bg-Colors-Brand-800 text-white"
							>
								시뮬레이션 실행
							</RadixIconButton>

							<RadixIconButton
								onClick={() => {
									const selectedId =
										Array.from(selectedRows)[0];
									if (selectedId) {
										handleViewResults(parseInt(selectedId));
									}
								}}
								disabled={selectedRows.size !== 1}
								className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
							>
								결과 보기
							</RadixIconButton>
						</div>
					}
				/>
			</div>
		</div>
	);
};

export default PlanningSimulationPage;
