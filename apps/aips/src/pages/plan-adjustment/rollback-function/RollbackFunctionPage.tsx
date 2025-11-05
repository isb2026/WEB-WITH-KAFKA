import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	RotateCcw,
	History,
	Download,
	Eye,
	CheckCircle,
	AlertTriangle,
	FileText,
	Tag,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	DraggableDialog,
	RadixButton,
	RadixSelect,
	RadixSelectItem,
} from '@radix-ui/components';
import { useDataTable } from '@radix-ui/hook';
import { useDataTableColumns } from '@radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { toast } from 'sonner';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';

interface VersionData {
	id: number;
	planCode: string;
	planName: string;
	version: string;
	versionType: 'major' | 'minor' | 'patch' | 'rollback';
	description: string;
	createdBy: string;
	createdAt: string;
	status: 'active' | 'inactive' | 'rolled_back';
	changeSummary: string;
	impact: 'high' | 'medium' | 'low';
	tags: string[];
	attachments: string[];
}

interface RollbackLogData {
	id: number;
	planCode: string;
	fromVersion: string;
	toVersion: string;
	reason: string;
	rolledBackBy: string;
	rolledBackAt: string;
	status: 'success' | 'failed' | 'in_progress';
	errorMessage?: string;
	rollbackTime: string;
	affectedItems: string[];
	notes: string;
}

// Dummy data
const versionData: VersionData[] = [
	{
		id: 1,
		planCode: 'PLAN-2024-001',
		planName: '2024년 1월 생산계획 A',
		version: '1.0.0',
		versionType: 'major',
		description: '초기 생산계획 버전',
		createdBy: '생산팀장 이영희',
		createdAt: '2024-01-01 09:00:00',
		status: 'inactive',
		changeSummary: '초기 계획 수립',
		impact: 'high',
		tags: ['초기버전', '생산계획'],
		attachments: ['생산계획서_v1.0.0.pdf'],
	},
	{
		id: 2,
		planCode: 'PLAN-2024-001',
		planName: '2024년 1월 생산계획 A',
		version: '1.1.0',
		versionType: 'minor',
		description: '고객 요청으로 인한 수량 조정',
		createdBy: '영업팀 김철수',
		createdAt: '2024-01-15 14:30:00',
		status: 'active',
		changeSummary: '수량 1000개 → 1200개 증가',
		impact: 'high',
		tags: ['수량조정', '고객요청'],
		attachments: ['고객주문서.pdf', '수정계획서_v1.1.0.pdf'],
	},
	{
		id: 3,
		planCode: 'PLAN-2024-001',
		planName: '2024년 1월 생산계획 A',
		version: '1.2.0',
		versionType: 'minor',
		description: '설비 점검으로 인한 일정 조정',
		createdBy: '설비팀 박지성',
		createdAt: '2024-01-18 16:45:00',
		status: 'active',
		changeSummary: '생산 시작일 2일 앞당김',
		impact: 'medium',
		tags: ['일정조정', '설비점검'],
		attachments: ['설비점검계획서.pdf', '수정계획서_v1.2.0.pdf'],
	},
	{
		id: 4,
		planCode: 'PLAN-2024-002',
		planName: '2024년 1월 생산계획 B',
		version: '1.0.0',
		versionType: 'major',
		description: '초기 생산계획 버전',
		createdBy: '생산팀장 이영희',
		createdAt: '2024-01-01 09:00:00',
		status: 'active',
		changeSummary: '초기 계획 수립',
		impact: 'high',
		tags: ['초기버전', '생산계획'],
		attachments: ['생산계획서_v1.0.0.pdf'],
	},
];

const rollbackLogData: RollbackLogData[] = [
	{
		id: 1,
		planCode: 'PLAN-2024-001',
		fromVersion: '1.2.0',
		toVersion: '1.1.0',
		reason: '설비 점검 일정 변경으로 인한 문제 발생',
		rolledBackBy: '생산팀장 이영희',
		rolledBackAt: '2024-01-19 10:00:00',
		status: 'success',
		rollbackTime: '00:05:30',
		affectedItems: ['생산일정', '자원배분', '공급업체일정'],
		notes: '설비 점검 일정을 다시 조정한 후 재배포 예정',
	},
	{
		id: 2,
		planCode: 'PLAN-2024-003',
		fromVersion: '2.0.0',
		toVersion: '1.5.0',
		reason: '새로운 기능에서 예상치 못한 오류 발생',
		rolledBackBy: '시스템관리자 홍길동',
		rolledBackAt: '2024-01-20 15:30:00',
		status: 'success',
		rollbackTime: '00:08:15',
		affectedItems: ['생산계획', '품질관리', '재고관리'],
		notes: '오류 수정 후 안정성 테스트 완료 시 재배포',
	},
	{
		id: 3,
		planCode: 'PLAN-2024-004',
		fromVersion: '1.3.0',
		toVersion: '1.2.0',
		reason: '사용자 피드백으로 인한 기능 롤백',
		rolledBackBy: '제품관리자 김민수',
		rolledBackAt: '2024-01-21 11:15:00',
		status: 'failed',
		errorMessage: '데이터베이스 연결 오류',
		rollbackTime: '00:12:45',
		affectedItems: ['계획관리', '보고서'],
		notes: '데이터베이스 문제 해결 후 재시도 필요',
	},
];

const RollbackFunctionPage = () => {
	const { t } = useTranslation('common');
	const [versions, setVersions] = useState<VersionData[]>(versionData);
	const [rollbackLogs, setRollbackLogs] =
		useState<RollbackLogData[]>(rollbackLogData);
	const [selectedVersion, setSelectedVersion] = useState<VersionData | null>(
		null
	);
	const [showRollbackModal, setShowRollbackModal] = useState<boolean>(false);
	const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
	const [showRollbackLogs, setShowRollbackLogs] = useState<boolean>(false);
	const [filterData, setFilterData] = useState({
		planCode: '',
		versionType: 'all',
		status: 'all',
		impact: 'all',
	});
	const [rollbackForm, setRollbackForm] = useState({
		reason: '',
		notes: '',
		targetVersion: '',
	});

	// Version type color function
	const getVersionTypeColor = (versionType: string) => {
		switch (versionType) {
			case 'major':
				return 'bg-red-100 text-red-800';
			case 'minor':
				return 'bg-blue-100 text-blue-800';
			case 'patch':
				return 'bg-green-100 text-green-800';
			case 'rollback':
				return 'bg-orange-100 text-orange-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// Status color function
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-800';
			case 'inactive':
				return 'bg-gray-100 text-gray-800';
			case 'rolled_back':
				return 'bg-orange-100 text-orange-800';
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

	// Rollback status color function
	const getRollbackStatusColor = (status: string) => {
		switch (status) {
			case 'success':
				return 'bg-green-100 text-green-800';
			case 'failed':
				return 'bg-red-100 text-red-800';
			case 'in_progress':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// Version type text function
	const getVersionTypeText = (versionType: string) => {
		switch (versionType) {
			case 'major':
				return '주요';
			case 'minor':
				return '부차';
			case 'patch':
				return '패치';
			case 'rollback':
				return '롤백';
			default:
				return versionType;
		}
	};

	// Status text function
	const getStatusText = (status: string) => {
		switch (status) {
			case 'active':
				return '활성';
			case 'inactive':
				return '비활성';
			case 'rolled_back':
				return '롤백됨';
			default:
				return status;
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

	// Rollback status text function
	const getRollbackStatusText = (status: string) => {
		switch (status) {
			case 'success':
				return '성공';
			case 'failed':
				return '실패';
			case 'in_progress':
				return '진행중';
			default:
				return status;
		}
	};

	// Filter data
	const filteredVersions = useMemo(() => {
		return versions.filter((item) => {
			if (
				filterData.planCode &&
				!item.planCode.includes(filterData.planCode)
			)
				return false;
			if (
				filterData.versionType !== 'all' &&
				item.versionType !== filterData.versionType
			)
				return false;
			if (
				filterData.status !== 'all' &&
				item.status !== filterData.status
			)
				return false;
			if (
				filterData.impact !== 'all' &&
				item.impact !== filterData.impact
			)
				return false;
			return true;
		});
	}, [versions, filterData]);

	// Chart options
	const versionTypeChartOption = useMemo(
		() => ({
			title: {
				text: '버전 유형별 현황',
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
					name: '버전 수',
					type: 'pie',
					radius: '50%',
					data: [
						{
							value: versions.filter(
								(item) => item.versionType === 'major'
							).length,
							name: '주요',
						},
						{
							value: versions.filter(
								(item) => item.versionType === 'minor'
							).length,
							name: '부차',
						},
						{
							value: versions.filter(
								(item) => item.versionType === 'patch'
							).length,
							name: '패치',
						},
						{
							value: versions.filter(
								(item) => item.versionType === 'rollback'
							).length,
							name: '롤백',
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
		[versions]
	);

	const rollbackStatusChartOption = useMemo(
		() => ({
			title: {
				text: '롤백 상태별 현황',
				left: 'center',
			},
			tooltip: {
				trigger: 'axis',
			},
			xAxis: {
				type: 'category',
				data: ['성공', '실패', '진행중'],
			},
			yAxis: {
				type: 'value',
			},
			series: [
				{
					name: '롤백 수',
					type: 'bar',
					data: [
						rollbackLogs.filter((item) => item.status === 'success')
							.length,
						rollbackLogs.filter((item) => item.status === 'failed')
							.length,
						rollbackLogs.filter(
							(item) => item.status === 'in_progress'
						).length,
					],
					itemStyle: { color: '#3B82F6' },
				},
			],
		}),
		[rollbackLogs]
	);

	// Table columns for versions
	const versionColumns = useMemo(
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
				accessorKey: 'planName',
				header: '계획명',
				size: 200,
				cell: ({ row }: { row: any }) => (
					<div className="font-medium">{row.original.planName}</div>
				),
			},
			{
				accessorKey: 'version',
				header: '버전',
				size: 100,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<div className="font-mono font-medium">
						{row.original.version}
					</div>
				),
			},
			{
				accessorKey: 'versionType',
				header: '버전 유형',
				size: 100,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getVersionTypeColor(row.original.versionType)}`}
					>
						{getVersionTypeText(row.original.versionType)}
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
				accessorKey: 'createdBy',
				header: '생성자',
				size: 120,
				cell: ({ row }: { row: any }) => (
					<div>{row.original.createdBy}</div>
				),
			},
			{
				accessorKey: 'createdAt',
				header: '생성일시',
				size: 150,
				cell: ({ row }: { row: any }) => (
					<div className="text-sm">{row.original.createdAt}</div>
				),
			},
			{
				accessorKey: 'actions',
				header: '작업',
				size: 250,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<div className="flex gap-2 justify-center">
						<button
							onClick={() => {
								setSelectedVersion(row.original);
								setShowDetailModal(true);
							}}
							className="p-1 text-blue-600 hover:bg-blue-50 rounded"
							title="상세 보기"
						>
							<Eye size={16} />
						</button>
						<button
							onClick={() => handleRollback(row.original)}
							className="p-1 text-orange-600 hover:bg-orange-50 rounded"
							title="롤백"
							disabled={row.original.status === 'rolled_back'}
						>
							<RotateCcw size={16} />
						</button>
						<button
							onClick={() => handleDownload(row.original)}
							className="p-1 text-green-600 hover:bg-green-50 rounded"
							title="다운로드"
						>
							<Download size={16} />
						</button>
					</div>
				),
			},
		],
		[]
	);

	// Process columns using useDataTableColumns
	const processedVersionColumns = useDataTableColumns(versionColumns);

	// Use useDataTable with all required parameters
	const {
		table: versionTable,
		selectedRows: versionSelectedRows,
		toggleRowSelection: toggleVersionRowSelection,
	} = useDataTable(
		filteredVersions,
		processedVersionColumns,
		30, // defaultPageSize
		0, // pageCount
		0, // page
		filteredVersions.length, // totalElements
		undefined // onPageChange
	);

	// Handle rollback
	const handleRollback = (version: VersionData) => {
		// Close detail modal if open and set rollback modal
		setShowDetailModal(false);
		setShowRollbackModal(true);
		setSelectedVersion(version);
	};

	// Handle download
	const handleDownload = (version: VersionData) => {
		// TODO: Implement download functionality
		toast.info(`${version.version} 버전 다운로드가 시작되었습니다.`);
	};

	// Handle rollback logs
	const handleRollbackLogs = (version: VersionData) => {
		setSelectedVersion(version);
		setShowRollbackLogs(true);
	};

	// Handle retry rollback
	const handleRetryRollback = (log: RollbackLogData) => {
		// TODO: Implement retry rollback functionality
		toast.info(`${log.planCode}의 롤백을 재시도합니다.`);
	};

	// Handle rollback form submit
	const handleRollbackSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedVersion) return;

		// Create new rollback log
		const newRollbackLog: RollbackLogData = {
			id: rollbackLogs.length + 1,
			planCode: selectedVersion.planCode,
			fromVersion: selectedVersion.version,
			toVersion: rollbackForm.targetVersion,
			reason: rollbackForm.reason,
			rolledBackBy: '현재 사용자',
			rolledBackAt: new Date()
				.toISOString()
				.replace('T', ' ')
				.substring(0, 19),
			status: 'success',
			rollbackTime: '00:03:45',
			affectedItems: ['생산계획', '자원배분', '공급업체일정'],
			notes: rollbackForm.notes,
		};

		// Update version status
		setVersions(
			versions.map((v) =>
				v.id === selectedVersion.id
					? { ...v, status: 'rolled_back' as any }
					: v
			)
		);

		// Add rollback log
		setRollbackLogs([...rollbackLogs, newRollbackLog]);

		// Reset form and close modal
		setRollbackForm({
			reason: '',
			notes: '',
			targetVersion: '',
		});
		setShowRollbackModal(false);
		setSelectedVersion(null);

		toast.success(
			`${selectedVersion.version} 버전이 성공적으로 롤백되었습니다.`
		);
	};

	// Handle form input change
	const handleInputChange = (field: string, value: string) => {
		setRollbackForm((prev) => ({ ...prev, [field]: value }));
	};

	// Handle filter change
	const handleFilterChange = (field: string, value: string) => {
		setFilterData((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<div className="space-y-4">
			{/* 통계 카드 */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<FileText className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">총 버전</p>
							<p className="text-2xl font-bold text-gray-900">
								{versions.length}
							</p>
						</div>
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<CheckCircle className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">활성 버전</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									versions.filter(
										(item) => item.status === 'active'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<RotateCcw className="h-8 w-8 text-orange-600" />
						<div>
							<p className="text-sm text-gray-600">롤백된 버전</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									versions.filter(
										(item) => item.status === 'rolled_back'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<History className="h-8 w-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600">총 롤백</p>
							<p className="text-2xl font-bold text-gray-900">
								{rollbackLogs.length}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 필터 섹션 */}
			<div className="bg-white p-4 rounded-lg border">
				<div className="flex items-center gap-4 mb-4">
					<Tag className="h-5 w-5 text-gray-500" />
					<h3 className="text-lg font-semibold">필터</h3>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							버전 유형
						</label>
						<RadixSelect
							value={filterData.versionType}
							onValueChange={(value) =>
								handleFilterChange('versionType', value)
							}
							className="w-full"
						>
							<RadixSelectItem value="all">전체</RadixSelectItem>
							<RadixSelectItem value="major">
								주요
							</RadixSelectItem>
							<RadixSelectItem value="minor">
								부차
							</RadixSelectItem>
							<RadixSelectItem value="patch">
								패치
							</RadixSelectItem>
							<RadixSelectItem value="rollback">
								롤백
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
							<RadixSelectItem value="all">전체</RadixSelectItem>
							<RadixSelectItem value="active">
								활성
							</RadixSelectItem>
							<RadixSelectItem value="inactive">
								비활성
							</RadixSelectItem>
							<RadixSelectItem value="rolled_back">
								롤백됨
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
							<RadixSelectItem value="all">전체</RadixSelectItem>
							<RadixSelectItem value="high">높음</RadixSelectItem>
							<RadixSelectItem value="medium">
								보통
							</RadixSelectItem>
							<RadixSelectItem value="low">낮음</RadixSelectItem>
						</RadixSelect>
					</div>
				</div>
			</div>

			{/* 차트 섹션 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white p-4 rounded-lg border">
					<EchartComponent
						options={versionTypeChartOption}
						styles={{ height: '400px' }}
					/>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<EchartComponent
						options={rollbackStatusChartOption}
						styles={{ height: '400px' }}
					/>
				</div>
			</div>

			{/* 버전 관리 테이블 */}
			<div className="bg-white rounded-lg border">
				<DatatableComponent
					data={filteredVersions}
					table={versionTable}
					columns={versionColumns}
					tableTitle="버전 관리 현황"
					rowCount={filteredVersions.length}
					useSearch={true}
					usePageNation={true}
					toggleRowSelection={toggleVersionRowSelection}
					selectedRows={versionSelectedRows}
					useEditable={false}
					searchSlot={<SearchSlotComponent />}
				/>
			</div>

			{/* 롤백 모달 */}
			<DraggableDialog
				open={showRollbackModal && !!selectedVersion}
				onOpenChange={(open) => {
					if (!open) {
						setShowRollbackModal(false);
						setSelectedVersion(null);
					}
				}}
				title={`${selectedVersion?.planCode} - ${selectedVersion?.version} 롤백`}
				content={
					<div className="space-y-4">
						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
							<div className="flex items-center gap-2 mb-2">
								<AlertTriangle className="h-5 w-5 text-yellow-600" />
								<h4 className="font-medium text-yellow-800">
									주의사항
								</h4>
							</div>
							<p className="text-sm text-yellow-700">
								롤백을 실행하면 현재 버전의 모든 변경사항이
								손실됩니다. 계속 진행하시겠습니까?
							</p>
						</div>
						<form
							onSubmit={handleRollbackSubmit}
							className="space-y-4"
						>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									롤백 대상 버전 *
								</label>
								<RadixSelect
									value={rollbackForm.targetVersion}
									onValueChange={(value) =>
										handleInputChange(
											'targetVersion',
											value
										)
									}
									className="w-full"
								>
									{versions
										.filter(
											(v) =>
												v.planCode ===
													selectedVersion?.planCode &&
												v.id !== selectedVersion?.id
										)
										.map((version) => (
											<RadixSelectItem
												key={version.id}
												value={version.version}
											>
												{version.version} -{' '}
												{version.description}
											</RadixSelectItem>
										))}
								</RadixSelect>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									롤백 사유 *
								</label>
								<input
									type="text"
									value={rollbackForm.reason}
									onChange={(e) =>
										handleInputChange(
											'reason',
											e.target.value
										)
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									비고
								</label>
								<textarea
									value={rollbackForm.notes}
									onChange={(e) =>
										handleInputChange(
											'notes',
											e.target.value
										)
									}
									rows={3}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div className="flex justify-end gap-2">
								<RadixButton
									type="submit"
									className="px-4 py-2 bg-Colors-Brand-700 text-white rounded-md hover:bg-Colors-Brand-800 flex items-center gap-2"
								>
									<RotateCcw size={16} />
									롤백 실행
								</RadixButton>
							</div>
						</form>
					</div>
				}
			/>

			{/* 상세 보기 모달 */}
			<DraggableDialog
				open={showDetailModal && !!selectedVersion}
				onOpenChange={(open) => {
					if (!open) {
						setShowDetailModal(false);
						setSelectedVersion(null);
					}
				}}
				title="버전 상세 정보"
				content={
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700">
									계획 코드
								</label>
								<p className="mt-1 text-sm text-gray-900">
									{selectedVersion?.planCode}
								</p>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									계획명
								</label>
								<p className="mt-1 text-sm text-gray-900">
									{selectedVersion?.planName}
								</p>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									버전
								</label>
								<p className="mt-1 text-sm text-gray-900 font-mono">
									{selectedVersion?.version}
								</p>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									버전 유형
								</label>
								<p className="mt-1 text-sm text-gray-900">
									{getVersionTypeText(
										selectedVersion?.versionType || 'major'
									)}
								</p>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									상태
								</label>
								<p className="mt-1 text-sm text-gray-900">
									{getStatusText(
										selectedVersion?.status || 'active'
									)}
								</p>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									영향도
								</label>
								<p className="mt-1 text-sm text-gray-900">
									{getImpactText(
										selectedVersion?.impact || 'medium'
									)}
								</p>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									생성자
								</label>
								<p className="mt-1 text-sm text-gray-900">
									{selectedVersion?.createdBy}
								</p>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									생성일시
								</label>
								<p className="mt-1 text-sm text-gray-900">
									{selectedVersion?.createdAt}
								</p>
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								설명
							</label>
							<p className="mt-1 text-sm text-gray-900">
								{selectedVersion?.description}
							</p>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								변경 요약
							</label>
							<p className="mt-1 text-sm text-gray-900">
								{selectedVersion?.changeSummary}
							</p>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								태그
							</label>
							<div className="flex flex-wrap gap-1 mt-1">
								{selectedVersion?.tags?.map((tag, index) => (
									<span
										key={index}
										className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
									>
										{tag}
									</span>
								))}
							</div>
						</div>
						{selectedVersion?.attachments &&
							selectedVersion.attachments.length > 0 && (
								<div>
									<label className="block text-sm font-medium text-gray-700">
										첨부파일
									</label>
									<div className="flex flex-wrap gap-2 mt-1">
										{selectedVersion.attachments.map(
											(file, index) => (
												<span
													key={index}
													className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full cursor-pointer hover:bg-blue-200"
												>
													{file}
												</span>
											)
										)}
									</div>
								</div>
							)}
					</div>
				}
			/>
		</div>
	);
};

export default RollbackFunctionPage;
