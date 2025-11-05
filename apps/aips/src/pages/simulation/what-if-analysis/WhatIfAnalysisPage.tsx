import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	HelpCircle,
	TrendingUp,
	Zap,
	Activity,
	Play,
	RotateCcw,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { toast } from 'sonner';
import { RadixIconButton } from '@radix-ui/components';

interface WhatIfScenario {
	id: number;
	scenarioName: string;
	scenarioType: 'demand' | 'resource' | 'capacity' | 'schedule';
	baseValue: number;
	modifiedValue: number;
	changePercent: number;
	impactOnOutput: number;
	impactOnCost: number;
	impactOnEfficiency: number;
	status: 'draft' | 'analyzing' | 'completed';
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// 더미 데이터
const whatIfAnalysisData: WhatIfScenario[] = [
	{
		id: 1,
		scenarioName: '수요 증가 20% 시나리오',
		scenarioType: 'demand',
		baseValue: 1000,
		modifiedValue: 1200,
		changePercent: 20,
		impactOnOutput: 15,
		impactOnCost: 8,
		impactOnEfficiency: -5,
		status: 'completed',
		createdBy: '생산계획팀',
		createdAt: '2024-01-01',
		updatedBy: '생산계획팀',
		updatedAt: '2024-01-01',
	},
	{
		id: 2,
		scenarioName: '설비 가동률 90% 시나리오',
		scenarioType: 'resource',
		baseValue: 80,
		modifiedValue: 90,
		changePercent: 12.5,
		impactOnOutput: 10,
		impactOnCost: 5,
		impactOnEfficiency: 8,
		status: 'analyzing',
		createdBy: '설비관리팀',
		createdAt: '2024-01-02',
		updatedBy: '설비관리팀',
		updatedAt: '2024-01-02',
	},
	{
		id: 3,
		scenarioName: '생산라인 2개 추가 시나리오',
		scenarioType: 'capacity',
		baseValue: 8,
		modifiedValue: 10,
		changePercent: 25,
		impactOnOutput: 25,
		impactOnCost: 15,
		impactOnEfficiency: 3,
		status: 'draft',
		createdBy: '생산계획팀',
		createdAt: '2024-01-03',
		updatedBy: '생산계획팀',
		updatedAt: '2024-01-03',
	},
];

const WhatIfAnalysisPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<WhatIfScenario[]>([]);
	const [selectedScenario, setSelectedScenario] =
		useState<WhatIfScenario | null>(null);
	const [simulationParams, setSimulationParams] = useState({
		demandChange: 0,
		resourceChange: 0,
		capacityChange: 0,
		scheduleChange: 0,
	});

	useEffect(() => {
		setData(whatIfAnalysisData);
	}, []);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'draft':
				return 'text-gray-600 bg-gray-100';
			case 'analyzing':
				return 'text-blue-600 bg-blue-100';
			case 'completed':
				return 'text-green-600 bg-green-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'draft':
				return '초안';
			case 'analyzing':
				return '분석중';
			case 'completed':
				return '완료';
			default:
				return '알 수 없음';
		}
	};

	const getScenarioTypeColor = (type: string) => {
		switch (type) {
			case 'demand':
				return 'text-blue-600 bg-blue-100';
			case 'resource':
				return 'text-green-600 bg-green-100';
			case 'capacity':
				return 'text-purple-600 bg-purple-100';
			case 'schedule':
				return 'text-orange-600 bg-orange-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getScenarioTypeText = (type: string) => {
		switch (type) {
			case 'demand':
				return '수요';
			case 'resource':
				return '자원';
			case 'capacity':
				return '능력';
			case 'schedule':
				return '일정';
			default:
				return '알 수 없음';
		}
	};

	// 차트 데이터
	const chartData = useMemo(() => {
		if (!data || data.length === 0) {
			return {
				impactData: [],
				scenarios: [],
			};
		}

		const impactData = data.map((item) => ({
			output: item.impactOnOutput,
			cost: item.impactOnCost,
			efficiency: item.impactOnEfficiency,
		}));
		const scenarios = data.map(
			(item) => item.scenarioName.substring(0, 15) + '...'
		);

		return {
			impactData,
			scenarios,
		};
	}, [data]);

	// DataTable columns configuration
	const columns = useMemo<ColumnConfig<WhatIfScenario>[]>(
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
				accessorKey: 'changePercent',
				header: '변경률(%)',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.changePercent > 0 ? '+' : ''}
						{row.original.changePercent.toFixed(1)}%
					</div>
				),
			},
			{
				accessorKey: 'impactOnOutput',
				header: '생산량 영향(%)',
				size: 130,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.impactOnOutput > 0 ? '+' : ''}
						{row.original.impactOnOutput.toFixed(1)}%
					</div>
				),
			},
			{
				accessorKey: 'impactOnCost',
				header: '비용 영향(%)',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.impactOnCost > 0 ? '+' : ''}
						{row.original.impactOnCost.toFixed(1)}%
					</div>
				),
			},
			{
				accessorKey: 'impactOnEfficiency',
				header: '효율성 영향(%)',
				size: 130,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.impactOnEfficiency > 0 ? '+' : ''}
						{row.original.impactOnEfficiency.toFixed(1)}%
					</div>
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

	// Interactive chart options
	const impactChartOption = {
		title: {
			text: '시나리오별 영향도 분석',
			left: 'center',
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		legend: {
			data: ['생산량 영향', '비용 영향', '효율성 영향'],
			top: 30,
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
			name: '영향도 (%)',
		},
		series: [
			{
				name: '생산량 영향',
				type: 'bar',
				data: chartData.impactData.map((item) => item.output),
				itemStyle: {
					color: '#3B82F6',
				},
			},
			{
				name: '비용 영향',
				type: 'bar',
				data: chartData.impactData.map((item) => item.cost),
				itemStyle: {
					color: '#EF4444',
				},
			},
			{
				name: '효율성 영향',
				type: 'bar',
				data: chartData.impactData.map((item) => item.efficiency),
				itemStyle: {
					color: '#10B981',
				},
			},
		],
	};

	const comparisonChartOption = {
		title: {
			text: '기준값 vs 수정값 비교',
			left: 'center',
		},
		tooltip: {
			trigger: 'item',
		},
		legend: {
			orient: 'vertical',
			left: 'left',
		},
		series: [
			{
				name: '영향도',
				type: 'pie',
				radius: '50%',
				data: [
					{
						value: Math.abs(chartData.impactData[0]?.output || 0),
						name: '생산량',
					},
					{
						value: Math.abs(chartData.impactData[0]?.cost || 0),
						name: '비용',
					},
					{
						value: Math.abs(
							chartData.impactData[0]?.efficiency || 0
						),
						name: '효율성',
					},
				],
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					},
				},
			},
		],
	};

	const handleRunAnalysis = () => {
		toast.success('What-if 분석을 시작합니다.');
		// 실제 분석 실행 로직
	};

	const handleResetParams = () => {
		setSimulationParams({
			demandChange: 0,
			resourceChange: 0,
			capacityChange: 0,
			scheduleChange: 0,
		});
		toast.info('파라미터가 초기화되었습니다.');
	};

	const handleScenarioSelect = (scenario: WhatIfScenario) => {
		setSelectedScenario(scenario);
		toast.info(`${scenario.scenarioName} 시나리오를 선택했습니다.`);
	};

	return (
		<div className="space-y-4">
			{/* 통계 카드 */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<HelpCircle className="h-8 w-8 text-blue-600" />
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
						<Activity className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">
								분석중인 시나리오
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'analyzing'
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
							<p className="text-sm text-gray-600">
								평균 생산량 영향
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{Math.round(
									data.reduce(
										(sum, item) =>
											sum + item.impactOnOutput,
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
							<p className="text-sm text-gray-600">완료된 분석</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'completed'
									).length
								}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 인터랙티브 시뮬레이션 컨트롤 */}
			<div className="p-6 rounded-lg border">
				<div className="flex items-center justify-between mb-2">
					<h3 className="text-lg font-semibold mb-4">
						인터랙티브 시뮬레이션 파라미터
					</h3>
					<div className="flex gap-2 items-center">
						<RadixIconButton
							onClick={handleRunAnalysis}
							className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-700 hover:bg-Colors-Brand-800 text-white"
						>
							<Play size={16} />
							시뮬레이션 실행
						</RadixIconButton>

						<RadixIconButton
							onClick={handleResetParams}
							className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
						>
							<RotateCcw size={16} />
							초기화
						</RadixIconButton>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							수요 변화 (%)
						</label>
						<input
							type="range"
							min="-50"
							max="50"
							value={simulationParams.demandChange}
							onChange={(e) =>
								setSimulationParams((prev) => ({
									...prev,
									demandChange: parseInt(e.target.value),
								}))
							}
							className="w-full cursor-pointer"
						/>
						<div className="text-center text-sm text-gray-600">
							{simulationParams.demandChange > 0 ? '+' : ''}
							{simulationParams.demandChange}%
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							자원 변화 (%)
						</label>
						<input
							type="range"
							min="-30"
							max="30"
							value={simulationParams.resourceChange}
							onChange={(e) =>
								setSimulationParams((prev) => ({
									...prev,
									resourceChange: parseInt(e.target.value),
								}))
							}
							className="w-full cursor-pointer"
						/>
						<div className="text-center text-sm text-gray-600">
							{simulationParams.resourceChange > 0 ? '+' : ''}
							{simulationParams.resourceChange}%
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							능력 변화 (%)
						</label>
						<input
							type="range"
							min="-20"
							max="40"
							value={simulationParams.capacityChange}
							onChange={(e) =>
								setSimulationParams((prev) => ({
									...prev,
									capacityChange: parseInt(e.target.value),
								}))
							}
							className="w-full cursor-pointer"
						/>
						<div className="text-center text-sm text-gray-600">
							{simulationParams.capacityChange > 0 ? '+' : ''}
							{simulationParams.capacityChange}%
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							일정 변화 (%)
						</label>
						<input
							type="range"
							min="-25"
							max="25"
							value={simulationParams.scheduleChange}
							onChange={(e) =>
								setSimulationParams((prev) => ({
									...prev,
									scheduleChange: parseInt(e.target.value),
								}))
							}
							className="w-full cursor-pointer"
						/>
						<div className="text-center text-sm text-gray-600">
							{simulationParams.scheduleChange > 0 ? '+' : ''}
							{simulationParams.scheduleChange}%
						</div>
					</div>
				</div>
			</div>

			{/* 차트 섹션 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="p-6 rounded-lg border">
					{impactChartOption && (
						<EchartComponent
							options={impactChartOption}
							styles={{ height: '400px' }}
						/>
					)}
				</div>
				<div className="p-6 rounded-lg border">
					{comparisonChartOption && (
						<EchartComponent
							options={comparisonChartOption}
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
					tableTitle="What-if 분석 시나리오"
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
										const scenario = data.find(
											(item) =>
												item.id.toString() ===
												selectedId
										);
										if (scenario) {
											handleScenarioSelect(scenario);
										}
									}
								}}
								disabled={selectedRows.size !== 1}
								className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-700 hover:bg-Colors-Brand-800 text-white"
							>
								시나리오 선택
							</RadixIconButton>

							<RadixIconButton
								onClick={() => {
									const selectedId =
										Array.from(selectedRows)[0];
									if (selectedId) {
										toast.info(
											`시나리오 ${selectedId} 상세 분석을 시작합니다.`
										);
									}
								}}
								disabled={selectedRows.size !== 1}
								className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
							>
								상세 분석
							</RadixIconButton>
						</div>
					}
				/>
			</div>

			{/* 선택된 시나리오 정보 */}
			{selectedScenario && (
				<div className="bg-white p-6 rounded-lg border">
					<h3 className="text-lg font-semibold mb-4">
						선택된 시나리오 상세 정보
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<p className="text-sm text-gray-600">시나리오명</p>
							<p className="font-medium">
								{selectedScenario.scenarioName}
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">
								시나리오 유형
							</p>
							<p className="font-medium">
								{getScenarioTypeText(
									selectedScenario.scenarioType
								)}
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">변경률</p>
							<p className="font-medium">
								{selectedScenario.changePercent > 0 ? '+' : ''}
								{selectedScenario.changePercent.toFixed(1)}%
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">생산량 영향</p>
							<p className="font-medium">
								{selectedScenario.impactOnOutput > 0 ? '+' : ''}
								{selectedScenario.impactOnOutput.toFixed(1)}%
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default WhatIfAnalysisPage;
