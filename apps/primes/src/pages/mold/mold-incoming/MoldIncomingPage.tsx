import React, { useState, useEffect, useCallback } from 'react';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import { MoldIncomingModal } from '@primes/pages/mold/components/MoldIncomingModal';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { SplitterComponent } from '@primes/components/common/Splitter';
import { useMoldOrderMaster, useMoldOrderDetailByMasterId } from '@primes/hooks';
import { MoldOrderDetailDto } from '@primes/types/mold';
import {
	MoldOrderMasterDto,
	MoldOrderMasterSearchRequest,
} from '@primes/types/mold';
import {
	moldOrderSearchFields,
	moldOrderColumns,
	moldOrderQuickSearchFields,
	moldOrderDetailColumns,
	useMoldOrderColumns,
} from '@primes/schemas/mold';

interface MoldIncomingPageProps {
	onEditClick?: (item: MoldOrderMasterDto) => void;
}

export const MoldIncomingPage: React.FC<MoldIncomingPageProps> = ({
	onEditClick,
}) => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const [page, setPage] = useState<number>(0);
	
	// Get translated columns
	const moldOrderColumns = useMoldOrderColumns();
	const [data, setData] = useState<MoldOrderMasterDto[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [searchRequest, setSearchRequest] =
		useState<MoldOrderMasterSearchRequest>({});
	const [selectedOrder, setSelectedOrder] = useState<MoldOrderMasterDto | null>(null);
	const [isIncomingModalOpen, setIsIncomingModalOpen] = useState(false);
	const [selectedDetail, setSelectedDetail] = useState<MoldOrderDetailDto | null>(null);
	const [isIncomingDetailModalOpen, setIsIncomingDetailModalOpen] = useState(false);
	const [selectedMasterId, setSelectedMasterId] = useState<number | null>(null);
	const [detailData, setDetailData] = useState<MoldOrderDetailDto[]>([]);
	const [detailTotalElements, setDetailTotalElements] = useState<number>(0);
	const [detailPageCount, setDetailPageCount] = useState<number>(0);
	const [detailPage, setDetailPage] = useState<number>(0);

	const DEFAULT_PAGE_SIZE = 30;

	// API 호출 - searchRequest 추가
	const {
		list: { data: apiData, isLoading, error, refetch },
	} = useMoldOrderMaster({
		searchRequest,
		page: page,
		size: DEFAULT_PAGE_SIZE,
	});

	// Detail table hook - only fetch when master is selected
	const {
		data: detailApiData,
		isLoading: detailIsLoading,
		error: detailError,
	} = useMoldOrderDetailByMasterId(selectedMasterId, detailPage, DEFAULT_PAGE_SIZE);

	// 페이지 변경 핸들러
	const onPageChange = useCallback((pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	}, []);

	// 검색 핸들러
	const handleSearch = useCallback(
		(filters: MoldOrderMasterSearchRequest) => {
			setSearchRequest(filters);
			setPage(0); // 검색 시 첫 페이지로 이동
		},
		[]
	);

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
				searchRequest.orderCode ||
				searchRequest.progressName ||
				searchRequest.moldType ||
				searchRequest.accountMonth ||
				'';
			const newSearchRequest: MoldOrderMasterSearchRequest = {};

			// 기존 검색 조건 초기화
			delete searchRequest.orderCode;
			delete searchRequest.progressName;
			delete searchRequest.moldType;
			delete searchRequest.accountMonth;

			// 새로운 필드에 값 설정
			if (key === 'orderCode') newSearchRequest.orderCode = currentValue;
			else if (key === 'progressName')
				newSearchRequest.progressName = currentValue;
			else if (key === 'moldType')
				newSearchRequest.moldType = currentValue;
			else if (key === 'accountMonth')
				newSearchRequest.accountMonth = currentValue;

			setSearchRequest(newSearchRequest);
		},
		[searchRequest]
	);

	useEffect(() => {
		if (apiData) {
			if (apiData.data) {
				// CommonResponseListMoldOrderMasterDto 응답 처리
				setData(apiData.data);
				setTotalElements(apiData.data.length);
				setPageCount(
					Math.ceil(apiData.data.length / DEFAULT_PAGE_SIZE)
				);
			} else if (Array.isArray(apiData)) {
				// 배열 형태의 응답 처리
				setData(apiData);
				setTotalElements(apiData.length);
				setPageCount(Math.ceil(apiData.length / DEFAULT_PAGE_SIZE));
			}
		}
	}, [apiData]);

	// Detail data processing
	useEffect(() => {
		console.log('Detail API data changed:', detailApiData);
		if (detailApiData) {
			if (detailApiData.data) {
				console.log('Setting detail data from data property:', detailApiData.data);
				setDetailData(detailApiData.data);
				setDetailTotalElements(detailApiData.data.length);
				setDetailPageCount(
					Math.ceil(detailApiData.data.length / DEFAULT_PAGE_SIZE)
				);
			} else if (Array.isArray(detailApiData)) {
				console.log('Setting detail data from array:', detailApiData);
				setDetailData(detailApiData);
				setDetailTotalElements(detailApiData.length);
				setDetailPageCount(Math.ceil(detailApiData.length / DEFAULT_PAGE_SIZE));
			}
		} else {
			// Reset detail data when no master is selected
			console.log('Resetting detail data');
			setDetailData([]);
			setDetailTotalElements(0);
			setDetailPageCount(0);
		}
	}, [detailApiData]);

	// Auto-refresh detail data when master data changes
	useEffect(() => {
		if (selectedMasterId && apiData) {
			console.log('Master data changed, refreshing detail data for master ID:', selectedMasterId);
			// This will trigger the detail hook to refetch data
		}
	}, [apiData, selectedMasterId]);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		moldOrderColumns, // schema에서 import한 컬럼 사용
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	// Detail table data table hook
	const { table: detailTable, selectedRows: detailSelectedRows, toggleRowSelection: toggleDetailRowSelection } = useDataTable(
		detailData,
		moldOrderDetailColumns,
		DEFAULT_PAGE_SIZE,
		detailPageCount,
		detailPage,
		detailTotalElements,
		(pagination: { pageIndex: number }) => setDetailPage(pagination.pageIndex)
	);

	// Auto-load detail data when row selection changes
	useEffect(() => {
		if (selectedRows.size > 0) {
			// Get the last selected row (most recent selection)
			const selectedRowIndex = parseInt(Array.from(selectedRows).slice(-1)[0]);
			const selectedOrderData = data[selectedRowIndex];
			if (selectedOrderData) {
				console.log('Auto-loading details for last selected order:', selectedOrderData.orderCode);
				setSelectedMasterId(selectedOrderData.id);
				setSelectedOrder(selectedOrderData);
			}
		} else {
			// Clear detail data when no rows are selected
			console.log('No rows selected, clearing detail data');
			setSelectedMasterId(null);
			setSelectedOrder(null);
		}
	}, [selectedRows, data]);

	const handleDetailIncomingClick = (detail: MoldOrderDetailDto) => {
		setSelectedDetail(detail);
		setIsIncomingDetailModalOpen(true);
	};

	const handleIncomingSuccess = () => {
		// Refresh data after successful incoming
		refetch();
		setIsIncomingDetailModalOpen(false);
		setSelectedDetail(null);
	};

	return (
		<>
					<SplitterComponent
			direction="horizontal"
			sizes={[45, 55]}
		>
				{/* Master Table - Order List */}
				<div className="h-full flex flex-col border rounded-lg">
					<div className="flex-1 min-h-0">
						<DatatableComponent
							table={table}
							columns={moldOrderColumns}
							data={data}
							tableTitle={tCommon('pages.mold.orders.incoming.title', '금형 주문 목록')}
							rowCount={totalElements}
							useSearch={true}
							selectedRows={selectedRows}
							toggleRowSelection={toggleRowSelection}
							searchSlot={
								<SearchSlotComponent
									onSearch={handleSearch}
									fields={moldOrderSearchFields}
									useQuickSearch={true}
									quickSearchField={moldOrderQuickSearchFields}
									onQuickSearch={handleQuickSearch}
									toggleQuickSearchEl={handleToggleQuickSearchField}
								/>
							}
													actionButtons={
							<ActionButtonsComponent
								topNodes={
									<div className="text-sm text-gray-500 px-2">
										{selectedRows.size > 0 ? `${selectedRows.size}개 주문 선택됨 (마지막 선택된 주문 표시)` : ''}
									</div>
								}
							/>
						}
						/>
					</div>
				</div>

				{/* Detail Table - Order Details */}
				<div className="h-full flex flex-col border rounded-lg">
					<div className="p-4 border-b bg-gray-50">
						<h3 className="text-lg font-semibold">
							{selectedOrder ? `주문 상세: ${selectedOrder.orderCode}` : '주문을 선택해주세요'}
						</h3>
						{selectedMasterId && (
							<div className="text-sm text-gray-500 mt-1">
								상세 데이터 로딩 중... {detailIsLoading ? '(로딩 중...)' : ''}
								{detailError && ` (오류: ${detailError.message})`}
								{detailData.length > 0 && ` (${detailData.length}개 항목)`}
							</div>
						)}
					</div>
					<div className="flex-1 min-h-0">
						<DatatableComponent
							table={detailTable}
							columns={moldOrderDetailColumns}
							data={detailData}
							tableTitle=""
							rowCount={detailTotalElements}
							useSearch={false}
							selectedRows={detailSelectedRows}
							toggleRowSelection={toggleDetailRowSelection}
							actionButtons={
								<ActionButtonsComponent
									topNodes={
										<button
											onClick={() => {
												if (detailSelectedRows.size > 0) {
													const selectedRowIndex = parseInt(Array.from(detailSelectedRows)[0]);
													const selectedDetailData = detailData[selectedRowIndex];
													if (selectedDetailData) {
														handleDetailIncomingClick(selectedDetailData);
													}
												}
											}}
											disabled={detailSelectedRows.size === 0}
											className="flex gap-1 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-700 hover:bg-Colors-Brand-800 text-white border-Colors-Brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
											title={detailSelectedRows.size === 0 ? '입고할 항목을 선택해주세요' : '입고등록'}
										>
											입고등록
										</button>
									}
								/>
							}
						/>
					</div>
				</div>
			</SplitterComponent>

			{/* Mold Incoming Modal for Detail Registration */}
			<MoldIncomingModal
				isOpen={isIncomingDetailModalOpen}
				onClose={() => {
					setIsIncomingDetailModalOpen(false);
					setSelectedDetail(null);
				}}
				selectedDetail={selectedDetail}
				onSuccess={() => {
					// Refresh data after successful incoming
					refetch();
					setIsIncomingDetailModalOpen(false);
					setSelectedDetail(null);
				}}
			/>
		</>
	);
};

export default MoldIncomingPage;
