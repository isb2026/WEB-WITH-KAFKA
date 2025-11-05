import { useState, useEffect, useCallback } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useMoldInstance } from '@primes/hooks';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import {
	MoldInstanceDto,
	MoldInstanceSearchRequest,
} from '@primes/types/mold';
import { DraggableDialog } from '@repo/radix-ui/components';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { HardDeleteConfirmDialog } from '@primes/components/common/HardDeleteConfirmDialog';
import MoldInoutInformationRegisterPage from './MoldInoutInformationRegisterPage';
import { toast } from 'sonner';
import {
	moldInstanceSearchFields,
	moldInstanceColumns,
	moldInstanceQuickSearchFields,
} from '@primes/schemas/mold';

export const MoldInoutInformationListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
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
		useState<MoldInstanceSearchRequest>({ isInput: true });

	const DEFAULT_PAGE_SIZE = 30;

	const onPageChange = useCallback((pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	}, []);

	const handleSearch = useCallback(
		(filters: MoldInstanceSearchRequest) => {
			setSearchRequest({ ...filters, isInput: true });
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
			const newRequest: MoldInstanceSearchRequest = { isInput: true };
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
		list: { data: apiData, isLoading, error, refetch },
		removeMoldInstance,
	} = useMoldInstance({
		searchRequest,
		page: page,
		size: DEFAULT_PAGE_SIZE,
	});

	useEffect(() => {
		if (apiData?.data) {
			if (Array.isArray(apiData.data)) {
				setData(apiData.data);
				setTotalElements(apiData.data.length);
				setPageCount(Math.ceil(apiData.data.length / DEFAULT_PAGE_SIZE));
			} else if (apiData.data.content && Array.isArray(apiData.data.content)) {
				setData(apiData.data.content);
				setTotalElements(apiData.data.totalElements || 0);
				setPageCount(apiData.data.totalPages || 0);
			} else {
				setData([]);
				setTotalElements(0);
				setPageCount(0);
			}
		} else {
			setData([]);
			setTotalElements(0);
			setPageCount(0);
		}
	}, [apiData]);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		moldInstanceColumns(),
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
			toast.error('수정하실 금형 인스턴스를 선택해주세요.');
		}
	};

	const handleRemove = () => {
		if (selectedMoldInstance) {
			setShowHardDeleteDialog(true);
		} else {
			toast.error('삭제하실 금형 인스턴스를 선택해주세요.');
		}
	};

	const confirmHardDelete = () => {
		if (selectedMoldInstance) {
			removeMoldInstance.mutate(
				[selectedMoldInstance.id],
				{
					onSuccess: () => {
						toast.success('완전 삭제가 완료되었습니다.');
						setShowHardDeleteDialog(false);
						setSelectedMoldInstance(null);
						// Auto-refresh the list after successful deletion
						refetch();
					},
					onError: (error) => {
						setShowHardDeleteDialog(false);
						toast.error('삭제 중 오류가 발생했습니다.');
					},
				}
			);
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
				title={
					isEditMode
						? '금형 입출고 정보 수정'
						: '금형 입출고 정보 등록'
				}
				content={
					<MoldInoutInformationRegisterPage
						onClose={() => setOpenModal(false)}
						selectedInoutInformation={
							isEditMode && selectedMoldInstance
								? selectedMoldInstance as any
								: undefined
						}
						isEditMode={isEditMode}
						onSuccess={() => {
							refetch();
						}}
					/>
				}
			/>

			<HardDeleteConfirmDialog
				isOpen={showHardDeleteDialog}
				onOpenChange={setShowHardDeleteDialog}
				onConfirm={confirmHardDelete}
				isDeleting={removeMoldInstance.isPending}
				itemIdentifier={
					selectedMoldInstance?.moldInstanceCode?.toString() || ''
				}
				verificationPhrase="완전 삭제"
				itemName="금형 인스턴스"
			/>

			<PageTemplate
				firstChildWidth="30%"
				className="border rounded-lg h-full"
			>
				<DatatableComponent
					table={table}
					columns={moldInstanceColumns()}
					data={data}
					tableTitle={tCommon('pages.mold.inout.list')}
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
							quickSearchField={
								moldInstanceQuickSearchFields()
							}
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

export default MoldInoutInformationListPage;
