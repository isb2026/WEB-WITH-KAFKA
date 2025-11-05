import React, { useState, useCallback } from 'react';
import { DatatableComponent } from '@primes/components/datatable/DatatableComponent';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { PageTemplate } from '@primes/templates/PageTemplate';
import { useTranslation } from '@repo/i18n';
import { useDataTable } from '@repo/radix-ui/hook';
import { FileText, Printer } from 'lucide-react';
import {
	Outgoing,
	OutgoingListColumns,
	OutgoingSearchFields
} from '@primes/schemas/outsourcing/outgoingSchema';

// Mock 데이터 (실제 API 연동 전까지 사용)
const mockOutgoings: Outgoing[] = [
	{
		id: 1,
		outgoingNumber: 'OUT-2025-001',
		lotNumber: 'LOT-2024-098',
		itemName: '브라켓 A',
		itemNumber: 'ITEM-001',
		itemSpec: '5*10mm',
		quantity: 100,
		vendorName: '(주)정밀가공',
		processName: '정밀가공',
		outDate: new Date('2025-01-10'),
		expectedReturnDate: new Date('2025-01-15'),
		unitPrice: 15000,
		totalAmount: 1500000,
		status: 'out',
		deliveryNote: 'DN-2025-001',
	},
	{
		id: 2,
		outgoingNumber: 'OUT-2025-002',
		lotNumber: 'LOT-2024-099',
		itemName: '샤프트 B',
		itemNumber: 'ITEM-002',
		itemSpec: '10*20mm',
		quantity: 150,
		vendorName: '코팅마스터',
		processName: '표면처리',
		outDate: new Date('2025-01-11'),
		expectedReturnDate: new Date('2025-01-16'),
		unitPrice: 8000,
		totalAmount: 1200000,
		status: 'processing',
		deliveryNote: 'DN-2025-002',
	},
	{
		id: 3,
		outgoingNumber: 'OUT-2025-003',
		lotNumber: 'LOT-2024-100',
		itemName: '플레이트 C',
		itemNumber: 'ITEM-003',
		itemSpec: '3*3mm',
		quantity: 200,
		vendorName: '대한용접',
		processName: '용접',
		outDate: new Date('2025-01-12'),
		expectedReturnDate: new Date('2025-01-17'),
		unitPrice: 12000,
		totalAmount: 2400000,
		status: 'completed',
		deliveryNote: 'DN-2025-003',
	},
];

const PAGE_SIZE = 30;

export const OutgoingListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');

	const [page, setPage] = useState(0);
	const [searchParams, setSearchParams] = useState({});

	const columns = OutgoingListColumns();
	const searchFields = OutgoingSearchFields();

	const onPageChange = useCallback((pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	}, []);

	const handleSearch = useCallback((filters: any) => {
		setSearchParams(filters);
		setPage(0);
	}, []);

	const mockData = {
		content: mockOutgoings,
		totalElements: mockOutgoings.length,
		totalPages: Math.ceil(mockOutgoings.length / PAGE_SIZE),
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
		console.log('출고 등록');
		// TODO: Service 레이어에서 구현 예정
	};

	const handleEdit = () => {
		console.log('선택된 출고 정보 수정:', selectedRows);
		// TODO: Service 레이어에서 구현 예정
	};

	const handleDelete = () => {
		console.log('선택된 출고 삭제:', selectedRows);
		// TODO: Service 레이어에서 구현 예정
	};

	const handlePrintDeliveryNote = () => {
		console.log('출고증 출력:', selectedRows);
		// TODO: Service 레이어에서 구현 예정
	};

	return (
		<PageTemplate>
			<DatatableComponent
				table={table}
				columns={columns}
				data={mockData.content}
				tableTitle={tCommon('tabs.labels.outsourcingOutgoing')}
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
									create={handleCreate}
									edit={handleEdit}
									remove={handleDelete}
									visibleText={false}
								/>
								<button
									onClick={handlePrintDeliveryNote}
									className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-50 hover:bg-Colors-Brand-100 text-Colors-Brand-700 border-Colors-Brand-200">
									<Printer size={16} />
									출고전표 출력
								</button>
							</div>
						}
					/>
				}
			/>
		</PageTemplate>
	);
};