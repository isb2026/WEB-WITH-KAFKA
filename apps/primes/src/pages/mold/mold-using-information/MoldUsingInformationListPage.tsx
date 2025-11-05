import { useState, useEffect, useCallback } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useMoldUsingInformation } from '@primes/hooks';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import {
	MoldUsingInformationDto,
	MoldUsingInformationSearchRequest,
} from '@primes/types/mold';
import { DraggableDialog } from '@repo/radix-ui/components';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { HardDeleteConfirmDialog } from '@primes/components/common/HardDeleteConfirmDialog';
import MoldUsingInformationRegisterPage from './MoldUsingInformationRegisterPage';
import { toast } from 'sonner';
import {
	moldUsingInformationSearchFields,
	moldUsingInformationColumns,
	moldUsingInformationQuickSearchFields,
	useMoldUsingInformationColumns,
} from '@primes/schemas/mold';

export const MoldUsingInformationListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<MoldUsingInformationDto[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [selectedMoldUsingInformation, setSelectedMoldUsingInformation] =
		useState<MoldUsingInformationDto | null>(null);
	const [isEditMode, setIsEditMode] = useState<boolean>(false);
	const [showHardDeleteDialog, setShowHardDeleteDialog] =
		useState<boolean>(false);
	const [searchRequest, setSearchRequest] =
		useState<MoldUsingInformationSearchRequest>({});

	const DEFAULT_PAGE_SIZE = 30;

	// Get translated columns
	const moldUsingInformationColumns = useMoldUsingInformationColumns();

	const onPageChange = useCallback((pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	}, []);

	const handleSearch = useCallback(
		(filters: MoldUsingInformationSearchRequest) => {
			setSearchRequest(filters);
			setPage(0); // 검색 시 첫 페이지로 이동
		},
		[]
	);

	const handleQuickSearch = useCallback((value: string) => {
		// Disabled: Enter key functionality disabled for mold pages
		// QuickSearch will not respond to Enter key presses
		return;
	}, []);

	const handleToggleQuickSearchField = useCallback((key: string) => {
		setSearchRequest((prev) => {
			const newRequest: MoldUsingInformationSearchRequest = {};
			// 모든 필드를 비활성화하고 선택된 필드만 활성화
			Object.keys(prev).forEach((fieldKey) => {
				if (fieldKey === key) {
					const value =
						prev[
							fieldKey as keyof MoldUsingInformationSearchRequest
						];
					if (value !== undefined) {
						(newRequest as any)[fieldKey] = value;
					}
				}
			});
			return newRequest;
		});
	}, []);

	// API 호출 - READ ONLY: Mold Using Info는 Kafka를 통해서만 등록됨
	const {
		list: { data: apiData, isLoading, error },
		// removeMoldUsingInformation, // 주석 처리: 삭제 기능 비활성화
	} = useMoldUsingInformation({
		searchRequest,
		page: page,
		size: DEFAULT_PAGE_SIZE,
	});

	useEffect(() => {
		if (apiData) {
			if (apiData.data && Array.isArray(apiData.data)) {
				// CommonResponseListMoldUsingInformationDto 응답 처리
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
			}
		}
	}, [apiData]);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		moldUsingInformationColumns, // translated columns 사용
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	// Handler functions - 주석 처리: READ ONLY 모드
	// const handleRegister = () => {
	// 	setIsEditMode(false);
	// 	setSelectedMoldUsingInformation(null);
	// 	setOpenModal(true);
	// };

	// const handleEdit = () => {
	// 	if (selectedMoldUsingInformation) {
	// 		setIsEditMode(true);
	// 		setOpenModal(true);
	// 	} else {
	// 		toast.error('수정하실 금형 사용 정보를 선택해주세요.');
	// 	}
	// };

	// const handleRemove = () => {
	// 	if (selectedMoldUsingInformation) {
	// 		setShowHardDeleteDialog(true);
	// 	} else {
	// 		toast.error('삭제하실 금형 사용 정보를 선택해주세요.');
	// 	}
	// };

	// const confirmHardDelete = () => {
	// 	if (selectedMoldUsingInformation) {
	// 		removeMoldUsingInformation.mutate(
	// 			[selectedMoldUsingInformation.id],
	// 			{
	// 				onSuccess: () => {
	// 					toast.success('완전 삭제가 완료되었습니다.');
	// 					setShowHardDeleteDialog(false);
	// 					setSelectedMoldUsingInformation(null);
	// 				},
	// 				onError: (error) => {
	// 					console.error('삭제 실패:', error);
	// 					setShowHardDeleteDialog(false);
	// 					toast.error('삭제 중 오류가 발생했습니다.');
	// 				},
	// 			}
	// 		);
	// 	}
	// };

	// Track selected row
	useEffect(() => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const selectedRow: MoldUsingInformationDto = data[rowIndex];
			setSelectedMoldUsingInformation(selectedRow);
		} else {
			setSelectedMoldUsingInformation(null);
		}
	}, [selectedRows, data]);

	return (
		<>
			{/* 주석 처리: READ ONLY 모드 - 등록/수정 모달 비활성화 */}
			{/* <DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={
					isEditMode ? '금형 사용 정보 수정' : '금형 사용 정보 등록'
				}
				content={
					<MoldUsingInformationRegisterPage
						onClose={() => setOpenModal(false)}
						selectedUsingInformation={
							isEditMode
								? selectedMoldUsingInformation
								: undefined
						}
						isEditMode={isEditMode}
					/>
				}
			/> */}

			{/* 주석 처리: READ ONLY 모드 - 삭제 확인 다이얼로그 비활성화 */}
			{/* <HardDeleteConfirmDialog
				isOpen={showHardDeleteDialog}
				onOpenChange={setShowHardDeleteDialog}
				onConfirm={confirmHardDelete}
				isDeleting={removeMoldUsingInformation.isPending}
				itemIdentifier={selectedMoldUsingInformation?.commandNo || ''}
				itemName="금형 사용 정보"
				verificationPhrase="완전 삭제"
			/> */}

			<PageTemplate
				firstChildWidth="30%"
				className="border rounded-lg h-full"
			>
				<DatatableComponent
					table={table}
					columns={moldUsingInformationColumns} // translated columns 사용
					data={data}
					tableTitle={tCommon('pages.mold.using.list')}
					rowCount={totalElements}
					useSearch={true}
					selectedRows={selectedRows}
					enableSingleSelect={true}
					toggleRowSelection={toggleRowSelection}
					searchSlot={
						<SearchSlotComponent
							onSearch={handleSearch}
							fields={moldUsingInformationSearchFields}
							useQuickSearch={true}
							quickSearchField={
								moldUsingInformationQuickSearchFields
							}
							onQuickSearch={handleQuickSearch}
							toggleQuickSearchEl={handleToggleQuickSearchField}
							// endSlot={
							// 	<ActionButtonsComponent
							// 		useCreate={false} // 주석 처리: READ ONLY 모드 - 등록 버튼 비활성화
							// 		useEdit={false} // 주석 처리: READ ONLY 모드 - 수정 버튼 비활성화
							// 		useRemove={false} // 주석 처리: READ ONLY 모드 - 삭제 버튼 비활성화
							// 		// create={handleRegister} // 주석 처리
							// 		// edit={handleEdit} // 주석 처리
							// 		// remove={handleRemove} // 주석 처리
							// 	/>
							// }
						/>
					}
				/>
			</PageTemplate>
		</>
	);
};

export default MoldUsingInformationListPage;
