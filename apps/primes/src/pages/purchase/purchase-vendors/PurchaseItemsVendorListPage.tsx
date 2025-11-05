import { useState, useMemo, useEffect } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useItemsVendor } from '@primes/hooks/purchase/itemsVendor/useItemsVendor';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import { ItemsVendor } from '@primes/types/purchase/itemsVendor';
import { DraggableDialog } from '@repo/radix-ui/components';
import { PurchaseItemsVendorRegisterPage } from './PurchaseItemsVendorRegisterPage';
import { ItemsVendorSearchFields, ItemsVendorListColumns } from '@primes/schemas/purchase/itemsVendorSchemas.tsx';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { toast } from 'sonner';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { useDeleteItemsVendor } from '@primes/hooks/purchase/itemsVendor/useDeleteItemsVendor';

export const PurchaseItemsVendorListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<ItemsVendor[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [editModal, setEditModal] = useState<boolean>(false);
	const [selectedItem, setSelectedItem] = useState<ItemsVendor | null>(null);
	const searchFields = ItemsVendorSearchFields();
	const [selectedItemsVendorData, setSelectedItemsVendorData] =
		useState<ItemsVendor | null>(null);
	const columns = ItemsVendorListColumns();
	const DEFAULT_PAGE_SIZE = 30;

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	// API 호출
	const { list } = useItemsVendor({
		page: page,
		size: DEFAULT_PAGE_SIZE,
	});

	const deleteMutation = useDeleteItemsVendor();

	useEffect(() => {
		if (list.data) {
			if (list.data.content) {
				// 페이지네이션 응답 처리
				setData(list.data.content);
				setTotalElements(list.data.totalElements || 0);
				setPageCount(list.data.totalPages || 0);
			} else if (Array.isArray(list.data)) {
				// 배열 형태의 응답 처리
				setData(list.data);
				setTotalElements(list.data.length);
				setPageCount(Math.ceil(list.data.length / DEFAULT_PAGE_SIZE));
			}
		}
	}, [list.data]);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		columns,
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	useEffect(() => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const selectedItemsVendor: ItemsVendor = data[rowIndex];

			setSelectedItemsVendorData(selectedItemsVendor || null);
		} else {
			setSelectedItemsVendorData(null);
		}
	}, [selectedRows, data]);


	const handleEdit = () => {
		if (!selectedItemsVendorData) {
			toast.warning('구매품을 선택해주세요.');
			return;
		}

		setShowEditModal(true);
	};

	const handleRemove = () => {
		if (!selectedItemsVendorData) {
			toast.warning('삭제할 구매품을 선택해주세요.');
			return;
		}
		setShowDeleteDialog(true);
	};

	const confirmDelete = () => {
		if (!selectedItemsVendorData) return;

		deleteMutation.mutate({ ids: [selectedItemsVendorData.id] }, {
			onSuccess: () => {
				setShowDeleteDialog(false);
				setSelectedItemsVendorData(null);
			},
			onError: (error: any) => {
				console.error('삭제 실패:', error);
				setShowDeleteDialog(false);
				toast.error('삭제 중 오류가 발생했습니다.');
			},
		});
	};

	return (
		<>
			<DraggableDialog
				open={editModal}
				onOpenChange={setEditModal}
				title={tCommon('pages.itemsVendor.edit')}
				content={
					<PurchaseItemsVendorRegisterPage
						mode="edit"
						data={selectedItem}
						onClose={() => setShowEditModal(false)}
					/>
				}
			/>
			<PageTemplate firstChildWidth="30%" className="border rounded-lg">
				<DatatableComponent
					table={table}
					columns={columns}
					data={data}
					tableTitle={tCommon('pages.itemsVendor.list')}
					rowCount={totalElements}
					useSearch={true}
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
				title={`${tCommon('tabs.titles.itemsVendor')} ${tCommon('edit')}`}
				content={
					<PurchaseItemsVendorRegisterPage
						mode="edit"
						data={selectedItemsVendorData}
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
				description={`선택한 구매품 "${selectedItemsVendorData?.vendorItemName || '항목'}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
			/>
		</>
	);
};

export default PurchaseItemsVendorListPage;
