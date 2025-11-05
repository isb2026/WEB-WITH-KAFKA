import { useState, useEffect, useCallback } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useMoldDispose } from '@primes/hooks';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import { MoldDisposeDto, MoldDisposeSearchRequest } from '@primes/types/mold';
import { DraggableDialog } from '@repo/radix-ui/components';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import MoldDisposeRegisterPage from './MoldDisposeRegisterPage';
import { RadixIconButton } from '@repo/radix-ui/components';
import { Pen, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
	moldDisposeSearchFields,
	moldDisposeColumns,
	moldDisposeQuickSearchFields,
	useMoldDisposeColumns,
} from '@primes/schemas/mold';

export const MoldDisposeListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<MoldDisposeDto[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [editMoldDisposeData, setEditingMoldDisposeData] =
		useState<MoldDisposeDto | null>(null);
	const [searchRequest, setSearchRequest] =
		useState<MoldDisposeSearchRequest>({});

	const DEFAULT_PAGE_SIZE = 30;

	// Get translated columns
	const moldDisposeColumns = useMoldDisposeColumns();

	const onPageChange = useCallback((pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	}, []);

	const handleSearch = useCallback((filters: MoldDisposeSearchRequest) => {
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
			const newRequest: MoldDisposeSearchRequest = {};
			// 모든 필드를 비활성화하고 선택된 필드만 활성화
			Object.keys(prev).forEach((fieldKey) => {
				if (fieldKey === key) {
					const value =
						prev[fieldKey as keyof MoldDisposeSearchRequest];
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
		list: { data: apiData },
		removeMoldDispose,
	} = useMoldDispose({
		searchRequest,
		page: page,
		size: DEFAULT_PAGE_SIZE,
	});

	useEffect(() => {
		if (apiData) {
			if (apiData.data && Array.isArray(apiData.data)) {
				// CommonResponseListMoldDisposeDto 응답 처리
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
				setTotalElements((apiData as any).totalElements);
				setPageCount((apiData as any).totalPages);
			} else if (Array.isArray(apiData)) {
				// 배열 형태의 응답 처리
				setData(apiData);
				setTotalElements(apiData.length);
				setPageCount(Math.ceil(apiData.length / DEFAULT_PAGE_SIZE));
			} else {
				setData([]);
				setTotalElements(0);
				setPageCount(0);
			}
		}
	}, [apiData]);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		moldDisposeColumns, // translated columns 사용
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	// Handle row selection for edit/delete
	useEffect(() => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const currentRow: MoldDisposeDto = data[rowIndex];
			setEditingMoldDisposeData(currentRow);
		} else {
			setEditingMoldDisposeData(null);
		}
	}, [selectedRows, data]);

	const handleRegister = () => {
		setOpenModal(true);
	};

	const handleEdit = () => {
		setOpenModal(true);
	};

	const handleDelete = () => {
		if (editMoldDisposeData) {
			const id = editMoldDisposeData.id;
			removeMoldDispose.mutate([id]);
		} else {
			toast.warning('삭제하실 금형 폐기를 선택해주세요.');
		}
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={(open) => {
					setOpenModal(open);
					if (!open) {
						setEditingMoldDisposeData(null);
					}
				}}
				title={
					editMoldDisposeData ? '금형 폐기 수정' : '금형 폐기 등록'
				}
				content={
					<MoldDisposeRegisterPage
						onClose={() => setOpenModal(false)}
						moldDisposeData={editMoldDisposeData || undefined}
						page={page}
						size={DEFAULT_PAGE_SIZE}
						searchRequest={searchRequest}
					/>
				}
			/>

			<PageTemplate
				firstChildWidth="30%"
				className="border rounded-lg h-full"
			>
				<DatatableComponent
					table={table}
					columns={moldDisposeColumns} // translated columns 사용
					data={data}
					tableTitle={tCommon('pages.mold.dispose.list')}
					rowCount={totalElements}
					useSearch={true}
					selectedRows={selectedRows}
					enableSingleSelect={true}
					toggleRowSelection={toggleRowSelection}
					searchSlot={
						<SearchSlotComponent
							onSearch={handleSearch}
							fields={moldDisposeSearchFields}
							useQuickSearch={true}
							quickSearchField={moldDisposeQuickSearchFields}
							onQuickSearch={handleQuickSearch}
							toggleQuickSearchEl={handleToggleQuickSearchField}
							endSlot={
								<ActionButtonsComponent
									useCreate={false}
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

export default MoldDisposeListPage;
