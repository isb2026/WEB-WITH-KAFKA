import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	Zap,
	BarChart3,
	TrendingUp,
	Target,
	Play,
	Pause,
	RotateCcw,
	Settings,
	Lightbulb,
	AlertTriangle,
	CheckCircle,
	X,
	ArrowRight,
	Eye,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import {
	DraggableDialog,
	RadixIconButton,
	RadixDialogRoot,
	RadixDialogPortal,
	RadixDialogOverlay,
	RadixDialogContent,
} from '@repo/radix-ui/components';
import { toast } from 'sonner';

interface AiWhatIfScenario {
	id: number;
	scenarioName: string;
	scenarioType: 'demand' | 'capacity' | 'resource' | 'supply' | 'custom';
	description: string;
	status: 'draft' | 'running' | 'completed' | 'failed';
	aiConfidence: number;
	estimatedImpact: {
		production: number;
		cost: number;
		delivery: number;
		quality: number;
	};
	riskLevel: 'low' | 'medium' | 'high';
	createdAt: string;
	updatedAt: string;
	executionTime: number;
	aiRecommendations: string[];
}

// Dummy data for AI What-if scenarios
const aiWhatIfData: AiWhatIfScenario[] = [
	{
		id: 1,
		scenarioName: '수요 20% 증가 시나리오',
		scenarioType: 'demand',
		description:
			'주요 고객사의 수요가 20% 증가할 경우의 생산 능력 및 리소스 영향 분석',
		status: 'completed',
		aiConfidence: 92.5,
		estimatedImpact: {
			production: 15,
			cost: -8,
			delivery: -12,
			quality: -2,
		},
		riskLevel: 'medium',
		createdAt: '2024-01-15',
		updatedAt: '2024-01-15',
		executionTime: 45,
		aiRecommendations: [
			'생산 라인 2의 가동 시간을 2시간 연장',
			'임시 작업자 3명 추가 고용',
			'공급업체와의 협력 체계 강화',
		],
	},
	{
		id: 2,
		scenarioName: '설비 정비 지연 시나리오',
		scenarioType: 'capacity',
		description: '핵심 설비의 정비가 3일 지연될 경우의 생산 계획 영향 분석',
		status: 'running',
		aiConfidence: 88.7,
		estimatedImpact: {
			production: -18,
			cost: 12,
			delivery: -25,
			quality: -5,
		},
		riskLevel: 'high',
		createdAt: '2024-01-14',
		updatedAt: '2024-01-15',
		executionTime: 32,
		aiRecommendations: [
			'대체 설비 활용 방안 검토',
			'고객과의 납기 협의',
			'우선순위 제품 선별 생산',
		],
	},
	{
		id: 3,
		scenarioName: '원자재 가격 15% 상승 시나리오',
		scenarioType: 'supply',
		description:
			'주요 원자재 가격이 15% 상승할 경우의 비용 및 수익성 영향 분석',
		status: 'completed',
		aiConfidence: 95.2,
		estimatedImpact: {
			production: 0,
			cost: 15,
			delivery: 0,
			quality: 0,
		},
		riskLevel: 'medium',
		createdAt: '2024-01-13',
		updatedAt: '2024-01-13',
		executionTime: 28,
		aiRecommendations: [
			'대체 공급업체 검토',
			'장기 계약 체결 검토',
			'제품 가격 조정 방안 검토',
		],
	},
	{
		id: 4,
		scenarioName: '신규 제품 라인 도입 시나리오',
		scenarioType: 'custom',
		description:
			'신규 제품 라인 도입 시 기존 생산 계획 및 리소스 영향 분석',
		status: 'draft',
		aiConfidence: 85.3,
		estimatedImpact: {
			production: 25,
			cost: -20,
			delivery: 8,
			quality: 5,
		},
		riskLevel: 'low',
		createdAt: '2024-01-12',
		updatedAt: '2024-01-12',
		executionTime: 0,
		aiRecommendations: [
			'단계적 도입 계획 수립',
			'기존 라인과의 조화 방안',
			'교육 프로그램 개발',
		],
	},
];

const AiWhatIfPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<AiWhatIfScenario[]>(aiWhatIfData);
	const [selectedScenario, setSelectedScenario] =
		useState<AiWhatIfScenario | null>(null);
	const [isSimulating, setIsSimulating] = useState(false);

	// Chart data for scenario analysis
	const chartData = useMemo(() => {
		const scenarioTypes = [
			'demand',
			'capacity',
			'resource',
			'supply',
			'custom',
		];
		const typeLabels = ['수요', '능력', '리소스', '공급', '커스텀'];

		return {
			scenarioTypes,
			typeLabels,
			confidenceData: scenarioTypes.map((type) => {
				const typeData = data.filter(
					(item) => item.scenarioType === type
				);
				return typeData.length > 0
					? typeData.reduce(
							(sum, item) => sum + item.aiConfidence,
							0
						) / typeData.length
					: 0;
			}),
			impactData: scenarioTypes.map((type) => {
				const typeData = data.filter(
					(item) => item.scenarioType === type
				);
				if (typeData.length === 0)
					return { production: 0, cost: 0, delivery: 0, quality: 0 };

				return {
					production:
						typeData.reduce(
							(sum, item) =>
								sum + item.estimatedImpact.production,
							0
						) / typeData.length,
					cost:
						typeData.reduce(
							(sum, item) => sum + item.estimatedImpact.cost,
							0
						) / typeData.length,
					delivery:
						typeData.reduce(
							(sum, item) => sum + item.estimatedImpact.delivery,
							0
						) / typeData.length,
					quality:
						typeData.reduce(
							(sum, item) => sum + item.estimatedImpact.quality,
							0
						) / typeData.length,
				};
			}),
		};
	}, [data]);

	// Table columns configuration
	const columns = useMemo<ColumnConfig<AiWhatIfScenario>[]>(
		() => [
			{
				accessorKey: 'scenarioName',
				header: '시나리오명',
				size: 200,
				align: 'left' as const,
			},
			{
				accessorKey: 'scenarioType',
				header: '시나리오 유형',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: { original: AiWhatIfScenario } }) => {
					const typeLabels = {
						demand: '수요',
						capacity: '능력',
						resource: '리소스',
						supply: '공급',
						custom: '커스텀',
					};
					return (
						<span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
							{typeLabels[row.original.scenarioType]}
						</span>
					);
				},
			},
			{
				accessorKey: 'status',
				header: '상태',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: { original: AiWhatIfScenario } }) => {
					const statusConfig = {
						draft: {
							color: 'bg-gray-100 text-gray-800',
							text: '초안',
						},
						running: {
							color: 'bg-yellow-100 text-yellow-800',
							text: '실행 중',
						},
						completed: {
							color: 'bg-green-100 text-green-800',
							text: '완료',
						},
						failed: {
							color: 'bg-red-100 text-red-800',
							text: '실패',
						},
					};
					const config = statusConfig[row.original.status];
					return (
						<span
							className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
						>
							{config.text}
						</span>
					);
				},
			},
			{
				accessorKey: 'aiConfidence',
				header: 'AI 신뢰도',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: { original: AiWhatIfScenario } }) => (
					<div className="text-center">
						<div className="text-lg font-bold text-green-600">
							{row.original.aiConfidence}%
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-green-600 h-2 rounded-full"
								style={{
									width: `${row.original.aiConfidence}%`,
								}}
							></div>
						</div>
					</div>
				),
			},
			{
				accessorKey: 'estimatedImpact',
				header: '예상 영향도',
				size: 200,
				align: 'center' as const,
				cell: ({ row }: { row: { original: AiWhatIfScenario } }) => (
					<div className="space-y-1">
						<div className="text-xs">
							<span className="font-medium">생산: </span>
							<span
								className={
									row.original.estimatedImpact.production >= 0
										? 'text-green-600'
										: 'text-red-600'
								}
							>
								{row.original.estimatedImpact.production >= 0
									? '+'
									: ''}
								{row.original.estimatedImpact.production}%
							</span>
						</div>
						<div className="text-xs">
							<span className="font-medium">비용: </span>
							<span
								className={
									row.original.estimatedImpact.cost >= 0
										? 'text-red-600'
										: 'text-green-600'
								}
							>
								{row.original.estimatedImpact.cost >= 0
									? '+'
									: ''}
								{row.original.estimatedImpact.cost}%
							</span>
						</div>
					</div>
				),
			},
			{
				accessorKey: 'riskLevel',
				header: '위험도',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: { original: AiWhatIfScenario } }) => {
					const riskConfig = {
						low: {
							color: 'bg-green-100 text-green-800',
							text: '낮음',
						},
						medium: {
							color: 'bg-yellow-100 text-yellow-800',
							text: '보통',
						},
						high: {
							color: 'bg-red-100 text-red-800',
							text: '높음',
						},
					};
					const config = riskConfig[row.original.riskLevel];
					return (
						<span
							className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
						>
							{config.text}
						</span>
					);
				},
			},
			{
				accessorKey: 'id',
				header: '작업',
				size: 140,
				align: 'left' as const,
				cell: ({ row }: { row: { original: AiWhatIfScenario } }) => (
					<div className="flex">
						{row.original.status === 'draft' && (
							<button
								onClick={() => handleRunScenario(row.original)}
								className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
								title="시나리오 실행"
							>
								<Play size={16} />
							</button>
						)}
						{row.original.status === 'running' && (
							<button
								onClick={() =>
									handlePauseScenario(row.original)
								}
								className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors"
								title="일시정지"
							>
								<Pause size={16} />
							</button>
						)}
						<button
							onClick={() => setSelectedScenario(row.original)}
							className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
							title="상세 보기"
						>
							<Eye size={16} />
						</button>
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
		undefined
	);

	// Chart options for scenario analysis
	const chartOption = {
		title: {
			text: 'AI What-if 시나리오 분석',
			left: 'center',
			textStyle: {
				fontSize: 16,
				fontWeight: 'bold',
			},
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		legend: {
			data: [
				'AI 신뢰도 (%)',
				'생산 영향도 (%)',
				'비용 영향도 (%)',
				'납기 영향도 (%)',
			],
			bottom: 10,
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			data: chartData.typeLabels,
			axisLabel: {
				rotate: 0,
			},
		},
		yAxis: [
			{
				type: 'value',
				name: '신뢰도 (%)',
				min: 0,
				max: 100,
				position: 'left',
				axisLabel: {
					formatter: '{value}%',
				},
			},
			{
				type: 'value',
				name: '영향도 (%)',
				min: -30,
				max: 30,
				position: 'right',
				axisLabel: {
					formatter: '{value}%',
				},
			},
		],
		series: [
			{
				name: 'AI 신뢰도 (%)',
				type: 'bar',
				yAxisIndex: 0,
				data: chartData.confidenceData,
				itemStyle: {
					color: '#10B981',
				},
			},
			{
				name: '생산 영향도 (%)',
				type: 'line',
				yAxisIndex: 1,
				data: chartData.impactData.map((val) => val.production),
				itemStyle: {
					color: '#3B82F6',
				},
				lineStyle: {
					width: 3,
				},
				symbol: 'circle',
				symbolSize: 8,
			},
			{
				name: '비용 영향도 (%)',
				type: 'line',
				yAxisIndex: 1,
				data: chartData.impactData.map((val) => val.cost),
				itemStyle: {
					color: '#EF4444',
				},
				lineStyle: {
					width: 3,
				},
				symbol: 'diamond',
				symbolSize: 8,
			},
			{
				name: '납기 영향도 (%)',
				type: 'line',
				yAxisIndex: 1,
				data: chartData.impactData.map((val) => val.delivery),
				itemStyle: {
					color: '#F59E0B',
				},
				lineStyle: {
					width: 3,
				},
				symbol: 'triangle',
				symbolSize: 8,
			},
		],
	};

	// Impact comparison chart
	const impactChartOption = {
		title: {
			text: '시나리오별 영향도 비교',
			left: 'center',
			textStyle: {
				fontSize: 16,
				fontWeight: 'bold',
			},
		},
		tooltip: {
			trigger: 'item',
		},
		legend: {
			orient: 'vertical',
			left: 'left',
		},
		radar: {
			indicator: [
				{ name: '생산성', max: 30 },
				{ name: '비용', max: 30 },
				{ name: '납기', max: 30 },
				{ name: '품질', max: 30 },
				{ name: '효율성', max: 30 },
			],
		},
		series: [
			{
				name: '시나리오 영향도',
				type: 'radar',
				data: [
					{
						value: [15, 8, 12, 2, 18],
						name: '수요 증가',
						itemStyle: {
							color: '#3B82F6',
						},
					},
					{
						value: [18, 12, 25, 5, 22],
						name: '설비 정비 지연',
						itemStyle: {
							color: '#EF4444',
						},
					},
					{
						value: [0, 15, 0, 0, 8],
						name: '원자재 가격 상승',
						itemStyle: {
							color: '#F59E0B',
						},
					},
				],
			},
		],
	};

	const handleRunScenario = (scenario: AiWhatIfScenario) => {
		setIsSimulating(true);
		setData((prev) =>
			prev.map((item) =>
				item.id === scenario.id
					? { ...item, status: 'running' as const }
					: item
			)
		);

		// Simulate scenario execution
		setTimeout(() => {
			setData((prev) =>
				prev.map((item) =>
					item.id === scenario.id
						? { ...item, status: 'completed' as const }
						: item
				)
			);
			setIsSimulating(false);
			toast.success(
				`${scenario.scenarioName} 시나리오가 완료되었습니다.`
			);
		}, 3000);
	};

	const handlePauseScenario = (scenario: AiWhatIfScenario) => {
		setData((prev) =>
			prev.map((item) =>
				item.id === scenario.id
					? { ...item, status: 'draft' as const }
					: item
			)
		);
		toast.info(`${scenario.scenarioName} 시나리오가 일시정지되었습니다.`);
	};

	return (
		<div className="space-y-4">
			{/* KPI Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-blue-100">
					<div className="flex items-center gap-3">
						<Zap className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">총 시나리오</p>
							<p className="text-2xl font-bold text-gray-900">
								{data.length}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border bg-gradient-to-r from-green-50 to-green-100">
					<div className="flex items-center gap-3">
						<CheckCircle className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">
								완료된 시나리오
							</p>
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
				<div className="p-4 rounded-lg border bg-gradient-to-r from-yellow-50 to-yellow-100">
					<div className="flex items-center gap-3">
						<Play className="h-8 w-8 text-yellow-600" />
						<div>
							<p className="text-sm text-gray-600">
								실행 중인 시나리오
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
				<div className="p-4 rounded-lg border bg-gradient-to-r from-purple-50 to-purple-100">
					<div className="flex items-center gap-3">
						<TrendingUp className="h-8 w-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600">
								평균 AI 신뢰도
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{Math.round(
									data.reduce(
										(sum, item) => sum + item.aiConfidence,
										0
									) / data.length
								)}
								%
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="p-6 rounded-lg border">
					<h3 className="text-lg font-semibold mb-4">
						시나리오 분석 차트
					</h3>
					<EchartComponent
						options={chartOption}
						styles={{ height: '400px' }}
					/>
				</div>
				<div className="p-6 rounded-lg border">
					<h3 className="text-lg font-semibold mb-4">
						영향도 비교 분석
					</h3>
					<EchartComponent
						options={impactChartOption}
						styles={{ height: '400px' }}
					/>
				</div>
			</div>

			{/* AI Insights Panel */}
			<div className="p-6 rounded-lg border">
				<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
					<Lightbulb className="h-5 w-5 text-yellow-500" />
					AI 인사이트 및 권장사항
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<h4 className="font-medium text-gray-900">
							주요 발견사항
						</h4>
						<ul className="space-y-2">
							<li className="flex items-start gap-2 text-sm text-gray-700">
								<span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
								수요 증가 시나리오에서 생산성 15% 향상 가능
							</li>
							<li className="flex items-start gap-2 text-sm text-gray-700">
								<span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
								설비 정비 지연 시 납기 지연 25% 예상
							</li>
							<li className="flex items-start gap-2 text-sm text-gray-700">
								<span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
								원자재 가격 상승 시 비용 15% 증가 예상
							</li>
						</ul>
					</div>
					<div className="space-y-4">
						<h4 className="font-medium text-gray-900">
							AI 권장사항
						</h4>
						<ul className="space-y-2">
							<li className="flex items-start gap-2 text-sm text-gray-700">
								<span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
								수요 증가에 대비한 생산 능력 확장 계획 수립
							</li>
							<li className="flex items-start gap-2 text-sm text-gray-700">
								<span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
								설비 정비 일정 최적화 및 예방정비 강화
							</li>
							<li className="flex items-start gap-2 text-sm text-gray-700">
								<span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
								장기 공급 계약 및 대체 공급업체 발굴
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Data Table */}
			<div className="rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="AI What-if 시나리오"
					rowCount={data.length}
					useSearch={true}
					usePageNation={true}
					toggleRowSelection={toggleRowSelection}
					selectedRows={selectedRows}
					useEditable={false}
				/>
			</div>

			<DraggableDialog
				open={!!selectedScenario}
				onOpenChange={() => setSelectedScenario(null)}
				title="시나리오 상세 정보"
				content={
					selectedScenario && (
						<div className="space-y-4">
							<div>
								<h4 className="font-medium text-gray-900 mb-2">
									시나리오명
								</h4>
								<p className="text-gray-700">
									{selectedScenario.scenarioName}
								</p>
							</div>

							<div>
								<h4 className="font-medium text-gray-900 mb-2">
									설명
								</h4>
								<p className="text-gray-700 bg-gray-50 p-3 rounded">
									{selectedScenario.description}
								</p>
							</div>

							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div>
									<h4 className="font-medium text-gray-900 mb-1">
										시나리오 유형
									</h4>
									<p className="text-sm text-gray-600">
										{selectedScenario.scenarioType ===
										'demand'
											? '수요'
											: selectedScenario.scenarioType ===
												  'capacity'
												? '능력'
												: selectedScenario.scenarioType ===
													  'resource'
													? '리소스'
													: selectedScenario.scenarioType ===
														  'supply'
														? '공급'
														: '커스텀'}
									</p>
								</div>
								<div>
									<h4 className="font-medium text-gray-900 mb-1">
										AI 신뢰도
									</h4>
									<p className="text-sm text-green-600 font-medium">
										{selectedScenario.aiConfidence}%
									</p>
								</div>
								<div>
									<h4 className="font-medium text-gray-900 mb-1">
										위험도
									</h4>
									<p className="text-sm text-gray-600">
										{selectedScenario.riskLevel === 'low'
											? '낮음'
											: selectedScenario.riskLevel ===
												  'medium'
												? '보통'
												: '높음'}
									</p>
								</div>
								<div>
									<h4 className="font-medium text-gray-900 mb-1">
										실행 시간
									</h4>
									<p className="text-sm text-gray-600">
										{selectedScenario.executionTime}초
									</p>
								</div>
							</div>

							<div>
								<h4 className="font-medium text-gray-900 mb-2">
									예상 영향도
								</h4>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div className="text-center p-3 bg-gray-50 rounded">
										<div className="text-sm text-gray-600">
											생산성
										</div>
										<div
											className={`text-lg font-bold ${selectedScenario.estimatedImpact.production >= 0 ? 'text-green-600' : 'text-red-600'}`}
										>
											{selectedScenario.estimatedImpact
												.production >= 0
												? '+'
												: ''}
											{
												selectedScenario.estimatedImpact
													.production
											}
											%
										</div>
									</div>
									<div className="text-center p-3 bg-gray-50 rounded">
										<div className="text-sm text-gray-600">
											비용
										</div>
										<div
											className={`text-lg font-bold ${selectedScenario.estimatedImpact.cost >= 0 ? 'text-red-600' : 'text-green-600'}`}
										>
											{selectedScenario.estimatedImpact
												.cost >= 0
												? '+'
												: ''}
											{
												selectedScenario.estimatedImpact
													.cost
											}
											%
										</div>
									</div>
									<div className="text-center p-3 bg-gray-50 rounded">
										<div className="text-sm text-gray-600">
											납기
										</div>
										<div
											className={`text-lg font-bold ${selectedScenario.estimatedImpact.delivery >= 0 ? 'text-green-600' : 'text-red-600'}`}
										>
											{selectedScenario.estimatedImpact
												.delivery >= 0
												? '+'
												: ''}
											{
												selectedScenario.estimatedImpact
													.delivery
											}
											%
										</div>
									</div>
									<div className="text-center p-3 bg-gray-50 rounded">
										<div className="text-sm text-gray-600">
											품질
										</div>
										<div
											className={`text-lg font-bold ${selectedScenario.estimatedImpact.quality >= 0 ? 'text-green-600' : 'text-red-600'}`}
										>
											{selectedScenario.estimatedImpact
												.quality >= 0
												? '+'
												: ''}
											{
												selectedScenario.estimatedImpact
													.quality
											}
											%
										</div>
									</div>
								</div>
							</div>

							<div>
								<h4 className="font-medium text-gray-900 mb-2">
									AI 권장사항
								</h4>
								<ul className="space-y-2">
									{selectedScenario.aiRecommendations.map(
										(rec, index) => (
											<li
												key={index}
												className="flex items-start gap-2 text-sm text-gray-700"
											>
												<span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
												{rec}
											</li>
										)
									)}
								</ul>
							</div>

							{selectedScenario.status === 'draft' && (
								<div className="flex pt-4 justify-end">
									<RadixIconButton
										onClick={() => {
											handleRunScenario(selectedScenario);
											setSelectedScenario(null);
										}}
										className="flex gap-1.5 p-2.5 rounded-lg text-sm items-center border bg-Colors-Brand-700 hover:bg-Colors-Brand-800 text-white"
									>
										<Play size={16} />
										시나리오 실행
									</RadixIconButton>
								</div>
							)}
						</div>
					)
				}
			/>

			<RadixDialogRoot open={isSimulating} onOpenChange={() => {}}>
				<RadixDialogPortal>
					<RadixDialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
					<RadixDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-8 text-center z-50">
						<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<h3 className="text-lg font-semibold mb-2">
							시나리오 시뮬레이션 중...
						</h3>
						<p className="text-gray-600">
							AI가 시나리오를 분석하고 있습니다.
						</p>
					</RadixDialogContent>
				</RadixDialogPortal>
			</RadixDialogRoot>
		</div>
	);
};

export default AiWhatIfPage;
