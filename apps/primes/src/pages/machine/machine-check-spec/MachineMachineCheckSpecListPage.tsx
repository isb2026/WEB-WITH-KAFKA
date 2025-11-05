import { useState, useEffect } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useMachineCheckSpecs } from '@primes/hooks/machine/useMachineCheckSpecs';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { useTranslation } from '@repo/i18n';
import type { MachineCheckSpec } from '@primes/types/machine/machineCheckSpec';

export const MachineMachineCheckSpecListPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<MachineCheckSpec[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [selectedItemData, setSelectedItemData] =
		useState<MachineCheckSpec | null>(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

	const DEFAULT_PAGE_SIZE = 30;

	// API 호출
	const { list, remove } = useMachineCheckSpecs({
		page,
		size: DEFAULT_PAGE_SIZE,
	});

	const tableColumns = [
		{
			accessorKey: 'id',
			header: 'ID',
			size: 80,
			minSize: 60,
		},
		{
			accessorKey: 'machineName',
			header: '기계명',
			size: 150,
		},
		{
			accessorKey: 'specName',
			header: '검사 기준명',
			size: 200,
		},
		{
			accessorKey: 'specType',
			header: '검사 유형',
			size: 120,
		},
		{
			accessorKey: 'standardValue',
			header: '기준값',
			size: 100,
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'upperLimit',
			header: '상한값',
			size: 100,
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'lowerLimit',
			header: '하한값',
			size: 100,
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'unit',
			header: '단위',
			size: 80,
		},
		{
			accessorKey: 'checkCycle',
			header: '검사 주기',
			size: 120,
		},
		{
			accessorKey: 'checkMethod',
			header: '검사 방법',
			size: 150,
		},
		{
			accessorKey: 'description',
			header: '설명',
			size: 200,
		},
		{
			accessorKey: 'isActive',
			header: '활성 상태',
			size: 100,
			cell: ({ getValue }: { getValue: () => boolean }) => {
				const value = getValue();
				return value ? '활성' : '비활성';
			},
		},
	];

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	// API 응답 처리
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
		tableColumns,
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	// selectedRows 변경 감지 및 선택된 데이터 저장
	useEffect(() => {
		console.log('selectedRows', selectedRows);
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const selectedItem: MachineCheckSpec = data[rowIndex];

			setSelectedItemData(selectedItem || null);
		} else {
			setSelectedItemData(null);
		}
	}, [selectedRows, data]);

	// 삭제 핸들러
	const handleDelete = () => {
		if (!selectedItemData) {
			console.warn('삭제할 항목을 선택해주세요.');
			return;
		}
		setOpenDeleteDialog(true);
	};

	const confirmDelete = async () => {
		if (!selectedItemData) return;

		try {
			await remove.mutateAsync(selectedItemData.id);
			console.log('기계 검사 기준이 삭제되었습니다.');
			setOpenDeleteDialog(false);
			setSelectedItemData(null);
		} catch (error) {
			console.error('삭제 실패:', error);
			console.error('삭제 중 오류가 발생했습니다.');
		}
	};

	return (
		<>
			<DeleteConfirmDialog
				isOpen={openDeleteDialog}
				onOpenChange={setOpenDeleteDialog}
				onConfirm={confirmDelete}
				title={t('dialogs.deleteConfirm') || '삭제 확인'}
				description={`${
					selectedItemData?.specName || '선택된 항목'
				}을(를) 삭제하시겠습니까?`}
			/>
			<PageTemplate firstChildWidth="30%" className="border rounded-lg">
				<DatatableComponent
					table={table}
					columns={tableColumns}
					data={data}
					tableTitle={
						t('pages.titles.machineCheckSpecList') ||
						'기계 검사 기준 관리 목록'
					}
					rowCount={totalElements}
					useSearch={true}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					enableSingleSelect={true}
					searchSlot={
						<SearchSlotComponent
							endSlot={
								<ActionButtonsComponent
									remove={handleDelete}
									edit={() => {}}
									useEdit={true}
									useRemove={true}
								/>
							}
						/>
					}
				/>
			</PageTemplate>
		</>
	);
};

export default MachineMachineCheckSpecListPage;
