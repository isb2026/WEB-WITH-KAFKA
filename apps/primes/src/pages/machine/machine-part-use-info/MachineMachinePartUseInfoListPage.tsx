import { useState, useEffect } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useMachinePartUseInfo } from '@primes/hooks/machine';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { useTranslation } from '@repo/i18n';
import { DraggableDialog } from '@repo/radix-ui/components';
import type { MachinePartUseInfo } from '@primes/types/machine';
import { MachineMachinePartUseInfoRegisterPage } from './MachineMachinePartUseInfoRegisterPage';
import {
	MachinePartUseInfoListColumns,
	MachinePartUseInfoSearchFields,
} from '@primes/schemas/machine';
import { useDeleteMachinePartUseInfo } from '@primes/hooks/machine';
import { toast } from 'sonner';

export const MachineMachinePartUseInfoListPage: React.FC = () => {
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<MachinePartUseInfo[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
	const [selectedMachinePartUseInfoData, setSelectedMachinePartUseInfoData] =
		useState<MachinePartUseInfo | null>(null);
	const { t: tCommon } = useTranslation('common');
	const DEFAULT_PAGE_SIZE = 30;
	const columns = MachinePartUseInfoListColumns();
	const searchFields = MachinePartUseInfoSearchFields();

	// API 호출
	const { list: apiData, remove } = useMachinePartUseInfo({
		page,
		size: DEFAULT_PAGE_SIZE,
	});

	const deleteMutation = useDeleteMachinePartUseInfo();

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	const handleEdit = () => {
		if (!selectedMachinePartUseInfoData) {
			toast.warning('예비부품 사용정보를 선택해주세요.');
			return;
		}

		setShowEditModal(true);
	};

	const handleRemove = () => {
		if (!selectedMachinePartUseInfoData) {
			toast.warning('삭제할 예비부품 사용정보를 선택해주세요.');
			return;
		}
		setShowDeleteDialog(true);
	};

	const confirmDelete = () => {
		if (!selectedMachinePartUseInfoData) return;

		deleteMutation.mutate([selectedMachinePartUseInfoData.id], {
			onSuccess: () => {
				setShowDeleteDialog(false);
				setSelectedMachinePartUseInfoData(null);
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

	// selectedRows 변경 감지 및 선택된 데이터 저장
	useEffect(() => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const selectedMachinePartUseInfo: MachinePartUseInfo = data[rowIndex];

			setSelectedMachinePartUseInfoData(selectedMachinePartUseInfo || null);
		} else {
			setSelectedMachinePartUseInfoData(null);
		}
	}, [selectedRows, data]);

	useEffect(() => {
		const response = apiData.data;

		if (response?.content) {
			setData(response.content);
			setTotalElements(response.totalElements || 0);
			setPageCount(response.totalPages || 0);
		} else if (Array.isArray(apiData)) {
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
					tableTitle={`${tCommon('tabs.titles.machinePartUseInfo')}`}
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
				title={`${tCommon('tabs.titles.machinePartUseInfo')} ${tCommon('edit')}`}
				content={
					<MachineMachinePartUseInfoRegisterPage
						mode="update"
						selectedMachinePartUseInfo={selectedMachinePartUseInfoData}
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
				description={`선택한 예비부품 사용내역을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
			/>
		</>
	);
};

export default MachineMachinePartUseInfoListPage;
