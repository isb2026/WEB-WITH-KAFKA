import React, { useState } from 'react';
import PageTemplate from '@primes/templates/PageTemplate';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import {
	Calendar,
	Eye,
	Download,
	CheckCircle,
	AlertCircle,
	Clock,
	XCircle,
	FileText,
} from 'lucide-react';
import {
	RadixSelect,
	RadixSelectGroup,
	RadixSelectItem,
	RadixButton,
} from '@repo/radix-ui/components';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import type { FormField } from '@primes/components/form/DynamicFormComponent';

type TableCellContext<TData, TValue> = {
	getValue: () => TValue;
	row: { original: TData };
};

// 정기검사 실행 결과 데이터 타입
interface PeriodicInspectionResult {
	id: number;
	inspectionDate: string;
	equipmentCode: string;
	equipment: string;
	inspectionType: string;
	inspector: string;
	department: string;
	status: 'completed' | 'failed' | 'pending' | 'cancelled';
	result: 'pass' | 'fail' | 'conditional' | 'pending';
	score: number;
	defectsFound: number;
	actionRequired: boolean;
	nextInspectionDate: string;
	duration: number; // 실제 소요시간
	notes: string;
}

const QualityPeriodicInspectionListPage: React.FC = () => {
	// 필터 상태
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	const [selectedMonth, setSelectedMonth] = useState(
		new Date().getMonth() + 1
	);
	const [selectedStatus, setSelectedStatus] = useState('all');
	const [selectedResult, setSelectedResult] = useState('all');
	const [selectedDepartment, setSelectedDepartment] = useState('all');

	// 샘플 데이터
	const [inspectionData] = useState<PeriodicInspectionResult[]>([
		{
			id: 1,
			inspectionDate: '2024-01-15',
			equipmentCode: 'INJ-001',
			equipment: '사출성형기 #001',
			inspectionType: '월간정기검사',
			inspector: '김정비',
			department: '품질관리팀',
			status: 'completed',
			result: 'pass',
			score: 95,
			defectsFound: 1,
			actionRequired: false,
			nextInspectionDate: '2024-02-15',
			duration: 3.5,
			notes: '경미한 오일 누유 발견, 즉시 보수 완료',
		},
		{
			id: 2,
			inspectionDate: '2024-01-18',
			equipmentCode: 'MCH-005',
			equipment: '공작기계 #005',
			inspectionType: '월간정기검사',
			inspector: '최정밀',
			department: '기술팀',
			status: 'completed',
			result: 'fail',
			score: 72,
			defectsFound: 3,
			actionRequired: true,
			nextInspectionDate: '2024-02-18',
			duration: 6.0,
			notes: '주축 베어링 마모, 정밀도 기준 미달, 긴급 수리 필요',
		},
		{
			id: 3,
			inspectionDate: '2024-01-20',
			equipmentCode: 'CNV-A01',
			equipment: '컨베이어 라인 A',
			inspectionType: '분기정기검사',
			inspector: '이점검',
			department: '생산팀',
			status: 'completed',
			result: 'conditional',
			score: 82,
			defectsFound: 2,
			actionRequired: true,
			nextInspectionDate: '2024-04-20',
			duration: 4.5,
			notes: '벨트 장력 조정 필요, 센서 교정 완료',
		},
		{
			id: 4,
			inspectionDate: '2024-01-25',
			equipmentCode: 'PRS-003',
			equipment: '프레스 #003',
			inspectionType: '월간정기검사',
			inspector: '박안전',
			department: '품질관리팀',
			status: 'pending',
			result: 'pending',
			score: 0,
			defectsFound: 0,
			actionRequired: false,
			nextInspectionDate: '2024-02-25',
			duration: 0,
			notes: '검사 예정',
		},
		{
			id: 5,
			inspectionDate: '2024-01-12',
			equipmentCode: 'WLD-002',
			equipment: '용접로봇 #002',
			inspectionType: '월간정기검사',
			inspector: '정용접',
			department: '기술팀',
			status: 'cancelled',
			result: 'pending',
			score: 0,
			defectsFound: 0,
			actionRequired: false,
			nextInspectionDate: '2024-02-12',
			duration: 0,
			notes: '설비 수리로 인한 검사 연기',
		},
	]);

	// 테이블 컬럼 정의
	const tableColumns = [
		{
			accessorKey: 'inspectionDate',
			header: '검사일',
			size: 100,
		},
		{
			accessorKey: 'equipmentCode',
			header: '설비코드',
			size: 100,
		},
		{
			accessorKey: 'equipment',
			header: '설비명',
			size: 150,
		},
		{
			accessorKey: 'inspectionType',
			header: '검사유형',
			size: 120,
		},
		{
			accessorKey: 'inspector',
			header: '검사자',
			size: 80,
		},
		{
			accessorKey: 'department',
			header: '담당부서',
			size: 100,
		},
		{
			accessorKey: 'status',
			header: '진행상태',
			size: 100,
			cell: (
				info: TableCellContext<PeriodicInspectionResult, string>
			) => {
				const value = info.getValue();
				const statusConfig = {
					completed: {
						label: '완료',
						color: 'bg-green-100 text-green-800',
						icon: CheckCircle,
					},
					failed: {
						label: '실패',
						color: 'bg-red-100 text-red-800',
						icon: XCircle,
					},
					pending: {
						label: '대기',
						color: 'bg-gray-100 text-gray-800',
						icon: Clock,
					},
					cancelled: {
						label: '취소',
						color: 'bg-red-100 text-red-800',
						icon: XCircle,
					},
				};
				const config = statusConfig[value as keyof typeof statusConfig];
				const IconComponent = config.icon;

				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}
					>
						<IconComponent size={12} />
						{config.label}
					</span>
				);
			},
		},
		{
			accessorKey: 'result',
			header: '검사결과',
			size: 100,
			cell: (
				info: TableCellContext<PeriodicInspectionResult, string>
			) => {
				const value = info.getValue();
				const resultConfig = {
					pass: {
						label: '합격',
						color: 'bg-green-100 text-green-800',
					},
					fail: { label: '불합격', color: 'bg-red-100 text-red-800' },
					conditional: {
						label: '조건부',
						color: 'bg-yellow-100 text-yellow-800',
					},
					pending: {
						label: '대기',
						color: 'bg-gray-100 text-gray-800',
					},
				};
				const config = resultConfig[value as keyof typeof resultConfig];

				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
					>
						{config.label}
					</span>
				);
			},
		},
		{
			accessorKey: 'score',
			header: '점수',
			size: 60,
			cell: (
				info: TableCellContext<PeriodicInspectionResult, number>
			) => {
				const value = info.getValue();
				if (value === 0) return '-';
				return (
					<span
						className={`font-medium ${
							value >= 90
								? 'text-green-600'
								: value >= 80
									? 'text-yellow-600'
									: 'text-red-600'
						}`}
					>
						{value}점
					</span>
				);
			},
		},
		{
			accessorKey: 'defectsFound',
			header: '발견결함',
			size: 80,
			cell: (
				info: TableCellContext<PeriodicInspectionResult, number>
			) => {
				const value = info.getValue();
				return (
					<span
						className={`font-medium ${
							value === 0
								? 'text-green-600'
								: value <= 2
									? 'text-yellow-600'
									: 'text-red-600'
						}`}
					>
						{value}건
					</span>
				);
			},
		},
		{
			accessorKey: 'actionRequired',
			header: '조치필요',
			size: 80,
			cell: (
				info: TableCellContext<PeriodicInspectionResult, boolean>
			) => {
				const value = info.getValue();
				return value ? (
					<AlertCircle size={16} className="text-red-500" />
				) : (
					<CheckCircle size={16} className="text-green-500" />
				);
			},
		},
		{
			accessorKey: 'duration',
			header: '소요시간',
			size: 80,
			cell: (
				info: TableCellContext<PeriodicInspectionResult, number>
			) => {
				const value = info.getValue();
				return value > 0 ? `${value}시간` : '-';
			},
		},
		{
			accessorKey: 'nextInspectionDate',
			header: '다음검사일',
			size: 100,
		},
		{
			accessorKey: 'actions',
			header: '작업',
			size: 80,
			cell: (
				info: TableCellContext<PeriodicInspectionResult, unknown>
			) => {
				const inspection = info.row.original;
				return (
					<div className="flex gap-1">
						<RadixButton
							size="sm"
							variant="ghost"
							onClick={() => handleViewDetail(inspection)}
							className="p-1 h-6 w-6"
						>
							<Eye size={12} />
						</RadixButton>
						{inspection.status === 'completed' && (
							<RadixButton
								size="sm"
								variant="ghost"
								onClick={() => handleDownloadReport(inspection)}
								className="p-1 h-6 w-6"
							>
								<FileText size={12} />
							</RadixButton>
						)}
					</div>
				);
			},
		},
	];

	// 필터링된 데이터
	const getFilteredData = () => {
		let filtered = inspectionData;

		// 년월 필터링
		filtered = filtered.filter((item) => {
			const inspectionDate = new Date(item.inspectionDate);
			return (
				inspectionDate.getFullYear() === selectedYear &&
				inspectionDate.getMonth() + 1 === selectedMonth
			);
		});

		if (selectedStatus !== 'all') {
			filtered = filtered.filter(
				(item) => item.status === selectedStatus
			);
		}

		if (selectedResult !== 'all') {
			filtered = filtered.filter(
				(item) => item.result === selectedResult
			);
		}

		if (selectedDepartment !== 'all') {
			filtered = filtered.filter(
				(item) => item.department === selectedDepartment
			);
		}

		return filtered;
	};

	const filteredData = getFilteredData();

	// 데이터테이블 훅
	const { table, selectedRows, toggleRowSelection } = useDataTable(
		filteredData,
		tableColumns,
		10,
		1,
		0,
		filteredData.length,
		() => {}
	);

	// 월별 요약 통계
	const getSummaryStats = () => {
		const total = filteredData.length;
		const completed = filteredData.filter(
			(item) => item.status === 'completed'
		).length;
		const passed = filteredData.filter(
			(item) => item.result === 'pass'
		).length;
		const failed = filteredData.filter(
			(item) => item.result === 'fail'
		).length;
		const actionRequired = filteredData.filter(
			(item) => item.actionRequired
		).length;

		return { total, completed, passed, failed, actionRequired };
	};

	const stats = getSummaryStats();

	// 이벤트 핸들러
	const handleViewDetail = (inspection: PeriodicInspectionResult) => {
		console.log('View detail:', inspection);
		// 상세 보기 모달 또는 페이지 이동
	};

	const handleDownloadReport = (inspection: PeriodicInspectionResult) => {
		console.log('Download report:', inspection);
		// 보고서 다운로드
	};

	const handleExport = () => {
		console.log('Export filtered data');
		// 필터링된 데이터 엑셀 내보내기
	};

	// 필터 슬롯 컴포넌트
	const FilterSlot = () => (
		<div className="flex flex-wrap items-center gap-4">
			<div className="flex items-center gap-2">
				<Calendar size={16} className="text-gray-500" />
				<span className="text-sm font-medium">검사년월:</span>
			</div>
			<div className="flex items-center gap-2">
				<div className="min-w-[100px]">
					<RadixSelect
						value={selectedYear.toString()}
						onValueChange={(value) =>
							setSelectedYear(parseInt(value))
						}
					>
						<RadixSelectGroup>
							<RadixSelectItem value="2023">
								2023년
							</RadixSelectItem>
							<RadixSelectItem value="2024">
								2024년
							</RadixSelectItem>
							<RadixSelectItem value="2025">
								2025년
							</RadixSelectItem>
						</RadixSelectGroup>
					</RadixSelect>
				</div>
				<div className="min-w-[80px]">
					<RadixSelect
						value={selectedMonth.toString()}
						onValueChange={(value) =>
							setSelectedMonth(parseInt(value))
						}
					>
						<RadixSelectGroup>
							{Array.from({ length: 12 }, (_, i) => (
								<RadixSelectItem
									key={i + 1}
									value={(i + 1).toString()}
								>
									{i + 1}월
								</RadixSelectItem>
							))}
						</RadixSelectGroup>
					</RadixSelect>
				</div>
			</div>
		</div>
	);

	const searchFields: FormField[] = [
		{
			name: 'status',
			label: '진행상태',
			type: 'select',
			options: [
				{ label: '전체', value: 'all' },
				{ label: '완료', value: 'completed' },
				{ label: '대기', value: 'pending' },
				{ label: '취소', value: 'cancelled' },
			],
		},
		{
			name: 'result',
			label: '검사결과',
			type: 'select',
			options: [
				{ label: '전체', value: 'all' },
				{ label: '합격', value: 'pass' },
				{ label: '불합격', value: 'fail' },
				{ label: '조건부', value: 'conditional' },
			],
		},
		{
			name: 'department',
			label: '부서',
			type: 'select',
			options: [
				{ label: '전체 부서', value: 'all' },
				{ label: '품질관리팀', value: '품질관리팀' },
				{ label: '생산팀', value: '생산팀' },
				{ label: '기술팀', value: '기술팀' },
			],
		},
	];

	// 액션 버튼들
	const ActionButtons = () => (
		<RadixButton
			onClick={handleExport}
			variant="outline"
			className="flex items-center gap-2"
		>
			<Download size={16} />
			내보내기
		</RadixButton>
	);

	return (
		<>
			{/* 요약 통계 카드 */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
				<div className="bg-white rounded-lg border p-4">
					<div className="text-sm text-gray-600">총 검사</div>
					<div className="text-2xl font-bold text-gray-900">
						{stats.total}
					</div>
				</div>
				<div className="bg-white rounded-lg border p-4">
					<div className="text-sm text-gray-600">완료</div>
					<div className="text-2xl font-bold text-blue-600">
						{stats.completed}
					</div>
				</div>
				<div className="bg-white rounded-lg border p-4">
					<div className="text-sm text-gray-600">합격</div>
					<div className="text-2xl font-bold text-green-600">
						{stats.passed}
					</div>
				</div>
				<div className="bg-white rounded-lg border p-4">
					<div className="text-sm text-gray-600">불합격</div>
					<div className="text-2xl font-bold text-red-600">
						{stats.failed}
					</div>
				</div>
				<div className="bg-white rounded-lg border p-4">
					<div className="text-sm text-gray-600">조치필요</div>
					<div className="text-2xl font-bold text-orange-600">
						{stats.actionRequired}
					</div>
				</div>
			</div>

			<PageTemplate>
				{/* 검사 결과 테이블 */}
				<div className="bg-white rounded-lg shadow">
					<DatatableComponent
						table={table}
						columns={tableColumns}
						data={filteredData}
						tableTitle={`${selectedYear}년 ${selectedMonth}월 정기검사 현황`}
						rowCount={filteredData.length}
						selectedRows={selectedRows}
						toggleRowSelection={toggleRowSelection}
						useSearch={true}
						usePageNation={true}
						useSummary={true}
						searchSlot={
							<SearchSlotComponent
								topSlot={<FilterSlot />}
								endSlot={<ActionButtons />}
								fields={searchFields}
								onSearch={(data) => {
									if (data.status)
										setSelectedStatus(String(data.status));
									if (data.result)
										setSelectedResult(String(data.result));
									if (data.department)
										setSelectedDepartment(
											String(data.department)
										);
								}}
							/>
						}
					/>
				</div>
			</PageTemplate>
		</>
	);
};

export default QualityPeriodicInspectionListPage;
