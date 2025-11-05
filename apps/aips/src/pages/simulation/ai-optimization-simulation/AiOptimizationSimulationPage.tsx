import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	Brain,
	TrendingUp,
	Zap,
	Lightbulb,
	Settings,
	Play,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { toast } from 'sonner';
import {
	RadixIconButton,
	RadixSelect,
	RadixSelectItem,
} from '@radix-ui/components';

interface AiOptimizationScenario {
	id: number;
	scenarioName: string;
	scenarioType: 'production' | 'scheduling' | 'resource' | 'quality';
	aiModel: string;
	confidence: number;
	expectedImprovement: number;
	implementationCost: number;
	implementationTime: number; // days
	risk: 'low' | 'medium' | 'high';
	status: 'generated' | 'analyzing' | 'approved' | 'implemented';
	recommendations: string[];
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// 더미 데이터
const aiOptimizationData: AiOptimizationScenario[] = [
	{
		id: 1,
		scenarioName: 'AI 기반 생산 일정 최적화',
		scenarioType: 'scheduling',
		aiModel: 'GPT-4 + Reinforcement Learning',
		confidence: 92.5,
		expectedImprovement: 18.3,
		implementationCost: 15000,
		implementationTime: 45,
		risk: 'low',
		status: 'approved',
		recommendations: [
			'기계별 작업 우선순위 동적 조정',
			'실시간 대기열 최적화',
			'예측 유지보수 일정 통합',
		],
		createdBy: 'AI 시스템',
		createdAt: '2024-01-01',
		updatedBy: 'AI 시스템',
		updatedAt: '2024-01-01',
	},
	{
		id: 2,
		scenarioName: '품질 예측 및 불량률 감소',
		scenarioType: 'quality',
		aiModel: 'Deep Learning + Computer Vision',
		confidence: 88.7,
		expectedImprovement: 25.1,
		implementationCost: 25000,
		implementationTime: 60,
		risk: 'medium',
		status: 'analyzing',
		recommendations: [
			'실시간 품질 모니터링 시스템',
			'불량 원인 예측 알고리즘',
			'자동 품질 검사 로봇',
		],
		createdBy: 'AI 시스템',
		createdAt: '2024-01-02',
		updatedBy: 'AI 시스템',
		updatedAt: '2024-01-02',
	},
	{
		id: 3,
		scenarioName: '자원 할당 최적화',
		scenarioType: 'resource',
		aiModel: 'Genetic Algorithm + ML',
		confidence: 85.2,
		expectedImprovement: 12.8,
		implementationCost: 12000,
		implementationTime: 30,
		risk: 'low',
		status: 'generated',
		recommendations: [
			'인력 배치 최적화',
			'설비 가동률 균형 조정',
			'재고 수준 동적 관리',
		],
		createdBy: 'AI 시스템',
		createdAt: '2024-01-03',
		updatedBy: 'AI 시스템',
		updatedAt: '2024-01-03',
	},
	{
		id: 4,
		scenarioName: '에너지 효율성 최적화',
		scenarioType: 'production',
		aiModel: 'Neural Network + IoT',
		confidence: 90.1,
		expectedImprovement: 15.6,
		implementationCost: 18000,
		implementationTime: 40,
		risk: 'low',
		status: 'implemented',
		recommendations: [
			'스마트 그리드 통합',
			'에너지 소비 패턴 분석',
			'자동 전력 조절 시스템',
		],
		createdBy: 'AI 시스템',
		createdAt: '2024-01-04',
		updatedBy: 'AI 시스템',
		updatedAt: '2024-01-04',
	},
];

const AiOptimizationSimulationPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<AiOptimizationScenario[]>([]);
	const [selectedScenario, setSelectedScenario] =
		useState<AiOptimizationScenario | null>(null);
	const [aiAnalysisParams, setAiAnalysisParams] = useState({
		optimizationTarget: 'efficiency',
		timeHorizon: 30,
		riskTolerance: 'medium',
		budgetLimit: 50000,
	});

	useEffect(() => {
		setData(aiOptimizationData);
	}, []);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'generated':
				return 'text-gray-600 bg-gray-100';
			case 'analyzing':
				return 'text-blue-600 bg-blue-100';
			case 'approved':
				return 'text-green-600 bg-green-100';
			case 'implemented':
				return 'text-purple-600 bg-purple-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'generated':
				return '생성됨';
			case 'analyzing':
				return '분석중';
			case 'approved':
				return '승인됨';
			case 'implemented':
				return '구현됨';
			default:
				return '알 수 없음';
		}
	};

	const getRiskColor = (risk: string) => {
		switch (risk) {
			case 'low':
				return 'text-green-600 bg-green-100';
			case 'medium':
				return 'text-yellow-600 bg-yellow-100';
			case 'high':
				return 'text-red-600 bg-red-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getRiskText = (risk: string) => {
		switch (risk) {
			case 'low':
				return '낮음';
			case 'medium':
				return '보통';
			case 'high':
				return '높음';
			default:
				return '알 수 없음';
		}
	};

	const getScenarioTypeColor = (type: string) => {
		switch (type) {
			case 'production':
				return 'text-blue-600 bg-blue-100';
			case 'scheduling':
				return 'text-green-600 bg-green-100';
			case 'resource':
				return 'text-purple-600 bg-purple-100';
			case 'quality':
				return 'text-orange-600 bg-orange-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getScenarioTypeText = (type: string) => {
		switch (type) {
			case 'production':
				return '생산';
			case 'scheduling':
				return '일정';
			case 'resource':
				return '자원';
			case 'quality':
				return '품질';
			default:
				return '알 수 없음';
		}
	};

	// 차트 데이터
	const chartData = useMemo(() => {
		if (!data || data.length === 0) {
			return {
				improvementData: [],
				confidenceData: [],
				scenarios: [],
			};
		}

		const improvementData = data.map((item) => item.expectedImprovement);
		const confidenceData = data.map((item) => item.confidence);
		const scenarios = data.map(
			(item) => item.scenarioName.substring(0, 15) + '...'
		);

		return {
			improvementData,
			confidenceData,
			scenarios,
		};
	}, [data]);

	// DataTable columns configuration
	const columns = useMemo<ColumnConfig<AiOptimizationScenario>[]>(
		() => [
			{
				accessorKey: 'scenarioName',
				header: '시나리오명',
				size: 250,
				align: 'left' as const,
			},
			{
				accessorKey: 'scenarioType',
				header: '유형',
				size: 100,
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
				accessorKey: 'aiModel',
				header: 'AI 모델',
				size: 200,
				align: 'left' as const,
			},
			{
				accessorKey: 'confidence',
				header: '신뢰도(%)',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.confidence.toFixed(1)}%
					</div>
				),
			},
			{
				accessorKey: 'expectedImprovement',
				header: '예상 개선(%)',
				size: 130,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.expectedImprovement.toFixed(1)}%
					</div>
				),
			},
			{
				accessorKey: 'implementationCost',
				header: '구현 비용($)',
				size: 130,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						${row.original.implementationCost.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'risk',
				header: '위험도',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(row.original.risk)}`}
					>
						{getRiskText(row.original.risk)}
					</span>
				),
			},
			{
				accessorKey: 'status',
				header: '상태',
				size: 120,
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

	// Chart options
	const improvementChartOption = {
		title: {
			text: 'AI 시나리오별 예상 개선 효과',
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
			name: '개선 효과 (%)',
		},
		series: [
			{
				name: '예상 개선',
				type: 'bar',
				data:
					chartData.improvementData.length > 0
						? chartData.improvementData
						: [0],
				itemStyle: {
					color: '#10B981',
				},
			},
		],
	};

	const confidenceChartOption = {
		title: {
			text: 'AI 모델별 신뢰도',
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
			name: '신뢰도 (%)',
			max: 100,
		},
		series: [
			{
				name: '신뢰도',
				type: 'line',
				data:
					chartData.confidenceData.length > 0
						? chartData.confidenceData
						: [0],
				itemStyle: {
					color: '#3B82F6',
				},
				smooth: true,
				markLine: {
					data: [
						{ yAxis: 90, name: '높은 신뢰도' },
						{ yAxis: 75, name: '보통 신뢰도' },
					],
					lineStyle: {
						color: '#EF4444',
						type: 'dashed',
					},
				},
			},
		],
	};

	const handleRunAiAnalysis = () => {
		toast.success('AI 최적화 분석을 시작합니다.');
		// 실제 AI 분석 실행 로직
	};

	const handleGenerateScenario = () => {
		toast.info('새로운 AI 시나리오를 생성합니다.');
		// 시나리오 생성 로직
	};

	const handleOptimizeParameters = () => {
		toast.success('AI 파라미터를 최적화합니다.');
		// 파라미터 최적화 로직
	};

	const handleScenarioSelect = (scenario: AiOptimizationScenario) => {
		setSelectedScenario(scenario);
		toast.info(`${scenario.scenarioName} 시나리오를 선택했습니다.`);
	};

	return (
		<div className="space-y-6">
			{/* 통계 카드 */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Brain className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">
								총 AI 시나리오
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{data.length}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Lightbulb className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">
								승인된 시나리오
							</p>
							<p className="text-2xl font-bold text-green-600">
								{
									data.filter(
										(item) => item.status === 'approved'
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
								평균 개선 효과
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{Math.round(
									data.reduce(
										(sum, item) =>
											sum + item.expectedImprovement,
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
								구현된 시나리오
							</p>
							<p className="text-2xl font-bold text-purple-600">
								{
									data.filter(
										(item) => item.status === 'implemented'
									).length
								}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* AI 분석 파라미터 컨트롤 */}
			<div className="p-5 rounded-lg border">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold">
						AI 분석 파라미터 설정
					</h3>
					<div className="flex gap-2">
						<RadixIconButton
							onClick={handleRunAiAnalysis}
							className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-700 hover:bg-Colors-Brand-800 text-white"
						>
							<Play size={16} />
							AI 분석 실행
						</RadixIconButton>
						<RadixIconButton
							onClick={handleGenerateScenario}
							className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
						>
							<Lightbulb size={16} />
							시나리오 생성
						</RadixIconButton>
						<RadixIconButton
							onClick={handleOptimizeParameters}
							className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
						>
							<Settings size={16} />
							파라미터 최적화
						</RadixIconButton>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							최적화 목표
						</label>
						<RadixSelect
							value={aiAnalysisParams.optimizationTarget}
							onValueChange={(value) =>
								setAiAnalysisParams((prev) => ({
									...prev,
									optimizationTarget: value,
								}))
							}
						>
							<RadixSelectItem value="efficiency">효율성</RadixSelectItem>
							<RadixSelectItem value="cost">비용</RadixSelectItem>
							<RadixSelectItem value="quality">품질</RadixSelectItem>
							<RadixSelectItem value="speed">속도</RadixSelectItem>
						</RadixSelect>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							시간 범위 (일)
						</label>
						<input
							type="range"
							min="7"
							max="90"
							value={aiAnalysisParams.timeHorizon}
							onChange={(e) =>
								setAiAnalysisParams((prev) => ({
									...prev,
									timeHorizon: parseInt(e.target.value),
								}))
							}
							className="w-full cursor-pointer"
						/>
						<div className="text-center text-sm text-gray-600">
							{aiAnalysisParams.timeHorizon}일
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							위험 허용도
						</label>
						<RadixSelect
							value={aiAnalysisParams.riskTolerance}
							onValueChange={(value) =>
								setAiAnalysisParams((prev) => ({
									...prev,
									riskTolerance: value,
								}))
							}
						>
							<RadixSelectItem value="low">낮음</RadixSelectItem>
							<RadixSelectItem value="medium">보통</RadixSelectItem>
							<RadixSelectItem value="high">높음</RadixSelectItem>
						</RadixSelect>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							예산 한도 ($)
						</label>
						<input
							type="number"
							value={aiAnalysisParams.budgetLimit}
							onChange={(e) =>
								setAiAnalysisParams((prev) => ({
									...prev,
									budgetLimit: parseInt(e.target.value),
								}))
							}
							className="w-full px-3 py-2 border rounded-lg"
						/>
					</div>
				</div>
			</div>

			{/* 차트 섹션 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="p-6 rounded-lg border">
					{improvementChartOption && (
						<EchartComponent
							options={improvementChartOption}
							styles={{ height: '400px' }}
						/>
					)}
				</div>
				<div className="p-6 rounded-lg border">
					{confidenceChartOption && (
						<EchartComponent
							options={confidenceChartOption}
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
					tableTitle="AI 최적화 시뮬레이션 시나리오"
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
								className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border disabled:cursor-not-allowed"
							>
								상세 분석
							</RadixIconButton>
						</div>
					}
				/>
			</div>
		</div>
	);
};

export default AiOptimizationSimulationPage;
