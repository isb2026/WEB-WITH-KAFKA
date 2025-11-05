import { useState, useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PageTemplate } from '@primes/templates';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import { Pen, Trash2, Plus, Code, ArrowRight } from 'lucide-react';
import { RadixIconButton } from '@repo/radix-ui/components';
import { DraggableDialog } from '@repo/radix-ui/components';
import { Link } from 'react-router-dom';
import DatatableComponent from '@aips/components/datatable/DatatableComponent';
import { DeleteConfirmDialog } from '@aips/components/common/DeleteConfirmDialog';
import { toast } from 'sonner';

// 코드 변환 타입 정의
interface CodeConversion {
	id: string;
	mesCode: string;
	aipsCode: string;
	codeType: string;
	description: string;
	conversionRule: string;
	status: string;
	lastUsed: string;
	createdAt: string;
	updatedAt: string;
}

// 더미 데이터
const codeConversionData: CodeConversion[] = [
	{
		id: '1',
		mesCode: 'PROD_001',
		aipsCode: 'AIPS_PROD_001',
		codeType: 'Product',
		description: '제품 코드 변환 규칙',
		conversionRule: 'MES_PREFIX + AIPS_SUFFIX',
		status: 'Active',
		lastUsed: '2024-01-15',
		createdAt: '2024-01-01',
		updatedAt: '2024-01-15',
	},
	{
		id: '2',
		mesCode: 'BOM_001',
		aipsCode: 'AIPS_BOM_001',
		codeType: 'BOM',
		description: 'BOM 코드 변환 규칙',
		conversionRule: 'MES_BOM_PREFIX + AIPS_BOM_SUFFIX',
		status: 'Active',
		lastUsed: '2024-01-14',
		createdAt: '2024-01-01',
		updatedAt: '2024-01-14',
	},
	{
		id: '3',
		mesCode: 'ROUTING_001',
		aipsCode: 'AIPS_ROUTING_001',
		codeType: 'Routing',
		description: '라우팅 코드 변환 규칙',
		conversionRule: 'MES_ROUTING_PREFIX + AIPS_ROUTING_SUFFIX',
		status: 'Active',
		lastUsed: '2024-01-13',
		createdAt: '2024-01-01',
		updatedAt: '2024-01-13',
	},
	{
		id: '4',
		mesCode: 'MACHINE_001',
		aipsCode: 'AIPS_MACHINE_001',
		codeType: 'Machine',
		description: '설비 코드 변환 규칙',
		conversionRule: 'MES_MACHINE_PREFIX + AIPS_MACHINE_SUFFIX',
		status: 'Inactive',
		lastUsed: '2024-01-10',
		createdAt: '2024-01-01',
		updatedAt: '2024-01-10',
	},
];

export const CodeConversionPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<CodeConversion[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
	const [editItemData, setEditingItemData] = useState<CodeConversion | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const DEFAULT_PAGE_SIZE = 30;

	const tableColumns = [
		{
			accessorKey: 'mesCode',
			header: 'MES 코드',
			size: 150,
			cell: ({
				getValue,
				row,
			}: {
				getValue: () => string;
				row: { original: CodeConversion };
			}) => {
				const value = getValue();
				const id = row.original.id;
				return (
					<Link
						className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:underline"
						to={`/aips/mes-integration/code-conversion/${id}`}
					>
						{value || '-'}
					</Link>
				);
			},
		},
		{
			accessorKey: 'aipsCode',
			header: 'AIPS 코드',
			size: 150,
			cell: ({
				getValue,
				row,
			}: {
				getValue: () => string;
				row: { original: CodeConversion };
			}) => {
				const value = getValue();
				const id = row.original.id;
				return (
					<Link
						className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:underline"
						to={`/aips/mes-integration/code-conversion/${id}`}
					>
						{value || '-'}
					</Link>
				);
			},
		},
		{
			accessorKey: 'codeType',
			header: '코드 타입',
			size: 120,
		},
		{
			accessorKey: 'description',
			header: '설명',
			size: 200,
		},
		{
			accessorKey: 'conversionRule',
			header: '변환 규칙',
			size: 180,
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
			accessorKey: 'lastUsed',
			header: '최근 사용',
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

	const handleEdit = (item: CodeConversion) => {
		setEditingItemData(item);
		setOpenModal(true);
	};

	const handleDelete = (item: CodeConversion) => {
		setEditingItemData(item);
		setOpenDeleteDialog(true);
	};

	const handleDeleteConfirm = () => {
		if (editItemData) {
			// 실제 삭제 로직 구현
			setData(data.filter(item => item.id !== editItemData.id));
			setTotalElements(prev => prev - 1);
			setPageCount(Math.ceil((totalElements - 1) / DEFAULT_PAGE_SIZE));
			toast.success('코드 변환 규칙이 삭제되었습니다.');
			setOpenDeleteDialog(false);
			setEditingItemData(null);
		}
	};

	// 더미 데이터 설정
	useEffect(() => {
		setData(codeConversionData);
		setTotalElements(codeConversionData.length);
		setPageCount(Math.ceil(codeConversionData.length / DEFAULT_PAGE_SIZE));
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
			const currentRow: CodeConversion = data[rowIndex];
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
				title={editItemData ? '코드 변환 규칙 수정' : '코드 변환 규칙 등록'}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							{editItemData
								? '코드 변환 규칙을 수정합니다.'
								: '새로운 코드 변환 규칙을 등록합니다.'}
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
				title="코드 변환 규칙 삭제"
				description={`선택한 코드 변환 규칙 '${editItemData?.mesCode}'을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
			/>

			{/* 테이블 섹션 */}
			<div className="space-y-4 border rounded-lg">
				<DatatableComponent
					table={table}
					columns={tableColumns}
					data={data}
					tableTitle="코드 변환"
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

export default CodeConversionPage;
