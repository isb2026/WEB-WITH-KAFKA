import { useState, useEffect, useCallback } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useMoldRepair } from '@primes/hooks';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import { MoldRepairDto, MoldRepairSearchRequest } from '@primes/types/mold';
import { DraggableDialog } from '@repo/radix-ui/components';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import MoldRepairRegisterPage from './MoldRepairRegisterPage';
import { toast } from 'sonner';
import {
	moldRepairSearchFields,
	useMoldRepairColumns,
	moldRepairQuickSearchFields,
} from '@primes/schemas/mold';

export const MoldRepairListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<MoldRepairDto[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [selectedMoldRepair, setSelectedMoldRepair] =
		useState<MoldRepairDto | null>(null);
	const [isEditMode, setIsEditMode] = useState<boolean>(false);
	const [searchRequest, setSearchRequest] = useState<MoldRepairSearchRequest>(
		{}
	);

	const DEFAULT_PAGE_SIZE = 30;

	// Get translated columns
	const moldRepairColumns = useMoldRepairColumns();

	const onPageChange = useCallback((pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	}, []);

	const handleSearch = useCallback((filters: MoldRepairSearchRequest) => {
		setSearchRequest(filters);
		setPage(0); // 검색 시 첫 페이지로 이동
	}, []);

	const handleQuickSearch = useCallback((value: string) => {
		// Disabled: Enter key functionality disabled for mold pages
		// QuickSearch will not respond to Enter key presses
		return;
	}, []);

	const handleToggleQuickSearchField = useCallback((key: string) => {
		setSearchRequest((prev) => {
			const newRequest: MoldRepairSearchRequest = {};
			// 모든 필드를 비활성화하고 선택된 필드만 활성화
			Object.keys(prev).forEach((fieldKey) => {
				if (fieldKey === key) {
					const value =
						prev[fieldKey as keyof MoldRepairSearchRequest];
					if (value !== undefined) {
						(newRequest as any)[fieldKey] = value;
					}
				}
			});
			return newRequest;
		});
	}, []);

	// API 호출
	const {
		list: { data: apiData, isLoading, error, refetch },
		removeMoldRepair,
	} = useMoldRepair({
		searchRequest,
		page: page,
		size: DEFAULT_PAGE_SIZE,
	});

	useEffect(() => {
		if (apiData) {
			if (apiData.data && Array.isArray(apiData.data)) {
				// CommonResponseListMoldRepairDto 응답 처리
				setData(apiData.data);
				setTotalElements(apiData.data.length);
				setPageCount(
					Math.ceil(apiData.data.length / DEFAULT_PAGE_SIZE)
				);
			} else if (
				(apiData as any).content &&
				Array.isArray((apiData as any).content)
			) {
				// Spring Boot Pageable 응답 처리
				setData((apiData as any).content);
				setTotalElements(
					(apiData as any).totalElements ||
						(apiData as any).content.length
				);
				setPageCount(
					(apiData as any).totalPages ||
						Math.ceil(
							(apiData as any).content.length / DEFAULT_PAGE_SIZE
						)
				);
			} else if (Array.isArray(apiData)) {
				// 배열 형태의 응답 처리
				setData(apiData);
				setTotalElements(apiData.length);
				setPageCount(Math.ceil(apiData.length / DEFAULT_PAGE_SIZE));
			} else {
				// Fallback - try to find any array in the response
				const possibleArrays = Object.values(apiData).filter(
					Array.isArray
				);
				if (possibleArrays.length > 0) {
					setData(possibleArrays[0] as MoldRepairDto[]);
					setTotalElements(possibleArrays[0].length);
					setPageCount(
						Math.ceil(possibleArrays[0].length / DEFAULT_PAGE_SIZE)
					);
				} else {
					setData([]);
					setTotalElements(0);
					setPageCount(0);
				}
			}
		} else {
			setData([]);
			setTotalElements(0);
			setPageCount(0);
		}
	}, [apiData]);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		moldRepairColumns, // schema에서 import한 컬럼 사용
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	// Handler functions
	const handleRegister = () => {
		setIsEditMode(false);
		setSelectedMoldRepair(null);
		setOpenModal(true);
	};

	const handleEdit = () => {
		if (selectedMoldRepair && selectedMoldRepair.id) {
			setIsEditMode(true);
			setOpenModal(true);
		} else {
			// Try to get the selected row directly from selectedRows
			if (selectedRows.size > 0) {
				const selectedRowIndex = Array.from(selectedRows)[0];
				const rowIndex = parseInt(selectedRowIndex);
				if (data && data[rowIndex]) {
					const selectedRow = data[rowIndex];
					setSelectedMoldRepair(selectedRow);
					setIsEditMode(true);
					setOpenModal(true);
					return;
				}
			}
			toast.error('수정하실 금형 수리를 선택해주세요.');
		}
	};

	const handleRemove = () => {
		let targetId: number | null = null;

		if (selectedMoldRepair && selectedMoldRepair.id) {
			targetId = selectedMoldRepair.id;
		} else if (selectedRows.size > 0) {
			// Try to get the selected row directly from selectedRows
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex = parseInt(selectedRowIndex);
			if (data && data[rowIndex] && data[rowIndex].id) {
				targetId = data[rowIndex].id;
			}
		}

		if (targetId) {
			removeMoldRepair.mutate([targetId], {
				onSuccess: () => {
					setSelectedMoldRepair(null);
					selectedRows.clear();
					// Auto-refresh the list after successful deletion
					setTimeout(() => {
						refetch();
					}, 100);
				},
				onError: (error) => {
					// Error toast is handled in the hook
				},
			});
		} else {
			toast.error('삭제하실 금형 수리를 선택해주세요.');
		}
	};

	// Track selected row
	useEffect(() => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);

			if (data && data[rowIndex]) {
				const selectedRow: MoldRepairDto = data[rowIndex];
				setSelectedMoldRepair(selectedRow);
			} else {
				setSelectedMoldRepair(null);
			}
		} else {
			setSelectedMoldRepair(null);
		}
	}, [selectedRows, data]);

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={isEditMode ? '금형 수리 수정' : '금형 수리 등록'}
				content={
					<MoldRepairRegisterPage
						onClose={() => setOpenModal(false)}
						selectedRepair={
							isEditMode ? selectedMoldRepair : undefined
						}
						isEditMode={isEditMode}
						onSuccess={() => {
							setTimeout(() => {
								refetch();
							}, 100); // Small delay to ensure backend processing is complete
						}}
					/>
				}
			/>

			<PageTemplate
				firstChildWidth="30%"
				className="border rounded-lg h-full"
			>
				<DatatableComponent
					table={table}
					columns={moldRepairColumns} // schema에서 import한 컬럼 사용
					data={data}
					tableTitle={tCommon('pages.mold.repair.list')}
					rowCount={totalElements}
					useSearch={true}
					selectedRows={selectedRows}
					enableSingleSelect={true}
					toggleRowSelection={toggleRowSelection}
					searchSlot={
						<SearchSlotComponent
							onSearch={handleSearch}
							fields={moldRepairSearchFields}
							useQuickSearch={true}
							quickSearchField={moldRepairQuickSearchFields}
							onQuickSearch={handleQuickSearch}
							toggleQuickSearchEl={handleToggleQuickSearchField}
							endSlot={
								<ActionButtonsComponent
									useCreate={false}
									useEdit={true}
									useRemove={true}
									create={handleRegister}
									edit={handleEdit}
									remove={handleRemove}
								/>
							}
						/>
					}
				/>
			</PageTemplate>
		</>
	);
};

export default MoldRepairListPage;
