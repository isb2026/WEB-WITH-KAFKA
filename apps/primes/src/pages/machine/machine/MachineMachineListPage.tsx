import { useState, useEffect } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import {
	useMachine,
	useDeleteMachine
 } from '@primes/hooks/machine';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import { Machine } from '@primes/types/machine';
import { 
	MachineListColumns,
	MachineSearchFields
} from '@primes/schemas/machine';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { DraggableDialog } from '@repo/radix-ui/components';
import { MachineMachineRegisterPage } from './MachineMachineRegisterPage';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { toast } from 'sonner';

export const MachineMachineListPage: React.FC = () => {
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<Machine[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [selectedMachineData, setSelectedMachineData] =
		useState<Machine | null>(null);
	const { t: tCommon } = useTranslation('common');
	const DEFAULT_PAGE_SIZE = 30;
	const columns = MachineListColumns();
	const searchFields = MachineSearchFields();

	const { list: apiData, remove } = useMachine({
		page: page,
		size: DEFAULT_PAGE_SIZE,
	});

	const deleteMutation = useDeleteMachine();

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	const handleEdit = () => {
		if (!selectedMachineData) {
			toast.warning('설비를 선택해주세요.');
			return;
		}

		setShowEditModal(true);
	};

	const handleRemove = () => {
		if (!selectedMachineData) {
			toast.warning('삭제할 설비를 선택해주세요.');
			return;
		}
		setShowDeleteDialog(true);
	};

	const confirmDelete = () => {
		if (!selectedMachineData) return;

		deleteMutation.mutate([selectedMachineData.id], {
			onSuccess: () => {
				setShowDeleteDialog(false);
				setSelectedMachineData(null);
				// selectedRows 초기화는 React Query 재조회 후 자동으로 처리됨
			},
			onError: (error) => {
				console.error('삭제 실패:', error);
				setShowDeleteDialog(false);
				toast.error('삭제 중 오류가 발생했습니다.');
			},
		});
	};

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		columns,
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	// selectedRows 변경 감지하여 선택된 데이터 저장
	useEffect(() => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const selectedMachine: Machine = data[rowIndex];

			setSelectedMachineData(selectedMachine || null);
		} else {
			setSelectedMachineData(null);
		}
	}, [selectedRows, data]);

	useEffect(() => {
		const response = apiData.data;

		if (response?.content) {
			// 페이지네이션 응답 처리
			setData(response.content);
			setTotalElements(response.totalElements || 0);
			setPageCount(response.totalPages || 0);
		} else if (Array.isArray(apiData)) {
			// 배열 형태의 응답 처리
			setData(apiData);
			setTotalElements(apiData.length);
			setPageCount(Math.ceil(apiData.length / DEFAULT_PAGE_SIZE));
		}
	}, [apiData.data]);

	return (
		<>
			<PageTemplate firstChildWidth="30%" className="border rounded-lg">
				<DatatableComponent
					table={table}
					columns={columns}
					data={data}
					tableTitle={tCommon('pages.machine.maininfoList')}
					rowCount={totalElements}
					useSearch={true}
					enableSingleSelect={true}
					usePageNation={true}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					searchSlot={
						<SearchSlotComponent
							endSlot={
								<ActionButtonsComponent
									useRemove={true}
									useEdit={true}
									edit={handleEdit}
									remove={handleRemove}
								/>
							}
						/>
					}
				/>
			</PageTemplate>

			{/* 편집 다이얼로그 */}
			{showEditModal && (
				<>
					<DraggableDialog
						open={showEditModal}
						onOpenChange={setShowEditModal}
						title={`${tCommon('tabs.titles.machine')} ${tCommon('edit')}`}
						content={
							<MachineMachineRegisterPage
								mode="update"
								selectedMachine={selectedMachineData}
								onClose={() => setShowEditModal(false)}
							/>
						}
					/>
				</>
			)}

			{/* 삭제 확인 다이얼로그 */}
			<DeleteConfirmDialog
				isOpen={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
				onConfirm={confirmDelete}
				isDeleting={remove.isPending}
				title={tCommon('delete')}
				description={`선택한 설비 "${selectedMachineData?.machineCode || '항목'}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
			/>
		</>
	);
};

export default MachineMachineListPage;
