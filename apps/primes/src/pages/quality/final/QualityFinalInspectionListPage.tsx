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

// checkingHead 데이터 타입 (기존 타입을 checkingHead 타입으로 변경)
import type { CheckingHeadData } from '@primes/types/qms/checkingHead';

// checkingHead 서비스와 훅 import
import { useCheckingHeads } from '@primes/hooks/qms/checkingHead/useCheckingHeads';

const PAGE_SIZE = 30;

export const QualityFinalInspectionListPage: React.FC = () => {
	const { t: tDataTable } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const navigate = useNavigate();

	const [page, setPage] = useState(0);
	const [data, setData] = useState<CheckingHeadData[]>([]);
	const [totalElements, setTotalElements] = useState(0);
	const [pageCount, setPageCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [selectedInspection, setSelectedInspection] =
		useState<CheckingHeadData | null>(null);
	const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
	const [searchParams, setSearchParams] = useState<any>({});

	// checkingHead 훅 사용 (자주검사 타입으로 필터링)
	const { remove, list } = useCheckingHeads({
		page,
		size: PAGE_SIZE,
		searchRequest: {
			...searchParams,
			inspectionType: 'FINAL', 
		},
	});

	// list 데이터가 변경될 때마다 상태 업데이트
	useEffect(() => {
		if (list.data) {
			setData(list.data.content);
			setTotalElements(list.data.totalElements);
			setPageCount(list.data.totalPages);
		}
	}, [list.data]);

	// 로딩 상태 동기화
	useEffect(() => {
		setLoading(list.isLoading);
	}, [list.isLoading]);

	// 초기 데이터 로드 - list 훅이 자동으로 데이터를 가져옴
	useEffect(() => {
		// list 훅이 자동으로 page 변경을 감지하여 데이터를 가져옴
		// 별도의 fetchCheckingHeadList 함수 호출 불필요
	}, [page]);

	// 검사 결과별 색상 (checkingHead 데이터에 맞게 수정)
	const getResultColor = (isPass: boolean) => {
		return isPass 
			? 'text-green-600 bg-green-50' 
			: 'text-red-600 bg-red-50';
	};

	// 상태별 색상 (isUse 필드 기반)
	const getStatusColor = (isUse: boolean) => {
		return isUse 
			? 'bg-green-100 text-green-800' 
			: 'bg-gray-100 text-gray-800';
	};

	// 테이블 컬럼 정의 (기존 구조 유지하면서 checkingHead 데이터에 맞게 수정)
	const tableColumns = [
		{
			id: 'createdAt',
			accessorKey: 'createdAt',
			header: tDataTable('columns.createdAt'),
			size: 120,
			cell: ({ row }: { row: any }) => {
				const meta = row.original.meta;
				return meta?.inspectionDate || '-';
			},
		},
		{
			id: 'itemName',
			accessorKey: 'itemName',
			header: tDataTable('columns.itemName'),
			size: 150,
			cell: ({ row }: { row: any }) => {
				const meta = row.original.meta;
				return meta?.itemName || '-';
			},
		},
		{
			id: 'targetCode',
			accessorKey: 'targetCode',
			header: tDataTable('columns.targetCode'),
			size: 140,
		},
		{
			id: 'checkName',
			accessorKey: 'checkName',
			header: tDataTable('columns.checkCode'),
			size: 150,
			cell: ({ row }: { row: any }) => {
				const checkingName = row.original.checkingName || '-';
				
				const handleCodeClick = () => {
					navigate(
						`/quality/final-inspection/report/${row.original.id}`
					);
				};

				return (
					<button
						onClick={handleCodeClick}
						className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:underline"
					>
						{checkingName}
					</button>
				);
			},
		},
		{
			id: 'inspectionType',
			accessorKey: 'inspectionType',
			header: tDataTable('columns.inspectionType'),
			size: 100,
			cell: tCommon('inspection.type.final'),
		},
		{
			id: 'inspectorName',
			accessorKey: 'inspectorName',
			header: tDataTable('columns.inspectorName'),
			size: 100,
			cell: ({ row }: { row: any }) => {
				const meta = row.original.meta;
				return meta?.inspectorName || '-';
			},
		},
		{
			id: 'status',
			accessorKey: 'status',
			header: tDataTable('columns.status'),
			size: 100,
			cell: ({ row }: { row: any }) => {
				const isUse = row.original.isUse;
				const statusText = isUse 
					? tCommon('inspection.status.completed')
					: tCommon('inspection.status.inProgress');
				return (
					<span
						className={`px-2 py-1 rounded text-xs ${getStatusColor(isUse)}`}
					>
						{statusText}
					</span>
				);
			},
		},
		{
			id: 'isPass',
			accessorKey: 'isPass',
			header: tDataTable('columns.overallResult'),
			size: 100,
			cell: ({ row }: { row: any }) => {
				const isPass = row.original.isPass;
				const result = isPass ? 'OK' : 'NG';
				return (
					<div
						className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getResultColor(isPass)}`}
					>
						{result}
					</div>
				);
			},
		},
		{
			id: 'sampleQuantity',
			accessorKey: 'sampleQuantity',
			header: tDataTable('columns.sampleQuantity'),
			size: 80,
			cell: ({ row }: { row: any }) => {
				const { checkingSamples } = row.original;
				const sampleCount = checkingSamples?.length || 0;
				
				// checkingSamples에서 isPass 값에 따라 OK, NG 계산
				const okCount = checkingSamples?.filter((sample: any) => sample.isPass === true).length || 0;
				const ngCount = checkingSamples?.filter((sample: any) => sample.isPass === false).length || 0;
				
				return (
					<div className="text-sm">
						<div className="font-medium">{sampleCount}</div>
						<div className="text-xs text-gray-500">
							OK:{okCount} NG:{ngCount}
						</div>
					</div>
				);
			},
		},
		{
			id: 'notes',
			accessorKey: 'notes',
			header: tDataTable('columns.notes'),
			size: 150,
			cell: ({ row }: { row: any }) => {
				const notes = row.original.meta?.notes || '';
				return notes || '-';
			},
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

	// Handle row selection - React Table의 내부 ID와 실제 데이터 ID를 매핑
	useEffect(() => {
		if (selectedRows.size > 0) {
			// selectedRows에는 React Table의 내부 ID가 저장되어 있음
			// 이를 실제 데이터의 인덱스로 변환하여 해당 데이터를 찾음
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex = parseInt(selectedRowIndex);
			
			if (!isNaN(rowIndex) && rowIndex >= 0 && rowIndex < data.length) {
				const selectedData = data[rowIndex];
				setSelectedInspection(selectedData || null);
			} else {
				setSelectedInspection(null);
			}
		} else {
			setSelectedInspection(null);
		}
		console.log(selectedRows);
	}, [selectedRows, data]);

	const handleEdit = () => {
		if (selectedInspection) {
			navigate(`/quality/final-inspection/edit/${selectedInspection.id}`);
		}
	};

	const handleDelete = () => {
		if (selectedInspection) {
			setOpenDeleteConfirm(true);
		}
	};

	const handleDeleteConfirm = async () => {
		if (selectedInspection) {
			try {
				await remove.mutateAsync([selectedInspection.id]);
				
				// 삭제 후 목록 새로고침
				// list 훅이 자동으로 page 변경을 감지하여 데이터를 가져옴
				// 별도의 fetchCheckingHeadList 함수 호출 불필요
				
				setSelectedInspection(null);
				setOpenDeleteConfirm(false);
				toast.success(tCommon('inspection.success.deleteSuccess'));
			} catch (error) {
				console.error('검사 헤드 삭제 실패:', error);
				toast.error(tCommon('inspection.error.deleteFailed'));
			}
		}
	};

	// 검색 처리
	const handleSearch = async (searchParams: any) => {
		try {
			setLoading(true);
			// 검색 시 첫 페이지로 이동
			setPage(0);
			// 검색 파라미터를 상태에 저장
			setSearchParams(searchParams);
			
		} catch (error) {
			console.error('검색 실패:', error);
			toast.error(tCommon('inspection.error.searchFailed'));
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<DeleteConfirmDialog
				isOpen={openDeleteConfirm}
				onOpenChange={setOpenDeleteConfirm}
				onConfirm={handleDeleteConfirm}
				title={tCommon('inspection.delete.title')}
				description={tCommon('inspection.delete.description')}
			/>

			<PageTemplate>
				<DatatableComponent
					table={table}
					columns={tableColumns}
					data={data}
					tableTitle={tCommon('inspection.type.final')}
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
							onSearch={handleSearch}
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

export default QualityFinalInspectionListPage;
