import React, { useState, useCallback } from 'react';
import { DatatableComponent } from '@primes/components/datatable/DatatableComponent';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { PageTemplate } from '@primes/templates/PageTemplate';
import { useTranslation } from '@repo/i18n';
import { useDataTable } from '@repo/radix-ui/hook';
import { 
	OutsourcingProcess, 
	OutsourcingProcessListColumns, 
	OutsourcingProcessSearchFields 
} from '@primes/schemas/outsourcing/processListSchema';
import { DraggableDialog } from '@radix-ui/components/DraggableDialog';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { OutsourcingProcessRegisterPage } from './OutsourcingProcessRegisterPage';
import { toast } from 'sonner';

// Mock 데이터
const mockProcesses: OutsourcingProcess[] = [
	{
		id: 1,
		itemId: 1001,
		itemName: '브라켓 A',
		itemNumber: 'ITEM-001',
		itemSpec: '5*10mm',
		processName: '정밀가공',
		vendorId: 1,
		vendorName: '(주)만도',
		unitPrice: 15000,
		leadTime: 3,
		minOrderQty: 20,
		memo: '브라켓 A 정밀가공',
		isActive: true,
	},
	{
		id: 2,
		itemId: 1002,
		itemName: '플레이트 B',
		itemNumber: 'ITEM-002',
		itemSpec: '10*20mm',
		processName: '용접',
		vendorId: 2,
		vendorName: '세아특수강',
		unitPrice: 25000,
		leadTime: 5,
		minOrderQty: 30,
		memo: '플레이트 B 용접',
		isActive: true,
	},
	{
		id: 3,
		itemId: 1001,
		itemName: '브라켓 A',
		itemNumber: 'ITEM-001',
		itemSpec: '3*3mm',
		processName: '표면처리',
		vendorId: 3,
		vendorName: '대호정밀',
		unitPrice: 8000,
		leadTime: 2,
		minOrderQty: 10,
		memo: '브라켓 A 표면처리',
		isActive: false,
	},
];

const PAGE_SIZE = 30;

export const OutsourcingProcessListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	
	const [page, setPage] = useState(0);
	const [searchParams, setSearchParams] = useState({});

	// 컬럼과 검색 필드 정의
	const columns = OutsourcingProcessListColumns();
	const searchFields = OutsourcingProcessSearchFields();
	const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [selectedOutsourcingProcessData, setSelectedOutsourcingProcessData] =
		useState<OutsourcingProcess | null>(null);

	// 페이지 변경 핸들러
	const onPageChange = useCallback((pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	}, []);

	// 검색 핸들러
	const handleSearch = useCallback((filters: any) => {
		setSearchParams(filters);
		setPage(0); // 검색 시 첫 페이지로 이동
	}, []);

	// TODO: 실제 API 연동 시 사용할 데이터
	// const { list } = useOutsourcingProcess({
	//     searchRequest: searchParams,
	//     page,
	//     size: PAGE_SIZE,
	// });

	// Mock 데이터 (실제 API 연동 전까지 사용)
	const mockData = {
		content: mockProcesses,
		totalElements: mockProcesses.length,
		totalPages: Math.ceil(mockProcesses.length / PAGE_SIZE),
	};

	// 데이터 테이블 Hook
	const { table, selectedRows, toggleRowSelection } = useDataTable(
		mockData.content,
		columns,
		PAGE_SIZE,
		mockData.totalPages,
		page,
		mockData.totalElements,
		onPageChange
	);

	const handleCreate = () => {
		console.log('공정 등록');
		// TODO: Service 레이어에서 구현 예정
	};

	const handleEdit = () => {
		if (selectedRows.size === 0) {
			toast.warning('수정할 항목을 선택해주세요.');
			return;
		}
		
		const selectedIndex = Array.from(selectedRows)[0];
		const selectedData = mockData.content[Number(selectedIndex)];
		
		if (selectedData) {
			setSelectedOutsourcingProcessData(selectedData);
			setShowEditModal(true);
		}
	};

	const handleDelete = () => {
		if (selectedRows.size === 0) {
			toast.warning('삭제할 항목을 선택해주세요.');
			return;
		}
		
		const selectedIndex = Array.from(selectedRows)[0];
		const selectedData = mockData.content[Number(selectedIndex)];
		
		if (selectedData) {
			setSelectedOutsourcingProcessData(selectedData);
			setShowDeleteDialog(true);
		}
	};

	const confirmDelete = () => {
		if (!selectedOutsourcingProcessData) return;

		// 성공 처리
		setShowDeleteDialog(false);
		setSelectedOutsourcingProcessData(null);
		toast.success('삭제가 정상적으로 완료되었습니다.');
	};

	return (
		<>
			<PageTemplate>
				<DatatableComponent
					table={table}
					columns={columns}
					data={mockData.content}
					tableTitle={tCommon('tabs.labels.outsourcingProcessPrice')}
					rowCount={mockData.totalElements}
					useSearch={true}
					enableSingleSelect={true}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					classNames={{
						container: 'border rounded-lg',
					}}
					searchSlot={
						<SearchSlotComponent
							fields={searchFields}
							onSearch={handleSearch}
							endSlot={
								<ActionButtonsComponent
									useCreate={false}
									useEdit={true}
									useRemove={true}
									create={handleCreate}
									edit={handleEdit}
									remove={handleDelete}
									visibleText={false}
								/>
							}
						/>
					}
				/>
			</PageTemplate>

			<DraggableDialog
				open={showEditModal}
				onOpenChange={setShowEditModal}
				title={`${tCommon('tabs.titles.outsourcingProcessPrice')} ${tCommon('edit')}`}
				content={
					<OutsourcingProcessRegisterPage
						processData={selectedOutsourcingProcessData}
						isEditMode={true}
						onClose={() => setShowEditModal(false)}
						onSuccess={() => {
							setShowEditModal(false);
							toast.success('수정이 완료되었습니다.');
						}}
					/>
				}
			/>

			<DeleteConfirmDialog
				isOpen={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
				onConfirm={confirmDelete}
				isDeleting={false}
				title={tCommon('delete') || '삭제'}
				description={`선택한 제품 "${selectedOutsourcingProcessData?.itemName || '항목'}"의 단가을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
			/>
		</>
	);
};
