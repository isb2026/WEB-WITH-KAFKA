import { useState, useEffect } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import { DraggableDialog } from '@repo/radix-ui/components';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import {
	useMachinePartOrders,
	useDeleteMachinePartOrder,
} from '@primes/hooks/machine/useMachinePartOrder';
import {
	MachinePartOrderListColumns,
	MachinePartOrderSearchFields,
} from '@primes/schemas/machine';
import { MachineMachinePartOrderRegisterPage } from './MachineMachinePartOrderRegisterPage';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { MachinePartOrder } from '@primes/types/machine';
import { toast } from 'sonner';

interface MachineMachinePartOrderListData {
	id: number;
	name?: string;
	code?: string;
	status?: string;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: unknown;
}

export const MachineMachinePartOrderListPage: React.FC = () => {
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<MachinePartOrder[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
	const [selectedMachinePartOrderData, setSelectedMachinePartOrderData] =
		useState<MachinePartOrder | null>(null);
	const searchFields = MachinePartOrderSearchFields();

	const { t: tCommon } = useTranslation('common');
	const columns = MachinePartOrderListColumns();

	const DEFAULT_PAGE_SIZE = 30;

	const { list: apiData, remove } = useMachinePartOrders({
		page: page,
		size: DEFAULT_PAGE_SIZE,
	});

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	const handleEdit = () => {
		if (!selectedMachinePartOrderData) {
			toast.warning('발주를 선택해주세요.');
			return;
		}

		setShowEditModal(true);
	};

	const handleRemove = () => {
		if (!selectedMachinePartOrderData) {
			toast.warning('삭제할 발주를 선택해주세요.');
			return;
		}
		setShowDeleteDialog(true);
	};

	const confirmDelete = () => {
		if (!selectedMachinePartOrderData) return;

		remove.mutate(selectedMachinePartOrderData.id, {
			onSuccess: () => {
				setShowDeleteDialog(false);
				setSelectedMachinePartOrderData(null);
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
			const selectedMachinePartOrder: MachinePartOrder = data[rowIndex];

			setSelectedMachinePartOrderData(selectedMachinePartOrder || null);
		} else {
			setSelectedMachinePartOrderData(null);
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
					tableTitle={tCommon('pages.machinePartOrder.list')}
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
			<DraggableDialog
				open={showEditModal}
				onOpenChange={setShowEditModal}
				title={`${tCommon('tabs.titles.machinePartOrder')} ${tCommon('edit')}`}
				content={
					<MachineMachinePartOrderRegisterPage
						mode="update"
						selectedMachinePartOrder={selectedMachinePartOrderData}
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
				description={`선택한 "${selectedMachinePartOrderData?.orderCode || '예비부품'}" 발주를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
			/>
		</>
	);
};

export default MachineMachinePartOrderListPage;
