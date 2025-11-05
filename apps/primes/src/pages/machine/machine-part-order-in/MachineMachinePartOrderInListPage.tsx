import { useState, useEffect } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import { DraggableDialog } from '@repo/radix-ui/components';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { MachinePartOrderIn } from '@primes/types/machine';
import {
	useMachinePartOrderIns,
	useDeleteMachinePartOrderIn,
} from '@primes/hooks/machine/useMachinePartOrderIn';
import { 
	MachinePartOrderInListColumns,
	MachinePartOrderInSearchFields
 } from '@primes/schemas/machine';
 import { MachineMachinePartOrderInRegisterPage } from './MachineMachinePartOrderInRegisterPage';
import { toast } from 'sonner';

interface MachineMachinePartOrderInListData {
	id: number;
	name?: string;
	code?: string;
	status?: string;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: unknown;
}

export const MachineMachinePartOrderInListPage: React.FC = () => {
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<MachinePartOrderIn[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
	const [selectedMachinePartOrderInData, setSelectedMachinePartOrderInData] =
		useState<MachinePartOrderIn | null>(null);
	const { t: tCommon } = useTranslation('common');
	const columns = MachinePartOrderInListColumns();

	const DEFAULT_PAGE_SIZE = 30;

	const { list: apiData, remove } = useMachinePartOrderIns({
		page: page,
		size: DEFAULT_PAGE_SIZE,
	});

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	const handleEdit = () => {
		if (!selectedMachinePartOrderInData) {
			toast.warning('입고를 선택해주세요.');
			return;
		}

		setShowEditModal(true);
	};

	const handleRemove = () => {
		if (!selectedMachinePartOrderInData) {
			toast.warning('삭제할 입고를 선택해주세요.');
			return;
		}
		setShowDeleteDialog(true);
	};

	const confirmDelete = () => {
		if (!selectedMachinePartOrderInData) return;

		remove.mutate(selectedMachinePartOrderInData.id, {
			onSuccess: () => {
				setShowDeleteDialog(false);
				setSelectedMachinePartOrderInData(null);
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
			const selectedMachinePartOrderIn: MachinePartOrderIn = data[rowIndex];

			setSelectedMachinePartOrderInData(selectedMachinePartOrderIn || null);
		} else {
			setSelectedMachinePartOrderInData(null);
		}
	}, [selectedRows, data]);

	useEffect(() => {
		const response = apiData.data;

		if (response?.content) {
			const data = response.content.map((item: any) => ({
				...item,
				partName: item.machinePart?.partName || `Part ${item.machinePartId}`,
				orderCode: item.machinePartOrder?.orderCode || `Order ${item.machinePartOrderId}`,
			}));
			
			setData(data);
			setTotalElements(response.totalElements || 0);
			setPageCount(response.totalPages || 0);
		} else if (Array.isArray(apiData)) {
			// 배열 형태의 응답 처리
			const data = apiData.map((item: any) => ({
				...item,
				partName: item.machinePart?.partName || `Part ${item.machinePartId}`,
				orderCode: item.machinePartOrder?.orderCode || `Order ${item.machinePartOrderId}`,
			}));
			
			setData(data);
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
					tableTitle={tCommon('pages.machinePartOrderIn.list')}
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
				<DraggableDialog
					open={showEditModal}
					onOpenChange={setShowEditModal}
					title={`${tCommon('tabs.titles.machinePartOrderIn')} ${tCommon('edit')}`}
					content={
						<MachineMachinePartOrderInRegisterPage
							mode="update"
							selectedMachinePartOrderIn={selectedMachinePartOrderInData}
							onClose={() => setShowEditModal(false)}
						/>
					}
				/>
			)}

			{/* 삭제 확인 다이얼로그 */}
			<DeleteConfirmDialog
				isOpen={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
				onConfirm={confirmDelete}
				isDeleting={remove.isPending}
				title={tCommon('delete')}
				description={`선택한 예비부품 입고를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
			/>
		</>
	);
};

export default MachineMachinePartOrderInListPage;
