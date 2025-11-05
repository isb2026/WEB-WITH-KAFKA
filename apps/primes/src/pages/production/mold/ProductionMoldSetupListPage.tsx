import React, { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { useDataTable } from '@radix-ui/hook';
import { toast } from 'sonner';

// 금형 투입 데이터 타입
interface MoldSetupData {
	id: number;
	moldCode: string;
	moldName: string;
	moldType: string;
	workOrderNo: string;
	productName: string;
	machineNo: string;
	setupDate: string;
	setupTime: string;
	operatorName: string;
	status: string;
	plannedQuantity: number;
	actualQuantity: number;
	setupDuration: number; // 셋업 시간 (분)
	remarks?: string;
}

const PAGE_SIZE = 30;

// 임시 데이터
const mockData: MoldSetupData[] = [
	{
		id: 1,
		moldCode: 'MLD-001',
		moldName: '스마트폰 케이스 금형',
		moldType: 'Injection',
		workOrderNo: 'WO-2024-001',
		productName: '스마트폰 케이스',
		machineNo: 'MC-001',
		setupDate: '2024-01-15',
		setupTime: '09:30',
		operatorName: '김작업',
		status: '완료',
		plannedQuantity: 1000,
		actualQuantity: 950,
		setupDuration: 45,
		remarks: '정상 투입',
	},
	{
		id: 2,
		moldCode: 'MLD-002',
		moldName: '노트북 커버 금형',
		moldType: 'Injection',
		workOrderNo: 'WO-2024-002',
		productName: '노트북 커버',
		machineNo: 'MC-002',
		setupDate: '2024-01-16',
		setupTime: '14:15',
		operatorName: '이기술',
		status: '진행중',
		plannedQuantity: 800,
		actualQuantity: 650,
		setupDuration: 60,
		remarks: '진행 중',
	},
	{
		id: 3,
		moldCode: 'MLD-003',
		moldName: '자동차 부품 금형',
		moldType: 'Die Casting',
		workOrderNo: 'WO-2024-003',
		productName: '자동차 부품',
		machineNo: 'MC-003',
		setupDate: '2024-01-17',
		setupTime: '08:00',
		operatorName: '박제조',
		status: '대기',
		plannedQuantity: 500,
		actualQuantity: 0,
		setupDuration: 90,
		remarks: '대기 중',
	},
];

export const ProductionMoldSetupListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');

	const [page, setPage] = useState(0);
	const [data, setData] = useState<MoldSetupData[]>(mockData);
	const [totalElements, setTotalElements] = useState(mockData.length);
	const [pageCount, setPageCount] = useState(
		Math.ceil(mockData.length / PAGE_SIZE)
	);
	const [selectedMoldSetup, setSelectedMoldSetup] =
		useState<MoldSetupData | null>(null);
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
			accessorKey: 'workOrderNo',
			header: t('columns.workOrderNo', '작업지시번호'),
			size: 140,
		},
		{
			accessorKey: 'productName',
			header: t('columns.itemName', '제품명'),
			size: 150,
		},
		{
			accessorKey: 'machineNo',
			header: t('columns.machineNo', '설비번호'),
			size: 120,
		},
		{
			accessorKey: 'setupDate',
			header: t('columns.startDate', '투입일자'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'setupTime',
			header: '투입시간',
			size: 100,
		},
		{
			accessorKey: 'operatorName',
			header: t('columns.workerName', '작업자'),
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
						case '대기':
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
			accessorKey: 'plannedQuantity',
			header: t('columns.plannedQuantity', '계획수량'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'actualQuantity',
			header: t('columns.actualQuantity', '실제수량'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'setupDuration',
			header: '셋업시간(분)',
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? `${value}분` : '-';
			},
		},
		{
			accessorKey: 'remarks',
			header: t('columns.memo', '비고'),
			size: 150,
		},
	];

	// 페이지 변경 핸들러
	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	// 검색 핸들러
	const handleSearch = (searchData: Record<string, any>) => {
		console.log('금형 투입 검색:', searchData);
		// TODO: 실제 검색 로직 구현
	};

	// 수정 핸들러
	const handleEdit = () => {
		if (selectedMoldSetup) {
			console.log('금형 투입 수정:', selectedMoldSetup);
			toast.success('금형 투입 정보를 수정합니다.');
		} else {
			toast.error('수정할 항목을 선택해주세요.');
		}
	};

	// 삭제 핸들러
	const handleDelete = () => {
		if (selectedMoldSetup) {
			setOpenDeleteConfirm(true);
		} else {
			toast.error('삭제할 항목을 선택해주세요.');
		}
	};

	// 삭제 확인 핸들러
	const handleDeleteConfirm = () => {
		if (selectedMoldSetup) {
			const newData = data.filter(
				(item) => item.id !== selectedMoldSetup.id
			);
			setData(newData);
			setTotalElements(newData.length);
			setPageCount(Math.ceil(newData.length / PAGE_SIZE));
			setSelectedMoldSetup(null);
			setOpenDeleteConfirm(false);
			toast.success('금형 투입 정보가 삭제되었습니다.');
		}
	};

	// 행 선택 핸들러
	const handleRowSelect = (selectedData: MoldSetupData[]) => {
		if (selectedData.length > 0) {
			setSelectedMoldSetup(selectedData[0]);
		} else {
			setSelectedMoldSetup(null);
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
				title="금형 투입 정보 삭제"
				description="선택된 금형 투입 정보를 삭제하시겠습니까?"
			/>

			<PageTemplate>
				<DatatableComponent
					table={table}
					columns={tableColumns}
					data={data}
					tableTitle="금형 투입 현황"
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

export default ProductionMoldSetupListPage;
