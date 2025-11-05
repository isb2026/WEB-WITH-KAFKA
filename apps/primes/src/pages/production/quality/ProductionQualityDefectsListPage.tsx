import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { DraggableDialog } from '@repo/radix-ui/components';
import ProductionQualityDefectsRegisterPage from './ProductionQualityDefectsRegisterPage';
import { useDefectRecords } from '@primes/hooks/production/defectRecord/useDefectRecord';
import { useDeleteDefectRecord } from '@primes/hooks/production/defectRecord/useDeleteDefectRecord';
import { mapDefectRecordDtoToDefectRecord,DefectSeverity,DefectStatus } from '@primes/types/production/defectTypes';
import type { DefectRecordSearchRequest } from '@primes/types/production/defectTypes';
import { toast } from 'sonner';

// 불량 현황 데이터 타입
interface DefectRecord {
	id: number;
	defectCode: string;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	defectType: string;
	defectTypeCode?: string;
	defectReason: string;
	defectReasonCode?: string;
	defectDescription: string;
	reportDate: string;
	reportedBy: string;
	severity: DefectSeverity;
	status: DefectStatus;
	assignedTo?: string;
	dueDate?: string;
	actionPlanDescription?: string;
}

const PAGE_SIZE = 30;

const ProductionQualityDefectsListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const navigate = useNavigate();
	
	const [page, setPage] = useState(0);
	const [size, setSize] = useState(PAGE_SIZE);
	const [searchRequest, setSearchRequest] = useState<DefectRecordSearchRequest>({});
	const [selectedDefect, setSelectedDefect] = useState<DefectRecord | null>(null);
	const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
	const [openEditModal, setOpenEditModal] = useState(false);
	const [openCreateModal, setOpenCreateModal] = useState(false);

	// API 훅 사용
	const { list: defectRecordsQuery } = useDefectRecords({
		searchRequest,
		page,
		size,
	});
	const deleteDefectRecordMutation = useDeleteDefectRecord();

	// 쿼리 결과 구조분해
	const { data: defectRecordsResponse, isLoading, error } = defectRecordsQuery;

	// API 응답 데이터를 DefectRecord 형태로 변환
	const defectRecords: DefectRecord[] = React.useMemo(() => {
		if (!defectRecordsResponse?.data?.content) return [];
		return defectRecordsResponse.data.content.map(mapDefectRecordDtoToDefectRecord);
	}, [defectRecordsResponse]);

	// 총 개수 및 페이지 정보
	const totalElements = defectRecordsResponse?.data?.totalElements || 0;
	const totalPages = defectRecordsResponse?.data?.totalPages || 0;

	// 테이블 컬럼 정의
	const tableColumns = [
		{
			accessorKey: 'defectCode',
			header: '불량코드',
			size: 120,
			cell: ({ row }: { row: { original: DefectRecord } }) => {
				const defectCode = row.original.defectCode;
				return (
					<button
						className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:underline"
						onClick={() =>
							navigate(
								`/production/defects/status/${row.original.id}`
							)
						}
					>
						{defectCode}
					</button>
				);
			},
		},
		{
			accessorKey: 'itemNumber',
			header: '제품코드',
			size: 120,
		},
		{
			accessorKey: 'itemName',
			header: '제품명',
			size: 180,
		},
		{
			accessorKey: 'defectType',
			header: '불량 유형',
			size: 100,
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				const colorMap: { [key: string]: string } = {
					'치수 불량': 'bg-red-100 text-red-800',
					'기능 불량': 'bg-orange-100 text-orange-800',
					'외관 불량': 'bg-yellow-100 text-yellow-800',
				};
				return (
					<span
						className={`px-2 py-1 rounded text-xs ${colorMap[value] || 'bg-gray-100 text-gray-800'}`}
					>
						{value}
					</span>
				);
			},
		},
		{
			accessorKey: 'defectReason',
			header: '불량 사유',
			size: 100,
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				const colorMap: { [key: string]: string } = {
					'제품 불량': 'bg-purple-100 text-purple-800',
					'공정 불량': 'bg-blue-100 text-blue-800',
					'원료 불량': 'bg-green-100 text-green-800',
				};
				return (
					<span
						className={`px-2 py-1 rounded text-xs ${colorMap[value] || 'bg-gray-100 text-gray-800'}`}
					>
						{value}
					</span>
				);
			},
		},
		{
			accessorKey: 'severity',
			header: '심각도',
			size: 80,
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				const colorMap: { [key: string]: string } = {
					HIGH: 'bg-red-100 text-red-800',
					MEDIUM: 'bg-yellow-100 text-yellow-800',
					LOW: 'bg-green-100 text-green-800',
				};
				const labelMap: { [key: string]: string } = {
					HIGH: '높음',
					MEDIUM: '중간',
					LOW: '낮음',
				};
				return (
					<span
						className={`px-2 py-1 rounded text-xs ${colorMap[value] || 'bg-gray-100 text-gray-800'}`}
					>
						{labelMap[value] || value}
					</span>
				);
			},
		},
		{
			accessorKey: 'status',
			header: t('columns.status', '상태'),
			size: 100,
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				const colorMap: { [key: string]: string } = {
					OPEN: 'bg-red-100 text-red-800',
					INVESTIGATING: 'bg-yellow-100 text-yellow-800',
					RESOLVED: 'bg-blue-100 text-blue-800',
					CLOSED: 'bg-green-100 text-green-800',
				};
				const labelMap: { [key: string]: string } = {
					OPEN: '신규',
					INVESTIGATING: '조사중',
					RESOLVED: '해결됨',
					CLOSED: '종료',
				};
				return (
					<span
						className={`px-2 py-1 rounded text-xs ${colorMap[value] || 'bg-gray-100 text-gray-800'}`}
					>
						{labelMap[value] || value}
					</span>
				);
			},
		},
		{
			accessorKey: 'reportDate',
			header: '신고일',
			size: 100,
		},
		{
			accessorKey: 'reportedBy',
			header: '신고자',
			size: 100,
		},
		{
			accessorKey: 'assignedTo',
			header: '담당자',
			size: 100,
		},
		{
			accessorKey: 'dueDate',
			header: '완료예정일',
			size: 120,
		},
	];

	// Initialize useDataTable
	const { table, toggleRowSelection, selectedRows } = useDataTable(
		defectRecords,
		tableColumns,
		PAGE_SIZE,
		totalPages,
		page,
		totalElements,
		(newPage: number) => setPage(newPage)
	);

	// Handle row selection
	useEffect(() => {
		const handleRowSelect = (ids: string[]) => {
			console.log('행 선택 변경:', ids);
			console.log('현재 defectRecords:', defectRecords);
			if (ids.length > 0) {
				// 인덱스로 찾기
				const selectedIndex = parseInt(ids[0]);
				const selectedData = defectRecords[selectedIndex];
				console.log('선택된 인덱스:', selectedIndex, '선택된 데이터:', selectedData);
				setSelectedDefect(selectedData || null);
			} else {
				console.log('선택 해제됨');
				setSelectedDefect(null);
			}
		};

		const selectedData = Array.from(selectedRows);
		handleRowSelect(selectedData);
	}, [selectedRows, defectRecords]);

	const handleEdit = () => {
		if (selectedDefect) {
			setOpenEditModal(true);
		}
	};

	const handleDelete = () => {
		console.log('handleDelete 함수 호출됨, selectedDefect:', selectedDefect);
		if (selectedDefect) {
			console.log('삭제 확인 다이얼로그 열기');
			setOpenDeleteConfirm(true);
		} else {
			console.log('선택된 항목이 없습니다.');
		}
	};

	const handleDeleteConfirm = () => {
		if (selectedDefect) {
			console.log('삭제할 불량 기록:', selectedDefect);
			deleteDefectRecordMutation.mutate([selectedDefect.id]);
			setSelectedDefect(null);
			setOpenDeleteConfirm(false);
			toast.success('불량 기록이 삭제되었습니다.');
		} else {
			console.log('선택된 불량 기록이 없습니다.');
		}
	};

	// 수정 데이터 저장 처리
	const handleSaveEdit = (data: any) => {
		console.log('불량 기록 수정:', data);
		setOpenEditModal(false);
		setSelectedDefect(null);
	};

	// 새 불량 기록 생성 처리
	const handleSaveCreate = (data: any) => {
		console.log('불량 기록 생성:', data);
		setOpenCreateModal(false);
	};

	// 로딩 상태 표시
	if (isLoading) {
		return (
			<PageTemplate>
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<p className="text-gray-600">불량 기록을 불러오는 중...</p>
					</div>
				</div>
			</PageTemplate>
		);
	}

	// 에러 상태 표시
	if (error) {
		return (
			<PageTemplate>
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<div className="text-red-500 text-6xl mb-4">⚠️</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">데이터 로드 실패</h3>
						<p className="text-gray-600 mb-4">{error.message}</p>
						<button 
							onClick={() => window.location.reload()}
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
						>
							다시 시도
						</button>
					</div>
				</div>
			</PageTemplate>
		);
	}

	return (
		<>
			<DeleteConfirmDialog
				isOpen={openDeleteConfirm}
				onOpenChange={setOpenDeleteConfirm}
				onConfirm={handleDeleteConfirm}
				title="불량 기록 삭제"
				description={`불량코드 "${selectedDefect?.defectCode}" 기록을 삭제하시겠습니까?`}
			/>

			<DraggableDialog
				open={openCreateModal}
				onOpenChange={setOpenCreateModal}
				title="불량 신고 등록"
				content={
					<ProductionQualityDefectsRegisterPage
						mode="create"
						onClose={() => setOpenCreateModal(false)}
						onSave={handleSaveCreate}
					/>
				}
			/>

			<DraggableDialog
				open={openEditModal}
				onOpenChange={setOpenEditModal}
				title="불량 신고 수정"
				content={
					<ProductionQualityDefectsRegisterPage
						mode="edit"
						data={selectedDefect || undefined}
						defectRecordId={selectedDefect?.id}
						onClose={() => setOpenEditModal(false)}
						onSave={handleSaveEdit}
					/>
				}
			/>

			<PageTemplate>
				<DatatableComponent
					table={table}
					columns={tableColumns}
					data={defectRecords}
					tableTitle="불량 현황 관리"
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

export default ProductionQualityDefectsListPage;
