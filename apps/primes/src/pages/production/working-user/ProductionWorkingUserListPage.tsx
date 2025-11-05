import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '@repo/i18n';
import { toast } from 'sonner';
import { UseFormReturn } from 'react-hook-form';

// Components
import { DatatableComponent } from '@primes/components/datatable/DatatableComponent';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { PageTemplate } from '@primes/templates/PageTemplate';
import { DraggableDialog } from '@repo/radix-ui/components';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';

// Hooks
import { useWorkingUser } from '@primes/hooks/production';
import { useDataTable } from '@radix-ui/hook';
// Types & Schemas
import { WorkingUser, WorkingUserSearchParams } from '@primes/types/production';
import {
	workingUserColumns,
	workingUserSearchFields,
	WorkingUserDataTableType,
} from '@primes/schemas/production';

// Page Component
import { ProductionWorkingUserRegisterPage } from './ProductionWorkingUserRegisterPage';

export const ProductionWorkingUserListPage: React.FC = () => {
	const { t: tCommon } = useTranslation('common');
	const { t: tDataTable } = useTranslation('dataTable');

	// State
	const [searchParams, setSearchParams] = useState<WorkingUserSearchParams>(
		{}
	);
	const [page, setPage] = useState(0);
	const [size] = useState(30);
	const [data, setData] = useState<WorkingUser[]>([]);
	const [totalElements, setTotalElements] = useState(0);
	const [pageCount, setPageCount] = useState(0);
	const [editingWorkingUser, setEditingWorkingUser] =
		useState<WorkingUser | null>(null);
	const [openModal, setOpenModal] = useState(false);
	const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);

	// Hooks
	const { list, create, update, remove } = useWorkingUser({
		...searchParams,
		page,
		size,
	});

	// 데이터 동기화
	useEffect(() => {
		if (list.data) {
			setData(list.data.content || []);
			setTotalElements(list.data.totalElements || 0);
			setPageCount(Math.ceil((list.data.totalElements || 0) / size));
		}
	}, [list.data, size]);

	// Form 리셋
	useEffect(() => {
		if (formMethods && editingWorkingUser) {
			formMethods.reset(
				editingWorkingUser as unknown as Record<string, unknown>
			);
		}
	}, [formMethods, editingWorkingUser]);

	// Form Ready Handler
	const handleFormReady = useCallback(
		(methods: UseFormReturn<Record<string, unknown>>) => {
			setFormMethods(methods);
		},
		[]
	);

	// DataTable
	const columns = workingUserColumns;
	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data as WorkingUserDataTableType[],
		columns,
		size,
		pageCount,
		page,
		totalElements,
		setPage
	);

	// Handlers
	const handleSearch = (searchData: Record<string, unknown>) => {
		setSearchParams(searchData as WorkingUserSearchParams);
		setPage(0);
	};

	const handleEdit = () => {
		if (editingWorkingUser) {
			setOpenModal(true);
		} else {
			toast.error('수정할 작업자를 선택해주세요.');
		}
	};

	const handleDelete = () => {
		if (editingWorkingUser) {
			setOpenDeleteConfirm(true);
		} else {
			toast.error('삭제할 작업자를 선택해주세요.');
		}
	};

	const handleDeleteConfirm = async () => {
		if (editingWorkingUser) {
			const id = editingWorkingUser.id;
			await remove.mutate([id]);
			setOpenDeleteConfirm(false);
			setEditingWorkingUser(null);
		}
	};

	// Row selection effect
	useEffect(() => {
		if (selectedRows.size === 1) {
			const selectedId = Array.from(selectedRows)[0];
			const selected = data.find(
				(item) => item.id?.toString() === selectedId
			);
			setEditingWorkingUser(selected || null);
		} else {
			setEditingWorkingUser(null);
		}
	}, [selectedRows, data]);

	return (
		<>
			{/* Register/Edit Modal */}
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={editingWorkingUser ? '작업자 수정' : '작업자 등록'}
				content={
					<ProductionWorkingUserRegisterPage
						data={editingWorkingUser || undefined}
						onClose={() => setOpenModal(false)}
						onFormReady={handleFormReady}
					/>
				}
			/>

			{/* Delete Confirm Dialog */}
			<DeleteConfirmDialog
				isOpen={openDeleteConfirm}
				onOpenChange={setOpenDeleteConfirm}
				onConfirm={handleDeleteConfirm}
				title="작업자 삭제"
				description="선택한 작업자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
			/>

			<PageTemplate className="border rounded-lg">
				<DatatableComponent
					table={table}
					columns={columns}
					data={data as WorkingUserDataTableType[]}
					tableTitle={tCommon('pages.titles.workingUserList')}
					rowCount={totalElements}
					useSearch={true}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					searchSlot={
						<SearchSlotComponent
							onSearch={handleSearch}
							fields={workingUserSearchFields}
							endSlot={
								<ActionButtonsComponent
									useEdit={true}
									useRemove={true}
									edit={handleEdit}
									remove={handleDelete}
								/>
							}
						/>
					}
				/>
			</PageTemplate>
		</>
	);
};
