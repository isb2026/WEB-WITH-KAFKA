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

// 자주검사 데이터 타입
interface QualityInspectionData {
	id: number;
	inspectionCode: string;
	inspectionDate: string;
	workOrderNo: string;
	productCode: string;
	productName: string;
	lotNumber: string;
	inspectorName: string;
	inspectionType: string; // 자주검사, 정기검사, 특별검사
	status: string; // 진행중, 완료, 보류
	totalItems: number; // 총 검사항목 수
	okItems: number; // 양호 항목 수
	ngItems: number; // 불량 항목 수
	warningItems: number; // 주의 항목 수
	overallResult: 'OK' | 'NG' | 'WARNING'; // 종합 결과
	notes?: string;
}

const PAGE_SIZE = 30;

// 임시 데이터
const mockData: QualityInspectionData[] = [
	{
		id: 1,
		inspectionCode: 'QI-2024-001',
		inspectionDate: '2024-01-25',
		workOrderNo: 'WO-240125-001',
		productCode: 'PROD-001',
		productName: '스마트폰 케이스',
		lotNumber: 'LOT-240125-001',
		inspectorName: '김검사',
		inspectionType: '자주검사',
		status: '완료',
		totalItems: 15,
		okItems: 12,
		ngItems: 1,
		warningItems: 2,
		overallResult: 'WARNING',
		notes: '일부 항목 재검토 필요',
	},
	{
		id: 2,
		inspectionCode: 'QI-2024-002',
		inspectionDate: '2024-01-25',
		workOrderNo: 'WO-240125-002',
		productCode: 'PROD-002',
		productName: '자동차 부품',
		lotNumber: 'LOT-240125-002',
		inspectorName: '이검사',
		inspectionType: '정기검사',
		status: '완료',
		totalItems: 20,
		okItems: 20,
		ngItems: 0,
		warningItems: 0,
		overallResult: 'OK',
		notes: '모든 항목 양호',
	},
	{
		id: 3,
		inspectionCode: 'QI-2024-003',
		inspectionDate: '2024-01-25',
		workOrderNo: 'WO-240125-003',
		productCode: 'PROD-003',
		productName: '전자부품',
		lotNumber: 'LOT-240125-003',
		inspectorName: '박검사',
		inspectionType: '자주검사',
		status: '진행중',
		totalItems: 12,
		okItems: 8,
		ngItems: 0,
		warningItems: 1,
		overallResult: 'WARNING',
		notes: '검사 진행중',
	},
];

export const ProductionQualityInspectionListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const navigate = useNavigate();

	const [page, setPage] = useState(0);
	const [data, setData] = useState<QualityInspectionData[]>(mockData);
	const [totalElements, setTotalElements] = useState(mockData.length);
	const [pageCount, setPageCount] = useState(
		Math.ceil(mockData.length / PAGE_SIZE)
	);
	const [selectedInspection, setSelectedInspection] =
		useState<QualityInspectionData | null>(null);
	const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

	// 검사 결과별 색상
	const getResultColor = (result: string) => {
		switch (result) {
			case 'OK':
				return 'text-green-600 bg-green-50';
			case 'WARNING':
				return 'text-yellow-600 bg-yellow-50';
			case 'NG':
				return 'text-red-600 bg-red-50';
			default:
				return 'text-gray-600 bg-gray-50';
		}
	};

	// 상태별 색상
	const getStatusColor = (status: string) => {
		switch (status) {
			case '완료':
				return 'bg-green-100 text-green-800';
			case '진행중':
				return 'bg-blue-100 text-blue-800';
			case '보류':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// 테이블 컬럼 정의
	const tableColumns = [
		{
			accessorKey: 'id',
			header: 'ID',
			size: 60,
			minSize: 60,
		},
		{
			accessorKey: 'inspectionCode',
			header: '검사코드',
			size: 120,
			cell: ({ getValue, row }: { getValue: () => any; row: any }) => {
				const inspectionCode = getValue();
				const handleCodeClick = () => {
					navigate(
						`/production/quality/inspection/${row.original.id}`
					);
				};

				return (
					<button
						onClick={handleCodeClick}
						className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:underline"
					>
						{inspectionCode}
					</button>
				);
			},
		},
		{
			accessorKey: 'inspectionDate',
			header: '검사일자',
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'workOrderNo',
			header: '작업지시번호',
			size: 140,
		},
		{
			accessorKey: 'productName',
			header: '제품명',
			size: 150,
		},
		{
			accessorKey: 'lotNumber',
			header: '로트번호',
			size: 120,
		},
		{
			accessorKey: 'inspectorName',
			header: '검사자',
			size: 100,
		},
		{
			accessorKey: 'inspectionType',
			header: '검사유형',
			size: 100,
		},
		{
			accessorKey: 'status',
			header: t('columns.status', '상태'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const status = getValue();
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
			accessorKey: 'overallResult',
			header: '종합결과',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const result = getValue();
				return (
					<div
						className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getResultColor(result)}`}
					>
						{result}
					</div>
				);
			},
		},
		{
			accessorKey: 'totalItems',
			header: '총 항목',
			size: 80,
			cell: ({ row }: { row: any }) => {
				const { totalItems, okItems, ngItems, warningItems } =
					row.original;
				return (
					<div className="text-sm">
						<div className="font-medium">{totalItems}</div>
						<div className="text-xs text-gray-500">
							OK:{okItems} NG:{ngItems} W:{warningItems}
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: 'notes',
			header: '비고',
			size: 180,
		},
	];

	// Initialize useDataTable
	const { table, toggleRowSelection, selectedRows } = useDataTable(
		data,
		tableColumns,
		PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		(newPage: number) => setPage(newPage)
	);

	// Handle row selection
	useEffect(() => {
		const handleRowSelect = (ids: string[]) => {
			if (ids.length > 0) {
				const selectedData = data.find(
					(item) => item.id.toString() === ids[0]
				);
				setSelectedInspection(selectedData || null);
			} else {
				setSelectedInspection(null);
			}
		};

		const selectedData = Array.from(selectedRows);
		handleRowSelect(selectedData);
	}, [selectedRows, data]);

	const handleEdit = () => {
		if (selectedInspection) {
			navigate(`/production/quality/inspection/${selectedInspection.id}`);
		}
	};

	const handleDelete = () => {
		if (selectedInspection) {
			setOpenDeleteConfirm(true);
		}
	};

	const handleDeleteConfirm = () => {
		if (selectedInspection) {
			// TODO: 실제 삭제 API 호출
			const newData = data.filter(
				(item) => item.id !== selectedInspection.id
			);
			setData(newData);
			setTotalElements(newData.length);
			setPageCount(Math.ceil(newData.length / PAGE_SIZE));
			setSelectedInspection(null);
			setOpenDeleteConfirm(false);
			toast.success('검사 정보가 삭제되었습니다.');
		}
	};

	return (
		<>
			<DeleteConfirmDialog
				isOpen={openDeleteConfirm}
				onOpenChange={setOpenDeleteConfirm}
				onConfirm={handleDeleteConfirm}
				title="자주검사 정보 삭제"
				description="선택된 자주검사 정보를 삭제하시겠습니까?"
			/>

			<PageTemplate>
				<DatatableComponent
					table={table}
					columns={tableColumns}
					data={data}
					tableTitle="자주검사 현황"
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

export default ProductionQualityInspectionListPage;
