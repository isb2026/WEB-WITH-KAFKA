import { useState, useEffect, useCallback } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useMoldItemRelation } from '@primes/hooks';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import {
	MoldItemRelationDto,
	MoldItemRelationSearchRequest,
} from '@primes/types/mold';
import { DraggableDialog } from '@repo/radix-ui/components';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { HardDeleteConfirmDialog } from '@primes/components/common/HardDeleteConfirmDialog';
import MoldItemRelationRegisterPage from './MoldItemRelationRegisterPage';
import { toast } from 'sonner';
import {
	moldItemRelationSearchFields,
	moldItemRelationColumns,
	moldItemRelationQuickSearchFields,
} from '@primes/schemas/mold';

export const MoldItemRelationListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<MoldItemRelationDto[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [selectedMoldItemRelation, setSelectedMoldItemRelation] =
		useState<MoldItemRelationDto | null>(null);
	const [isEditMode, setIsEditMode] = useState<boolean>(false);
	const [showHardDeleteDialog, setShowHardDeleteDialog] =
		useState<boolean>(false);
	const [searchRequest, setSearchRequest] =
		useState<MoldItemRelationSearchRequest>({});

	const DEFAULT_PAGE_SIZE = 30;

	const onPageChange = useCallback((pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	}, []);

	const handleSearch = useCallback(
		(filters: MoldItemRelationSearchRequest) => {
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
			const newRequest: MoldItemRelationSearchRequest = {};
			// 모든 필드를 비활성화하고 선택된 필드만 활성화
			Object.keys(prev).forEach((fieldKey) => {
				if (fieldKey === key) {
					const value =
						prev[fieldKey as keyof MoldItemRelationSearchRequest];
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
		removeMoldItemRelation,
	} = useMoldItemRelation({
		searchRequest,
		page: page,
		size: DEFAULT_PAGE_SIZE,
	});

	useEffect(() => {
		console.log('MoldItemRelation API Data received:', apiData);
		console.log('API Data type:', typeof apiData);
		console.log(
			'API Data keys:',
			apiData ? Object.keys(apiData) : 'No data'
		);

		if (apiData) {
			if (apiData.data && Array.isArray(apiData.data)) {
				// CommonResponseListMoldItemRelationDto 응답 처리
				console.log('Setting data from apiData.data:', apiData.data);
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
				console.log(
					'Setting data from apiData.content:',
					(apiData as any).content
				);
				setData((apiData as any).content);
				setTotalElements((apiData as any).totalElements);
				setPageCount((apiData as any).totalPages);
			} else if (Array.isArray(apiData)) {
				// 배열 형태의 응답 처리
				console.log('Setting data from array:', apiData);
				setData(apiData);
				setTotalElements(apiData.length);
				setPageCount(Math.ceil(apiData.length / DEFAULT_PAGE_SIZE));
			} else {
				console.log('Unexpected API data structure:', apiData);
			}
		}
	}, [apiData]);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		moldItemRelationColumns, // schema에서 import한 컬럼 사용
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	// Handler functions
	const handleRegister = () => {
		setIsEditMode(false);
		setSelectedMoldItemRelation(null);
		setOpenModal(true);
	};

	const handleEdit = () => {
		if (selectedMoldItemRelation) {
			setIsEditMode(true);
			setOpenModal(true);
		} else {
			toast.error('수정하실 금형 아이템 관계를 선택해주세요.');
		}
	};

	const handleRemove = () => {
		if (selectedMoldItemRelation) {
			setShowHardDeleteDialog(true);
		} else {
			toast.error('삭제하실 금형 아이템 관계를 선택해주세요.');
		}
	};

	const confirmHardDelete = () => {
		if (selectedMoldItemRelation) {
			console.log('Selected item for delete:', selectedMoldItemRelation);
			console.log(
				'Available properties:',
				Object.keys(selectedMoldItemRelation)
			);
			removeMoldItemRelation.mutate([selectedMoldItemRelation.id], {
				onSuccess: () => {
					toast.success('완전 삭제가 완료되었습니다.');
					setShowHardDeleteDialog(false);
					setSelectedMoldItemRelation(null);
					// Cache invalidation in the hook will automatically refresh the list
				},
				onError: (error) => {
					console.error('삭제 실패:', error);
					setShowHardDeleteDialog(false);
					toast.error('삭제 중 오류가 발생했습니다.');
				},
			});
		}
	};

	// Track selected row
	useEffect(() => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const selectedRow: MoldItemRelationDto = data[rowIndex];
			setSelectedMoldItemRelation(selectedRow);
		} else {
			setSelectedMoldItemRelation(null);
		}
	}, [selectedRows, data]);

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={
					isEditMode
						? '금형 아이템 관계 수정'
						: '금형 아이템 관계 등록'
				}
				content={
					<MoldItemRelationRegisterPage
						onClose={() => setOpenModal(false)}
						selectedItemRelation={
							isEditMode ? selectedMoldItemRelation : undefined
						}
						isEditMode={isEditMode}
						onSuccess={() => {
							console.log(
								'Cache invalidation will automatically refresh the list'
							);
							// Cache invalidation in the hooks will automatically refresh the list
						}}
					/>
				}
			/>

			<HardDeleteConfirmDialog
				isOpen={showHardDeleteDialog}
				onOpenChange={setShowHardDeleteDialog}
				onConfirm={confirmHardDelete}
				isDeleting={removeMoldItemRelation.isPending}
				itemIdentifier={
					selectedMoldItemRelation
						? (() => {
								const itemName =
									selectedMoldItemRelation.itemName;
								const itemNumber =
									selectedMoldItemRelation.itemNumber;
								const id = selectedMoldItemRelation.id;

								if (itemName && itemNumber) {
									return `${itemName} (${itemNumber})`;
								} else if (itemName) {
									return itemName;
								} else if (itemNumber) {
									return `품번: ${itemNumber}`;
								} else if (id) {
									return `ID: ${id}`;
								} else {
									return '선택된 항목';
								}
							})()
						: '알 수 없는 항목'
				}
				verificationPhrase="완전 삭제"
				itemName="금형 아이템 관계"
			/>

			<PageTemplate
				firstChildWidth="30%"
				className="border rounded-lg h-full"
			>
				<DatatableComponent
					table={table}
					columns={moldItemRelationColumns} // schema에서 import한 컬럼 사용
					data={data}
					tableTitle={tCommon('pages.mold.itemRelation.list')}
					rowCount={totalElements}
					useSearch={true}
					selectedRows={selectedRows}
					enableSingleSelect={true}
					toggleRowSelection={toggleRowSelection}
					searchSlot={
						<SearchSlotComponent
							onSearch={handleSearch}
							fields={moldItemRelationSearchFields}
							useQuickSearch={true}
							quickSearchField={moldItemRelationQuickSearchFields}
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

export default MoldItemRelationListPage;
