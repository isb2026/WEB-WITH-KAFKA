import { useState, useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PageTemplate } from '@primes/templates';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import { Pen, Trash2, Plus, RefreshCw, Play, Pause, Clock } from 'lucide-react';
import { RadixIconButton } from '@repo/radix-ui/components';
import { DraggableDialog } from '@repo/radix-ui/components';
import { Link } from 'react-router-dom';
import DatatableComponent from '@aips/components/datatable/DatatableComponent';
import { DeleteConfirmDialog } from '@aips/components/common/DeleteConfirmDialog';
import { toast } from 'sonner';

// 데이터 동기화 타입 정의
interface DataSync {
	id: string;
	syncName: string;
	syncType: string;
	sourceSystem: string;
	targetSystem: string;
	schedule: string;
	lastSyncTime: string;
	nextSyncTime: string;
	status: string;
	recordsProcessed: number;
	errorCount: number;
	createdAt: string;
	updatedAt: string;
}

// 더미 데이터
const dataSyncData: DataSync[] = [
	{
		id: '1',
		syncName: '제품 마스터 동기화',
		syncType: 'Product Master',
		sourceSystem: 'MES',
		targetSystem: 'AIPS',
		schedule: 'Daily 02:00',
		lastSyncTime: '2024-01-15 02:00:00',
		nextSyncTime: '2024-01-16 02:00:00',
		status: 'Active',
		recordsProcessed: 1250,
		errorCount: 0,
		createdAt: '2024-01-01',
		updatedAt: '2024-01-15',
	},
	{
		id: '2',
		syncName: 'BOM 마스터 동기화',
		syncType: 'BOM Master',
		sourceSystem: 'MES',
		targetSystem: 'AIPS',
		schedule: 'Daily 02:30',
		lastSyncTime: '2024-01-15 02:30:00',
		nextSyncTime: '2024-01-16 02:30:00',
		status: 'Active',
		recordsProcessed: 890,
		errorCount: 0,
		createdAt: '2024-01-01',
		updatedAt: '2024-01-15',
	},
	{
		id: '3',
		syncName: '공정 라우팅 동기화',
		syncType: 'Process Routing',
		sourceSystem: 'MES',
		targetSystem: 'AIPS',
		schedule: 'Daily 03:00',
		lastSyncTime: '2024-01-15 03:00:00',
		nextSyncTime: '2024-01-16 03:00:00',
		status: 'Active',
		recordsProcessed: 456,
		errorCount: 0,
		createdAt: '2024-01-01',
		updatedAt: '2024-01-15',
	},
	{
		id: '4',
		syncName: '설비 마스터 동기화',
		syncType: 'Machine Master',
		sourceSystem: 'MES',
		targetSystem: 'AIPS',
		schedule: 'Weekly Sunday 01:00',
		lastSyncTime: '2024-01-14 01:00:00',
		nextSyncTime: '2024-01-21 01:00:00',
		status: 'Paused',
		recordsProcessed: 234,
		errorCount: 2,
		createdAt: '2024-01-01',
		updatedAt: '2024-01-14',
	},
];

export const DataSyncPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<DataSync[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
	const [editItemData, setEditingItemData] = useState<DataSync | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const DEFAULT_PAGE_SIZE = 30;

	const tableColumns = [
		{
			accessorKey: 'syncName',
			header: '동기화 명',
			size: 200,
			cell: ({
				getValue,
				row,
			}: {
				getValue: () => string;
				row: { original: DataSync };
			}) => {
				const value = getValue();
				const id = row.original.id;
				return (
					<Link
						className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:underline"
						to={`/aips/mes-integration/data-sync/${id}`}
					>
						{value || '-'}
					</Link>
				);
			},
		},
		{
			accessorKey: 'syncType',
			header: '동기화 타입',
			size: 150,
		},
		{
			accessorKey: 'sourceSystem',
			header: '소스 시스템',
			size: 120,
		},
		{
			accessorKey: 'targetSystem',
			header: '타겟 시스템',
			size: 120,
		},
		{
			accessorKey: 'schedule',
			header: '스케줄',
			size: 150,
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
								: value === 'Paused'
								? 'bg-yellow-100 text-yellow-800'
								: 'bg-gray-100 text-gray-800'
						}`}
					>
						{value}
					</span>
				);
			},
		},
		{
			accessorKey: 'lastSyncTime',
			header: '최근 동기화',
			size: 150,
		},
		{
			accessorKey: 'nextSyncTime',
			header: '다음 동기화',
			size: 150,
		},
		{
			accessorKey: 'recordsProcessed',
			header: '처리 레코드',
			size: 120,
			align: 'center',
		},
		{
			accessorKey: 'errorCount',
			header: '에러 수',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${
							value === 0
								? 'bg-green-100 text-green-800'
								: 'bg-red-100 text-red-800'
						}`}
					>
						{value}
					</span>
				);
			},
		},
	];

	const onPageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handleEdit = (item: DataSync) => {
		setEditingItemData(item);
		setOpenModal(true);
	};

	const handleDelete = (item: DataSync) => {
		setEditingItemData(item);
		setOpenDeleteDialog(true);
	};

	const handleDeleteConfirm = () => {
		if (editItemData) {
			// 실제 삭제 로직 구현
			setData(data.filter(item => item.id !== editItemData.id));
			setTotalElements(prev => prev - 1);
			setPageCount(Math.ceil((totalElements - 1) / DEFAULT_PAGE_SIZE));
			toast.success('데이터 동기화 설정이 삭제되었습니다.');
			setOpenDeleteDialog(false);
			setEditingItemData(null);
		}
	};

	// 더미 데이터 설정
	useEffect(() => {
		setData(dataSyncData);
		setTotalElements(dataSyncData.length);
		setPageCount(Math.ceil(dataSyncData.length / DEFAULT_PAGE_SIZE));
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
			const currentRow: DataSync = data[rowIndex];
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
				title={editItemData ? '데이터 동기화 설정 수정' : '데이터 동기화 설정 등록'}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							{editItemData
								? '데이터 동기화 설정을 수정합니다.'
								: '새로운 데이터 동기화 설정을 등록합니다.'}
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
				title="데이터 동기화 설정 삭제"
				description={`선택한 데이터 동기화 설정 '${editItemData?.syncName}'을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
			/>

			{/* 테이블 섹션 */}
			<div className="space-y-4 border rounded-lg">
				<DatatableComponent
					table={table}
					columns={tableColumns}
					data={data}
					tableTitle="데이터 동기화"
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

export default DataSyncPage;
