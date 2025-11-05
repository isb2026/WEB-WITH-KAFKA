import { useState, useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from '@repo/i18n';
import {
	TrendingUp,
	Calendar,
	BarChart3,
	Edit3,
	Pen,
	Trash2,
} from 'lucide-react';
import { DraggableDialog, RadixIconButton } from '@repo/radix-ui/components';
import { forecastDemandData } from '../dummy-data/forecastDemandData';
import { EchartComponent } from '@repo/echart';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import DatatableComponent from '@aips/components/datatable/DatatableComponent';
import { DeleteConfirmDialog } from '@aips/components/common/DeleteConfirmDialog';
import { toast } from 'sonner';

interface ForecastDemand {
	id: number;
	productName: string;
	january: number;
	february: number;
	march: number;
	april: number;
	may: number;
	june: number;
	july: number;
	august: number;
	september: number;
	october: number;
	november: number;
	december: number;
	total: number;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

export const ForecastDemandManagementPage: React.FC = () => {
	const { t } = useTranslation('common');
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<ForecastDemand[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
	const [editItemData, setEditingItemData] = useState<ForecastDemand | null>(
		null
	);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editData, setEditData] = useState<ForecastDemand | null>(null);
	const DEFAULT_PAGE_SIZE = 30;

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	// 더미 remove 함수
	const dummyRemove = {
		mutate: (id: number) => {
			console.log('Delete forecast demand with id:', id);
			toast.success('수요 예측이 삭제되었습니다.');
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
		if (editItemData) {
			setOpenModal(true);
		} else {
			toast.warning('수정하실 수요 예측을 선택해주세요.');
		}
	};

	const handleDelete = () => {
		if (editItemData) {
			setOpenDeleteDialog(true);
		} else {
			toast.warning('삭제하실 수요 예측을 선택해주세요.');
		}
	};

	const handleDeleteConfirm = () => {
		if (editItemData) {
			const id = editItemData.id;
			dummyRemove.mutate(id);
			setOpenDeleteDialog(false);
		}
	};

	const AddButton = () => {
		return (
			<>
				<RadixIconButton
					onClick={handleEdit}
					className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
				>
					<Pen size={16} />
					{t('edit')}
				</RadixIconButton>
				<RadixIconButton
					onClick={handleDelete}
					className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
				>
					<Trash2 size={16} />
					{t('delete')}
				</RadixIconButton>
			</>
		);
	};

	useEffect(() => {
		setData(forecastDemandData);
		setTotalElements(forecastDemandData.length);
		setPageCount(Math.ceil(forecastDemandData.length / DEFAULT_PAGE_SIZE));
	}, []);

	useEffect(() => {
		if (formMethods && editItemData) {
			formMethods.reset(
				editItemData as unknown as Record<string, unknown>
			);
		}
	}, [formMethods]);

	const months = [
		{ key: 'january', label: '1월' },
		{ key: 'february', label: '2월' },
		{ key: 'march', label: '3월' },
		{ key: 'april', label: '4월' },
		{ key: 'may', label: '5월' },
		{ key: 'june', label: '6월' },
		{ key: 'july', label: '7월' },
		{ key: 'august', label: '8월' },
		{ key: 'september', label: '9월' },
		{ key: 'october', label: '10월' },
		{ key: 'november', label: '11월' },
		{ key: 'december', label: '12월' },
	];

	const tableColumns = [
		{
			accessorKey: 'productName',
			header: '제품명',
			size: 200,
		},
		{
			accessorKey: 'january',
			header: '1월',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'february',
			header: '2월',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'march',
			header: '3월',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'april',
			header: '4월',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'may',
			header: '5월',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'june',
			header: '6월',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'july',
			header: '7월',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'august',
			header: '8월',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'september',
			header: '9월',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'october',
			header: '10월',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'november',
			header: '11월',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'december',
			header: '12월',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'total',
			header: '합계',
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
	];

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
			const currentRow: ForecastDemand = data[rowIndex];
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
				title={editItemData ? '수요 예측 수정' : '수요 예측 등록'}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							{editItemData
								? '수요 예측 정보를 수정합니다.'
								: '새로운 수요 예측을 등록합니다.'}
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
				title="수요 예측 삭제"
				description={`선택한 수요 예측 '${editItemData?.productName}'을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
			/>

			<div className="space-y-4">
				{/* 요약 카드 */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="bg-white p-4 rounded-lg border shadow-sm">
						<div className="flex items-center">
							<div className="p-2 bg-blue-100 rounded-lg">
								<TrendingUp className="h-6 w-6 text-blue-600" />
							</div>
							<div className="ml-3">
								<p className="text-sm font-medium text-gray-600">
									총 예측 수요
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{data
										.reduce(
											(sum, item) => sum + item.total,
											0
										)
										.toLocaleString()}
								</p>
							</div>
						</div>
					</div>
					<div className="bg-white p-4 rounded-lg border shadow-sm">
						<div className="flex items-center">
							<div className="p-2 bg-green-100 rounded-lg">
								<Calendar className="h-6 w-6 text-green-600" />
							</div>
							<div className="ml-3">
								<p className="text-sm font-medium text-gray-600">
									관리 제품 수
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{data.length}
								</p>
							</div>
						</div>
					</div>
					<div className="bg-white p-4 rounded-lg border shadow-sm">
						<div className="flex items-center">
							<div className="p-2 bg-yellow-100 rounded-lg">
								<BarChart3 className="h-6 w-6 text-yellow-600" />
							</div>
							<div className="ml-3">
								<p className="text-sm font-medium text-gray-600">
									평균 월 수요
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{Math.round(
										data.reduce(
											(sum, item) => sum + item.total,
											0
										) / 12
									).toLocaleString()}
								</p>
							</div>
						</div>
					</div>
					<div className="bg-white p-4 rounded-lg border shadow-sm">
						<div className="flex items-center">
							<div className="p-2 bg-purple-100 rounded-lg">
								<Edit3 className="h-6 w-6 text-purple-600" />
							</div>
							<div className="ml-3">
								<p className="text-sm font-medium text-gray-600">
									편집 중
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{editItemData ? '1' : '0'}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* 차트 영역 */}
				<div className="bg-white p-6 rounded-lg border shadow-sm">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						수요 예측 트렌드
					</h3>
					<div className="h-64">
						<EchartComponent
							options={{
								title: {
									text: '월별 수요 예측 트렌드',
									left: 'center',
								},
								tooltip: {
									trigger: 'axis',
								},
								legend: {
									data: data.map((item) => item.productName),
									top: 30,
								},
								xAxis: {
									type: 'category',
									data: [
										'1월',
										'2월',
										'3월',
										'4월',
										'5월',
										'6월',
										'7월',
										'8월',
										'9월',
										'10월',
										'11월',
										'12월',
									],
								},
								yAxis: {
									type: 'value',
								},
								series: data.map((item) => ({
									name: item.productName,
									type: 'line',
									data: [
										item.january,
										item.february,
										item.march,
										item.april,
										item.may,
										item.june,
										item.july,
										item.august,
										item.september,
										item.october,
										item.november,
										item.december,
									],
								})),
							}}
							height="250px"
						/>
					</div>
				</div>

				{/* 테이블 섹션 */}
				<div className="space-y-4 border rounded-lg">
					<DatatableComponent
						table={table}
						columns={tableColumns}
						data={data}
						tableTitle="월별 수요 예측 데이터"
						rowCount={totalElements}
						useSearch={true}
						enableSingleSelect={true}
						selectedRows={selectedRows}
						toggleRowSelection={toggleRowSelection}
						searchSlot={
							<SearchSlotComponent endSlot={<AddButton />} />
						}
					/>
				</div>
			</div>
		</>
	);
};

export default ForecastDemandManagementPage;
