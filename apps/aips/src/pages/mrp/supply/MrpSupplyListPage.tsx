import { useState, useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PageTemplate } from '@primes/templates';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import {
	Plus,
	RefreshCw,
	AlertTriangle,
	TrendingUp,
	Package,
	Truck,
} from 'lucide-react';
import { RadixIconButton } from '@repo/radix-ui/components';
import { DraggableDialog } from '@repo/radix-ui/components';
import { MrpSupplyRegisterPage } from './MrpSupplyRegisterPage';
import DatatableComponent from '@aips/components/datatable/DatatableComponent';
import { EchartComponent } from '@repo/echart';
import { toast } from 'sonner';
import { supplyDummyData } from './dummy-data';

// Supply data interface
export interface SupplyData {
	id: number;
	supplierName: string;
	supplierCode: string;
	materialName: string;
	materialCode: string;
	currentStock: number;
	reorderPoint: number;
	leadTime: number;
	unitPrice: number;
	lastOrderDate: string;
	nextDeliveryDate: string;
	status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'On Order';
	category: string;
}

export const MrpSupplyListPage: React.FC = () => {
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<SupplyData[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [editSupplyData, setEditSupplyData] = useState<SupplyData | null>(
		null
	);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const DEFAULT_PAGE_SIZE = 20;

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'In Stock':
				return 'text-green-600 bg-green-50';
			case 'Low Stock':
				return 'text-yellow-600 bg-yellow-50';
			case 'Out of Stock':
				return 'text-red-600 bg-red-50';
			case 'On Order':
				return 'text-blue-600 bg-blue-50';
			default:
				return 'text-gray-600 bg-gray-50';
		}
	};

	const tableColumns = [
		{
			accessorKey: 'supplierCode',
			header: 'Supplier Code',
			size: 120,
		},
		{
			accessorKey: 'supplierName',
			header: 'Supplier Name',
			size: 180,
		},
		{
			accessorKey: 'materialCode',
			header: 'Material Code',
			size: 120,
		},
		{
			accessorKey: 'materialName',
			header: 'Material Name',
			size: 200,
		},
		{
			accessorKey: 'currentStock',
			header: 'Current Stock',
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value.toLocaleString();
			},
		},
		{
			accessorKey: 'reorderPoint',
			header: 'Reorder Point',
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value.toLocaleString();
			},
		},
		{
			accessorKey: 'leadTime',
			header: 'Lead Time (Days)',
			size: 130,
			align: 'center',
		},
		{
			accessorKey: 'unitPrice',
			header: 'Unit Price ($)',
			size: 120,
			align: 'right',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return `$${value.toFixed(2)}`;
			},
		},
		{
			accessorKey: 'status',
			header: 'Status',
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}
					>
						{value}
					</span>
				);
			},
		},
		{
			accessorKey: 'nextDeliveryDate',
			header: 'Next Delivery',
			size: 130,
			align: 'center',
		},
	];

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);
	};

	const handleRefreshData = () => {
		toast.success('Supply data refreshed successfully');
	};

	const ActionButtons = () => {
		return (
			<div className="flex gap-2">
				<RadixIconButton
					onClick={handleRefreshData}
					className="flex gap-1.5 px-3 py-2 rounded-lg text-sm items-center border border-gray-300 hover:bg-gray-50"
				>
					<RefreshCw size={16} />
					Refresh
				</RadixIconButton>
			</div>
		);
	};

	// Chart configurations
	const stockStatusChartOptions = {
		title: {
			text: 'Stock Status Overview',
			left: 'center',
			textStyle: { fontSize: 16, fontWeight: 'bold' },
		},
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c} ({d}%)',
		},
		legend: {
			orient: 'vertical',
			left: 'left',
		},
		series: [
			{
				name: 'Stock Status',
				type: 'pie',
				radius: '50%',
				data: [
					{
						value: 2,
						name: 'In Stock',
						itemStyle: { color: '#10b981' },
					},
					{
						value: 1,
						name: 'Low Stock',
						itemStyle: { color: '#f59e0b' },
					},
					{
						value: 1,
						name: 'Out of Stock',
						itemStyle: { color: '#ef4444' },
					},
					{
						value: 1,
						name: 'On Order',
						itemStyle: { color: '#3b82f6' },
					},
				],
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					},
				},
			},
		],
	};

	const leadTimeChartOptions = {
		title: {
			text: 'Lead Time Analysis',
			left: 'center',
			textStyle: { fontSize: 16, fontWeight: 'bold' },
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: { type: 'shadow' },
		},
		xAxis: {
			type: 'category',
			data: [
				'ABC Materials',
				'XYZ Electronics',
				'Global Plastics',
				'Premium Fasteners',
				'Tech Components',
			],
		},
		yAxis: {
			type: 'value',
			name: 'Days',
		},
		series: [
			{
				name: 'Lead Time',
				type: 'bar',
				data: [7, 14, 10, 3, 21],
				itemStyle: {
					color: '#3b82f6',
				},
			},
		],
	};

	// Supply data initialization
	useEffect(() => {
		setData(supplyDummyData);
		setTotalElements(supplyDummyData.length);
		setPageCount(Math.ceil(supplyDummyData.length / DEFAULT_PAGE_SIZE));
	}, []);

	useEffect(() => {
		if (formMethods && editSupplyData) {
			formMethods.reset(
				editSupplyData as unknown as Record<string, unknown>
			);
		}
	}, [formMethods, editSupplyData]);

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
			const currentRow: SupplyData = data[rowIndex];
			setEditSupplyData(currentRow);
		} else {
			setEditSupplyData(null);
		}
	}, [selectedRows, data]);

	// Supply metrics
	const totalSuppliers = supplyDummyData.length;
	const lowStockItems = supplyDummyData.filter(
		(item) => item.status === 'Low Stock' || item.status === 'Out of Stock'
	).length;
	const avgLeadTime = Math.round(
		supplyDummyData.reduce((sum, item) => sum + item.leadTime, 0) /
			supplyDummyData.length
	);
	const totalValue = supplyDummyData.reduce(
		(sum, item) => sum + item.currentStock * item.unitPrice,
		0
	);

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={editSupplyData ? 'Edit Supplier' : 'Add New Supplier'}
				content={
					<MrpSupplyRegisterPage
						itemsData={editSupplyData || undefined}
						onClose={() => {
							setOpenModal(false);
						}}
						onFormReady={handleFormReady}
					/>
				}
			/>

			<div className="space-y-4">
				{/* Supply Metrics Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="p-4 rounded-lg border">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Total Suppliers
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{totalSuppliers}
								</p>
							</div>
							<Package className="h-8 w-8 text-blue-600" />
						</div>
					</div>
					<div className="p-4 rounded-lg border">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Critical Items
								</p>
								<p className="text-2xl font-bold text-red-600">
									{lowStockItems}
								</p>
							</div>
							<AlertTriangle className="h-8 w-8 text-red-600" />
						</div>
					</div>
					<div className="p-4 rounded-lg border">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Avg Lead Time
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{avgLeadTime} days
								</p>
							</div>
							<Truck className="h-8 w-8 text-green-600" />
						</div>
					</div>
					<div className="p-4 rounded-lg border">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Total Value
								</p>
								<p className="text-2xl font-bold text-gray-900">
									${totalValue.toLocaleString()}
								</p>
							</div>
							<TrendingUp className="h-8 w-8 text-purple-600" />
						</div>
					</div>
				</div>

				{/* Charts Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="p-6 rounded-lg border">
						<EchartComponent
							options={stockStatusChartOptions}
							height="300px"
						/>
					</div>
					<div className="p-6 rounded-lg border">
						<EchartComponent
							options={leadTimeChartOptions}
							height="300px"
						/>
					</div>
				</div>

				{/* Supply Data Table */}
				<div className="rounded-lg border">
					<DatatableComponent
						table={table}
						columns={tableColumns}
						data={data}
						tableTitle="Material Analysis"
						rowCount={totalElements}
						useSearch={true}
						enableSingleSelect={true}
						selectedRows={selectedRows}
						toggleRowSelection={toggleRowSelection}
						searchSlot={
							<SearchSlotComponent endSlot={<ActionButtons />} />
						}
						classNames={{ container: 'max-h-[500px]' }}
					/>
				</div>
			</div>
		</>
	);
};

export default MrpSupplyListPage;
