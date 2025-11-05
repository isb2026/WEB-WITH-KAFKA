import { useState, useEffect, useRef, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { usePlan } from '@primes/hooks/production';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { PlanMaster } from '@primes/types/production';
import { usePlanColumns, planSearchFields } from '@primes/schemas/production';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { DraggableDialog } from '@repo/radix-ui/components';
import { ProductionPlanRegisterPage } from './ProductionPlanRegisterPage';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { toast } from 'sonner';
import { useTranslation } from '@repo/i18n';
import { PrimesDatePickerDemo } from '@primes/components/common/PrimesDatePickerDemo';

export const ProductionPlanListPage: React.FC = () => {
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<PlanMaster[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [selectedPlanData, setSelectedPlanData] = useState<PlanMaster | null>(
		null
	);
	const { t: tCommon } = useTranslation('common');
	const DEFAULT_PAGE_SIZE = 30;
	const columns = usePlanColumns();
	const searchFields = planSearchFields();

	const { list: apiData } = usePlan({
		page: page,
		size: DEFAULT_PAGE_SIZE,
	});

	const remove = usePlan().remove;
	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	const handleEdit = () => {
		if (!selectedPlanData) {
			toast.warning('생산 계획을 선택해주세요.');
			return;
		}

		setShowEditModal(true);
	};

	const handleRemove = () => {
		if (!selectedPlanData) {
			toast.warning('삭제할 생산 계획을 선택해주세요.');
			return;
		}
		setShowDeleteDialog(true);
	};

	const confirmDelete = () => {
		if (!selectedPlanData) return;

		remove.mutate([selectedPlanData.id], {
			onSuccess: () => {
				setShowDeleteDialog(false);
				setSelectedPlanData(null);
				// selectedRows 초기화는 React Query 재조회 후 자동으로 처리됨
			},
			onError: (error) => {
				console.error('삭제 실패:', error);
				setShowDeleteDialog(false);
				toast.error('삭제 중 오류가 발생했습니다.');
			},
		});
	};

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		columns,
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	// selectedRows 변경 감지하여 선택된 데이터 저장
	useEffect(() => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const selectedPlan: PlanMaster = data[rowIndex];

			setSelectedPlanData(selectedPlan || null);
		} else {
			setSelectedPlanData(null);
		}
	}, [selectedRows, data]);

	useEffect(() => {
		const response = apiData.data;

		if (response?.content) {
			// 페이지네이션 응답 처리
			setData(response.content);
			setTotalElements(response.totalElements || 0);
			setPageCount(response.totalPages || 0);
		} else if (Array.isArray(apiData.data)) {
			// 배열 형태의 응답 처리
			setData(apiData.data);
			setTotalElements(apiData.data.length);
			setPageCount(Math.ceil(apiData.data.length / DEFAULT_PAGE_SIZE));
		}
	}, [apiData.data]);

	return (
		<>
			<PageTemplate firstChildWidth="30%" className="border rounded-lg">
				<DatatableComponent
					table={table}
					columns={columns}
					data={data}
					tableTitle={tCommon('pages.productionPlan.list')}
					rowCount={totalElements}
					useSearch={true}
					enableSingleSelect={true}
					usePageNation={true}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					searchSlot={
						<SearchSlotComponent
							fields={searchFields}
							endSlot={
								<div className="flex items-center gap-2">
									<ActionButtonsComponent
										useRemove={true}
										useEdit={true}
										edit={handleEdit}
										remove={handleRemove}
									/>
								</div>
							}
						/>
					}
				/>
			</PageTemplate>

			{/* 편집 다이얼로그 */}
			<DraggableDialog
				open={showEditModal}
				onOpenChange={setShowEditModal}
				title={`${tCommon('tabs.titles.productionPlan')} ${tCommon('edit')}`}
				content={
					<ProductionPlanRegisterPage
						mode="edit"
						data={selectedPlanData || undefined}
						onClose={() => setShowEditModal(false)}
					/>
				}
			/>

			{/* 삭제 확인 다이얼로그 */}
			<DeleteConfirmDialog
				isOpen={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
				onConfirm={confirmDelete}
				isDeleting={remove.isPending}
				title={tCommon('delete') || '삭제'}
				description={`선택한 생산 계획 "${selectedPlanData?.planCode || '항목'}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
			/>
		</>
	);
};

export default ProductionPlanListPage;
