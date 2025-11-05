import { useState, useEffect, useCallback } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useMoldGrade } from '@primes/hooks';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import { MoldGradeDto, MoldGradeSearchRequest } from '@primes/types/mold';
import { DraggableDialog } from '@repo/radix-ui/components';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { HardDeleteConfirmDialog } from '@primes/components/common/HardDeleteConfirmDialog';
import MoldGradeRegisterPage from './MoldGradeRegisterPage';
import { toast } from 'sonner';
import {
	moldGradeSearchFields,
	moldGradeColumns,
	moldGradeQuickSearchFields,
	useMoldGradeColumns,
} from '@primes/schemas/mold';

export const MoldGradeListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<MoldGradeDto[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [hardDeleteDialogOpen, setHardDeleteDialogOpen] =
		useState<boolean>(false);
	const [selectedMoldGrade, setSelectedMoldGrade] =
		useState<MoldGradeDto | null>(null);
	const [isEditMode, setIsEditMode] = useState<boolean>(false);
	const [searchRequest, setSearchRequest] = useState<MoldGradeSearchRequest>(
		{}
	);

	const DEFAULT_PAGE_SIZE = 30;

	// Get translated columns
	const moldGradeColumns = useMoldGradeColumns();

	const onPageChange = useCallback((pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	}, []);

	const handleSearch = useCallback((filters: MoldGradeSearchRequest) => {
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
			const newRequest: MoldGradeSearchRequest = {};
			// 모든 필드를 비활성화하고 선택된 필드만 활성화
			Object.keys(prev).forEach((fieldKey) => {
				if (fieldKey === key) {
					const value =
						prev[fieldKey as keyof MoldGradeSearchRequest];
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
		removeMoldGrade,
	} = useMoldGrade({
		searchRequest,
		page: page,
		size: DEFAULT_PAGE_SIZE,
	});

	useEffect(() => {
		if (apiData) {
			if (apiData.data && Array.isArray(apiData.data)) {
				// CommonResponseListMoldGradeDto 응답 처리
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
		moldGradeColumns, // translated columns 사용
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	// Handler functions
	const handleRegister = () => {
		setIsEditMode(false);
		setSelectedMoldGrade(null);
		setOpenModal(true);
	};

	const handleEdit = () => {
		if (selectedMoldGrade) {
			setIsEditMode(true);
			setOpenModal(true);
		} else {
			toast.error('수정하실 금형등급을 선택해주세요.');
		}
	};

	const handleRemove = () => {
		if (selectedMoldGrade) {
			setHardDeleteDialogOpen(true);
		} else {
			toast.error('삭제하실 금형등급을 선택해주세요.');
		}
	};

	const handleHardDeleteConfirm = () => {
		if (selectedMoldGrade) {
			removeMoldGrade.mutate([selectedMoldGrade.id], {
				onSuccess: () => {
					setHardDeleteDialogOpen(false);
					setSelectedMoldGrade(null);
				},
				onError: () => {
					setHardDeleteDialogOpen(false);
				},
			});
		}
	};

	// Track selected row
	useEffect(() => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const selectedRow: MoldGradeDto = data[rowIndex];
			setSelectedMoldGrade(selectedRow);
		} else {
			setSelectedMoldGrade(null);
		}
	}, [selectedRows, data]);

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={isEditMode ? '금형 등급 수정' : '금형 등급 등록'}
				content={
					<MoldGradeRegisterPage
						onClose={() => setOpenModal(false)}
						selectedGrade={
							isEditMode ? selectedMoldGrade : undefined
						}
						isEditMode={isEditMode}
					/>
				}
			/>

			<HardDeleteConfirmDialog
				isOpen={hardDeleteDialogOpen}
				onOpenChange={setHardDeleteDialogOpen}
				onConfirm={handleHardDeleteConfirm}
				isDeleting={removeMoldGrade.isPending}
				title="금형 등급 완전 삭제"
				description={`기초 데이터인 금형 등급을 완전히 삭제합니다. 이 작업은 되돌릴 수 없으며, 연관된 모든 데이터에 영향을 줄 수 있습니다.`}
				itemName="금형 등급 코드"
				itemIdentifier={selectedMoldGrade?.grade || ''}
				verificationPhrase="완전 삭제 확인"
				warningMessage="금형 등급은 기초 데이터입니다. 삭제 후 복구할 수 없으니 신중하게 결정해주세요."
			/>

			<PageTemplate
				firstChildWidth="30%"
				className="border rounded-lg h-full"
			>
				<DatatableComponent
					table={table}
					columns={moldGradeColumns} // translated columns 사용
					data={data}
					tableTitle={tCommon('pages.mold.grade.list')}
					rowCount={totalElements}
					useSearch={true}
					selectedRows={selectedRows}
					enableSingleSelect={true}
					toggleRowSelection={toggleRowSelection}
					searchSlot={
						<SearchSlotComponent
							onSearch={handleSearch}
							fields={moldGradeSearchFields}
							useQuickSearch={true}
							quickSearchField={moldGradeQuickSearchFields}
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

export default MoldGradeListPage;
