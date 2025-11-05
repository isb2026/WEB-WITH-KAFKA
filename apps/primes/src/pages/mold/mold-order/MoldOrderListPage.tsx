import { useState, useEffect, useCallback } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useMoldOrderMaster } from '@primes/hooks';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import {
	MoldOrderMasterDto,
	MoldOrderMasterSearchRequest,
} from '@primes/types/mold';
import {
	moldOrderSearchFields,
	moldOrderColumns,
	moldOrderQuickSearchFields,
	useMoldOrderColumns,
} from '@primes/schemas/mold';

interface MoldOrderListData {
	id: number;
	name?: string;
	code?: string;
	status?: string;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: any;
}

interface MoldOrderListPageProps {
	onEditClick?: (item: MoldOrderMasterDto) => void;
}

export const MoldOrderListPage: React.FC<MoldOrderListPageProps> = ({
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

	const DEFAULT_PAGE_SIZE = 30;

	// API 호출 - searchRequest 추가
	const {
		list: { data: apiData, isLoading, error },
	} = useMoldOrderMaster({
		searchRequest,
		page: page,
		size: DEFAULT_PAGE_SIZE,
	});

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

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		moldOrderColumns, // schema에서 import한 컬럼 사용
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	return (
		<PageTemplate
			firstChildWidth="30%"
			className="border rounded-lg h-full"
		>
			<DatatableComponent
				table={table}
				columns={moldOrderColumns} // schema에서 import한 컬럼 사용
				data={data}
				tableTitle=""
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
			/>
		</PageTemplate>
	);
};

export default MoldOrderListPage;
