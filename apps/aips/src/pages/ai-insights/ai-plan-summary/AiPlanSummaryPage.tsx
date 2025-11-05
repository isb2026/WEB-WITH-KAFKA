import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	Brain,
	BarChart3,
	TrendingUp,
	Target,
	Package,
	CheckCircle,
	Zap,
	RefreshCw,
	Eye,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { DraggableDialog } from '@repo/radix-ui/components';
import { toast } from 'sonner';

interface AiPlanSummary {
	id: number;
	planName: string;
	planType: 'production' | 'inventory' | 'capacity' | 'supply';
	aiConfidence: number;
	status: 'analyzing' | 'completed' | 'failed' | 'pending';
	summary: string;
	keyInsights: string[];
	recommendations: string[];
	estimatedSavings: number;
	riskLevel: 'low' | 'medium' | 'high';
	createdAt: string;
	updatedAt: string;
	executionTime: number;
}

// Dummy data for AI Plan Summary
const aiPlanSummaryData: AiPlanSummary[] = [
	{
		id: 1,
		planName: '2024년 1분기 생산 계획 최적화',
		planType: 'production',
		aiConfidence: 94.5,
		status: 'completed',
		summary:
			'AI가 분석한 결과, 생산 라인 3의 가동률을 15% 향상시킬 수 있는 최적화 방안을 제시했습니다.',
		keyInsights: [
			'생산 라인 3의 병목 구간 식별',
			'설비 가동률 15% 향상 가능',
			'재고 비용 12% 절감 예상',
		],
		recommendations: [
			'설비 정비 일정 최적화',
			'작업자 배치 조정',
			'재료 공급 타이밍 개선',
		],
		estimatedSavings: 2500000,
		riskLevel: 'low',
		createdAt: '2024-01-15',
		updatedAt: '2024-01-15',
		executionTime: 45,
	},
	{
		id: 2,
		planName: '재고 최적화 시나리오 분석',
		planType: 'inventory',
		aiConfidence: 87.2,
		status: 'completed',
		summary:
			'재고 수준을 20% 줄이면서도 서비스 수준을 유지할 수 있는 방안을 제시했습니다.',
		keyInsights: [
			'안전 재고 수준 최적화',
			'주문 주기 단축 가능',
			'재고 회전율 25% 향상',
		],
		recommendations: [
			'JIT 공급 체계 도입',
			'재고 모니터링 시스템 강화',
			'공급업체 협력 체계 개선',
		],
		estimatedSavings: 1800000,
		riskLevel: 'medium',
		createdAt: '2024-01-14',
		updatedAt: '2024-01-14',
		executionTime: 32,
	},
	{
		id: 3,
		planName: '설비 능력 분석 및 확장 계획',
		planType: 'capacity',
		aiConfidence: 91.8,
		status: 'analyzing',
		summary:
			'현재 설비 능력을 분석하여 향후 6개월간의 수요 증가에 대응할 수 있는 확장 방안을 제시합니다.',
		keyInsights: [
			'설비 가동률 78%에서 92%로 향상 가능',
			'신규 설비 투자 ROI 분석',
			'인력 배치 최적화 방안',
		],
		recommendations: [
			'신규 설비 2대 추가 투자',
			'작업자 교육 프로그램 확대',
			'3교대 운영 체계 도입',
		],
		estimatedSavings: 4200000,
		riskLevel: 'medium',
		createdAt: '2024-01-13',
		updatedAt: '2024-01-15',
		executionTime: 67,
	},
];

const AiPlanSummaryPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<AiPlanSummary[]>(aiPlanSummaryData);
	const [selectedPlan, setSelectedPlan] = useState<AiPlanSummary | null>(
		null
	);

	// Chart data for AI confidence levels
	const chartData = useMemo(() => {
		const planTypes = ['production', 'inventory', 'capacity', 'supply'];
		const typeLabels = ['생산', '재고', '능력', '공급'];

		return {
			planTypes,
			typeLabels,
			confidenceData: planTypes.map((type) => {
				const typeData = data.filter((item) => item.planType === type);
				return typeData.length > 0
					? typeData.reduce(
							(sum, item) => sum + item.aiConfidence,
							0
						) / typeData.length
					: 0;
			}),
			savingsData: planTypes.map((type) => {
				const typeData = data.filter((item) => item.planType === type);
				return typeData.reduce(
					(sum, item) => sum + item.estimatedSavings,
					0
				);
			}),
		};
	}, [data]);

	// Table columns configuration
	const columns = useMemo<ColumnConfig<AiPlanSummary>[]>(
		() => [
			{
				accessorKey: 'planName',
				header: '계획명',
				size: 200,
				align: 'left' as const,
			},
			{
				accessorKey: 'planType',
				header: '계획 유형',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: { original: AiPlanSummary } }) => {
					const typeLabels = {
						production: '생산',
						inventory: '재고',
						capacity: '능력',
						supply: '공급',
					};
					return (
						<span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
							{typeLabels[row.original.planType]}
						</span>
					);
				},
			},
			{
				accessorKey: 'aiConfidence',
				header: 'AI 신뢰도',
				size: 120,
				align: 'center' as const,
				cell: ({ row }: { row: { original: AiPlanSummary } }) => (
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
				accessorKey: 'status',
				header: '상태',
				size: 120,
				align: 'center' as const,
				cell: ({ row }: { row: { original: AiPlanSummary } }) => {
					const statusConfig = {
						analyzing: {
							color: 'bg-yellow-100 text-yellow-800',
							text: '분석 중',
						},
						completed: {
							color: 'bg-green-100 text-green-800',
							text: '완료',
						},
						failed: {
							color: 'bg-red-100 text-red-800',
							text: '실패',
						},
						pending: {
							color: 'bg-gray-100 text-gray-800',
							text: '대기',
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
				accessorKey: 'estimatedSavings',
				header: '예상 절감액',
				size: 140,
				align: 'right' as const,
				cell: ({ row }: { row: { original: AiPlanSummary } }) => (
					<div className="text-right font-medium text-green-600">
						₩{row.original.estimatedSavings.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'riskLevel',
				header: '위험도',
				size: 100,
				align: 'center' as const,
				cell: ({ row }: { row: { original: AiPlanSummary } }) => {
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
				accessorKey: 'executionTime',
				header: '실행 시간',
				size: 120,
				align: 'center' as const,
				cell: ({ row }: { row: { original: AiPlanSummary } }) => (
					<div className="text-center">
						<span className="text-sm font-medium">
							{row.original.executionTime}초
						</span>
					</div>
				),
			},
			{
				accessorKey: 'id',
				header: '작업',
				size: 120,
				align: 'center' as const,
				cell: ({ row }: { row: { original: AiPlanSummary } }) => (
					<div className="flex gap-2 justify-center">
						<button
							onClick={() => setSelectedPlan(row.original)}
							className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
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

	// Chart options for AI confidence levels
	const chartOption = {
		title: {
			text: 'AI 계획별 신뢰도 및 절감액',
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
			data: ['AI 신뢰도 (%)', '예상 절감액 (백만원)'],
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
				name: 'AI 신뢰도 (%)',
				min: 0,
				max: 100,
				position: 'left',
				axisLabel: {
					formatter: '{value}%',
				},
			},
			{
				type: 'value',
				name: '예상 절감액 (백만원)',
				position: 'right',
				axisLabel: {
					formatter: '{value}M',
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
				name: '예상 절감액 (백만원)',
				type: 'line',
				yAxisIndex: 1,
				data: chartData.savingsData.map((val) => val / 1000000),
				itemStyle: {
					color: '#3B82F6',
				},
				lineStyle: {
					width: 3,
				},
				symbol: 'circle',
				symbolSize: 8,
			},
		],
	};

	const handleRefreshAnalysis = () => {
		toast.success('AI 분석이 새로고침되었습니다.');
	};

	const handleViewCharts = () => {
		toast.info('차트 보기 모드로 전환되었습니다.');
	};

	return (
		<div className="space-y-4">
			{/* KPI Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-blue-100">
					<div className="flex items-center gap-3">
						<Brain className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">총 AI 분석</p>
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
				<div className="p-4 rounded-lg border bg-gradient-to-r from-orange-50 to-orange-100">
					<div className="flex items-center gap-3">
						<Package className="h-8 w-8 text-orange-600" />
						<div>
							<p className="text-sm text-gray-600">
								총 예상 절감액
							</p>
							<p className="text-2xl font-bold text-gray-900">
								₩
								{data
									.reduce(
										(sum, item) =>
											sum + item.estimatedSavings,
										0
									)
									.toLocaleString()}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Chart */}
			<div className="p-6 rounded-lg border">
				<h3 className="text-lg font-semibold mb-4">
					AI 분석 성과 차트
				</h3>
				<EchartComponent
					options={chartOption}
					styles={{ height: '400px' }}
				/>
			</div>

			{/* AI Insights Summary */}
			<div className="p-6 rounded-lg border">
				<h3 className="text-lg font-semibold mb-4">AI 인사이트 요약</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<h4 className="font-medium text-gray-900 flex items-center gap-2">
							<Zap className="h-5 w-5 text-yellow-500" />
							주요 발견사항
						</h4>
						<ul className="space-y-2">
							{data[0]?.keyInsights.map((insight, index) => (
								<li
									key={index}
									className="flex items-start gap-2 text-sm text-gray-700"
								>
									<span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
									{insight}
								</li>
							))}
						</ul>
					</div>
					<div className="space-y-4">
						<h4 className="font-medium text-gray-900 flex items-center gap-2">
							<Target className="h-5 w-5 text-green-500" />
							AI 권장사항
						</h4>
						<ul className="space-y-2">
							{data[0]?.recommendations.map((rec, index) => (
								<li
									key={index}
									className="flex items-start gap-2 text-sm text-gray-700"
								>
									<span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
									{rec}
								</li>
							))}
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
					tableTitle="AI 계획 요약 데이터"
					rowCount={data.length}
					useSearch={true}
					usePageNation={true}
					toggleRowSelection={toggleRowSelection}
					selectedRows={selectedRows}
					useEditable={false}
				/>
			</div>

			<DraggableDialog
				open={!!selectedPlan}
				onOpenChange={() => setSelectedPlan(null)}
				title="AI 계획 상세 정보"
				content={
					selectedPlan && (
						<div className="space-y-4">
							<div>
								<h4 className="font-medium text-gray-900 mb-2">
									계획명
								</h4>
								<p className="text-gray-700">
									{selectedPlan.planName}
								</p>
							</div>

							<div>
								<h4 className="font-medium text-gray-900 mb-2">
									요약
								</h4>
								<p className="text-gray-700 bg-gray-50 p-3 rounded">
									{selectedPlan.summary}
								</p>
							</div>

							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div>
									<h4 className="font-medium text-gray-900 mb-1">
										계획 유형
									</h4>
									<p className="text-sm text-gray-600">
										{selectedPlan.planType === 'production'
											? '생산'
											: selectedPlan.planType ===
												  'inventory'
												? '재고'
												: selectedPlan.planType ===
													  'capacity'
													? '능력'
													: '공급'}
									</p>
								</div>
								<div>
									<h4 className="font-medium text-gray-900 mb-1">
										AI 신뢰도
									</h4>
									<p className="text-sm text-green-600 font-medium">
										{selectedPlan.aiConfidence}%
									</p>
								</div>
								<div>
									<h4 className="font-medium text-gray-900 mb-1">
										예상 절감액
									</h4>
									<p className="text-sm text-green-600 font-medium">
										₩
										{selectedPlan.estimatedSavings.toLocaleString()}
									</p>
								</div>
								<div>
									<h4 className="font-medium text-gray-900 mb-1">
										위험도
									</h4>
									<p className="text-sm text-gray-600">
										{selectedPlan.riskLevel === 'low'
											? '낮음'
											: selectedPlan.riskLevel ===
												  'medium'
												? '보통'
												: '높음'}
									</p>
								</div>
							</div>

							<div>
								<h4 className="font-medium text-gray-900 mb-2">
									주요 인사이트
								</h4>
								<ul className="space-y-2">
									{selectedPlan.keyInsights.map(
										(insight, index) => (
											<li
												key={index}
												className="flex items-start gap-2 text-sm text-gray-700"
											>
												<span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
												{insight}
											</li>
										)
									)}
								</ul>
							</div>

							<div>
								<h4 className="font-medium text-gray-900 mb-2">
									AI 권장사항
								</h4>
								<ul className="space-y-2">
									{selectedPlan.recommendations.map(
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
						</div>
					)
				}
			/>
		</div>
	);
};

export default AiPlanSummaryPage;
