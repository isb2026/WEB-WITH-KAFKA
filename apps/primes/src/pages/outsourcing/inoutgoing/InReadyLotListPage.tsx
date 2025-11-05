import React, { useState, useCallback, useEffect, useRef } from 'react';
import { DatatableComponent } from '@primes/components/datatable/DatatableComponent';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { PageTemplate } from '@primes/templates/PageTemplate';
import { useTranslation } from '@repo/i18n';
import { useDataTable } from '@repo/radix-ui/hook';
import { Plus } from 'lucide-react';
import { DraggableDialog } from '@repo/radix-ui/components';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { toast } from 'sonner';
import { ItemSelectComponent } from '@primes/components/customSelect/ItemSelectComponent';
import { VendorSelectComponent } from '@primes/components/customSelect/VendorSelectComponent';
import { CodeSelectComponent } from '@primes/components/customSelect/CodeSelectComponent';
import {
	InReadyLot,
	InReadyLotListColumns,
	InReadyLotSearchFields
} from '@primes/schemas/outsourcing/inReadyLotSchema';

// Mock 데이터 (실제 API 연동 전까지 사용)
const mockInReadyLots: InReadyLot[] = [
	{
		id: 1,
		outgoingCode: 'OUT-2025-001',
		lotNo: 'LOT-2024-098',
		itemName: '브라켓 A',
		itemNumber: 'ITEM-001',
		itemSpec: '5*10mm',
		quantity: 100,
		vendorName: '(주)정밀가공',
		progressName: '정밀가공',
		outDate: new Date('2025-01-10'),
		expectedInDate: new Date('2025-01-15'),
		actualCompletionDate: new Date('2025-01-14'),
		status: 'completed',
		qualityStatus: 'pending',
	},
	{
		id: 2,
		outgoingCode: 'OUT-2025-004',
		lotNo: 'LOT-2025-001',
		itemName: '하우징 D',
		itemNumber: 'ITEM-004',
		itemSpec: '10*20mm',
		quantity: 75,
		vendorName: '대한용접',
		progressName: '용접',
		outDate: new Date('2025-01-12'),
		expectedInDate: new Date('2025-01-17'),
		actualCompletionDate: new Date('2025-01-16'),
		status: 'quality_check',
		qualityStatus: 'pass',
	},
	{
		id: 3,
		outgoingCode: 'OUT-2025-002',
		lotNo: 'LOT-2024-099',
		itemName: '샤프트 B',
		itemNumber: 'ITEM-002',
		itemSpec: '3*3mm',
		quantity: 150,
		vendorName: '코팅마스터',
		progressName: '밀링',
		outDate: new Date('2025-01-13'),
		expectedInDate: new Date('2025-01-16'),
		status: 'processing',
	},
];

const PAGE_SIZE = 30;

export const InReadyLotListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');

	const [page, setPage] = useState(0);
	const [searchParams, setSearchParams] = useState({});
	const [openRegisterModal, setOpenRegisterModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [selectedInReadyLotData, setSelectedInReadyLotData] = useState<InReadyLot | null>(null);
	const pageRef = useRef<HTMLDivElement>(null);

	const columns = InReadyLotListColumns();
	const searchFields = InReadyLotSearchFields();

	const onPageChange = useCallback((pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	}, []);

	const handleSearch = useCallback((filters: any) => {
		setSearchParams(filters);
		setPage(0);
	}, []);

	const mockData = {
		content: mockInReadyLots,
		totalElements: mockInReadyLots.length,
		totalPages: Math.ceil(mockInReadyLots.length / PAGE_SIZE),
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
			setSelectedInReadyLotData(selectedData);
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
			setSelectedInReadyLotData(selectedData);
			setShowDeleteDialog(true);
		}
	};

	const confirmDelete = () => {
		if (!selectedInReadyLotData) return;

		// 성공 처리
		setShowDeleteDialog(false);
		setSelectedInReadyLotData(null);
		toast.success('삭제가 정상적으로 완료되었습니다.');
	};

	const handleRegisterSuccess = () => {
		setOpenRegisterModal(false);
		toast.success('입고 등록이 완료되었습니다.');
	};

	// 입고 등록 폼 필드 (mockInReadyLots 컬럼과 동일하게 구성)
	const registerFormFields = [
		{
			name: 'outgoingCode',
			label: t('columns.outgoingCode'),
			type: 'text',
			required: true,
			placeholder: t('columns.outgoingCode') + '을(를) 입력하세요',
		},
		{
			name: 'lotNo',
			label: 'LOT번호',
			type: 'text',
			required: true,
			placeholder: 'LOT번호를 입력하세요',
		},
		{
			name: 'itemName',
			label: '제품명',
			type: 'itemSelect',
			required: true,
			placeholder: '제품을 선택하세요',
		},
		{
			name: 'quantity',
			label: '수량',
			type: 'number',
			required: true,
			placeholder: '수량을 입력하세요',
		},
		{
			name: 'vendorName',
			label: '협력업체',
			type: 'vendorSelect',
			required: true,
			placeholder: '협력업체를 선택하세요',
		},
		{
			name: 'progressName',
			label: '공정명',
			type: 'codeSelect',
			required: true,
			placeholder: '공정을 선택하세요',
			fieldKey: 'PRD-002',
		},
		{
			name: 'outDate',
			label: '출고일',
			type: 'date',
			required: true,
		},
		{
			name: 'expectedInDate',
			label: '예상입고일',
			type: 'date',
			required: true,
		},
		{
			name: 'actualCompletionDate',
			label: t('columns.completeDate'),
			type: 'date',
			required: false,
		},
		{
			name: 'status',
			label: '상태',
			type: 'select',
			required: true,
			options: [
				{ label: '완료', value: 'completed' },
				{ label: '품질검사', value: 'quality_check' },
				{ label: '가공중', value: 'processing' },
			],
		},
		{
			name: 'qualityStatus',
			label: '품질상태',
			type: 'select',
			required: false,
			options: [
				{ label: '합격', value: 'pass' },
				{ label: '검사중', value: 'pending' },
				{ label: '불합격', value: 'fail' },
			],
		},
	];

	return (
		<div ref={pageRef} data-ready-page>
			{/* 등록 모달 */}
			<DraggableDialog
				open={openRegisterModal}
				onOpenChange={setOpenRegisterModal}
				title="입고 등록"
				content={
					<div className="max-w-full mx-auto">
						<DynamicForm
							fields={registerFormFields}
							onSubmit={(data: Record<string, unknown>) => {
								handleRegisterSuccess();
							}}
							visibleSaveButton={true}
							submitButtonText={"저장"}
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
				title="입고 정보 수정"
				content={
					<div className="max-w-full mx-auto">
						<DynamicForm
							fields={registerFormFields}
							initialData={selectedInReadyLotData ? selectedInReadyLotData as unknown as Record<string, unknown> : undefined}
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
				description={`선택한 LOT "${selectedInReadyLotData?.lotNo || '항목'}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
			/>

			<PageTemplate>
				<DatatableComponent
					table={table}
					columns={columns}
					data={mockData.content}
					tableTitle={tCommon('tabs.labels.outsourcingInReadyLot')}
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