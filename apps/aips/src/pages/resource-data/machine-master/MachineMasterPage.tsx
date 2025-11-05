import { useState, useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { Item } from '@primes/types/item';
import { useTranslation } from '@repo/i18n';
import { Pen, Trash2 } from 'lucide-react';
import { RadixIconButton } from '@repo/radix-ui/components';
import { DraggableDialog } from '@repo/radix-ui/components';
import { Link } from 'react-router-dom';
import DatatableComponent from '@aips/components/datatable/DatatableComponent';
import { machineMasterData } from '../dummy-data/machineMasterData';
import { DeleteConfirmDialog } from '@aips/components/common/DeleteConfirmDialog';
import { toast } from 'sonner';

// Example dummy dataset for Machine Master
export type Machine = {
	id: number;
	machineCode: string;
	machineName: string;
	workCenterName?: string | null;
	calendarName?: string | null;
	capacityPerHour?: number | null; // units/hour
	efficiencyPct?: number | null; // 0-100
	utilizationPct?: number | null; // 0-100
	status?: 'Running' | 'Idle' | 'Down' | 'Maintenance';
	lastMaintenanceAt?: string | null; // ISO date
	nextMaintenanceAt?: string | null; // ISO date
};

export const MachineMasterPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');

	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<Machine[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
	const [editItemData, setEditingItemData] = useState<Machine | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);

	const DEFAULT_PAGE_SIZE = 30;

	const fmtNumber = (v?: number | null) =>
		typeof v === 'number' ? v.toLocaleString() : '-';
	const fmtPct = (v?: number | null) =>
		typeof v === 'number' ? `${v}%` : '-';
	const fmtDate = (v?: string | null) =>
		v ? new Date(v).toLocaleDateString() : '-';

	// ✅ Machine columns (not product)
	const tableColumns = [
		{
			accessorKey: 'machineCode',
			header: '설비코드',
			size: 140,
			cell: ({
				getValue,
				row,
			}: {
				getValue: () => string;
				row: { original: Machine };
			}) => {
				const value = getValue();
				const id = row.original.id;
				return (
					<Link
						className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:underline"
						to={`/aips/master-data/machine-master/${id}`}
					>
						{value || '-'}
					</Link>
				);
			},
		},
		{
			accessorKey: 'machineName',
			header: '설비명',
			size: 220,
			cell: ({
				getValue,
				row,
			}: {
				getValue: () => string;
				row: { original: Machine };
			}) => {
				const value = getValue();
				const id = row.original.id;
				return (
					<Link
						className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:underline"
						to={`/aips/master-data/machine-master/${id}`}
					>
						{value || '-'}
					</Link>
				);
			},
		},
		{
			accessorKey: 'workCenterName',
			header: '작업장',
			size: 160,
			cell: ({ getValue }: { getValue: () => string }) =>
				getValue() || '-',
		},
		{
			accessorKey: 'calendarName',
			header: '작업 달력',
			size: 160,
			cell: ({ getValue }: { getValue: () => string }) =>
				getValue() || '-',
		},
		{
			accessorKey: 'capacityPerHour',
			header: '시간당 CAPA',
			size: 120,
			align: 'right',
			cell: ({ getValue }: { getValue: () => number }) =>
				fmtNumber(getValue()),
		},
		{
			accessorKey: 'efficiencyPct',
			header: '효율(%)',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) =>
				fmtPct(getValue()),
		},
		{
			accessorKey: 'utilizationPct',
			header: '가동률(%)',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) =>
				fmtPct(getValue()),
		},
		{
			accessorKey: 'status',
			header: '상태',
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => Machine['status'] }) => {
				const status = getValue();
				const color =
					status === 'Running'
						? 'bg-green-100 text-green-700'
						: status === 'Idle'
							? 'bg-slate-100 text-slate-700'
							: status === 'Maintenance'
								? 'bg-amber-100 text-amber-700'
								: status === 'Down'
									? 'bg-red-100 text-red-700'
									: 'bg-slate-100 text-slate-700';
				return (
					<span
						className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${color}`}
					>
						{status ?? '-'}
					</span>
				);
			},
		},
		{
			accessorKey: 'nextMaintenanceAt',
			header: '다음 점검일',
			size: 140,
			align: 'center',
			cell: ({ getValue }: { getValue: () => string }) =>
				fmtDate(getValue()),
		},
	];

	const onPageChange = (pagination: { pageIndex: number }) =>
		setPage(pagination.pageIndex);

	// dummy remove for now
	const dummyRemove = {
		mutate: (id: number) => {
			console.log('Delete machine with id:', id);
			toast.success('설비가 삭제되었습니다.');
		},
		isPending: false,
	};

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);
	};

	const handleAdd = () => {
		setEditingItemData(null);
		setOpenModal(true);
	};

	const handleEdit = () => {
		if (editItemData) setOpenModal(true);
		else toast.warning('수정하실 설비를 선택해주세요.');
	};

	const handleDelete = () => {
		if (editItemData) setOpenDeleteDialog(true);
		else toast.warning('삭제하실 설비를 선택해주세요.');
	};

	const handleDeleteConfirm = () => {
		if (editItemData) {
			const id = editItemData.id;
			dummyRemove.mutate(id);
			setOpenDeleteDialog(false);
		}
	};

	const ToolbarButtons = () => (
		<>
			<RadixIconButton
				onClick={handleEdit}
				className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
			>
				<Pen size={16} />
				{tCommon('edit')}
			</RadixIconButton>
			<RadixIconButton
				onClick={handleDelete}
				className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
			>
				<Trash2 size={16} />
				{tCommon('delete')}
			</RadixIconButton>
		</>
	);

	// ✅ load machine dummy
	useEffect(() => {
		setData(machineMasterData);
		setTotalElements(machineMasterData.length);
		setPageCount(Math.ceil(machineMasterData.length / DEFAULT_PAGE_SIZE));
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

	useEffect(() => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const currentRow: Machine = data[rowIndex];
			setEditingItemData(currentRow);
		} else {
			setEditingItemData(null);
		}
	}, [selectedRows, data]);

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={editItemData ? '설비 수정' : '설비 등록'}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							{editItemData
								? '설비 정보를 수정합니다.'
								: '새로운 설비를 등록합니다.'}
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
				isDeleting={dummyRemove.isPending}
				title="설비 삭제"
				description={`선택한 설비 '${editItemData?.machineName || editItemData?.machineCode}'을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
			/>

			{/* Table */}
			<div className="space-y-4 border rounded-lg">
				<DatatableComponent
					table={table}
					columns={tableColumns}
					data={data}
					tableTitle="설비 마스터"
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

export default MachineMasterPage;
