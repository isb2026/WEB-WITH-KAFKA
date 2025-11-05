import { useState, useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PageTemplate } from '@primes/templates';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import { Pen, Trash2, Plus, Database, Table } from 'lucide-react';
import { RadixIconButton } from '@repo/radix-ui/components';
import { DraggableDialog } from '@repo/radix-ui/components';
import { Link } from 'react-router-dom';
import DatatableComponent from '@aips/components/datatable/DatatableComponent';
import { DeleteConfirmDialog } from '@aips/components/common/DeleteConfirmDialog';
import { toast } from 'sonner';

// 테이블 매핑 타입 정의
interface TableMapping {
	id: string;
	mesTableName: string;
	aipsTableName: string;
	mappingType: string;
	description: string;
	status: string;
	lastSyncDate: string;
	createdAt: string;
	updatedAt: string;
}

// 더미 데이터
const tableMappingData: TableMapping[] = [
	{
		id: '1',
		mesTableName: 'MES_PRODUCT_MASTER',
		aipsTableName: 'aips_product_master',
		mappingType: 'Product',
		description: '제품 마스터 테이블 매핑',
		status: 'Active',
		lastSyncDate: '2024-01-15',
		createdAt: '2024-01-01',
		updatedAt: '2024-01-15',
	},
	{
		id: '2',
		mesTableName: 'MES_BOM_MASTER',
		aipsTableName: 'aips_bom_master',
		mappingType: 'BOM',
		description: 'BOM 마스터 테이블 매핑',
		status: 'Active',
		lastSyncDate: '2024-01-14',
		createdAt: '2024-01-01',
		updatedAt: '2024-01-14',
	},
	{
		id: '3',
		mesTableName: 'MES_PROCESS_ROUTING',
		aipsTableName: 'aips_process_routing',
		mappingType: 'Routing',
		description: '공정 라우팅 테이블 매핑',
		status: 'Active',
		lastSyncDate: '2024-01-13',
		createdAt: '2024-01-01',
		updatedAt: '2024-01-13',
	},
	{
		id: '4',
		mesTableName: 'MES_MACHINE_MASTER',
		aipsTableName: 'aips_machine_master',
		mappingType: 'Machine',
		description: '설비 마스터 테이블 매핑',
		status: 'Inactive',
		lastSyncDate: '2024-01-10',
		createdAt: '2024-01-01',
		updatedAt: '2024-01-10',
	},
];

export const TableMappingPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<TableMapping[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
	const [editItemData, setEditingItemData] = useState<TableMapping | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const DEFAULT_PAGE_SIZE = 30;

	const tableColumns = [
		{
			accessorKey: 'mesTableName',
			header: 'MES 테이블명',
			size: 180,
			cell: ({
				getValue,
				row,
			}: {
				getValue: () => string;
				row: { original: TableMapping };
			}) => {
				const value = getValue();
				const id = row.original.id;
				return (
					<Link
						className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:underline"
						to={`/aips/mes-integration/table-mapping/${id}`}
					>
						{value || '-'}
					</Link>
				);
			},
		},
		{
			accessorKey: 'aipsTableName',
			header: 'AIPS 테이블명',
			size: 180,
			cell: ({
				getValue,
				row,
			}: {
				getValue: () => string;
				row: { original: TableMapping };
			}) => {
				const value = getValue();
				const id = row.original.id;
				return (
					<Link
						className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:underline"
						to={`/aips/mes-integration/table-mapping/${id}`}
					>
						{value || '-'}
					</Link>
				);
			},
		},
		{
			accessorKey: 'mappingType',
			header: '매핑 타입',
			size: 120,
		},
		{
			accessorKey: 'description',
			header: '설명',
			size: 200,
		},
		{
			accessorKey: 'status',
			header: '상태',
			size: 100,
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${
							value === 'Active'
								? 'bg-green-100 text-green-800'
								: 'bg-gray-100 text-gray-800'
						}`}
					>
						{value}
					</span>
				);
			},
		},
		{
			accessorKey: 'lastSyncDate',
			header: '최근 동기화',
			size: 120,
		},
		{
			accessorKey: 'updatedAt',
			header: '수정일',
			size: 120,
		},
	];

	const onPageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handleEdit = (item: TableMapping) => {
		setEditingItemData(item);
		setOpenModal(true);
	};

	const handleDelete = (item: TableMapping) => {
		setEditingItemData(item);
		setOpenDeleteDialog(true);
	};

	const handleDeleteConfirm = () => {
		if (editItemData) {
			// 실제 삭제 로직 구현
			setData(data.filter(item => item.id !== editItemData.id));
			setTotalElements(prev => prev - 1);
			setPageCount(Math.ceil((totalElements - 1) / DEFAULT_PAGE_SIZE));
			toast.success('테이블 매핑이 삭제되었습니다.');
			setOpenDeleteDialog(false);
			setEditingItemData(null);
		}
	};

	// 더미 데이터 설정
	useEffect(() => {
		setData(tableMappingData);
		setTotalElements(tableMappingData.length);
		setPageCount(Math.ceil(tableMappingData.length / DEFAULT_PAGE_SIZE));
	}, []);

	useEffect(() => {
		if (formMethods && editItemData) {
			formMethods.reset(
				editItemData as unknown as Record<string, unknown>
			);
		}
	}, [formMethods]);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		tableColumns,
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	// Toolbar Buttons Component
	const ToolbarButtons = () => {
		return (
			<>
				<RadixIconButton
					onClick={() => editItemData && handleEdit(editItemData)}
					className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
					disabled={!editItemData}
				>
					<Pen size={16} />
					{tCommon('edit')}
				</RadixIconButton>
				<RadixIconButton
					onClick={() => editItemData && handleDelete(editItemData)}
					className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
					disabled={!editItemData}
				>
					<Trash2 size={16} />
					{tCommon('delete')}
				</RadixIconButton>
			</>
		);
	};

	useEffect(() => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const currentRow: TableMapping = data[rowIndex];
			setEditingItemData(currentRow);
		} else {
			setEditingItemData(null);
		}
	}, [selectedRows]);

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={editItemData ? '테이블 매핑 수정' : '테이블 매핑 등록'}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							{editItemData
								? '테이블 매핑 정보를 수정합니다.'
								: '새로운 테이블 매핑을 등록합니다.'}
						</p>
						<div className="mt-4 flex justify-end gap-2">
							<RadixIconButton
								onClick={() => setOpenModal(false)}
								className="px-4 py-2 border rounded-lg"
							>
								닫기
							</RadixIconButton>
						</div>
					</div>
				}
			/>
			<DeleteConfirmDialog
				isOpen={openDeleteDialog}
				onOpenChange={setOpenDeleteDialog}
				onConfirm={handleDeleteConfirm}
				isDeleting={false}
				title="테이블 매핑 삭제"
				description={`선택한 테이블 매핑 '${editItemData?.mesTableName}'을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
			/>

			{/* 테이블 섹션 */}
			<div className="space-y-4 border rounded-lg">
				<DatatableComponent
					table={table}
					columns={tableColumns}
					data={data}
					tableTitle="테이블 매핑"
					rowCount={totalElements}
					useSearch={true}
					enableSingleSelect={true}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					searchSlot={
						<SearchSlotComponent endSlot={<ToolbarButtons />} />
					}
				/>
			</div>
		</>
	);
};



// Add Button Component
const AddButton = () => {
	const { t } = useTranslation('common');
	return (
		<RadixIconButton
			className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
		>
			<Plus size={16} />
			{t('tabs.actions.register')}
		</RadixIconButton>
	);
};

export default TableMappingPage;
