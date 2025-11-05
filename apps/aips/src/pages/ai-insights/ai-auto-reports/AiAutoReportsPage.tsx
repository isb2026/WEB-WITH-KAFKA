import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	FileText,
	Download,
	BarChart3,
	TrendingUp,
	Target,
	Clock,
	CheckCircle,
	AlertTriangle,
	X,
	Eye,
	Settings,
	RefreshCw,
	Zap,
	FileSpreadsheet,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { DraggableDialog, RadixIconButton } from '@repo/radix-ui/components';
import { toast } from 'sonner';

interface AiAutoReport {
	id: number;
	reportName: string;
	reportType:
		| 'production'
		| 'inventory'
		| 'quality'
		| 'cost'
		| 'delivery'
		| 'custom';
	description: string;
	status: 'generating' | 'completed' | 'failed' | 'scheduled';
	aiGenerated: boolean;
	lastGenerated: string;
	nextSchedule: string;
	fileSize: number;
	downloadCount: number;
	format: 'pdf' | 'excel' | 'both';
	aiInsights: string[];
	recommendations: string[];
}

// Dummy data for AI Auto Reports
const aiAutoReportsData: AiAutoReport[] = [
	{
		id: 1,
		reportName: '월간 생산 성과 보고서',
		reportType: 'production',
		description:
			'AI가 분석한 월간 생산 성과 및 최적화 방안을 포함한 종합 보고서',
		status: 'completed',
		aiGenerated: true,
		lastGenerated: '2024-01-15 09:30',
		nextSchedule: '2024-02-01 09:00',
		fileSize: 2.4,
		downloadCount: 15,
		format: 'both',
		aiInsights: [
			'생산 라인 3의 가동률이 목표 대비 8% 부족',
			'품질 불량률이 전월 대비 12% 감소',
			'에너지 효율성이 목표 대비 15% 향상',
		],
		recommendations: [
			'생산 라인 3의 병목 구간 개선 방안 검토',
			'품질 관리 프로세스 표준화',
			'에너지 절약 프로그램 확대',
		],
	},
	{
		id: 2,
		reportName: '재고 최적화 분석 보고서',
		reportType: 'inventory',
		description: 'AI 기반 재고 수준 분석 및 최적화 방안 제시',
		status: 'completed',
		aiGenerated: true,
		lastGenerated: '2024-01-14 14:15',
		nextSchedule: '2024-01-21 14:00',
		fileSize: 1.8,
		downloadCount: 8,
		format: 'pdf',
		aiInsights: [
			'안전 재고 수준이 20% 과다',
			'재고 회전율이 목표 대비 15% 향상',
			'부족 재고 발생률이 8% 감소',
		],
		recommendations: [
			'안전 재고 수준 재조정',
			'JIT 공급 체계 도입 검토',
			'재고 모니터링 시스템 강화',
		],
	},
	{
		id: 3,
		reportName: '품질 관리 현황 보고서',
		reportType: 'quality',
		description: '품질 지표 분석 및 개선 방안을 포함한 종합 보고서',
		status: 'generating',
		aiGenerated: true,
		lastGenerated: '2024-01-13 11:45',
		nextSchedule: '2024-01-20 11:00',
		fileSize: 0,
		downloadCount: 0,
		format: 'both',
		aiInsights: [
			'품질 불량률이 목표 대비 5% 감소',
			'고객 만족도가 전월 대비 8% 향상',
			'품질 검사 시간이 15% 단축',
		],
		recommendations: [
			'품질 관리 프로세스 자동화 확대',
			'고객 피드백 시스템 개선',
			'품질 검사 표준화',
		],
	},
	{
		id: 4,
		reportName: '비용 분석 및 절감 방안 보고서',
		reportType: 'cost',
		description: 'AI가 분석한 비용 구조 및 절감 방안 제시',
		status: 'scheduled',
		aiGenerated: true,
		lastGenerated: '2024-01-12 16:20',
		nextSchedule: '2024-01-19 16:00',
		fileSize: 3.2,
		downloadCount: 12,
		format: 'excel',
		aiInsights: [
			'원자재 비용이 전월 대비 8% 증가',
			'인건비 효율성이 목표 대비 12% 향상',
			'간접비가 5% 감소',
		],
		recommendations: [
			'공급업체 협상 강화',
			'인력 배치 최적화',
			'간접비 관리 체계 개선',
		],
	},
];

const AiAutoReportsPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<AiAutoReport[]>(aiAutoReportsData);
	const [selectedReport, setSelectedReport] = useState<AiAutoReport | null>(
		null
	);
	const [isGenerating, setIsGenerating] = useState(false);

	// Chart data for report analysis
	const chartData = useMemo(() => {
		const reportTypes = [
			'production',
			'inventory',
			'quality',
			'cost',
			'delivery',
			'custom',
		];
		const typeLabels = ['생산', '재고', '품질', '비용', '납기', '커스텀'];

		return {
			reportTypes,
			typeLabels,
			downloadData: reportTypes.map((type) => {
				const typeData = data.filter(
					(item) => item.reportType === type
				);
				return typeData.reduce(
					(sum, item) => sum + item.downloadCount,
					0
				);
			}),
			fileSizeData: reportTypes.map((type) => {
				const typeData = data.filter(
					(item) => item.reportType === type
				);
				return typeData.reduce((sum, item) => sum + item.fileSize, 0);
			}),
		};
	}, [data]);

	// Table columns configuration
	const columns = useMemo<ColumnConfig<AiAutoReport>[]>(
		() => [
			{
				accessorKey: 'reportName',
				header: '보고서명',
				size: 200,
				align: 'left' as const,
			},
			{
				accessorKey: 'reportType',
				header: '보고서 유형',
				size: 120,
				align: 'center' as const,
				cell: ({ row }: { row: { original: AiAutoReport } }) => {
					const typeLabels = {
						production: '생산',
						inventory: '재고',
						quality: '품질',
						cost: '비용',
						delivery: '납기',
						custom: '커스텀',
					};
					return (
						<span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
							{typeLabels[row.original.reportType]}
						</span>
					);
				},
			},
			{
				accessorKey: 'status',
				header: '상태',
				size: 120,
				align: 'center' as const,
				cell: ({ row }: { row: { original: AiAutoReport } }) => {
					const statusConfig = {
						generating: {
							color: 'bg-yellow-100 text-yellow-800',
							text: '생성 중',
						},
						completed: {
							color: 'bg-green-100 text-green-800',
							text: '완료',
						},
						failed: {
							color: 'bg-red-100 text-red-800',
							text: '실패',
						},
						scheduled: {
							color: 'bg-blue-100 text-blue-800',
							text: '예약됨',
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
				accessorKey: 'aiGenerated',
				header: 'AI 생성',
				size: 100,
				align: 'center' as const,
				cell: ({ row }: { row: { original: AiAutoReport } }) => (
					<div className="text-center">
						{row.original.aiGenerated ? (
							<CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
						) : (
							<X className="h-5 w-5 text-gray-400 mx-auto" />
						)}
					</div>
				),
			},
			{
				accessorKey: 'fileSize',
				header: '파일 크기',
				size: 100,
				align: 'center' as const,
				cell: ({ row }: { row: { original: AiAutoReport } }) => (
					<div className="text-center">
						<span className="text-sm font-medium">
							{row.original.fileSize > 0
								? `${row.original.fileSize}MB`
								: '-'}
						</span>
					</div>
				),
			},
			{
				accessorKey: 'downloadCount',
				header: '다운로드',
				size: 100,
				align: 'center' as const,
				cell: ({ row }: { row: { original: AiAutoReport } }) => (
					<div className="text-center">
						<span className="text-sm font-medium">
							{row.original.downloadCount}회
						</span>
					</div>
				),
			},
			{
				accessorKey: 'id',
				header: '작업',
				size: 200,
				align: 'center' as const,
				cell: ({ row }: { row: { original: AiAutoReport } }) => (
					<div className="flex gap-2 justify-center">
						<button
							onClick={() => setSelectedReport(row.original)}
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

	// Chart options for report analysis
	const chartOption = {
		title: {
			text: 'AI 자동 보고서 분석',
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
			data: ['다운로드 수', '파일 크기 (MB)'],
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
				name: '다운로드 수',
				position: 'left',
				axisLabel: {
					formatter: '{value}회',
				},
			},
			{
				type: 'value',
				name: '파일 크기 (MB)',
				position: 'right',
				axisLabel: {
					formatter: '{value}MB',
				},
			},
		],
		series: [
			{
				name: '다운로드 수',
				type: 'bar',
				yAxisIndex: 0,
				data: chartData.downloadData,
				itemStyle: {
					color: '#3B82F6',
				},
			},
			{
				name: '파일 크기 (MB)',
				type: 'line',
				yAxisIndex: 1,
				data: chartData.fileSizeData,
				itemStyle: {
					color: '#10B981',
				},
				lineStyle: {
					width: 3,
				},
				symbol: 'circle',
				symbolSize: 8,
			},
		],
	};

	// Report generation trend chart
	const trendChartOption = {
		title: {
			text: '보고서 생성 트렌드',
			left: 'center',
			textStyle: {
				fontSize: 16,
				fontWeight: 'bold',
			},
		},
		tooltip: {
			trigger: 'axis',
		},
		legend: {
			data: ['생성된 보고서', 'AI 생성 비율'],
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
			data: ['1월 1주', '1월 2주', '1월 3주', '1월 4주'],
			axisLabel: {
				rotate: 0,
			},
		},
		yAxis: [
			{
				type: 'value',
				name: '보고서 수',
				min: 0,
				max: 20,
				position: 'left',
				axisLabel: {
					formatter: '{value}건',
				},
			},
			{
				type: 'value',
				name: 'AI 생성 비율 (%)',
				min: 0,
				max: 100,
				position: 'right',
				axisLabel: {
					formatter: '{value}%',
				},
			},
		],
		series: [
			{
				name: '생성된 보고서',
				type: 'bar',
				yAxisIndex: 0,
				data: [8, 12, 15, 18],
				itemStyle: {
					color: '#3B82F6',
				},
			},
			{
				name: 'AI 생성 비율',
				type: 'line',
				yAxisIndex: 1,
				data: [75, 80, 85, 90],
				itemStyle: {
					color: '#10B981',
				},
				lineStyle: {
					width: 3,
				},
				symbol: 'circle',
				symbolSize: 8,
			},
		],
	};

	const handleDownloadPDF = (report: AiAutoReport) => {
		toast.success(`${report.reportName} PDF 다운로드가 시작되었습니다.`);
		// 실제 다운로드 로직은 여기에 구현
	};

	const handleDownloadExcel = (report: AiAutoReport) => {
		toast.success(`${report.reportName} Excel 다운로드가 시작되었습니다.`);
		// 실제 다운로드 로직은 여기에 구현
	};

	const handleGenerateReport = (report: AiAutoReport) => {
		setIsGenerating(true);
		setData((prev) =>
			prev.map((item) =>
				item.id === report.id
					? { ...item, status: 'generating' as const }
					: item
			)
		);

		// Simulate report generation
		setTimeout(() => {
			setData((prev) =>
				prev.map((item) =>
					item.id === report.id
						? {
								...item,
								status: 'completed' as const,
								fileSize: Math.random() * 5 + 1,
								downloadCount: 0,
							}
						: item
				)
			);
			setIsGenerating(false);
			toast.success(`${report.reportName} 생성이 완료되었습니다.`);
		}, 3000);
	};

	return (
		<div className="space-y-4">
			{/* KPI Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-blue-100">
					<div className="flex items-center gap-3">
						<FileText className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">총 보고서</p>
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
								완료된 보고서
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
				<div className="p-4 rounded-lg border bg-gradient-to-r from-purple-50 to-purple-100">
					<div className="flex items-center gap-3">
						<Zap className="h-8 w-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600">
								AI 생성 비율
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{Math.round(
									(data.filter((item) => item.aiGenerated)
										.length /
										data.length) *
										100
								)}
								%
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border bg-gradient-to-r from-orange-50 to-orange-100">
					<div className="flex items-center gap-3">
						<Download className="h-8 w-8 text-orange-600" />
						<div>
							<p className="text-sm text-gray-600">총 다운로드</p>
							<p className="text-2xl font-bold text-gray-900">
								{data.reduce(
									(sum, item) => sum + item.downloadCount,
									0
								)}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="p-6 rounded-lg border">
					<h3 className="text-lg font-semibold mb-4">
						보고서 분석 차트
					</h3>
					<EchartComponent
						options={chartOption}
						styles={{ height: '400px' }}
					/>
				</div>
				<div className="p-6 rounded-lg border">
					<h3 className="text-lg font-semibold mb-4">생성 트렌드</h3>
					<EchartComponent
						options={trendChartOption}
						styles={{ height: '400px' }}
					/>
				</div>
			</div>

			{/* AI Insights Panel */}
			<div className="p-6 rounded-lg border">
				<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
					<Zap className="h-5 w-5 text-yellow-500" />
					AI 보고서 생성 인사이트
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<h4 className="font-medium text-gray-900">
							주요 발견사항
						</h4>
						<ul className="space-y-2">
							<li className="flex items-start gap-2 text-sm text-gray-700">
								<span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
								생산 보고서가 가장 많이 다운로드됨 (평균
								15회/월)
							</li>
							<li className="flex items-start gap-2 text-sm text-gray-700">
								<span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
								AI 생성 보고서의 정확도가 90% 이상
							</li>
							<li className="flex items-start gap-2 text-sm text-gray-700">
								<span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
								PDF 형식이 Excel보다 2배 더 많이 다운로드됨
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
								생산 보고서 템플릿 표준화 및 자동화 확대
							</li>
							<li className="flex items-start gap-2 text-sm text-gray-700">
								<span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
								PDF 형식 우선 지원 및 시각화 개선
							</li>
							<li className="flex items-start gap-2 text-sm text-gray-700">
								<span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
								실시간 보고서 생성 및 알림 시스템 구축
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
					tableTitle="AI 자동 보고서"
					rowCount={data.length}
					useSearch={true}
					usePageNation={true}
					toggleRowSelection={toggleRowSelection}
					selectedRows={selectedRows}
					useEditable={false}
				/>
			</div>

			<DraggableDialog
				open={!!selectedReport}
				onOpenChange={() => setSelectedReport(null)}
				title="보고서 상세 정보"
				content={
					selectedReport && (
						<div className="space-y-4">
							<div>
								<h4 className="font-medium text-gray-900 mb-2">
									보고서명
								</h4>
								<p className="text-gray-700">
									{selectedReport.reportName}
								</p>
							</div>

							<div>
								<h4 className="font-medium text-gray-900 mb-2">
									설명
								</h4>
								<p className="text-gray-700 bg-gray-50 p-3 rounded">
									{selectedReport.description}
								</p>
							</div>

							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div>
									<h4 className="font-medium text-gray-900 mb-1">
										보고서 유형
									</h4>
									<p className="text-sm text-gray-600">
										{selectedReport.reportType ===
										'production'
											? '생산'
											: selectedReport.reportType ===
												  'inventory'
												? '재고'
												: selectedReport.reportType ===
													  'quality'
													? '품질'
													: selectedReport.reportType ===
														  'cost'
														? '비용'
														: selectedReport.reportType ===
															  'delivery'
															? '납기'
															: '커스텀'}
									</p>
								</div>
								<div>
									<h4 className="font-medium text-gray-900 mb-1">
										AI 생성
									</h4>
									<p className="text-sm text-gray-600">
										{selectedReport.aiGenerated
											? '예'
											: '아니오'}
									</p>
								</div>
								<div>
									<h4 className="font-medium text-gray-900 mb-1">
										파일 크기
									</h4>
									<p className="text-sm text-gray-600">
										{selectedReport.fileSize > 0
											? `${selectedReport.fileSize}MB`
											: '-'}
									</p>
								</div>
								<div>
									<h4 className="font-medium text-gray-900 mb-1">
										다운로드 수
									</h4>
									<p className="text-sm text-gray-600">
										{selectedReport.downloadCount}회
									</p>
								</div>
							</div>

							<div>
								<h4 className="font-medium text-gray-900 mb-2">
									AI 인사이트
								</h4>
								<ul className="space-y-2">
									{selectedReport.aiInsights.map(
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
									{selectedReport.recommendations.map(
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

							<div className="flex gap-2 pt-4 justify-end">
								{selectedReport.status === 'scheduled' && (
									<RadixIconButton
										onClick={() => {
											handleGenerateReport(
												selectedReport
											);
											setSelectedReport(null);
										}}
										className="flex gap-1.5 p-2.5 rounded-lg text-sm items-center border bg-Colors-Brand-700 hover:bg-Colors-Brand-800 text-white"
									>
										<Zap size={16} />
										보고서 생성
									</RadixIconButton>
								)}
								{selectedReport.status === 'completed' && (
									<>
										<RadixIconButton
											onClick={() => {
												handleDownloadPDF(
													selectedReport
												);
												setSelectedReport(null);
											}}
											className="flex gap-1.5 px-2 py-1.5 rounded-lg text-sm items-center border"
										>
											<FileText size={16} />
											PDF 다운로드
										</RadixIconButton>
										<RadixIconButton
											onClick={() => {
												handleDownloadExcel(
													selectedReport
												);
												setSelectedReport(null);
											}}
											className="flex gap-1.5 px-2 py-1.5 rounded-lg text-sm items-center border"
										>
											<FileSpreadsheet size={16} />
											Excel 다운로드
										</RadixIconButton>
									</>
								)}
							</div>
						</div>
					)
				}
			/>

			{/* Generation Overlay */}
			{isGenerating && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-8 text-center">
						<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<h3 className="text-lg font-semibold mb-2">
							보고서 생성 중...
						</h3>
						<p className="text-gray-600">
							AI가 보고서를 생성하고 있습니다.
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default AiAutoReportsPage;
