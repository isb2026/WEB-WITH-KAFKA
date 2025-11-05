import { useState, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	History,
	Clock,
	FileText,
	Activity,
	Eye,
	Download,
	Filter,
	GitBranch,
	Search,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import { RadixSelect, RadixSelectItem } from '@radix-ui/components';
import { DraggableDialog } from '@repo/radix-ui/components';
import { useDataTable } from '@radix-ui/hook';
import { useDataTableColumns, ColumnConfig } from '@radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { toast } from 'sonner';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';

interface PlanHistoryData {
	id: number;
	planCode: string;
	planName: string;
	version: string;
	productName: string;
	productCode: string;
	changeType: 'created' | 'modified' | 'approved' | 'rejected' | 'cancelled';
	changeReason: string;
	changedBy: string;
	changedAt: string;
	previousVersion: string;
	nextVersion: string;
	changeDetails: string;
	impact: 'high' | 'medium' | 'low';
	status: 'active' | 'archived' | 'deleted';
	createdAt: string;
	updatedAt: string;
}

// Dummy data
const planHistoryData: PlanHistoryData[] = [
	{
		id: 1,
		planCode: 'PLAN-2024-001',
		planName: '2024년 1월 생산계획 A',
		version: 'v1.2',
		productName: '제품 A',
		productCode: 'PROD-001',
		changeType: 'modified',
		changeReason: '고객 요청으로 인한 수량 증가',
		changedBy: '생산팀 김철수',
		changedAt: '2024-01-16 14:30:00',
		previousVersion: 'v1.1',
		nextVersion: 'v1.3',
		changeDetails: '수량: 1000 → 1200, 기간: 2024-01-01~15 → 2024-01-03~18',
		impact: 'high',
		status: 'active',
		createdAt: '2024-01-15',
		updatedAt: '2024-01-16',
	},
	{
		id: 2,
		planCode: 'PLAN-2024-001',
		planName: '2024년 1월 생산계획 A',
		version: 'v1.1',
		productName: '제품 A',
		productCode: 'PROD-001',
		changeType: 'approved',
		changeReason: '초기 계획 승인',
		changedBy: '생산팀장 이영희',
		changedAt: '2024-01-15 10:15:00',
		previousVersion: 'v1.0',
		nextVersion: 'v1.2',
		changeDetails: '초기 계획 승인 완료',
		impact: 'medium',
		status: 'archived',
		createdAt: '2024-01-15',
		updatedAt: '2024-01-15',
	},
	{
		id: 3,
		planCode: 'PLAN-2024-001',
		planName: '2024년 1월 생산계획 A',
		version: 'v1.0',
		productName: '제품 A',
		productCode: 'PROD-001',
		changeType: 'created',
		changeReason: '신규 계획 생성',
		changedBy: '생산팀 김철수',
		changedAt: '2024-01-15 09:00:00',
		previousVersion: '',
		nextVersion: 'v1.1',
		changeDetails: '신규 계획 생성',
		impact: 'medium',
		status: 'archived',
		createdAt: '2024-01-15',
		updatedAt: '2024-01-15',
	},
	{
		id: 4,
		planCode: 'PLAN-2024-002',
		planName: '2024년 1월 생산계획 B',
		version: 'v1.0',
		productName: '제품 B',
		productCode: 'PROD-002',
		changeType: 'approved',
		changeReason: '설비 점검 일정 조정',
		changedBy: '생산팀장 이영희',
		changedAt: '2024-01-19 16:45:00',
		previousVersion: '',
		nextVersion: '',
		changeDetails: '설비 점검으로 인한 일정 조정 승인',
		impact: 'low',
		status: 'active',
		createdAt: '2024-01-18',
		updatedAt: '2024-01-19',
	},
	{
		id: 5,
		planCode: 'PLAN-2024-003',
		planName: '2024년 1월 생산계획 C',
		version: 'v1.0',
		productName: '제품 C',
		productCode: 'PROD-003',
		changeType: 'created',
		changeReason: '재료 공급 지연으로 인한 일정 조정',
		changedBy: '생산팀 최민수',
		changedAt: '2024-01-20 11:20:00',
		previousVersion: '',
		nextVersion: '',
		changeDetails: '재료 공급 지연으로 인한 일정 조정',
		impact: 'medium',
		status: 'active',
		createdAt: '2024-01-20',
		updatedAt: '2024-01-20',
	},
];

const PlanHistoryManagementPage = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<PlanHistoryData[]>(planHistoryData);
	const [selectedHistory, setSelectedHistory] =
		useState<PlanHistoryData | null>(null);
	const [filterData, setFilterData] = useState({
		planCode: '',
		changeType: 'all',
		impact: 'all',
		status: 'all',
		dateRange: 'all',
	});

	// Change type color function
	const getChangeTypeColor = (changeType: string) => {
		switch (changeType) {
			case 'created':
				return 'bg-green-100 text-green-800';
			case 'modified':
				return 'bg-blue-100 text-blue-800';
			case 'approved':
				return 'bg-purple-100 text-purple-800';
			case 'rejected':
				return 'bg-red-100 text-red-800';
			case 'cancelled':
				return 'bg-gray-100 text-gray-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// Impact color function
	const getImpactColor = (impact: string) => {
		switch (impact) {
			case 'high':
				return 'bg-red-100 text-red-800';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800';
			case 'low':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// Status color function
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-800';
			case 'archived':
				return 'bg-yellow-100 text-yellow-800';
			case 'deleted':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// Change type text function
	const getChangeTypeText = (changeType: string) => {
		switch (changeType) {
			case 'created':
				return '생성';
			case 'modified':
				return '수정';
			case 'approved':
				return '승인';
			case 'rejected':
				return '거부';
			case 'cancelled':
				return '취소';
			default:
				return changeType;
		}
	};

	// Impact text function
	const getImpactText = (impact: string) => {
		switch (impact) {
			case 'high':
				return '높음';
			case 'medium':
				return '보통';
			case 'low':
				return '낮음';
			default:
				return impact;
		}
	};

	// Status text function
	const getStatusText = (status: string) => {
		switch (status) {
			case 'active':
				return '활성';
			case 'archived':
				return '보관';
			case 'deleted':
				return '삭제됨';
			default:
				return status;
		}
	};

	// Filter data
	const filteredData = useMemo(() => {
		return data.filter((item) => {
			if (
				filterData.planCode &&
				!item.planCode.includes(filterData.planCode)
			)
				return false;
			if (
				filterData.changeType !== 'all' &&
				item.changeType !== filterData.changeType
			)
				return false;
			if (
				filterData.impact !== 'all' &&
				item.impact !== filterData.impact
			)
				return false;
			if (
				filterData.status !== 'all' &&
				item.status !== filterData.status
			)
				return false;
			return true;
		});
	}, [data, filterData]);

	// Chart options
	const changeTypeChartOption = useMemo(
		() => ({
			title: {
				text: '변경 유형별 현황',
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
					name: '변경 수',
					type: 'pie',
					radius: '50%',
					data: [
						{
							value: data.filter(
								(item) => item.changeType === 'created'
							).length,
							name: '생성',
						},
						{
							value: data.filter(
								(item) => item.changeType === 'modified'
							).length,
							name: '수정',
						},
						{
							value: data.filter(
								(item) => item.changeType === 'approved'
							).length,
							name: '승인',
						},
						{
							value: data.filter(
								(item) => item.changeType === 'rejected'
							).length,
							name: '거부',
						},
						{
							value: data.filter(
								(item) => item.changeType === 'cancelled'
							).length,
							name: '취소',
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
		}),
		[data]
	);

	const timelineChartOption = useMemo(
		() => ({
			title: {
				text: '변경 이력 타임라인',
				left: 'center',
			},
			tooltip: {
				trigger: 'axis',
				formatter: function (params: any) {
					const data = params[0];
					return `${data.name}<br/>${data.seriesName}: ${data.value}건`;
				},
			},
			xAxis: {
				type: 'category',
				data: [
					'1월 15일',
					'1월 16일',
					'1월 17일',
					'1월 18일',
					'1월 19일',
					'1월 20일',
				],
			},
			yAxis: {
				type: 'value',
				name: '변경 건수',
			},
			series: [
				{
					name: '변경 건수',
					type: 'line',
					data: [2, 1, 0, 1, 1, 1],
					itemStyle: { color: '#3B82F6' },
					areaStyle: { color: 'rgba(59, 130, 246, 0.1)' },
				},
			],
		}),
		[data]
	);

	// Table columns
	const columns = useMemo(
		() => [
			{
				accessorKey: 'planCode',
				header: '계획 코드',
				size: 150,
				cell: ({ row }: { row: any }) => (
					<div className="font-medium text-blue-600">
						{row.original.planCode}
					</div>
				),
			},
			{
				accessorKey: 'version',
				header: '버전',
				size: 80,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<div className="font-medium text-purple-600">
						{row.original.version}
					</div>
				),
			},
			{
				accessorKey: 'planName',
				header: '계획명',
				size: 200,
				cell: ({ row }: { row: any }) => (
					<div className="font-medium">{row.original.planName}</div>
				),
			},
			{
				accessorKey: 'changeType',
				header: '변경 유형',
				size: 100,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getChangeTypeColor(row.original.changeType)}`}
					>
						{getChangeTypeText(row.original.changeType)}
					</span>
				),
			},
			{
				accessorKey: 'changedBy',
				header: '변경자',
				size: 120,
				cell: ({ row }: { row: any }) => (
					<div>{row.original.changedBy}</div>
				),
			},
			{
				accessorKey: 'changedAt',
				header: '변경일시',
				size: 150,
				cell: ({ row }: { row: any }) => (
					<div className="text-sm">{row.original.changedAt}</div>
				),
			},
			{
				accessorKey: 'impact',
				header: '영향도',
				size: 100,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(row.original.impact)}`}
					>
						{getImpactText(row.original.impact)}
					</span>
				),
			},
			{
				accessorKey: 'status',
				header: '상태',
				size: 100,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.original.status)}`}
					>
						{getStatusText(row.original.status)}
					</span>
				),
			},
			{
				accessorKey: 'actions',
				header: '작업',
				size: 150,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<div className="flex gap-2 justify-center">
						<button
							onClick={() => setSelectedHistory(row.original)}
							className="p-1 text-blue-600 hover:bg-blue-50 rounded"
							title="상세 보기"
						>
							<Eye size={16} />
						</button>
						<button
							onClick={() => handleDownload(row.original)}
							className="p-1 text-green-600 hover:bg-green-50 rounded"
							title="다운로드"
						>
							<Download size={16} />
						</button>
						<button
							onClick={() => handleCompare(row.original)}
							className="p-1 text-purple-600 hover:bg-purple-50 rounded"
							title="비교"
						>
							<GitBranch size={16} />
						</button>
					</div>
				),
			},
		],
		[]
	);

	// Process columns using useDataTableColumns
	const processedColumns = useDataTableColumns(columns);

	// Use useDataTable with all required parameters
	const { table, selectedRows, toggleRowSelection } = useDataTable(
		filteredData,
		processedColumns,
		30, // defaultPageSize
		0, // pageCount
		0, // page
		filteredData.length, // totalElements
		undefined // onPageChange
	);

	// Handle download
	const handleDownload = (history: PlanHistoryData) => {
		toast.success(
			`${history.planCode} ${history.version} 버전을 다운로드합니다.`
		);
	};

	// Handle compare
	const handleCompare = (history: PlanHistoryData) => {
		toast.info(`${history.planCode} ${history.version} 버전을 비교합니다.`);
	};

	// Handle filter change
	const handleFilterChange = (field: string, value: string) => {
		setFilterData((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<>
			<DraggableDialog
				open={!!selectedHistory}
				onOpenChange={(open) => !open && setSelectedHistory(null)}
				title="계획 이력 상세 정보"
				content={
					selectedHistory && (
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">
										계획 코드
									</label>
									<p className="mt-1 text-sm text-blue-600 font-medium">
										{selectedHistory.planCode}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										버전
									</label>
									<p className="mt-1 text-sm text-purple-600 font-medium">
										{selectedHistory.version}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										계획명
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{selectedHistory.planName}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										제품명
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{selectedHistory.productName}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										변경 유형
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{getChangeTypeText(
											selectedHistory.changeType
										)}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										변경자
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{selectedHistory.changedBy}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										변경일시
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{selectedHistory.changedAt}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										영향도
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{getImpactText(selectedHistory.impact)}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										이전 버전
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{selectedHistory.previousVersion || '-'}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										다음 버전
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{selectedHistory.nextVersion || '-'}
									</p>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									변경 사유
								</label>
								<p className="mt-1 text-sm text-gray-900">
									{selectedHistory.changeReason}
								</p>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									변경 상세
								</label>
								<p className="mt-1 text-sm text-gray-900">
									{selectedHistory.changeDetails}
								</p>
							</div>
						</div>
					)
				}
			/>

			<div className="space-y-4">
				{/* 통계 카드 */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="p-4 rounded-lg border">
						<div className="flex items-center gap-3">
							<History className="h-8 w-8 text-blue-600" />
							<div>
								<p className="text-sm text-gray-600">총 이력</p>
								<p className="text-2xl font-bold text-gray-900">
									{data.length}
								</p>
							</div>
						</div>
					</div>
					<div className="p-4 rounded-lg border">
						<div className="flex items-center gap-3">
							<FileText className="h-8 w-8 text-green-600" />
							<div>
								<p className="text-sm text-gray-600">
									활성 버전
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{
										data.filter(
											(item) => item.status === 'active'
										).length
									}
								</p>
							</div>
						</div>
					</div>
					<div className="p-4 rounded-lg border">
						<div className="flex items-center gap-3">
							<Activity className="h-8 w-8 text-yellow-600" />
							<div>
								<p className="text-sm text-gray-600">
									보관 버전
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{
										data.filter(
											(item) => item.status === 'archived'
										).length
									}
								</p>
							</div>
						</div>
					</div>
					<div className="p-4 rounded-lg border">
						<div className="flex items-center gap-3">
							<Clock className="h-8 w-8 text-purple-600" />
							<div>
								<p className="text-sm text-gray-600">
									오늘 변경
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{
										data.filter((item) =>
											item.changedAt.includes(
												'2024-01-20'
											)
										).length
									}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* 필터 섹션 */}
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-4 mb-4">
						<Filter className="h-5 w-5 text-gray-500" />
						<h3 className="text-lg font-semibold">필터</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								변경 유형
							</label>
							<RadixSelect
								value={filterData.changeType}
								onValueChange={(value) =>
									handleFilterChange('changeType', value)
								}
								className="w-full"
							>
								<RadixSelectItem value="all">
									전체
								</RadixSelectItem>
								<RadixSelectItem value="created">
									생성
								</RadixSelectItem>
								<RadixSelectItem value="modified">
									수정
								</RadixSelectItem>
								<RadixSelectItem value="approved">
									승인
								</RadixSelectItem>
								<RadixSelectItem value="rejected">
									거부
								</RadixSelectItem>
								<RadixSelectItem value="cancelled">
									취소
								</RadixSelectItem>
							</RadixSelect>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								영향도
							</label>
							<RadixSelect
								value={filterData.impact}
								onValueChange={(value) =>
									handleFilterChange('impact', value)
								}
								className="w-full"
							>
								<RadixSelectItem value="all">
									전체
								</RadixSelectItem>
								<RadixSelectItem value="high">
									높음
								</RadixSelectItem>
								<RadixSelectItem value="medium">
									보통
								</RadixSelectItem>
								<RadixSelectItem value="low">
									낮음
								</RadixSelectItem>
							</RadixSelect>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								상태
							</label>
							<RadixSelect
								value={filterData.status}
								onValueChange={(value) =>
									handleFilterChange('status', value)
								}
								className="w-full"
							>
								<RadixSelectItem value="all">
									전체
								</RadixSelectItem>
								<RadixSelectItem value="active">
									활성
								</RadixSelectItem>
								<RadixSelectItem value="archived">
									보관
								</RadixSelectItem>
								<RadixSelectItem value="deleted">
									삭제됨
								</RadixSelectItem>
							</RadixSelect>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								기간
							</label>
							<RadixSelect
								value={filterData.dateRange}
								onValueChange={(value) =>
									handleFilterChange('dateRange', value)
								}
								className="w-full"
							>
								<RadixSelectItem value="all">
									전체
								</RadixSelectItem>
								<RadixSelectItem value="today">
									오늘
								</RadixSelectItem>
								<RadixSelectItem value="week">
									이번 주
								</RadixSelectItem>
								<RadixSelectItem value="month">
									이번 달
								</RadixSelectItem>
							</RadixSelect>
						</div>
					</div>
				</div>

				{/* 차트 섹션 */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="p-4 rounded-lg border">
						<EchartComponent
							options={changeTypeChartOption}
							styles={{ height: '400px' }}
						/>
					</div>
					<div className="p-4 rounded-lg border">
						<EchartComponent
							options={timelineChartOption}
							styles={{ height: '400px' }}
						/>
					</div>
				</div>

				{/* 계획 이력 테이블 */}
				<div className="rounded-lg border">
					<DatatableComponent
						data={filteredData}
						table={table}
						columns={columns}
						tableTitle="계획 이력 현황"
						rowCount={filteredData.length}
						useSearch={true}
						usePageNation={true}
						toggleRowSelection={toggleRowSelection}
						selectedRows={selectedRows}
						useEditable={false}
						searchSlot={<SearchSlotComponent />}
					/>
				</div>
			</div>
		</>
	);
};

export default PlanHistoryManagementPage;
