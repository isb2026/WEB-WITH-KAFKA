import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import { Target, TrendingUp, Clock, CheckCircle, X, Eye } from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { DraggableDialog, RadixIconButton } from '@repo/radix-ui/components';
import { toast } from 'sonner';

interface AiPlanCorrection {
	id: number;
	planName: string;
	originalPlan: string;
	aiSuggestion: string;
	changeType: 'schedule' | 'resource' | 'sequence' | 'capacity';
	priority: 'low' | 'medium' | 'high' | 'critical';
	impact: 'positive' | 'negative' | 'neutral';
	estimatedImprovement: number;
	riskLevel: 'low' | 'medium' | 'high';
	status: 'pending' | 'accepted' | 'rejected' | 'implemented';
	createdAt: string;
	deadline: string;
	implementationTime: number;
}

// Dummy data for AI Plan Correction
const aiPlanCorrectionData: AiPlanCorrection[] = [
	{
		id: 1,
		planName: '생산 라인 2 스케줄 최적화',
		originalPlan: '2024-01-20 ~ 2024-01-25 (5일)',
		aiSuggestion: '2024-01-18 ~ 2024-01-22 (4일) + 리소스 재배치',
		changeType: 'schedule',
		priority: 'high',
		impact: 'positive',
		estimatedImprovement: 20,
		riskLevel: 'low',
		status: 'pending',
		createdAt: '2024-01-15',
		deadline: '2024-01-17',
		implementationTime: 8,
	},
	{
		id: 2,
		planName: '설비 정비 일정 조정',
		originalPlan: '2024-01-22 ~ 2024-01-24 (3일)',
		aiSuggestion: '2024-01-21 ~ 2024-01-23 (2일) + 예방정비 강화',
		changeType: 'schedule',
		priority: 'medium',
		impact: 'positive',
		estimatedImprovement: 15,
		riskLevel: 'low',
		status: 'accepted',
		createdAt: '2024-01-14',
		deadline: '2024-01-20',
		implementationTime: 6,
	},
	{
		id: 3,
		planName: '작업자 배치 최적화',
		originalPlan: '고급 작업자 3명 + 일반 작업자 5명',
		aiSuggestion: '고급 작업자 2명 + 일반 작업자 6명 + 교육 프로그램',
		changeType: 'resource',
		priority: 'medium',
		impact: 'positive',
		estimatedImprovement: 12,
		riskLevel: 'medium',
		status: 'pending',
		createdAt: '2024-01-13',
		deadline: '2024-01-19',
		implementationTime: 12,
	},
	{
		id: 4,
		planName: '생산 순서 변경',
		originalPlan: '제품 A → 제품 B → 제품 C',
		aiSuggestion: '제품 B → 제품 A → 제품 C (설비 효율성 향상)',
		changeType: 'sequence',
		priority: 'low',
		impact: 'positive',
		estimatedImprovement: 8,
		riskLevel: 'low',
		status: 'implemented',
		createdAt: '2024-01-12',
		deadline: '2024-01-16',
		implementationTime: 4,
	},
];

const AiPlanCorrectionPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<AiPlanCorrection[]>(aiPlanCorrectionData);
	const [selectedCorrection, setSelectedCorrection] =
		useState<AiPlanCorrection | null>(null);

	// Chart data for plan correction analysis
	const chartData = useMemo(() => {
		const changeTypes = ['schedule', 'resource', 'sequence', 'capacity'];
		const typeLabels = ['스케줄', '리소스', '순서', '능력'];

		return {
			changeTypes,
			typeLabels,
			improvementData: changeTypes.map((type) => {
				const typeData = data.filter(
					(item) => item.changeType === type
				);
				return typeData.length > 0
					? typeData.reduce(
							(sum, item) => sum + item.estimatedImprovement,
							0
						) / typeData.length
					: 0;
			}),
			statusData: changeTypes.map((type) => {
				const typeData = data.filter(
					(item) => item.changeType === type
				);
				const accepted = typeData.filter(
					(item) => item.status === 'accepted'
				).length;
				const pending = typeData.filter(
					(item) => item.status === 'pending'
				).length;
				const implemented = typeData.filter(
					(item) => item.status === 'implemented'
				).length;
				return { accepted, pending, implemented };
			}),
		};
	}, [data]);

	// Table columns configuration
	const columns = useMemo<ColumnConfig<AiPlanCorrection>[]>(
		() => [
			{
				accessorKey: 'planName',
				header: '계획명',
				size: 200,
				align: 'left' as const,
			},
			{
				accessorKey: 'changeType',
				header: '변경 유형',
				size: 120,
				align: 'center' as const,
				cell: ({ row }: { row: { original: AiPlanCorrection } }) => {
					const typeLabels = {
						schedule: '스케줄',
						resource: '리소스',
						sequence: '순서',
						capacity: '능력',
					};
					return (
						<span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
							{typeLabels[row.original.changeType]}
						</span>
					);
				},
			},
			{
				accessorKey: 'priority',
				header: '우선순위',
				size: 100,
				align: 'center' as const,
				cell: ({ row }: { row: { original: AiPlanCorrection } }) => {
					const priorityConfig = {
						low: {
							color: 'bg-green-100 text-green-800',
							text: '낮음',
						},
						medium: {
							color: 'bg-yellow-100 text-yellow-800',
							text: '보통',
						},
						high: {
							color: 'bg-orange-100 text-orange-800',
							text: '높음',
						},
						critical: {
							color: 'bg-red-100 text-red-800',
							text: '긴급',
						},
					};
					const config = priorityConfig[row.original.priority];
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
				accessorKey: 'estimatedImprovement',
				header: '예상 개선도',
				size: 130,
				align: 'center' as const,
				cell: ({ row }: { row: { original: AiPlanCorrection } }) => (
					<div className="text-center">
						<div className="text-lg font-bold text-green-600">
							+{row.original.estimatedImprovement}%
						</div>
					</div>
				),
			},
			{
				accessorKey: 'status',
				header: '상태',
				size: 120,
				align: 'center' as const,
				cell: ({ row }: { row: { original: AiPlanCorrection } }) => {
					const statusConfig = {
						pending: {
							color: 'bg-yellow-100 text-yellow-800',
							text: '대기',
						},
						accepted: {
							color: 'bg-blue-100 text-blue-800',
							text: '수락',
						},
						rejected: {
							color: 'bg-red-100 text-red-800',
							text: '거부',
						},
						implemented: {
							color: 'bg-green-100 text-green-800',
							text: '구현',
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
				accessorKey: 'deadline',
				header: '마감일',
				size: 120,
				align: 'center' as const,
				cell: ({ row }: { row: { original: AiPlanCorrection } }) => (
					<div className="text-center">
						<span className="text-sm font-medium">
							{row.original.deadline}
						</span>
					</div>
				),
			},
			{
				accessorKey: 'id',
				header: '작업',
				size: 150,
				align: 'center' as const,
				cell: ({ row }: { row: { original: AiPlanCorrection } }) => (
					<div className="flex justify-center">
						<button
							onClick={() => handleAccept(row.original)}
							disabled={row.original.status !== 'pending'}
							className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							title="제안 수락"
						>
							<CheckCircle size={16} />
						</button>
						<button
							onClick={() => handleReject(row.original)}
							disabled={row.original.status !== 'pending'}
							className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							title="제안 거부"
						>
							<X size={16} />
						</button>
						<button
							onClick={() => setSelectedCorrection(row.original)}
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

	// Chart options for plan correction analysis
	const chartOption = {
		title: {
			text: 'AI 계획 조정 분석',
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
				'예상 개선도 (%)',
				'수락된 제안',
				'대기 중인 제안',
				'구현된 제안',
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
				name: '개선도 (%)',
				min: 0,
				max: 25,
				position: 'left',
				axisLabel: {
					formatter: '{value}%',
				},
			},
			{
				type: 'value',
				name: '제안 수',
				position: 'right',
				axisLabel: {
					formatter: '{value}건',
				},
			},
		],
		series: [
			{
				name: '예상 개선도 (%)',
				type: 'bar',
				yAxisIndex: 0,
				data: chartData.improvementData,
				itemStyle: {
					color: '#10B981',
				},
			},
			{
				name: '수락된 제안',
				type: 'line',
				yAxisIndex: 1,
				data: chartData.statusData.map((val) => val.accepted),
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
				name: '대기 중인 제안',
				type: 'line',
				yAxisIndex: 1,
				data: chartData.statusData.map((val) => val.pending),
				itemStyle: {
					color: '#F59E0B',
				},
				lineStyle: {
					width: 3,
				},
				symbol: 'diamond',
				symbolSize: 8,
			},
			{
				name: '구현된 제안',
				type: 'line',
				yAxisIndex: 1,
				data: chartData.statusData.map((val) => val.implemented),
				itemStyle: {
					color: '#059669',
				},
				lineStyle: {
					width: 3,
				},
				symbol: 'triangle',
				symbolSize: 8,
			},
		],
	};

	// Gantt chart options for timeline visualization
	const ganttChartOption = {
		title: {
			text: 'AI 제안 타임라인',
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
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			data: data.map((item) => item.planName),
			axisLabel: {
				width: 200,
				overflow: 'truncate',
			},
		},
		yAxis: {
			type: 'time',
			axisLabel: {
				formatter: (value: number) => {
					const date = new Date(value);
					return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
				},
			},
		},
		series: [
			{
				name: '원본 계획',
				type: 'line',
				symbol: 'rect',
				symbolSize: 12,
				itemStyle: {
					color: '#EF4444',
				},
				lineStyle: {
					color: '#EF4444',
					width: 3,
				},
				data: data.map((item, index) => [
					index,
					new Date('2025-01-20').getTime(),
				]),
			},
			{
				name: 'AI 제안',
				type: 'line',
				symbol: 'rect',
				symbolSize: 12,
				itemStyle: {
					color: '#10B981',
				},
				lineStyle: {
					color: '#10B981',
					width: 3,
				},
				data: data.map((item, index) => [
					index,
					new Date('2025-01-18').getTime(),
				]),
			},
		],
	};

	const handleAccept = (correction: AiPlanCorrection) => {
		setData((prev) =>
			prev.map((item) =>
				item.id === correction.id
					? { ...item, status: 'accepted' as const }
					: item
			)
		);
		toast.success(`${correction.planName} 제안이 수락되었습니다.`);
	};

	const handleReject = (correction: AiPlanCorrection) => {
		setData((prev) =>
			prev.map((item) =>
				item.id === correction.id
					? { ...item, status: 'rejected' as const }
					: item
			)
		);
		toast.error(`${correction.planName} 제안이 거부되었습니다.`);
	};

	return (
		<div className="space-y-4">
			{/* KPI Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-blue-100">
					<div className="flex items-center gap-3">
						<Target className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">총 AI 제안</p>
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
							<p className="text-sm text-gray-600">수락된 제안</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'accepted'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border bg-gradient-to-r from-yellow-50 to-yellow-100">
					<div className="flex items-center gap-3">
						<Clock className="h-8 w-8 text-yellow-600" />
						<div>
							<p className="text-sm text-gray-600">
								대기 중인 제안
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'pending'
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
							<p className="text-sm text-gray-600">평균 개선도</p>
							<p className="text-2xl font-bold text-gray-900">
								+
								{Math.round(
									data.reduce(
										(sum, item) =>
											sum + item.estimatedImprovement,
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
						AI 제안 분석 차트
					</h3>
					<EchartComponent
						options={chartOption}
						styles={{ height: '400px' }}
					/>
				</div>
				<div className="p-6 rounded-lg border">
					<h3 className="text-lg font-semibold mb-4">
						계획 변경 타임라인
					</h3>
					<EchartComponent
						options={ganttChartOption}
						styles={{ height: '400px' }}
					/>
				</div>
			</div>

			{/* Data Table */}
			<div className="rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="AI 계획 조정 제안"
					rowCount={data.length}
					useSearch={true}
					usePageNation={true}
					toggleRowSelection={toggleRowSelection}
					selectedRows={selectedRows}
					useEditable={false}
				/>
			</div>

			<DraggableDialog
				open={!!selectedCorrection}
				onOpenChange={() => setSelectedCorrection(null)}
				title="AI 제안 상세 정보"
				content={
					selectedCorrection && (
						<div className="space-y-4">
							<div>
								<h4 className="font-medium text-gray-900 mb-2">
									계획명
								</h4>
								<p className="text-gray-700">
									{selectedCorrection.planName}
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<h4 className="font-medium text-gray-900 mb-2">
										원본 계획
									</h4>
									<p className="text-gray-700 bg-gray-50 p-3 rounded">
										{selectedCorrection.originalPlan}
									</p>
								</div>
								<div>
									<h4 className="font-medium text-gray-900 mb-2">
										AI 제안
									</h4>
									<p className="text-gray-700 bg-green-50 p-3 rounded">
										{selectedCorrection.aiSuggestion}
									</p>
								</div>
							</div>

							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div>
									<h4 className="font-medium text-gray-900 mb-1">
										변경 유형
									</h4>
									<p className="text-sm text-gray-600">
										{selectedCorrection.changeType ===
										'schedule'
											? '스케줄'
											: selectedCorrection.changeType ===
												  'resource'
												? '리소스'
												: selectedCorrection.changeType ===
													  'sequence'
													? '순서'
													: '능력'}
									</p>
								</div>
								<div>
									<h4 className="font-medium text-gray-900 mb-1">
										우선순위
									</h4>
									<p className="text-sm text-gray-600">
										{selectedCorrection.priority === 'low'
											? '낮음'
											: selectedCorrection.priority ===
												  'medium'
												? '보통'
												: selectedCorrection.priority ===
													  'high'
													? '높음'
													: '긴급'}
									</p>
								</div>
								<div>
									<h4 className="font-medium text-gray-900 mb-1">
										예상 개선도
									</h4>
									<p className="text-sm text-green-600 font-medium">
										+
										{
											selectedCorrection.estimatedImprovement
										}
										%
									</p>
								</div>
								<div>
									<h4 className="font-medium text-gray-900 mb-1">
										위험도
									</h4>
									<p className="text-sm text-gray-600">
										{selectedCorrection.riskLevel === 'low'
											? '낮음'
											: selectedCorrection.riskLevel ===
												  'medium'
												? '보통'
												: '높음'}
									</p>
								</div>
							</div>

							{selectedCorrection.status === 'pending' && (
								<div className="flex gap-2 pt-6 justify-end">
									<RadixIconButton
										onClick={() => {
											handleReject(selectedCorrection);
											setSelectedCorrection(null);
										}}
										className="flex gap-1.5 px-2 py-1.5 rounded-lg text-sm items-center border"
									>
										<X size={16} />
										제안 거부
									</RadixIconButton>

									<RadixIconButton
										onClick={() => {
											handleAccept(selectedCorrection);
											setSelectedCorrection(null);
										}}
										className="flex gap-1.5 px-4 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-700 hover:bg-Colors-Brand-800 text-white"
									>
										<CheckCircle size={16} />
										제안 수락
									</RadixIconButton>
								</div>
							)}
						</div>
					)
				}
			/>
		</div>
	);
};

export default AiPlanCorrectionPage;
