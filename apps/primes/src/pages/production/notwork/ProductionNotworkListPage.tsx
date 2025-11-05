import React, { useState, useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from '@repo/i18n';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { DraggableDialog } from '@repo/radix-ui/components';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { useDataTable } from '@radix-ui/hook';

// 새로운 Atomic Hooks 사용
import {
	useNotworkMasterListQuery,
	useCreateNotworkMaster,
	useUpdateNotworkMaster,
	useDeleteNotworkMaster,
} from '@primes/hooks/production';

// Types
import {
	NotworkMaster,
	NotworkMasterSearchParams,
} from '@primes/types/production/notwork';

// Schemas
import {
	notworkMasterColumns,
	notworkMasterSearchFields,
	NotworkMasterDataTableType,
} from '@primes/schemas/production';

// Components
import { ProductionNotworkRegisterPage } from './ProductionNotworkRegisterPage';

export const ProductionNotworkListPage: React.FC = () => {
	const { t: tCommon } = useTranslation('common');

	// State Management
	const [searchParams, setSearchParams] = useState<NotworkMasterSearchParams>(
		{}
	);
	const [page, setPage] = useState(0);
	const [size] = useState(30);

	// 데이터 상태
	const [data, setData] = useState<NotworkMaster[]>([]);
	const [totalElements, setTotalElements] = useState(0);
	const [pageCount, setPageCount] = useState(0);

	// Modal & Selection State
	const [editingNotwork, setEditingNotwork] = useState<NotworkMaster | null>(
		null
	);
	const [openModal, setOpenModal] = useState(false);
	const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

	// Form State (onFormReady + reset 패턴)
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);

	// Atomic Hooks
	const list = useNotworkMasterListQuery({
		...searchParams,
		page,
		size,
	});

	const create = useCreateNotworkMaster();
	const update = useUpdateNotworkMaster();
	const remove = useDeleteNotworkMaster();

	// 데이터 동기화
	useEffect(() => {
		if (list.data) {
			setData(list.data.content || []);
			setTotalElements(list.data.totalElements || 0);
			setPageCount(Math.ceil((list.data.totalElements || 0) / size));
		}
	}, [list.data, size]);

	// Form 리셋 (onFormReady + reset 패턴)
	useEffect(() => {
		if (formMethods && editingNotwork) {
			formMethods.reset(
				editingNotwork as unknown as Record<string, unknown>
			);
		}
	}, [formMethods, editingNotwork]);

	// Form Ready Handler (onFormReady 패턴)
	const handleFormReady = useCallback(
		(methods: UseFormReturn<Record<string, unknown>>) => {
			setFormMethods(methods);
		},
		[]
	);

	// DataTable Setup
	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data as NotworkMasterDataTableType[],
		notworkMasterColumns,
		size,
		pageCount,
		page,
		totalElements,
		setPage
	);

	// Search Handler
	const handleSearch = (searchData: Record<string, unknown>) => {
		setSearchParams(searchData as NotworkMasterSearchParams);
		setPage(0);
	};

	// CRUD Handlers
	const handleCreate = () => {
		setEditingNotwork(null);
		setOpenModal(true);
	};

	const handleEdit = () => {
		if (selectedRows.size === 1) {
			const selectedId = Array.from(selectedRows)[0];
			const selected = data.find(
				(item) => item.id?.toString() === selectedId
			);
			if (selected) {
				setEditingNotwork(selected);
				setOpenModal(true);
			}
		}
	};

	const handleSubmit = async (data: Record<string, unknown>) => {
		try {
			if (editingNotwork) {
				await update.mutateAsync({
					id: editingNotwork.id,
					data: data as any,
				});
			} else {
				await create.mutateAsync(data as any);
			}
			setOpenModal(false);
			setEditingNotwork(null);
		} catch (error) {
			console.error('비가동 처리 실패:', error);
		}
	};

	const handleDelete = async () => {
		try {
			const selectedIds = Array.from(selectedRows).map((id) =>
				parseInt(id)
			);
			await remove.mutateAsync(selectedIds);
			setOpenDeleteConfirm(false);
		} catch (error) {
			console.error('비가동 삭제 실패:', error);
		}
	};

	// ActionButtons 구성 (endSlot 패턴)
	const actionButtons = (
		<ActionButtonsComponent
			create={handleCreate}
			edit={handleEdit}
			remove={() => setOpenDeleteConfirm(true)}
			useCreate={true}
			useEdit={selectedRows.size === 1}
			useRemove={selectedRows.size > 0}
		/>
	);

	return (
		<PageTemplate>
			<div className="flex flex-col gap-4">
				{/* 헤더 */}
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold">
						{tCommon('tabs.titles.notworkList', '비가동 목록')}
					</h1>
					{actionButtons}
				</div>

				{/* 검색 */}
				<SearchSlotComponent
					fields={notworkMasterSearchFields}
					onSearch={handleSearch}
				/>

				{/* 데이터 테이블 */}
				<DatatableComponent
					table={table}
					columns={notworkMasterColumns}
					data={data}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					tableTitle={tCommon(
						'tabs.titles.notworkList',
						'비가동 목록'
					)}
				/>
			</div>

			{/* 등록/수정 모달 */}
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={
					editingNotwork
						? tCommon('edit', '수정')
						: tCommon('register', '등록')
				}
				content={
					<ProductionNotworkRegisterPage
						mode={editingNotwork ? 'edit' : 'create'}
						type="master"
						data={editingNotwork}
						onSubmit={handleSubmit}
						onClose={() => setOpenModal(false)}
						onFormReady={handleFormReady}
					/>
				}
			/>

			{/* 삭제 확인 */}
			<DeleteConfirmDialog
				isOpen={openDeleteConfirm}
				onOpenChange={setOpenDeleteConfirm}
				onConfirm={handleDelete}
				title={tCommon('delete.confirm', '삭제 확인')}
				description={tCommon(
					'delete.confirmMessage',
					'선택한 항목을 삭제하시겠습니까?'
				)}
			/>
		</PageTemplate>
	);
};
