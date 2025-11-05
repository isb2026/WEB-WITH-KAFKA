import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { useDataTable } from '@radix-ui/hook';
import { toast } from 'sonner';

// 금형 점검 데이터 타입
interface MoldMaintenanceData {
	id: number;
	moldCode: string;
	moldName: string;
	moldType: string;
	maintenanceType: string; // 점검 유형
	scheduledDate: string; // 예정일
	actualDate?: string; // 실제 점검일
	duration: number; // 점검 시간 (시간)
	inspector: string; // 점검자
	status: string; // 상태
	findings?: string; // 점검 결과
	nextMaintenanceDate?: string; // 다음 점검 예정일
	cost?: number; // 점검 비용
	priority: string; // 우선순위
	location: string; // 금형 위치
}

const PAGE_SIZE = 30;

// 임시 데이터
const mockData: MoldMaintenanceData[] = [
	{
		id: 1,
		moldCode: 'MLD-001',
		moldName: '스마트폰 케이스 금형',
		moldType: 'Injection',
		maintenanceType: '정기점검',
		scheduledDate: '2024-01-15',
		actualDate: '2024-01-15',
		duration: 4,
		inspector: '김점검',
		status: '완료',
		findings: '정상 상태 확인',
		nextMaintenanceDate: '2024-04-15',
		cost: 150000,
		priority: '중간',
		location: '라인-1',
	},
	{
		id: 2,
		moldCode: 'MLD-002',
		moldName: '노트북 커버 금형',
		moldType: 'Injection',
		maintenanceType: '비정기점검',
		scheduledDate: '2024-01-20',
		actualDate: '2024-01-20',
		duration: 6,
		inspector: '이기술',
		status: '완료',
		findings: '부분 수리 필요',
		nextMaintenanceDate: '2024-03-20',
		cost: 300000,
		priority: '높음',
		location: '라인-2',
	},
	{
		id: 3,
		moldCode: 'MLD-003',
		moldName: '자동차 부품 금형',
		moldType: 'Die Casting',
		maintenanceType: '정기점검',
		scheduledDate: '2024-01-25',
		duration: 8,
		inspector: '박정비',
		status: '예정',
		priority: '중간',
		location: '라인-3',
	},
];

export const ProductionMoldMaintenanceListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const navigate = useNavigate();
	const { t: tCommon } = useTranslation('common');

	const [page, setPage] = useState(0);
	const [data, setData] = useState<MoldMaintenanceData[]>(mockData);
	const [totalElements, setTotalElements] = useState(mockData.length);
	const [pageCount, setPageCount] = useState(
		Math.ceil(mockData.length / PAGE_SIZE)
	);
	const [selectedMoldMaintenance, setSelectedMoldMaintenance] =
		useState<MoldMaintenanceData | null>(null);
	const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

	// 테이블 컬럼 정의
	const tableColumns = [
		{
			accessorKey: 'id',
			header: 'ID',
			size: 60,
			minSize: 60,
		},
		{
			accessorKey: 'moldCode',
			header: t('columns.moldCode', '금형코드'),
			size: 120,
			cell: ({ getValue, row }: { getValue: () => any; row: any }) => {
				const moldCode = getValue();
				const handleMoldCodeClick = () => {
					navigate(`/production/mold/maintenance/${moldCode}`);
				};

				return (
					<button
						onClick={handleMoldCodeClick}
						className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:underline"
					>
						{moldCode}
					</button>
				);
			},
		},
		{
			accessorKey: 'moldName',
			header: t('columns.moldName', '금형명'),
			size: 180,
		},
		{
			accessorKey: 'moldType',
			header: t('columns.moldType', '금형타입'),
			size: 120,
		},
		{
			accessorKey: 'maintenanceType',
			header: '점검유형',
			size: 120,
		},
		{
			accessorKey: 'scheduledDate',
			header: '예정일자',
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'actualDate',
			header: '실제일자',
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'duration',
			header: '점검시간(시간)',
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? `${value}시간` : '-';
			},
		},
		{
			accessorKey: 'inspector',
			header: '점검자',
			size: 100,
		},
		{
			accessorKey: 'status',
			header: t('columns.status', '상태'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const status = getValue();
				const getStatusColor = (status: string) => {
					switch (status) {
						case '완료':
							return 'bg-green-100 text-green-800';
						case '진행중':
							return 'bg-blue-100 text-blue-800';
						case '예정':
							return 'bg-yellow-100 text-yellow-800';
						default:
							return 'bg-gray-100 text-gray-800';
					}
				};
				return (
					<span
						className={`px-2 py-1 rounded text-xs ${getStatusColor(status)}`}
					>
						{status}
					</span>
				);
			},
		},
		{
			accessorKey: 'findings',
			header: '점검결과',
			size: 180,
		},
		{
			accessorKey: 'nextMaintenanceDate',
			header: '다음점검예정일',
			size: 140,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'cost',
			header: '점검비용',
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? `₩${value.toLocaleString()}` : '-';
			},
		},
		{
			accessorKey: 'priority',
			header: '우선순위',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const priority = getValue();
				const getPriorityColor = (priority: string) => {
					switch (priority) {
						case '높음':
							return 'bg-red-100 text-red-800';
						case '중간':
							return 'bg-yellow-100 text-yellow-800';
						case '낮음':
							return 'bg-green-100 text-green-800';
						default:
							return 'bg-gray-100 text-gray-800';
					}
				};
				return (
					<span
						className={`px-2 py-1 rounded text-xs ${getPriorityColor(priority)}`}
					>
						{priority}
					</span>
				);
			},
		},
		{
			accessorKey: 'location',
			header: t('columns.location', '위치'),
			size: 100,
		},
	];

	// 페이지 변경 핸들러
	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	// 검색 핸들러
	const handleSearch = (searchData: Record<string, any>) => {
		console.log('금형 점검 검색:', searchData);
		// TODO: 실제 검색 로직 구현
	};

	// 수정 핸들러
	const handleEdit = () => {
		if (selectedMoldMaintenance) {
			console.log('금형 점검 수정:', selectedMoldMaintenance);
			toast.success('금형 점검 정보를 수정합니다.');
		} else {
			toast.error('수정할 항목을 선택해주세요.');
		}
	};

	// 삭제 핸들러
	const handleDelete = () => {
		if (selectedMoldMaintenance) {
			setOpenDeleteConfirm(true);
		} else {
			toast.error('삭제할 항목을 선택해주세요.');
		}
	};

	// 삭제 확인 핸들러
	const handleDeleteConfirm = () => {
		if (selectedMoldMaintenance) {
			const newData = data.filter(
				(item) => item.id !== selectedMoldMaintenance.id
			);
			setData(newData);
			setTotalElements(newData.length);
			setPageCount(Math.ceil(newData.length / PAGE_SIZE));
			setSelectedMoldMaintenance(null);
			setOpenDeleteConfirm(false);
			toast.success('금형 점검 정보가 삭제되었습니다.');
		}
	};

	// 행 선택 핸들러
	const handleRowSelect = (selectedData: MoldMaintenanceData[]) => {
		if (selectedData.length > 0) {
			setSelectedMoldMaintenance(selectedData[0]);
		} else {
			setSelectedMoldMaintenance(null);
		}
	};

	// 데이터 테이블 훅
	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		tableColumns,
		PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	// 선택된 행 변경 감지
	useEffect(() => {
		const selectedIds = Array.from(selectedRows);
		const selectedData = data.filter((item) =>
			selectedIds.includes(item.id.toString())
		);
		handleRowSelect(selectedData);
	}, [selectedRows, data]);

	return (
		<>
			<DeleteConfirmDialog
				isOpen={openDeleteConfirm}
				onOpenChange={setOpenDeleteConfirm}
				onConfirm={handleDeleteConfirm}
				title="금형 점검 정보 삭제"
				description="선택된 금형 점검 정보를 삭제하시겠습니까?"
			/>

			<PageTemplate>
				<DatatableComponent
					table={table}
					columns={tableColumns}
					data={data}
					tableTitle="금형 점검 현황"
					rowCount={totalElements}
					useSearch={true}
					enableSingleSelect={true}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					classNames={{
						container: 'border rounded-lg',
					}}
					searchSlot={
						<SearchSlotComponent
							endSlot={
								<ActionButtonsComponent
									useEdit={true}
									useRemove={true}
									edit={handleEdit}
									remove={handleDelete}
									visibleText={false}
								/>
							}
						/>
					}
				/>
			</PageTemplate>
		</>
	);
};

export default ProductionMoldMaintenanceListPage;
