import React, { useState, useCallback, useEffect, useRef } from 'react';
import { DatatableComponent } from '@primes/components/datatable/DatatableComponent';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { PageTemplate } from '@primes/templates/PageTemplate';
import { useTranslation } from '@repo/i18n';
import { useDataTable } from '@repo/radix-ui/hook';
import { DraggableDialog } from '@repo/radix-ui/components';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { toast } from 'sonner';
import { ItemSelectComponent } from '@primes/components/customSelect/ItemSelectComponent';
import { VendorSelectComponent } from '@primes/components/customSelect/VendorSelectComponent';
import { CodeSelectComponent } from '@primes/components/customSelect/CodeSelectComponent';
import {
	OutReadyLot,
	OutReadyLotListColumns,
	OutReadyLotSearchFields
} from '@primes/schemas/outsourcing/outReadyLotSchema';

// Mock 데이터 (실제 API 연동 전까지 사용)
const mockOutReadyLots: OutReadyLot[] = [
	{
		id: 1,
		lotNo: 'LOT-2025-001',
		itemId: 1001,
		itemName: '브라켓 A',
		itemNumber: 'ITEM-001',
		itemSpec: '5*10mm',
		quantity: 100,
		vendorId: 1,
		vendorName: '(주)만도',
		progressName: '가공',
		expectedOutDate: new Date('2025-01-15'),
		priority: 'high',
		status: 'ready',
	},
	{
		id: 2,
		lotNo: 'LOT-2025-002',
		itemId: 1002,
		itemName: '플레이트 B',
		itemNumber: 'ITEM-002',
		itemSpec: '10*20mm',
		quantity: 50,
		vendorId: 2,
		vendorName: '세아특수강',
		progressName: '용접',
		expectedOutDate: new Date('2025-01-16'),
		priority: 'medium',
		status: 'outgoing',
	},
	{
		id: 3,
		lotNo: 'LOT-2025-003',
		itemId: 1003,
		itemName: '커버 C',
		itemNumber: 'ITEM-003',
		itemSpec: '3*3mm',
		quantity: 200,
		vendorId: 3,
		vendorName: '대호정밀',
		progressName: '표면처리',
		expectedOutDate: new Date('2025-01-17'),
		priority: 'low',
		status: 'ready',
	},
];

const PAGE_SIZE = 30;

export const OutReadyLotListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');

	const [page, setPage] = useState(0);
	const [searchParams, setSearchParams] = useState({});
	const [openRegisterModal, setOpenRegisterModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [selectedOutReadyLotData, setSelectedOutReadyLotData] = useState<OutReadyLot | null>(null);
	const pageRef = useRef<HTMLDivElement>(null);

	const columns = OutReadyLotListColumns();
	const searchFields = OutReadyLotSearchFields();

	const onPageChange = useCallback((pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	}, []);

	const handleSearch = useCallback((filters: any) => {
		setSearchParams(filters);
		setPage(0);
	}, []);

	const mockData = {
		content: mockOutReadyLots,
		totalElements: mockOutReadyLots.length,
		totalPages: Math.ceil(mockOutReadyLots.length / PAGE_SIZE),
	};

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		mockData.content,
		columns,
		PAGE_SIZE,
		mockData.totalPages,
		page,
		mockData.totalElements,
		onPageChange
	);

	const handleEdit = () => {
		if (selectedRows.size === 0) {
			toast.warning('수정할 항목을 선택해주세요.');
			return;
		}
		
		const selectedIndex = Array.from(selectedRows)[0];
		const selectedData = mockData.content[Number(selectedIndex)];
		
		if (selectedData) {
			setSelectedOutReadyLotData(selectedData);
			setShowEditModal(true);
		}
	};

	const handleCreate = () => {
		setOpenRegisterModal(true);
	};

	// 탭의 등록 버튼과 연동하기 위한 이벤트 리스너
	useEffect(() => {
		const handleOpenRegisterModal = () => {
			setOpenRegisterModal(true);
		};

		const element = pageRef.current;
		if (element) {
			element.addEventListener('openRegisterModal', handleOpenRegisterModal);
			return () => {
				element.removeEventListener('openRegisterModal', handleOpenRegisterModal);
			};
		}
		return undefined;
	}, []);

	const handleDelete = () => {
		if (selectedRows.size === 0) {
			toast.warning('삭제할 항목을 선택해주세요.');
			return;
		}
		
		const selectedIndex = Array.from(selectedRows)[0];
		const selectedData = mockData.content[Number(selectedIndex)];
		
		if (selectedData) {
			setSelectedOutReadyLotData(selectedData);
			setShowDeleteDialog(true);
		}
	};

	const confirmDelete = () => {
		if (!selectedOutReadyLotData) return;

		// 성공 처리
		setShowDeleteDialog(false);
		setSelectedOutReadyLotData(null);
		toast.success('삭제가 정상적으로 완료되었습니다.');
	};

	const handleRegisterSuccess = () => {
		setOpenRegisterModal(false);
	};

	// 출고 등록 폼 필드 (mockOutReadyLots 컬럼과 동일하게 구성)
	const registerFormFields = [
		{
			name: 'lotNo',
			label: t('columns.lotNo'),
			type: 'text',
			required: true,
			placeholder: 'LOT번호를 입력하세요',
		},
		{
			name: 'itemId',
			label: t('columns.itemName'),
			type: 'itemSelect',
			required: true,
			placeholder: '제품을 선택하세요',
		},
		{
			name: 'progressName',
			label: t('columns.progressName'),
			type: 'codeSelect',
			required: true,
			placeholder: '공정을 선택하세요',
			fieldKey: 'PRD-002',
		},
		{
			name: 'vendorId',
			label: t('columns.vendorName'),
			type: 'vendorSelect',
			required: true,
			placeholder: '협력업체를 선택하세요',
		},
		{
			name: 'quantity',
			label: t('columns.quantity'),
			type: 'number',
			required: true,
			placeholder: '출고수량을 입력하세요',
		},
		{
			name: 'expectedOutDate',
			label: t('columns.expectedOutDate'),
			type: 'date',
			required: true,
		},
		{
			name: 'priority',
			label: t('columns.priority'),
			type: 'select',
			required: true,
			options: [
				{ label: '높음', value: 'high' },
				{ label: '보통', value: 'medium' },
				{ label: '낮음', value: 'low' },
			],
		},
		{
			name: 'status',
			label: t('columns.status'),
			type: 'select',
			required: true,
			options: [
				{ label: '출고준비', value: 'ready' },
				{ label: '출고중', value: 'outgoing' },
				{ label: '출고완료', value: 'completed' },
			],
		},
	];

	return (
		<div ref={pageRef} data-ready-page>
			{/* 등록 모달 */}
			<DraggableDialog
				open={openRegisterModal}
				onOpenChange={setOpenRegisterModal}
				title={tCommon('tabs.labels.outsourcingOutReadyLot')}
				content={
					<div className="max-w-full mx-auto">
						<DynamicForm
							fields={registerFormFields}
							onSubmit={(data: Record<string, unknown>) => {
								handleRegisterSuccess();
							}}
							visibleSaveButton={true}
							submitButtonText="저장"
							otherTypeElements={{
								itemSelect: (props: any) => (
									<ItemSelectComponent
										{...props}
										displayFields={['itemName', 'itemNumber']}
										displayTemplate='{itemName} [{itemNumber}]'
										placeholder="제품을 선택하세요"
										onItemDataChange={(itemData) => {
											props.onChange(itemData?.itemId?.toString() || '');
										}}
									/>
								),
								vendorSelect: (props: any) => (
									<VendorSelectComponent
										{...props}
										placeholder="협력업체를 선택하세요"
									/>
								),
								codeSelect: (props: any) => (
									<CodeSelectComponent
										{...props}
										placeholder="공정을 선택하세요"
										fieldKey="PRD-002"
										valueKey="codeValue"
										labelKey="codeName"
									/>
								),
							}}
						/>
					</div>
				}
			/>

			{/* 수정 모달 */}
			<DraggableDialog
				open={showEditModal}
				onOpenChange={setShowEditModal}
				title="출고 정보 수정"
				content={
					<div className="max-w-full mx-auto">
						<DynamicForm
							fields={registerFormFields}
							initialData={selectedOutReadyLotData ? selectedOutReadyLotData as unknown as Record<string, unknown> : undefined}
							onSubmit={(data: Record<string, unknown>) => {
								setShowEditModal(false);
								toast.success('수정이 완료되었습니다.');
							}}
							visibleSaveButton={true}
							submitButtonText="저장"
							otherTypeElements={{
								itemSelect: (props: any) => (
									<ItemSelectComponent
										{...props}
										displayFields={['itemName', 'itemNumber']}
										displayTemplate='{itemName} [{itemNumber}]'
										placeholder="제품을 선택하세요"
										onItemDataChange={(itemData) => {
											props.onChange(itemData?.itemId?.toString() || '');
										}}
									/>
								),
								vendorSelect: (props: any) => (
									<VendorSelectComponent
										{...props}
										placeholder="협력업체를 선택하세요"
									/>
								),
								codeSelect: (props: any) => (
									<CodeSelectComponent
										{...props}
										placeholder="공정을 선택하세요"
										fieldKey="PRD-002"
										valueKey="codeValue"
										labelKey="codeName"
									/>
								),
							}}
						/>
					</div>
				}
			/>

			{/* 삭제 확인 다이얼로그 */}
			<DeleteConfirmDialog
				isOpen={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
				onConfirm={confirmDelete}
				isDeleting={false}
				title={tCommon('delete') || '삭제'}
				description={`선택한 LOT "${selectedOutReadyLotData?.lotNo || '항목'}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
			/>

			<PageTemplate>
				<DatatableComponent
					table={table}
					columns={columns}
					data={mockData.content}
					tableTitle={tCommon('tabs.labels.outsourcingOutReadyLot')}
					rowCount={mockData.totalElements}
					useSearch={true}
					enableSingleSelect={true}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					classNames={{ container: 'border rounded-lg' }}
					searchSlot={
						<SearchSlotComponent
							fields={searchFields}
							onSearch={handleSearch}
						endSlot={
							<div className="flex gap-2">
								<ActionButtonsComponent
									useCreate={false}
									useEdit={true}
									useRemove={true}
									create={handleCreate}
									edit={handleEdit}
									remove={handleDelete}
									visibleText={false}
								/>
							</div>
						}
						/>
					}
				/>
			</PageTemplate>
		</div>
	);
};
