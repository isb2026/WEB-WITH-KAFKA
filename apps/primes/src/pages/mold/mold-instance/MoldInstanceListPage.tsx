import { useState, useEffect, useCallback } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useMoldInstance } from '@primes/hooks/mold/mold-instance/useMoldInstance';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import { MoldInstanceDto, MoldInstanceSearchRequest } from '@primes/types/mold';
import { DraggableDialog } from '@repo/radix-ui/components';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { HardDeleteConfirmDialog } from '@primes/components/common/HardDeleteConfirmDialog';
import MoldInstanceRegisterPage from './MoldInstanceRegisterPage';
import { toast } from 'sonner';
import {
	moldInstanceSearchFields,
	moldInstanceColumns,
	moldInstanceQuickSearchFields,
} from '@primes/schemas/mold';

export const MoldInstanceListPage: React.FC = () => {
	const { t: tCommon } = useTranslation('common');
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<MoldInstanceDto[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [selectedMoldInstance, setSelectedMoldInstance] =
		useState<MoldInstanceDto | null>(null);
	const [isEditMode, setIsEditMode] = useState<boolean>(false);
	const [showHardDeleteDialog, setShowHardDeleteDialog] =
		useState<boolean>(false);
	const [searchRequest, setSearchRequest] =
		useState<MoldInstanceSearchRequest>({});

	const DEFAULT_PAGE_SIZE = 30;

	const onPageChange = useCallback((pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	}, []);

	const handleSearch = useCallback((filters: MoldInstanceSearchRequest) => {
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
			const newRequest: MoldInstanceSearchRequest = {};
			// 모든 필드를 비활성화하고 선택된 필드만 활성화
			Object.keys(prev).forEach((fieldKey) => {
				if (fieldKey === key) {
					const value =
						prev[fieldKey as keyof MoldInstanceSearchRequest];
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
		list: { data: apiData, isLoading, error },
		removeMoldInstance,
	} = useMoldInstance({
		searchRequest,
		page: page,
		size: DEFAULT_PAGE_SIZE,
	});

	useEffect(() => {
		if (apiData?.data) {
			// Spring Boot Pageable 응답 처리
			setData(apiData.data.content || []);
			setTotalElements(apiData.data.totalElements || 0);
			setPageCount(apiData.data.totalPages || 0);
		}
	}, [apiData]);

	// 에러 처리
	useEffect(() => {
		if (error) {
			console.error('MoldInstance 목록 조회 오류:', error);
			toast.error('데이터를 불러오는 중 오류가 발생했습니다.');
		}
	}, [error]);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		moldInstanceColumns(), // schema에서 import한 컬럼 사용
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	// Handler functions
	const handleRegister = () => {
		setIsEditMode(false);
		setSelectedMoldInstance(null);
		setOpenModal(true);
	};

	const handleEdit = () => {
		if (selectedMoldInstance) {
			setIsEditMode(true);
			setOpenModal(true);
		} else {
			toast.error('수정하실 실금형을 선택해주세요.');
		}
	};

	const handleRemove = () => {
		if (selectedMoldInstance) {
			setShowHardDeleteDialog(true);
		} else {
			toast.error('삭제하실 실금형을 선택해주세요.');
		}
	};

	const confirmHardDelete = () => {
		if (selectedMoldInstance) {
			removeMoldInstance.mutate([selectedMoldInstance.id], {
				onSuccess: () => {
					setShowHardDeleteDialog(false);
					setSelectedMoldInstance(null);
					// Clear selection by finding the selected row and toggling it off
					if (selectedRows.size > 0) {
						const selectedRowId = Array.from(selectedRows)[0];
						toggleRowSelection(selectedRowId);
					}
				},
				onError: (error) => {
					setShowHardDeleteDialog(false);
				},
			});
		}
	};

	// Track selected row
	useEffect(() => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const selectedRow: MoldInstanceDto = data[rowIndex];
			setSelectedMoldInstance(selectedRow);
		} else {
			setSelectedMoldInstance(null);
		}
	}, [selectedRows, data]);

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={isEditMode ? '실금형 수정' : '실금형 등록'}
				content={
					<MoldInstanceRegisterPage
						onClose={() => setOpenModal(false)}
						selectedInstance={
							isEditMode ? selectedMoldInstance : undefined
						}
						isEditMode={isEditMode}
					/>
				}
			/>

			<HardDeleteConfirmDialog
				isOpen={showHardDeleteDialog}
				onOpenChange={setShowHardDeleteDialog}
				onConfirm={confirmHardDelete}
				isDeleting={removeMoldInstance.isPending}
				itemIdentifier={selectedMoldInstance?.moldInstanceCode || ''}
				verificationPhrase="완전 삭제"
				itemName="실금형"
			/>

			<PageTemplate
				firstChildWidth="30%"
				className="border rounded-lg h-full"
			>
				<DatatableComponent
					table={table}
					columns={moldInstanceColumns()} // schema에서 import한 컬럼 사용
					data={data}
					tableTitle={tCommon('pages.mold.instance.list')}
					rowCount={totalElements}
					useSearch={true}
					selectedRows={selectedRows}
					enableSingleSelect={true}
					toggleRowSelection={toggleRowSelection}

					searchSlot={
						<SearchSlotComponent
							onSearch={handleSearch}
							fields={moldInstanceSearchFields()}
							useQuickSearch={true}
							quickSearchField={moldInstanceQuickSearchFields()}
							onQuickSearch={handleQuickSearch}
							toggleQuickSearchEl={handleToggleQuickSearchField}
							endSlot={
								<ActionButtonsComponent
									useCreate={false}
									useEdit={false}
									useRemove={false}
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

export default MoldInstanceListPage;
