import { useState, useEffect } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useMachineRepair } from '@primes/hooks/machine';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { useTranslation } from '@repo/i18n';
import { DraggableDialog } from '@repo/radix-ui/components';
import type { MachineRepair } from '@primes/types/machine';
import { MachineMachineRepairRegisterPage } from './MachineMachineRepairRegisterPage';
import {
	MachineRepairListColumns,
	MachineRepairSearchFields,
} from '@primes/schemas/machine';
import { useDeleteMachineRepair } from '@primes/hooks/machine/machine-repair/useDeleteMachineRepair';
import { toast } from 'sonner';

export const MachineMachineRepairListPage: React.FC = () => {
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<MachineRepair[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
	const [selectedMachineRepairData, setSelectedMachineRepairData] =
		useState<MachineRepair | null>(null);
	const { t: tCommon } = useTranslation('common');
	const DEFAULT_PAGE_SIZE = 30;
	const columns = MachineRepairListColumns();
	const searchFields = MachineRepairSearchFields();

	// API 호출
	const { list: apiData, remove } = useMachineRepair({
		page,
		size: DEFAULT_PAGE_SIZE,
	});

	const deleteMutation = useDeleteMachineRepair();

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	const handleEdit = () => {
		if (!selectedMachineRepairData) {
			toast.warning('설비 수리 정보를 선택해주세요.');
			return;
		}

		setShowEditModal(true);
	};

	const handleRemove = () => {
		if (!selectedMachineRepairData) {
			toast.warning('삭제할 설비 수리 정보를 선택해주세요.');
			return;
		}
		setShowDeleteDialog(true);
	};

	const confirmDelete = () => {
		if (!selectedMachineRepairData) return;

		deleteMutation.mutate([selectedMachineRepairData.id], {
			onSuccess: () => {
				setShowDeleteDialog(false);
				setSelectedMachineRepairData(null);
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

	// selectedRows 변경 감지 및 선택된 데이터 저장
	useEffect(() => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const selectedMachineRepair: MachineRepair = data[rowIndex];

			setSelectedMachineRepairData(selectedMachineRepair || null);
		} else {
			setSelectedMachineRepairData(null);
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
					tableTitle={ tCommon('pages.titles.machineRepairList') }
					rowCount={totalElements}
					useSearch={true}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					enableSingleSelect={true}
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

			<DraggableDialog
				open={showEditModal}
				onOpenChange={setShowEditModal}
				title={`${tCommon('tabs.titles.machineRepair')} ${tCommon('edit')}`}
				content={
					<MachineMachineRepairRegisterPage
						mode="update"
						selectedMachineRepair={selectedMachineRepairData}
						onClose={() => setShowEditModal(false)}
					/>
				}
			/>

			{/* 삭제 확인 다이얼로그 */}
			<DeleteConfirmDialog
				isOpen={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
				onConfirm={confirmDelete}
				isDeleting={remove.isPending}
				title={tCommon('delete')}
				description={`선택한 수리 제목이 "${selectedMachineRepairData?.subject}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
			/>
		</>
	);
};

export default MachineMachineRepairListPage;
