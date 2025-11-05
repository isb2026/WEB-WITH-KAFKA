import React, { useState } from 'react';
import PageTemplate from '@primes/templates/PageTemplate';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import {
	Calendar,
	Download,
	CheckCircle,
	AlertCircle,
	Clock,
	Edit,
	Trash2,
} from 'lucide-react';
import {
	RadixSelect,
	RadixSelectGroup,
	RadixSelectItem,
	RadixButton,
} from '@repo/radix-ui/components';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';

type TableCellContext<TData, TValue> = {
	getValue: () => TValue;
	row: { original: TData };
};

// 정기검사 계획 데이터 타입
export interface PeriodicInspectionPlan {
	id: number;
	year: number;
	month: number;
	equipment: string;
	equipmentCode: string;
	inspectionType: string;
	plannedDate: string;
	inspector: string;
	department: string;
	status: 'planned' | 'in-progress' | 'completed' | 'overdue';
	description: string;
	estimatedHours: number;
	priority: 'high' | 'medium' | 'low';
}

interface QualityPeriodicInspectionPlanPageProps {
	onRequestEdit?: (plan: PeriodicInspectionPlan) => void;
}

// 월별 요약 데이터 타입
interface MonthlySummary {
	totalPlanned: number;
	completed: number;
	inProgress: number;
	overdue: number;
	completionRate: number;
}

const QualityPeriodicInspectionPlanPage: React.FC<
	QualityPeriodicInspectionPlanPageProps
> = ({ onRequestEdit }) => {
	// 상태 관리
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	const [selectedMonth, setSelectedMonth] = useState(
		new Date().getMonth() + 1
	);

	// 샘플 데이터
	const [planData] = useState<PeriodicInspectionPlan[]>([
		{
			id: 1,
			year: 2024,
			month: 1,
			equipment: '사출성형기 #001',
			equipmentCode: 'INJ-001',
			inspectionType: '월간정기검사',
			plannedDate: '2024-01-15',
			inspector: '김정비',
			department: '품질관리팀',
			status: 'completed',
			description: '유압시스템 및 안전장치 점검',
			estimatedHours: 4,
			priority: 'high',
		},
		{
			id: 2,
			year: 2024,
			month: 1,
			equipment: '컨베이어 라인 A',
			equipmentCode: 'CNV-A01',
			inspectionType: '분기정기검사',
			plannedDate: '2024-01-20',
			inspector: '이점검',
			department: '생산팀',
			status: 'in-progress',
			description: '벨트 장력 및 모터 점검',
			estimatedHours: 6,
			priority: 'medium',
		},
		{
			id: 3,
			year: 2024,
			month: 1,
			equipment: '프레스 #003',
			equipmentCode: 'PRS-003',
			inspectionType: '월간정기검사',
			plannedDate: '2024-01-25',
			inspector: '박안전',
			department: '품질관리팀',
			status: 'planned',
			description: '유압펌프 및 안전센서 점검',
			estimatedHours: 3,
			priority: 'high',
		},
		{
			id: 4,
			year: 2024,
			month: 1,
			equipment: '공작기계 #005',
			equipmentCode: 'MCH-005',
			inspectionType: '월간정기검사',
			plannedDate: '2024-01-18',
			inspector: '최정밀',
			department: '기술팀',
			status: 'overdue',
			description: '정밀도 측정 및 교정',
			estimatedHours: 5,
			priority: 'high',
		},
	]);

	// 월별 요약 계산
	const getMonthlySummary = (): MonthlySummary => {
		const filteredData = planData.filter(
			(item) => item.year === selectedYear && item.month === selectedMonth
		);

		const totalPlanned = filteredData.length;
		const completed = filteredData.filter(
			(item) => item.status === 'completed'
		).length;
		const inProgress = filteredData.filter(
			(item) => item.status === 'in-progress'
		).length;
		const overdue = filteredData.filter(
			(item) => item.status === 'overdue'
		).length;
		const completionRate =
			totalPlanned > 0 ? (completed / totalPlanned) * 100 : 0;

		return { totalPlanned, completed, inProgress, overdue, completionRate };
	};

	const summary = getMonthlySummary();

	// 테이블 컬럼 정의
	const tableColumns = [
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
			accessorKey: 'plannedDate',
			header: '예정일',
			size: 100,
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
			header: '상태',
			size: 100,
			cell: (info: TableCellContext<PeriodicInspectionPlan, string>) => {
				const value = info.getValue();
				const statusConfig = {
					planned: {
						label: '계획됨',
						color: 'bg-blue-100 text-blue-800',
						icon: Clock,
					},
					'in-progress': {
						label: '진행중',
						color: 'bg-yellow-100 text-yellow-800',
						icon: AlertCircle,
					},
					completed: {
						label: '완료',
						color: 'bg-green-100 text-green-800',
						icon: CheckCircle,
					},
					overdue: {
						label: '지연',
						color: 'bg-red-100 text-red-800',
						icon: AlertCircle,
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
			accessorKey: 'priority',
			header: '우선순위',
			size: 80,
			cell: (info: TableCellContext<PeriodicInspectionPlan, string>) => {
				const value = info.getValue();
				const priorityConfig = {
					high: { label: '높음', color: 'text-red-600' },
					medium: { label: '보통', color: 'text-yellow-600' },
					low: { label: '낮음', color: 'text-green-600' },
				};
				const config =
					priorityConfig[value as keyof typeof priorityConfig];

				return (
					<span className={`font-medium ${config.color}`}>
						{config.label}
					</span>
				);
			},
		},
		{
			accessorKey: 'estimatedHours',
			header: '예상시간',
			size: 80,
			cell: (info: TableCellContext<PeriodicInspectionPlan, number>) =>
				`${info.getValue()}시간`,
		},
		{
			accessorKey: 'actions',
			header: '작업',
			size: 100,
			cell: (info: TableCellContext<PeriodicInspectionPlan, unknown>) => {
				const plan = info.row.original;
				return (
					<div className="flex gap-1">
						<RadixButton
							size="sm"
							variant="ghost"
							onClick={() => onRequestEdit?.(plan)}
							className="p-1 h-6 w-6"
						>
							<Edit size={12} />
						</RadixButton>
						<RadixButton
							size="sm"
							variant="ghost"
							onClick={() => handleDelete(plan.id)}
							className="p-1 h-6 w-6 text-red-600 hover:text-red-700"
						>
							<Trash2 size={12} />
						</RadixButton>
					</div>
				);
			},
		},
	];

	// 필터링된 데이터
	const filteredData = planData.filter(
		(item) => item.year === selectedYear && item.month === selectedMonth
	);

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

	// 폼은 탭의 모달에서 관리

	// 이벤트 핸들러
	const handleDelete = (id: number) => {
		// 실제로는 삭제 확인 다이얼로그와 API 호출
		console.log('Delete plan:', id);
	};
	const handleExport = () => {
		// 엑셀 내보내기
		console.log('Export to Excel');
	};

	// 필터 슬롯 컴포넌트
	const FilterSlot = () => (
		<div className="flex items-center gap-4">
			<div className="flex items-center gap-2">
				<Calendar size={16} className="text-gray-500" />
				<span className="text-sm font-medium">계획년월:</span>
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

	// 액션 버튼들
	const ActionButtons = () => (
		<div className="flex items-center gap-2">
			<RadixButton
				onClick={handleExport}
				variant="outline"
				className="flex items-center gap-2"
			>
				<Download size={16} />
				내보내기
			</RadixButton>
		</div>
	);

	return (
		<>
			{/* 월별 요약 카드 */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
				<div className="bg-white rounded-lg border p-4">
					<div className="text-sm text-gray-600">총 계획</div>
					<div className="text-2xl font-bold text-gray-900">
						{summary.totalPlanned}
					</div>
				</div>
				<div className="bg-white rounded-lg border p-4">
					<div className="text-sm text-gray-600">완료</div>
					<div className="text-2xl font-bold text-green-600">
						{summary.completed}
					</div>
				</div>
				<div className="bg-white rounded-lg border p-4">
					<div className="text-sm text-gray-600">진행중</div>
					<div className="text-2xl font-bold text-yellow-600">
						{summary.inProgress}
					</div>
				</div>
				<div className="bg-white rounded-lg border p-4">
					<div className="text-sm text-gray-600">지연</div>
					<div className="text-2xl font-bold text-red-600">
						{summary.overdue}
					</div>
				</div>
				<div className="bg-white rounded-lg border p-4">
					<div className="text-sm text-gray-600">완료율</div>
					<div className="text-2xl font-bold text-blue-600">
						{summary.completionRate.toFixed(1)}%
					</div>
				</div>
			</div>

			<PageTemplate>
				{/* 계획 테이블 */}
				<div className="bg-white rounded-lg shadow">
					<DatatableComponent
						table={table}
						columns={tableColumns}
						data={filteredData}
						tableTitle={`${selectedYear}년 ${selectedMonth}월 정기검사 계획`}
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
							/>
						}
					/>
				</div>
			</PageTemplate>
		</>
	);
};

export default QualityPeriodicInspectionPlanPage;
