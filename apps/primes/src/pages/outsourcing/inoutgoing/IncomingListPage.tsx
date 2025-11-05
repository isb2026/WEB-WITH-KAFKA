import React, { useState, useCallback } from 'react';
import { DatatableComponent } from '@primes/components/datatable/DatatableComponent';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { PageTemplate } from '@primes/templates/PageTemplate';
import { useTranslation } from '@repo/i18n';
import { useDataTable } from '@repo/radix-ui/hook';
import { FileText, Download, Printer } from 'lucide-react';
import { toast } from 'sonner';
import {
	Incoming,
	IncomingListColumns,
	IncomingSearchFields
} from '@primes/schemas/outsourcing/incomingSchema';

// Mock 데이터 (실제 API 연동 전까지 사용)
const mockIncomings: Incoming[] = [
	{
		id: 1,
		incomingNumber: 'IN-2025-001',
		outgoingNumber: 'OUT-2025-001',
		lotNumber: 'LOT-2024-098',
		itemName: '브라켓 A',
		itemCode: 'ITEM-001',
		outQuantity: 100,
		inQuantity: 98,
		vendorName: '(주)정밀가공',
		processName: '정밀가공',
		outDate: new Date('2025-01-10'),
		inDate: new Date('2025-01-15'),
		unitPrice: 15000,
		totalAmount: 1470000,
		qualityStatus: 'pass',
		status: 'completed',
		incomingNote: 'IN-2025-001',
	},
	{
		id: 2,
		incomingNumber: 'IN-2025-002',
		outgoingNumber: 'OUT-2025-002',
		lotNumber: 'LOT-2024-099',
		itemName: '샤프트 B',
		itemCode: 'ITEM-002',
		outQuantity: 150,
		inQuantity: 150,
		vendorName: '코팅마스터',
		processName: '표면처리',
		outDate: new Date('2025-01-11'),
		inDate: new Date('2025-01-16'),
		unitPrice: 8000,
		totalAmount: 1200000,
		qualityStatus: 'pending',
		status: 'quality_check',
		incomingNote: 'IN-2025-002',
	},
	{
		id: 3,
		incomingNumber: 'IN-2025-003',
		outgoingNumber: 'OUT-2025-003',
		lotNumber: 'LOT-2024-100',
		itemName: '플레이트 C',
		itemCode: 'ITEM-003',
		outQuantity: 200,
		inQuantity: 195,
		vendorName: '대한용접',
		processName: '용접',
		outDate: new Date('2025-01-12'),
		inDate: new Date('2025-01-17'),
		unitPrice: 12000,
		totalAmount: 2340000,
		qualityStatus: 'fail',
		status: 'in',
		incomingNote: 'IN-2025-003',
	},
];

const PAGE_SIZE = 30;

export const IncomingListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');

	const [page, setPage] = useState(0);
	const [searchParams, setSearchParams] = useState({});
	const [openRegisterModal, setOpenRegisterModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [selectedIncomingData, setSelectedIncomingData] = useState<Incoming | null>(null);

	const columns = IncomingListColumns();
	const searchFields = IncomingSearchFields();

	const onPageChange = useCallback((pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	}, []);

	const handleSearch = useCallback((filters: any) => {
		setSearchParams(filters);
		setPage(0);
	}, []);

	const mockData = {
		content: mockIncomings,
		totalElements: mockIncomings.length,
		totalPages: Math.ceil(mockIncomings.length / PAGE_SIZE),
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

	const handleCreate = () => {
		setOpenRegisterModal(true);
	};

	const handleEdit = () => {
		if (selectedRows.size === 0) {
			toast.warning('수정할 항목을 선택해주세요.');
			return;
		}
		
		const selectedIndex = Array.from(selectedRows)[0];
		const selectedData = mockData.content[Number(selectedIndex)];
		
		if (selectedData) {
			setSelectedIncomingData(selectedData);
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
			setSelectedIncomingData(selectedData);
			setShowDeleteDialog(true);
		}
	};

	const confirmDelete = () => {
		if (!selectedIncomingData) return;

		// 성공 처리
		setShowDeleteDialog(false);
		setSelectedIncomingData(null);
		toast.success('삭제가 정상적으로 완료되었습니다.');
	};

	const handleRegisterSuccess = () => {
		setOpenRegisterModal(false);
		toast.success('입고 등록이 완료되었습니다.');
	};

	const handlePrintIncomingNote = () => {
		console.log('입고증 출력:', selectedRows);
		// TODO: Service 레이어에서 구현 예정
	};

	const handleExportReport = () => {
		console.log('입고 리포트 내보내기:', selectedRows);
		// TODO: Service 레이어에서 구현 예정
	};

	// 입고 등록 폼 필드 (mockIncomings 컬럼과 동일하게 구성)
	const registerFormFields = [
		{
			name: 'incomingCode',
			label: t('columns.incomingCode'),
			type: 'text',
			required: true,
			placeholder: '입고번호를 입력하세요',
		},
		{
			name: 'outgoingCode',
			label: t('columns.outgoingCode'),
			type: 'text',
			required: true,
			placeholder: '출고번호를 입력하세요',
		},
		{
			name: 'lotNumber',
			label: t('columns.lotNo'),
			type: 'text',
			required: true,
			placeholder: 'LOT번호를 입력하세요',
		},
		{
			name: 'itemName',
			label: t('columns.itemName'),
			type: 'itemSelect',
			required: true,
			placeholder: '제품을 선택하세요',
		},
		{
			name: 'outQuantity',
			label: t('columns.outQuantity'),
			type: 'number',
			required: true,
			placeholder: '출고수량을 입력하세요',
		},
		{
			name: 'inQuantity',
			label: t('columns.inQuantity'),
			type: 'number',
			required: true,
			placeholder: '입고수량을 입력하세요',
		},
		{
			name: 'vendorName',
			label: t('columns.vendorName'),
			type: 'vendorSelect',
			required: true,
			placeholder: '협력업체를 선택하세요',
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
			name: 'outDate',
			label: t('columns.outgoingDate'),
			type: 'date',
			required: true,
		},
		{
			name: 'inDate',
			label: t('columns.inDate'),
			type: 'date',
			required: true,
		},
		{
			name: 'unitPrice',
			label: t('columns.unitPrice'),
			type: 'number',
			required: true,
			placeholder: '단가를 입력하세요',
		},
		{
			name: 'totalAmount',
			label: t('columns.totalAmount'),
			type: 'number',
			required: false,
			placeholder: '총금액을 입력하세요',
			disabled: true,
		},
		{
			name: 'qualityStatus',
			label: t('columns.qualityStatus'),
			type: 'select',
			required: true,
			options: [
				{ label: '합격', value: 'pass' },
				{ label: '검사중', value: 'pending' },
				{ label: '불합격', value: 'fail' },
			],
		},
		{
			name: 'status',
			label: '상태',
			type: 'select',
			required: true,
			options: [
				{ label: '입고완료', value: 'completed' },
				{ label: '품질검사', value: 'quality_check' },
				{ label: '입고중', value: 'in' },
			],
		},
		{
			name: 'incomingNote',
			label: '입고메모',
			type: 'textarea',
			required: false,
			placeholder: '입고메모를 입력하세요',
			rows: 3,
		},
	];

	return (
		<PageTemplate>
			<DatatableComponent
				table={table}
				columns={columns}
				data={mockData.content}
				tableTitle={tCommon('tabs.labels.outsourcingIncoming')}
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
									useEdit={false}
									useRemove={false}
									visibleText={false}
								/>
								<button
									onClick={handlePrintIncomingNote}
									className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-50 hover:bg-Colors-Brand-100 text-Colors-Brand-700 border-Colors-Brand-200">
									<Printer size={16} />
										입고전표 출력
								</button>
							</div>
						}
					/>
				}
			/>
		</PageTemplate>
	);
};