import { useState, useEffect } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import {
	useMachinePartRelations,
	useDeleteMachinePartRelation,
} from '@primes/hooks/machine/useMachinePartRelation';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { MachinePartRelation } from '@primes/types/machine';
import {
	MachinePartRelationListColumns,
	MachinePartRelationSearchFields,
} from '@primes/schemas/machine';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { DraggableDialog } from '@repo/radix-ui/components';
import { MachineMachinePartRelationRegisterPage } from './MachineMachinePartRelationRegisterPage';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { toast } from 'sonner';
import { useTranslation } from '@repo/i18n';

export const MachineMachinePartRelationListPage: React.FC = () => {
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<MachinePartRelation[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [selectedMachinePartRelationData, setSelectedMachinePartRelationData] =
		useState<MachinePartRelation | null>(null);
	const { t: tCommon } = useTranslation('common');
	const DEFAULT_PAGE_SIZE = 30;
	const columns = MachinePartRelationListColumns();
	const searchFields = MachinePartRelationSearchFields();

	const { data: apiData, isLoading } = useMachinePartRelations({
		page: page,
		size: DEFAULT_PAGE_SIZE,
	});
	
	const deleteMutation = useDeleteMachinePartRelation();

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	const handleEdit = () => {
		if (!selectedMachinePartRelationData) {
			toast.warning('설비 예비부품 연동 관계를 선택해주세요.');
			return;
		}

		setShowEditModal(true);
	};

	const handleRemove = () => {
		if (!selectedMachinePartRelationData) {
			toast.warning('삭제할 설비 예비부품 연동 관계를 선택해주세요.');
			return;
		}
		setShowDeleteDialog(true);
	};

	const confirmDelete = () => {
		if (!selectedMachinePartRelationData) return;

		deleteMutation.mutate([selectedMachinePartRelationData.id], {
			onSuccess: () => {
				setShowDeleteDialog(false);
				setSelectedMachinePartRelationData(null);
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
			const selectedMachinePartRelation: MachinePartRelation = data[rowIndex];

			setSelectedMachinePartRelationData(selectedMachinePartRelation || null);
		} else {
			setSelectedMachinePartRelationData(null);
		}
	}, [selectedRows, data]);

	useEffect(() => {
		if (apiData) {
			if (apiData.content) {
				setData(apiData.content);
				setTotalElements(apiData.totalElements || 0);
				setPageCount(apiData.totalPages || 0);
			} else if (Array.isArray(apiData)) {
				setData(apiData);
				setTotalElements(apiData.length);
				setPageCount(Math.ceil(apiData.length / DEFAULT_PAGE_SIZE));
			}
		}
	}, [apiData]);

	return (
		<>
			<PageTemplate firstChildWidth="30%" className="border rounded-lg">
				<DatatableComponent
					table={table}
					columns={columns}
					data={data}
					tableTitle={tCommon('pages.machinePartRelation.list')}
					rowCount={totalElements}
					useSearch={true}
					enableSingleSelect={true}
					usePageNation={true}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					searchSlot={
						<SearchSlotComponent
							fields={searchFields}
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
				title={`${tCommon('tabs.titles.machinePartRelation')} ${tCommon('edit')}`}
				content={
					<MachineMachinePartRelationRegisterPage
						mode="update"
						selectedMachinePartRelation={selectedMachinePartRelationData}
						onClose={() => setShowEditModal(false)}
					/>
				}
			/>

			{/* 삭제 확인 다이얼로그 */}
			<DeleteConfirmDialog
				isOpen={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
				onConfirm={confirmDelete}
				isDeleting={deleteMutation.isPending}
				title={tCommon('delete') || '삭제'}
				description={`선택한 설비 예비부품 연동 관계를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
			/>
		</>
	);
};

export default MachineMachinePartRelationListPage;
