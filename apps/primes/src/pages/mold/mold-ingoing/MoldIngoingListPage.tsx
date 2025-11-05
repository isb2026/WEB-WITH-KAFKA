import React, { useState, useEffect, useCallback } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';

import { DraggableDialog } from '@repo/radix-ui/components';
import MoldIngoingRegisterPage from './MoldIngoingRegisterPage';
import { PageTemplate } from '@primes/templates';
import { useMoldOrderIngoing } from '@primes/hooks';
import {
	MoldOrderIngoingDto,
	MoldOrderIngoingSearchRequest,
} from '@primes/types/mold';
import { useMoldIngoingColumns } from '@primes/schemas/mold';


export const MoldIngoingListPage: React.FC = () => {
	const { t: tCommon } = useTranslation('common');

	const [page, setPage] = useState<number>(0);

	// Get translated columns
	const moldIngoingColumns = useMoldIngoingColumns();
	const [data, setMoldIngoingData] = useState<MoldOrderIngoingDto[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [searchRequest, setSearchRequest] =
		useState<MoldOrderIngoingSearchRequest>({});
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [editIngoingData, setEditingIngoingData] =
		useState<MoldOrderIngoingDto | null>(null);

	const DEFAULT_PAGE_SIZE = 30;

	// API 호출 - get ingoing records
	const {
		list: { data: apiData },
	} = useMoldOrderIngoing({
		searchRequest,
		page: page,
		size: DEFAULT_PAGE_SIZE,
	});

	// Process API data
	useEffect(() => {
		console.log('=== MoldIngoingListPage Debug ===');
		console.log('API Data received:', apiData);
		console.log('API Data type:', typeof apiData);
		console.log('Is API Data array?', Array.isArray(apiData));
		console.log(
			'API Data keys:',
			apiData ? Object.keys(apiData) : 'No data'
		);

		if (apiData) {
			if (apiData.data && Array.isArray(apiData.data)) {
				// CommonResponseListMoldOrderIngoingDto 응답 처리
				console.log('Processing apiData.data:', apiData.data);
				setMoldIngoingData(apiData.data);
				setTotalElements(apiData.data.length);
				setPageCount(
					Math.ceil(apiData.data.length / DEFAULT_PAGE_SIZE)
				);
			} else if (
				(apiData as any).content &&
				Array.isArray((apiData as any).content)
			) {
				// Spring Boot Pageable 응답 처리
				console.log(
					'Processing Spring Boot Pageable response:',
					(apiData as any).content
				);
				setMoldIngoingData((apiData as any).content);
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
				console.log('Processing direct array:', apiData);
				setMoldIngoingData(apiData);
				setTotalElements(apiData.length);
				setPageCount(Math.ceil(apiData.length / DEFAULT_PAGE_SIZE));
			} else {
				// 기타 응답 구조 처리
				console.log(
					'Unknown response structure, trying to extract data...'
				);
				const extractedData = (apiData.data || apiData) as any;
				if (Array.isArray(extractedData)) {
					console.log('Extracted array data:', extractedData);
					setMoldIngoingData(extractedData);
					setTotalElements(extractedData.length);
					setPageCount(
						Math.ceil(extractedData.length / DEFAULT_PAGE_SIZE)
					);
				} else {
					console.log('Could not extract array data from response');
					setMoldIngoingData([]);
					setTotalElements(0);
					setPageCount(0);
				}
			}
		} else {
			console.log('No API data received');
			setMoldIngoingData([]);
			setTotalElements(0);
			setPageCount(0);
		}
	}, [apiData]);

	// Debug current state
	useEffect(() => {
		console.log('Current state - data:', data);
		console.log('Current state - totalElements:', totalElements);
		console.log('Current state - pageCount:', pageCount);
	}, [data, totalElements, pageCount]);

	const onPageChange = useCallback((pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	}, []);

	const handleSearch = useCallback(
		(filters: MoldOrderIngoingSearchRequest) => {
			setSearchRequest(filters);
			setPage(0);
		},
		[]
	);

	const handleQuickSearch = useCallback((_value: string) => {
		return;
	}, []);

	const handleToggleQuickSearchField = useCallback(
		(key: string) => {
			const currentValue =
				searchRequest.accountMonth ||
				searchRequest.inMonth ||
				searchRequest.auditBy ||
				'';
			const newSearchRequest: MoldOrderIngoingSearchRequest = {};
			delete searchRequest.accountMonth;
			delete searchRequest.inMonth;
			delete searchRequest.auditBy;
			if (key === 'accountMonth')
				newSearchRequest.accountMonth = currentValue;
			if (key === 'inMonth') newSearchRequest.inMonth = currentValue;
			if (key === 'auditBy') newSearchRequest.auditBy = currentValue;
			setSearchRequest(newSearchRequest);
		},
		[searchRequest]
	);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		moldIngoingColumns,
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
			const currentRow: MoldOrderIngoingDto = data[rowIndex];
			setEditingIngoingData(currentRow);
		} else {
			setEditingIngoingData(null);
		}
	}, [selectedRows, data]);

	const handleEdit = () => {
		setOpenModal(true);
	};



	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={(open) => {
					setOpenModal(open);
					if (!open) {
						setEditingIngoingData(null);
					}
				}}
				title={editIngoingData ? '입고 수정' : '입고 등록'}
				content={<MoldIngoingRegisterPage />}
			/>

			<PageTemplate
				firstChildWidth="30%"
				className="border rounded-lg h-full"
			>
				<DatatableComponent
					table={table}
					columns={moldIngoingColumns}
					data={data}
					tableTitle={tCommon(
						'pages.mold.ingoing.list.title',
						'입고처리된 현황'
					)}
					rowCount={totalElements}
					useSearch={true}
					selectedRows={selectedRows}
					enableSingleSelect={true}
					toggleRowSelection={toggleRowSelection}

					searchSlot={
						<SearchSlotComponent
							onSearch={handleSearch}
							fields={[
								{
									name: 'accountMonth',
									label: '회계월',
									type: 'text',
								},
								{
									name: 'inMonth',
									label: '입고월',
									type: 'text',
								},
								{
									name: 'inDate',
									label: '입고일자',
									type: 'text',
								},
								{
									name: 'auditBy',
									label: '검사자',
									type: 'text',
								},
								{
									name: 'isPass',
									label: '합격여부',
									type: 'select',
									options: [
										{ value: 'true', label: '합격' },
										{ value: 'false', label: '불합격' },
									],
								},
								{
									name: 'isDev',
									label: '개발금형',
									type: 'select',
									options: [
										{ value: 'true', label: '개발' },
										{ value: 'false', label: '양산' },
									],
								},
								{
									name: 'isChange',
									label: '설변여부',
									type: 'select',
									options: [
										{ value: 'true', label: '설변' },
										{ value: 'false', label: '일반' },
									],
								},
							]}
							useQuickSearch={true}
							quickSearchField={[
								{
									key: 'accountMonth',
									value: '회계월',
									active: true,
								},
								{
									key: 'inMonth',
									value: '입고월',
									active: false,
								},
								{
									key: 'auditBy',
									value: '검사자',
									active: false,
								},
							]}
							onQuickSearch={handleQuickSearch}
							toggleQuickSearchEl={handleToggleQuickSearchField}
						/>
					}
				/>
			</PageTemplate>
		</>
	);
};

export default MoldIngoingListPage;
