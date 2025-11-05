import { useState, useMemo, useEffect } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import { DraggableDialog } from '@repo/radix-ui/components';
import { PurchaseReturnsRegisterPage } from './PurchaseReturnsRegisterPage';
import { PurchaseReturnsEditPage } from './PurchaseReturnsEditPage';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { toast } from 'sonner';

// Mock data type - replace with actual type when API is available
interface PurchaseReturn {
	id: number;
	returnCode: string;
	purchaseOrderCode: string;
	vendorName: string;
	returnDate: string;
	returnReason: string;
	returnStatus: string;
	totalAmount: number;
	currencyUnit: string;
	notes: string;
}

// Mock data - replace with actual API call when available
const mockReturnsData: PurchaseReturn[] = [
	{
		id: 1,
		returnCode: 'RET-2024-001',
		purchaseOrderCode: 'PO-2024-001',
		vendorName: 'ABC Supplier',
		returnDate: '2024-01-15',
		returnReason: 'Defective products',
		returnStatus: 'Pending',
		totalAmount: 1500000,
		currencyUnit: 'KRW',
		notes: 'Quality issue with batch #123',
	},
	{
		id: 2,
		returnCode: 'RET-2024-002',
		purchaseOrderCode: 'PO-2024-002',
		vendorName: 'XYZ Corporation',
		returnDate: '2024-01-16',
		returnReason: 'Wrong specification',
		returnStatus: 'Approved',
		totalAmount: 2300000,
		currencyUnit: 'KRW',
		notes: 'Specification mismatch',
	},
	{
		id: 3,
		returnCode: 'RET-2024-003',
		purchaseOrderCode: 'PO-2024-003',
		vendorName: 'DEF Industries',
		returnDate: '2024-01-17',
		returnReason: 'Late delivery',
		returnStatus: 'Rejected',
		totalAmount: 800000,
		currencyUnit: 'KRW',
		notes: 'Delivery delay beyond acceptable limit',
	},
];

export const PurchaseReturnsListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<PurchaseReturn[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [editModal, setEditModal] = useState<boolean>(false);
	const [selectedReturn, setSelectedReturn] = useState<PurchaseReturn | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

	const DEFAULT_PAGE_SIZE = 30;

	// Table columns - matches the pattern from ItemsVendorListPage
	const tableColumns = useMemo(
		() => [
			{
				accessorKey: 'returnCode',
				header: t('columns.returnCode'),
				size: 150,
			},
			{
				accessorKey: 'purchaseOrderCode',
				header: t('columns.purchaseOrderCode'),
				size: 150,
			},
			{
				accessorKey: 'vendorName',
				header: t('columns.vendorName'),
				size: 150,
			},
			{
				accessorKey: 'returnDate',
				header: t('columns.returnDate'),
				size: 120,
			},
			{
				accessorKey: 'returnReason',
				header: t('columns.returnReason'),
				size: 200,
			},
			{
				accessorKey: 'returnStatus',
				header: t('columns.returnStatus'),
				size: 100,
				cell: ({ getValue }: { getValue: () => string }) => {
					const value = getValue();
					const statusColors = {
						'Pending': 'text-yellow-600 bg-yellow-100',
						'Approved': 'text-green-600 bg-green-100',
						'Rejected': 'text-red-600 bg-red-100',
					};
					const colorClass = statusColors[value as keyof typeof statusColors] || 'text-gray-600 bg-gray-100';
					return (
						<span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
							{value}
						</span>
					);
				},
			},
			{
				accessorKey: 'totalAmount',
				header: t('columns.totalAmount'),
				size: 120,
				cell: ({ getValue }: { getValue: () => number }) => {
					const value = getValue();
					return value ? value.toLocaleString() : '-';
				},
			},
			{
				accessorKey: 'currencyUnit',
				header: t('columns.currencyUnit'),
				size: 80,
			},
			{
				accessorKey: 'notes',
				header: t('columns.notes'),
				size: 200,
				cell: ({ getValue }: { getValue: () => string }) => {
					const value = getValue();
					return value || '-';
				},
			},
		],
		[t]
	);

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	// Mock API simulation - replace with actual API call when available
	useEffect(() => {
		// Simulate API call delay
		const timer = setTimeout(() => {
			setData(mockReturnsData);
			setTotalElements(mockReturnsData.length);
			setPageCount(Math.ceil(mockReturnsData.length / DEFAULT_PAGE_SIZE));
		}, 100);

		return () => clearTimeout(timer);
	}, [page]);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		tableColumns,
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	// Action handlers - following mold set pattern
	const handleRegister = () => {
		// Mock register - in real implementation, this would open register dialog
		console.log('Register button clicked');
		toast.success('Register functionality will be implemented');
	};

	const handleEdit = () => {
		if (selectedRows.size === 1) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const selectedItem = data[Number(selectedRowIndex)];
			if (selectedItem) {
				setSelectedReturn(selectedItem);
				setEditModal(true);
			} else {
				toast.warning('선택된 항목을 찾을 수 없습니다.');
			}
		} else if (selectedRows.size === 0) {
			toast.warning(tCommon('pages.actions.noRowSelectedEdit'));
		}
	};

	const handleDelete = () => {
		if (selectedRows.size === 1) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const selectedItem = data[Number(selectedRowIndex)];
			if (selectedItem) {
				setSelectedReturn(selectedItem);
				setDeleteDialogOpen(true);
			} else {
				toast.warning('선택된 항목을 찾을 수 없습니다.');
			}
		} else if (selectedRows.size === 0) {
			toast.warning(tCommon('pages.actions.noRowSelectedDelete'));
		} else {
			toast.warning(tCommon('pages.actions.multipleRowsSelectedDelete'));
		}
	};

	const handleDeleteConfirm = () => {
		if (selectedReturn) {
			// Mock delete - in real implementation, this would call an API
			console.log('Mock delete:', selectedReturn);
			toast.success('반품이 삭제되었습니다.');
			setDeleteDialogOpen(false);
			setSelectedReturn(null);
		}
	};

	const handleEditModalClose = () => {
		setEditModal(false);
		setSelectedReturn(null);
	};

	return (
		<>
			<DraggableDialog
				open={editModal}
				onOpenChange={setEditModal}
				title={tCommon('pages.purchaseReturns.edit')}
				content={
					<PurchaseReturnsEditPage
						data={selectedReturn}
						onClose={handleEditModalClose}
					/>
				}
			/>
			<DeleteConfirmDialog
				isOpen={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={handleDeleteConfirm}
				isDeleting={false}
				title={tCommon('pages.purchaseReturns.delete')}
				description={tCommon('pages.purchaseReturns.deleteConfirm')}
			/>
			<PageTemplate firstChildWidth="30%" className="border rounded-lg">
				<DatatableComponent
					table={table}
					columns={tableColumns}
					data={data}
					tableTitle={tCommon('pages.purchaseReturns.list')}
					rowCount={totalElements}
					useSearch={true}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					searchSlot={
						<SearchSlotComponent
							endSlot={
								<ActionButtonsComponent
									useEdit={true}
									useRemove={true}
									create={handleRegister}
									edit={handleEdit}
									remove={handleDelete}
								/>
							}
						/>
					}
					enableSingleSelect
				/>
			</PageTemplate>
		</>
	);
};

export default PurchaseReturnsListPage;