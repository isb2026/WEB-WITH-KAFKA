import { useState, useEffect, useCallback } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useMold } from '@primes/hooks';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import { MoldMasterDto, MoldMasterSearchRequest } from '@primes/types/mold';
import { DraggableDialog } from '@repo/radix-ui/components';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import MoldRegisterPage from './MoldRegisterPage';
import { toast } from 'sonner';
import {
	moldSearchFields,
	useMoldColumns,
	moldQuickSearchFields,
} from '@primes/schemas/mold';

export const MoldListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<MoldMasterDto[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [searchRequest, setSearchRequest] = useState<MoldMasterSearchRequest>(
		{}
	);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [editMoldData, setEditingMoldData] = useState<MoldMasterDto | null>(
		null
	);

	const DEFAULT_PAGE_SIZE = 30;

	// Get translated columns
	const moldColumns = useMoldColumns();

	// API 호출 - searchRequest 추가
	const {
		list: { data: apiData, isLoading, error },
		removeMold,
	} = useMold({
		searchRequest,
		page: page,
		size: DEFAULT_PAGE_SIZE,
	});

	// 페이지 변경 핸들러
	const onPageChange = useCallback((pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	}, []);

	// 검색 핸들러
	const handleSearch = useCallback((filters: MoldMasterSearchRequest) => {
		setSearchRequest(filters);
		setPage(0); // 검색 시 첫 페이지로 이동
	}, []);

	// Quick Search 핸들러
	const handleQuickSearch = useCallback((value: string) => {
		// Disabled: Enter key functionality disabled for mold pages
		// QuickSearch will not respond to Enter key presses
		return;
	}, []);

	// Quick Search 필드 토글 핸들러
	const handleToggleQuickSearchField = useCallback(
		(key: string) => {
			// Quick Search 필드 변경 시 현재 검색어를 새로운 필드로 이동
			const currentValue =
				searchRequest.moldCode ||
				searchRequest.moldName ||
				searchRequest.moldType ||
				searchRequest.moldStandard ||
				'';
			const newSearchRequest: MoldMasterSearchRequest = {};

			// 기존 검색 조건 초기화
			delete searchRequest.moldCode;
			delete searchRequest.moldName;
			delete searchRequest.moldType;
			delete searchRequest.moldStandard;

			// 새로운 필드에 값 설정
			if (key === 'moldCode') newSearchRequest.moldCode = currentValue;
			else if (key === 'moldName')
				newSearchRequest.moldName = currentValue;
			else if (key === 'moldType')
				newSearchRequest.moldType = currentValue;
			else if (key === 'moldStandard')
				newSearchRequest.moldStandard = currentValue;

			setSearchRequest(newSearchRequest);
		},
		[searchRequest]
	);

	useEffect(() => {
		if (apiData) {
			// ✅ FIXED: Handle various response structures more comprehensively
			let moldData: MoldMasterDto[] = [];
			let total = 0;

			// Handle direct array response
			if (Array.isArray(apiData)) {
				moldData = apiData;
				total = apiData.length;
			}
			// Handle nested data structure
			else if (apiData.data) {
				if (Array.isArray(apiData.data)) {
					moldData = apiData.data;
					total = apiData.data.length;
				}
				// Handle paginated response
				else if (
					apiData.data.content &&
					Array.isArray(apiData.data.content)
				) {
					moldData = apiData.data.content;
					total =
						apiData.data.totalElements ||
						apiData.data.content.length;
				}
				// Handle items structure
				else if (
					apiData.data.items &&
					Array.isArray(apiData.data.items)
				) {
					moldData = apiData.data.items;
					total =
						apiData.data.totalCount || apiData.data.items.length;
				}
			}
			// Handle content structure directly
			else if (apiData.content && Array.isArray(apiData.content)) {
				moldData = apiData.content;
				total = apiData.totalElements || apiData.content.length;
			}
			// Handle items structure directly
			else if (apiData.items && Array.isArray(apiData.items)) {
				moldData = apiData.items;
				total = apiData.totalCount || apiData.items.length;
			}
			// Fallback
			else {
				console.warn('Unknown response structure:', apiData);
				moldData = [];
				total = 0;
			}

			setData(moldData);
			setTotalElements(total);
			setPageCount(Math.ceil(total / DEFAULT_PAGE_SIZE));
		}
	}, [apiData]);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		moldColumns, // schema에서 import한 컬럼 사용
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
			const currentRow: MoldMasterDto = data[rowIndex];
			setEditingMoldData(currentRow);
		} else {
			setEditingMoldData(null);
		}
	}, [selectedRows, data]);

	const handleEdit = () => {
		setOpenModal(true);
	};

	const handleDelete = () => {
		if (editMoldData) {
			const id = editMoldData.id;
			removeMold.mutate([id]);
		} else {
			toast.warning('삭제하실 금형을 선택해주세요.');
		}
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={(open) => {
					setOpenModal(open);
					if (!open) {
						setEditingMoldData(null);
					}
				}}
				title={editMoldData ? '금형 수정' : '금형 등록'}
				content={
					<MoldRegisterPage
						onClose={() => setOpenModal(false)}
						moldData={editMoldData || undefined}
					/>
				}
			/>

			<PageTemplate
				firstChildWidth="30%"
				className="border rounded-lg h-full"
			>
				{isLoading && (
					<div className="flex items-center justify-center p-8">
						<div className="text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
							<p className="text-gray-600">
								데이터를 불러오는 중...
							</p>
						</div>
					</div>
				)}

				{error && (
					<div className="flex items-center justify-center p-8">
						<div className="text-center text-red-600">
							<p>데이터 로드 중 오류가 발생했습니다:</p>
							<p className="text-sm">{error.message}</p>
						</div>
					</div>
				)}

				{!isLoading && !error && (
					<>
						<DatatableComponent
							table={table}
							columns={moldColumns} // schema에서 import한 컬럼 사용
							data={data}
							tableTitle={tCommon('pages.mold.list')}
							rowCount={totalElements}
							useSearch={true}
							selectedRows={selectedRows}
							enableSingleSelect={true}
							toggleRowSelection={toggleRowSelection}
							searchSlot={
								<SearchSlotComponent
									onSearch={handleSearch}
									fields={moldSearchFields}
									useQuickSearch={true}
									quickSearchField={moldQuickSearchFields}
									onQuickSearch={handleQuickSearch}
									toggleQuickSearchEl={
										handleToggleQuickSearchField
									}
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

						{/* ✅ ADDED: Debug info for empty data */}
						{data.length === 0 && !isLoading && (
							<div className="flex items-center justify-center p-8">
								<div className="text-center text-gray-500">
									<p>등록된 금형 데이터가 없습니다.</p>
									<p className="text-sm mt-2">
										새로운 금형을 등록해보세요.
									</p>
								</div>
							</div>
						)}
					</>
				)}
			</PageTemplate>
		</>
	);
};

export default MoldListPage;
