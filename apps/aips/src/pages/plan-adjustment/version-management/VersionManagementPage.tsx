import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	GitBranch,
	FileText,
	Eye,
	Download,
	GitCompare,
	Plus,
	Save,
	X,
	History,
	CheckCircle,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import { RadixSelect, RadixSelectItem } from '@radix-ui/components';
import { DraggableDialog } from '@repo/radix-ui/components';
import { useDataTable } from '@radix-ui/hook';
import { useDataTableColumns, ColumnConfig } from '@radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { toast } from 'sonner';

interface VersionData {
	id: number;
	planCode: string;
	planName: string;
	version: string;
	productName: string;
	productCode: string;
	versionType: 'major' | 'minor' | 'patch';
	status: 'active' | 'draft' | 'archived' | 'deprecated';
	createdBy: string;
	approvedBy: string;
	approvedAt: string;
	description: string;
	changeLog: string;
	tags: string[];
	compatibility: string[];
	previousVersion: string;
	nextVersion: string;
	createdAt: string;
	updatedAt: string;
}

// Dummy data
const versionData: VersionData[] = [
	{
		id: 1,
		planCode: 'PLAN-2024-001',
		planName: '2024년 1월 생산계획 A',
		version: 'v1.2.0',
		productName: '제품 A',
		productCode: 'PROD-001',
		versionType: 'minor',
		status: 'active',
		createdBy: '생산팀 김철수',
		createdAt: '2024-01-16',
		approvedBy: '생산팀장 이영희',
		approvedAt: '2024-01-17',
		description: '고객 요청으로 인한 수량 증가 및 일정 조정',
		changeLog: '수량: 1000 → 1200, 기간: 2024-01-01~15 → 2024-01-03~18',
		tags: ['고객요청', '수량증가', '일정조정'],
		compatibility: ['v1.1.0', 'v1.0.0'],
		previousVersion: 'v1.1.0',
		nextVersion: 'v1.3.0',
		updatedAt: '2024-01-17',
	},
	{
		id: 2,
		planCode: 'PLAN-2024-001',
		planName: '2024년 1월 생산계획 A',
		version: 'v1.1.0',
		productName: '제품 A',
		productCode: 'PROD-001',
		versionType: 'minor',
		status: 'archived',
		createdBy: '생산팀 김철수',
		createdAt: '2024-01-15',
		approvedBy: '생산팀장 이영희',
		approvedAt: '2024-01-15',
		description: '초기 계획 승인',
		changeLog: '초기 계획 승인 완료',
		tags: ['초기승인', '계획수립'],
		compatibility: ['v1.0.0'],
		previousVersion: 'v1.0.0',
		nextVersion: 'v1.2.0',
		updatedAt: '2024-01-15',
	},
	{
		id: 3,
		planCode: 'PLAN-2024-001',
		planName: '2024년 1월 생산계획 A',
		version: 'v1.0.0',
		productName: '제품 A',
		productCode: 'PROD-001',
		versionType: 'major',
		status: 'archived',
		createdBy: '생산팀 김철수',
		createdAt: '2024-01-15',
		approvedBy: '',
		approvedAt: '',
		description: '신규 계획 생성',
		changeLog: '신규 계획 생성',
		tags: ['신규생성', '계획수립'],
		compatibility: [],
		previousVersion: '',
		nextVersion: 'v1.1.0',
		updatedAt: '2024-01-15',
	},
	{
		id: 4,
		planCode: 'PLAN-2024-002',
		planName: '2024년 1월 생산계획 B',
		version: 'v1.0.0',
		productName: '제품 B',
		productCode: 'PROD-002',
		versionType: 'major',
		status: 'active',
		createdBy: '생산팀 박지성',
		createdAt: '2024-01-18',
		approvedBy: '생산팀장 이영희',
		approvedAt: '2024-01-19',
		description: '설비 점검으로 인한 일정 조정',
		changeLog: '설비 점검으로 인한 일정 조정 승인',
		tags: ['설비점검', '일정조정'],
		compatibility: [],
		previousVersion: '',
		nextVersion: '',
		updatedAt: '2024-01-19',
	},
	{
		id: 5,
		planCode: 'PLAN-2024-003',
		planName: '2024년 1월 생산계획 C',
		version: 'v1.0.0',
		productName: '제품 C',
		productCode: 'PROD-003',
		versionType: 'major',
		status: 'draft',
		createdBy: '생산팀 최민수',
		createdAt: '2024-01-20',
		approvedBy: '',
		approvedAt: '',
		description: '재료 공급 지연으로 인한 일정 조정',
		changeLog: '재료 공급 지연으로 인한 일정 조정',
		tags: ['재료지연', '일정조정'],
		compatibility: [],
		previousVersion: '',
		nextVersion: '',
		updatedAt: '2024-01-20',
	},
];

const VersionManagementPage = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<VersionData[]>(versionData);
	const [selectedVersion, setSelectedVersion] = useState<VersionData | null>(
		null
	);
	const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
	const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
	const [compareData, setCompareData] = useState({
		version1: '',
		version2: '',
	});
	const [formData, setFormData] = useState({
		planCode: '',
		version: '',
		description: '',
		changeLog: '',
		tags: '',
	});

	// Version type color function
	const getVersionTypeColor = (versionType: string) => {
		switch (versionType) {
			case 'major':
				return 'bg-red-100 text-red-800';
			case 'minor':
				return 'bg-yellow-100 text-yellow-800';
			case 'patch':
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
			case 'draft':
				return 'bg-yellow-100 text-yellow-800';
			case 'archived':
				return 'bg-gray-100 text-gray-800';
			case 'deprecated':
				return 'bg-red-100 text-red-800';
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
			default:
				return versionType;
		}
	};

	// Status text function
	const getStatusText = (status: string) => {
		switch (status) {
			case 'active':
				return '활성';
			case 'draft':
				return '초안';
			case 'archived':
				return '보관';
			case 'deprecated':
				return '사용중단';
			default:
				return status;
		}
	};

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
							value: data.filter(
								(item) => item.versionType === 'major'
							).length,
							name: '주요',
						},
						{
							value: data.filter(
								(item) => item.versionType === 'minor'
							).length,
							name: '부차',
						},
						{
							value: data.filter(
								(item) => item.versionType === 'patch'
							).length,
							name: '패치',
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

	const statusChartOption = useMemo(
		() => ({
			title: {
				text: '버전 상태별 현황',
				left: 'center',
			},
			tooltip: {
				trigger: 'axis',
			},
			xAxis: {
				type: 'category',
				data: ['활성', '초안', '보관', '사용중단'],
			},
			yAxis: {
				type: 'value',
			},
			series: [
				{
					name: '버전 수',
					type: 'bar',
					data: [
						data.filter((item) => item.status === 'active').length,
						data.filter((item) => item.status === 'draft').length,
						data.filter((item) => item.status === 'archived')
							.length,
						data.filter((item) => item.status === 'deprecated')
							.length,
					],
					itemStyle: { color: '#3B82F6' },
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
				size: 100,
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
				accessorKey: 'createdBy',
				header: '생성자',
				size: 120,
				cell: ({ row }: { row: any }) => (
					<div>{row.original.createdBy}</div>
				),
			},
			{
				accessorKey: 'createdAt',
				header: '생성일',
				size: 120,
				cell: ({ row }: { row: any }) => (
					<div>{row.original.createdAt}</div>
				),
			},
			{
				accessorKey: 'tags',
				header: '태그',
				size: 150,
				cell: ({ row }: { row: any }) => (
					<div className="flex flex-wrap gap-1">
						{row.original.tags.map((tag: string, index: number) => (
							<span
								key={index}
								className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
							>
								{tag}
							</span>
						))}
					</div>
				),
			},
			{
				accessorKey: 'actions',
				header: '작업',
				size: 200,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<div className="flex gap-2 justify-center">
						<button
							onClick={() => setSelectedVersion(row.original)}
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
							<GitCompare size={16} />
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
		data,
		processedColumns,
		30, // defaultPageSize
		0, // pageCount
		0, // page
		data.length, // totalElements
		undefined // onPageChange
	);

	// Handle download
	const handleDownload = (version: VersionData) => {
		toast.success(
			`${version.planCode} ${version.version} 버전을 다운로드합니다.`
		);
	};

	// Handle compare
	const handleCompare = (version: VersionData) => {
		setCompareData({ version1: version.version, version2: '' });
		setShowCompareModal(true);
	};

	// Handle compare submit
	const handleCompareSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (compareData.version1 && compareData.version2) {
			toast.info(
				`${compareData.version1}과 ${compareData.version2} 버전을 비교합니다.`
			);
			setShowCompareModal(false);
			setCompareData({ version1: '', version2: '' });
		} else {
			toast.error('비교할 두 버전을 모두 선택해주세요.');
		}
	};

	return (
		<div className="space-y-4">
			{/* 통계 카드 */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<GitBranch className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">총 버전</p>
							<p className="text-2xl font-bold text-gray-900">
								{data.length}
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
									data.filter(
										(item) => item.status === 'active'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<FileText className="h-8 w-8 text-yellow-600" />
						<div>
							<p className="text-sm text-gray-600">초안 버전</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'draft'
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
							<p className="text-sm text-gray-600">보관 버전</p>
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
						options={statusChartOption}
						styles={{ height: '400px' }}
					/>
				</div>
			</div>

			{/* 버전 관리 테이블 */}
			<div className="rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="버전 관리 현황"
					rowCount={data.length}
					useSearch={true}
					usePageNation={true}
					toggleRowSelection={toggleRowSelection}
					selectedRows={selectedRows}
					useEditable={false}
				/>
			</div>

			<DraggableDialog
				open={!!selectedVersion}
				onOpenChange={(open) => !open && setSelectedVersion(null)}
				title="버전 상세 정보"
				content={
					selectedVersion && (
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">
										계획 코드
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{selectedVersion.planCode}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										버전
									</label>
									<p className="mt-1 text-sm text-purple-600 font-medium">
										{selectedVersion.version}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										계획명
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{selectedVersion.planName}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										제품명
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{selectedVersion.productName}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										버전 유형
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{getVersionTypeText(
											selectedVersion.versionType
										)}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										상태
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{getStatusText(selectedVersion.status)}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										생성자
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{selectedVersion.createdBy}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										생성일
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{selectedVersion.createdAt}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										승인자
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{selectedVersion.approvedBy || '-'}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										승인일
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{selectedVersion.approvedAt || '-'}
									</p>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									설명
								</label>
								<p className="mt-1 text-sm text-gray-900">
									{selectedVersion.description}
								</p>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									변경 로그
								</label>
								<p className="mt-1 text-sm text-gray-900">
									{selectedVersion.changeLog}
								</p>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									태그
								</label>
								<div className="flex flex-wrap gap-1 mt-1">
									{selectedVersion.tags.map((tag, index) => (
										<span
											key={index}
											className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
										>
											{tag}
										</span>
									))}
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">
										이전 버전
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{selectedVersion.previousVersion || '-'}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										다음 버전
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{selectedVersion.nextVersion || '-'}
									</p>
								</div>
							</div>
						</div>
					)
				}
			/>

			<DraggableDialog
				open={showCompareModal}
				onOpenChange={setShowCompareModal}
				title="버전 비교"
				content={
					<form onSubmit={handleCompareSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								버전 1
							</label>
							<RadixSelect
								value={compareData.version1}
								onValueChange={(value) =>
									setCompareData((prev) => ({
										...prev,
										version1: value,
									}))
								}
								className="w-full"
							>
								{data.map((version) => (
									<RadixSelectItem
										key={version.id}
										value={version.version}
									>
										{version.version} - {version.planName}
									</RadixSelectItem>
								))}
							</RadixSelect>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								버전 2
							</label>
							<RadixSelect
								value={compareData.version2}
								onValueChange={(value) =>
									setCompareData((prev) => ({
										...prev,
										version2: value,
									}))
								}
								className="w-full"
							>
								{data.map((version) => (
									<RadixSelectItem
										key={version.id}
										value={version.version}
									>
										{version.version} - {version.planName}
									</RadixSelectItem>
								))}
							</RadixSelect>
						</div>
						<div className="flex justify-end gap-2">
							<button
								type="button"
								onClick={() => setShowCompareModal(false)}
								className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
							>
								취소
							</button>
							<button
								type="submit"
								className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
							>
								<GitCompare size={16} />
								비교
							</button>
						</div>
					</form>
				}
			/>
		</div>
	);
};

export default VersionManagementPage;
