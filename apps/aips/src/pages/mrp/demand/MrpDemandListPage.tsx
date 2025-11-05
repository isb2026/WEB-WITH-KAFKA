import { useState, useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { RefreshCw, TrendingUp, Calendar, Users, Target } from 'lucide-react';
import { RadixIconButton } from '@repo/radix-ui/components';
import { DraggableDialog } from '@repo/radix-ui/components';
import { MrpDemandRegisterPage } from './MrpDemandRegisterPage';
import DatatableComponent from '@aips/components/datatable/DatatableComponent';
import { EchartComponent } from '@repo/echart';
import { toast } from 'sonner';
import { demandDummyData, DemandData } from './dummy-data';

export const MrpDemandListPage: React.FC = () => {
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<DemandData[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [editDemandData, setEditDemandData] = useState<DemandData | null>(
		null
	);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const DEFAULT_PAGE_SIZE = 20;

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'High':
				return 'text-red-600 bg-red-50';
			case 'Medium':
				return 'text-yellow-600 bg-yellow-50';
			case 'Low':
				return 'text-green-600 bg-green-50';
			default:
				return 'text-gray-600 bg-gray-50';
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Planned':
				return 'text-blue-600 bg-blue-50';
			case 'Confirmed':
				return 'text-green-600 bg-green-50';
			case 'In Production':
				return 'text-orange-600 bg-orange-50';
			case 'Completed':
				return 'text-gray-600 bg-gray-50';
			default:
				return 'text-gray-600 bg-gray-50';
		}
	};

	const tableColumns = [
		{
			accessorKey: 'productCode',
			header: 'Product Code',
			size: 120,
		},
		{
			accessorKey: 'productName',
			header: 'Product Name',
			size: 180,
		},
		{
			accessorKey: 'customerName',
			header: 'Customer',
			size: 150,
		},
		{
			accessorKey: 'requiredQuantity',
			header: 'Required Qty',
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value.toLocaleString();
			},
		},
		{
			accessorKey: 'forecastQuantity',
			header: 'Forecast Qty',
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value.toLocaleString();
			},
		},
		{
			accessorKey: 'actualDemand',
			header: 'Actual Demand',
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value > 0 ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'priority',
			header: 'Priority',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(value)}`}
					>
						{value}
					</span>
				);
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
			accessorKey: 'dueDate',
			header: 'Due Date',
			size: 120,
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
		toast.success('Demand data refreshed successfully');
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
	const demandForecastChartOptions = {
		title: {
			text: 'Demand vs Forecast Analysis',
			left: 'center',
			textStyle: { fontSize: 16, fontWeight: 'bold' },
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: { type: 'shadow' },
		},
		legend: {
			data: ['Required', 'Forecast', 'Actual'],
			top: '10%',
		},
		xAxis: {
			type: 'category',
			data: [
				'Steel Frame',
				'ECU',
				'Plastic Housing',
				'Gear Set',
				'Sensor Array',
				'Hydraulic Cyl',
			],
		},
		yAxis: {
			type: 'value',
			name: 'Quantity',
		},
		series: [
			{
				name: 'Required',
				type: 'bar',
				data: [500, 200, 1000, 150, 300, 75],
				itemStyle: { color: '#3b82f6' },
			},
			{
				name: 'Forecast',
				type: 'bar',
				data: [480, 220, 950, 160, 280, 80],
				itemStyle: { color: '#10b981' },
			},
			{
				name: 'Actual',
				type: 'bar',
				data: [520, 195, 0, 150, 0, 0],
				itemStyle: { color: '#f59e0b' },
			},
		],
	};

	const priorityDistributionChartOptions = {
		title: {
			text: 'Priority Distribution',
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
				name: 'Priority',
				type: 'pie',
				radius: '50%',
				data: [
					{ value: 3, name: 'High', itemStyle: { color: '#ef4444' } },
					{
						value: 2,
						name: 'Medium',
						itemStyle: { color: '#f59e0b' },
					},
					{ value: 1, name: 'Low', itemStyle: { color: '#10b981' } },
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

	// Demand data initialization
	useEffect(() => {
		setData(demandDummyData);
		setTotalElements(demandDummyData.length);
		setPageCount(Math.ceil(demandDummyData.length / DEFAULT_PAGE_SIZE));
	}, []);

	useEffect(() => {
		if (formMethods && editDemandData) {
			formMethods.reset(
				editDemandData as unknown as Record<string, unknown>
			);
		}
	}, [formMethods, editDemandData]);

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
			const currentRow: DemandData = data[rowIndex];
			setEditDemandData(currentRow);
		} else {
			setEditDemandData(null);
		}
	}, [selectedRows, data]);

	// Demand metrics
	const totalDemands = demandDummyData.length;
	const highPriorityItems = demandDummyData.filter(
		(item) => item.priority === 'High'
	).length;
	const totalRequiredQty = demandDummyData.reduce(
		(sum, item) => sum + item.requiredQuantity,
		0
	);
	const totalValue = demandDummyData.reduce(
		(sum, item) => sum + item.requiredQuantity * item.unitPrice,
		0
	);

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={editDemandData ? 'Edit Demand' : 'Add New Demand'}
				content={
					<MrpDemandRegisterPage
						itemsData={editDemandData || undefined}
						onClose={() => {
							setOpenModal(false);
						}}
						onFormReady={handleFormReady}
					/>
				}
			/>

			<div className="space-y-4">
				{/* Demand Metrics Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="p-4 rounded-lg border">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Total Demands
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{totalDemands}
								</p>
							</div>
							<Calendar className="h-8 w-8 text-blue-600" />
						</div>
					</div>
					<div className="p-4 rounded-lg border">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									High Priority
								</p>
								<p className="text-2xl font-bold text-red-600">
									{highPriorityItems}
								</p>
							</div>
							<Target className="h-8 w-8 text-red-600" />
						</div>
					</div>
					<div className="p-4 rounded-lg border">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Total Quantity
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{totalRequiredQty.toLocaleString()}
								</p>
							</div>
							<Users className="h-8 w-8 text-green-600" />
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
							options={demandForecastChartOptions}
							height="300px"
						/>
					</div>
					<div className="p-6 rounded-lg border">
						<EchartComponent
							options={priorityDistributionChartOptions}
							height="300px"
						/>
					</div>
				</div>

				{/* Demand Data Table */}
				<div className="rounded-lg border">
					<DatatableComponent
						table={table}
						columns={tableColumns}
						data={data}
						tableTitle="Demand Analysis"
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

export default MrpDemandListPage;
