import { useState, useEffect } from 'react';
import {
	Play,
	TrendingUp,
	AlertTriangle,
	CheckCircle,
	Clock,
	Factory,
	Package,
} from 'lucide-react';
import { RadixBadge } from '@repo/radix-ui/components';
import { useDataTable } from '@radix-ui/hook';
import { EchartComponent } from '@repo/echart';
import DatatableComponent from '@aips/components/datatable/DatatableComponent';

interface SimulationData {
	id: string;
	productName: string;
	demandQuantity: number;
	currentStock: number;
	plannedProduction: number;
	status: 'running' | 'completed' | 'pending' | 'error';
	completionRate: number;
	estimatedCompletion: string;
}

interface KPIData {
	title: string;
	value: string;
	change: string;
	trend: 'up' | 'down' | 'stable';
	icon: React.ReactNode;
}

interface ApsSimulationListPageProps {
	isSimulationRunning?: boolean;
	simulationProgress?: number;
	currentScenario?: string;
}

export const ApsSimulationListPage: React.FC<ApsSimulationListPageProps> = ({
	isSimulationRunning = false,
	simulationProgress = 0,
}) => {
	const [simulationData, setSimulationData] = useState<SimulationData[]>([]);
	const [kpiData, setKpiData] = useState<KPIData[]>([]);

	// Table configuration
	const tableColumns = [
		{
			accessorKey: 'productName',
			header: 'Product',
			size: 200,
		},
		{
			accessorKey: 'demandQuantity',
			header: 'Demand',
			size: 120,
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value.toLocaleString();
			},
		},
		{
			accessorKey: 'currentStock',
			header: 'Current Stock',
			size: 120,
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value.toLocaleString();
			},
		},
		{
			accessorKey: 'plannedProduction',
			header: 'Planned Production',
			size: 150,
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value.toLocaleString();
			},
		},
		{
			accessorKey: 'status',
			header: 'Status',
			size: 120,
			cell: ({ getValue }: { getValue: () => string }) => {
				const status = getValue();
				return getStatusBadge(status);
			},
		},
		{
			accessorKey: 'completionRate',
			header: 'Completion',
			size: 150,
			cell: ({ getValue }: { getValue: () => number }) => {
				const rate = getValue();
				return (
					<div className="flex items-center">
						<div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
							<div
								className="h-2 rounded-full"
								style={{
									backgroundColor: '#8270C2', // Colors-Brand-500
									width: `${rate}%`,
								}}
							></div>
						</div>
						<span>{rate}%</span>
					</div>
				);
			},
		},
		{
			accessorKey: 'estimatedCompletion',
			header: 'Est. Completion',
			size: 130,
		},
	];

	// Initialize dummy data
	useEffect(() => {
		const dummySimulationData: SimulationData[] = [
			{
				id: '1',
				productName: 'Smartphone Case',
				demandQuantity: 1000,
				currentStock: 150,
				plannedProduction: 850,
				status: 'running',
				completionRate: 65,
				estimatedCompletion: '2024-02-15',
			},
			{
				id: '2',
				productName: 'Wireless Earphones',
				demandQuantity: 500,
				currentStock: 80,
				plannedProduction: 420,
				status: 'completed',
				completionRate: 100,
				estimatedCompletion: '2024-02-10',
			},
			{
				id: '3',
				productName: 'USB Cable',
				demandQuantity: 2000,
				currentStock: 300,
				plannedProduction: 1700,
				status: 'pending',
				completionRate: 0,
				estimatedCompletion: '2024-02-20',
			},
			{
				id: '4',
				productName: 'Bluetooth Speaker',
				demandQuantity: 300,
				currentStock: 45,
				plannedProduction: 255,
				status: 'error',
				completionRate: 25,
				estimatedCompletion: '2024-02-18',
			},
		];

		const dummyKPIData: KPIData[] = [
			{
				title: 'Production Efficiency',
				value: '87.5%',
				change: '+2.3%',
				trend: 'up',
				icon: <Factory className="w-5 h-5" />,
			},
			{
				title: 'Inventory Turnover',
				value: '12.4x',
				change: '+0.8x',
				trend: 'up',
				icon: <Package className="w-5 h-5" />,
			},
			{
				title: 'Lead Time',
				value: '5.2 days',
				change: '-0.5 days',
				trend: 'down',
				icon: <Clock className="w-5 h-5" />,
			},
			{
				title: 'Demand Fulfillment',
				value: '94.2%',
				change: '+1.1%',
				trend: 'up',
				icon: <TrendingUp className="w-5 h-5" />,
			},
		];

		setSimulationData(dummySimulationData);
		setKpiData(dummyKPIData);
	}, []);

	// DataTable setup
	const { table, selectedRows, toggleRowSelection } = useDataTable(
		simulationData,
		tableColumns,
		10, // pageSize
		1, // pageCount
		0, // currentPage
		simulationData.length, // totalElements
		() => {} // onPageChange
	);

	// Chart configurations
	const productionChartOptions = {
		title: {
			text: 'Production vs Demand',
			left: 'center',
		},
		tooltip: {
			trigger: 'axis',
		},
		legend: {
			data: ['Demand', 'Current Stock', 'Planned Production'],
			bottom: 0,
		},
		xAxis: {
			type: 'category',
			data: simulationData.map((item) => item.productName),
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				name: 'Demand',
				type: 'bar',
				data: simulationData.map((item) => item.demandQuantity),
				itemStyle: { color: '#F79009' }, // Colors-Warning-500
			},
			{
				name: 'Current Stock',
				type: 'bar',
				data: simulationData.map((item) => item.currentStock),
				itemStyle: { color: '#6A53B1' }, // Colors-Brand-500
			},
			{
				name: 'Planned Production',
				type: 'bar',
				data: simulationData.map((item) => item.plannedProduction),
				itemStyle: { color: '#3b82f6' }, // Colors-Brand-600
			},
		],
	};

	const completionRateChartOptions = {
		title: {
			text: 'Completion Rate by Product',
			left: 'center',
		},
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c}%',
		},
		series: [
			{
				name: 'Completion Rate',
				type: 'pie',
				radius: '60%',
				data: simulationData.map((item, index) => {
					const colors = ['#8270C2', '#17B26A', '#3b82f6', '#3b82f6'];
					return {
						value: item.completionRate,
						name: item.productName,
						itemStyle: { color: colors[index % colors.length] },
					};
				}),
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

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			running: { color: 'blue', icon: <Play className="w-3 h-3" /> },
			completed: {
				color: 'green',
				icon: <CheckCircle className="w-3 h-3" />,
			},
			pending: { color: 'yellow', icon: <Clock className="w-3 h-3" /> },
			error: {
				color: 'red',
				icon: <AlertTriangle className="w-3 h-3" />,
			},
		};

		const config = statusConfig[status as keyof typeof statusConfig];
		return (
			<RadixBadge
				variant="outline"
				className={`text-${config.color}-600 border-${config.color}-200`}
			>
				{config.icon}
				<span className="ml-1 capitalize">{status}</span>
			</RadixBadge>
		);
	};

	return (
		<div className="space-y-4 min-h-screen">
			{/* Progress Bar */}
			{(isSimulationRunning || simulationProgress > 0) && (
				<div className="p-4 border rounded-lg">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium text-gray-700">
							Simulation Progress
						</span>
						<span className="text-sm text-gray-500">
							{simulationProgress}%
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="h-2 rounded-full transition-all duration-300"
							style={{
								backgroundColor: '#8270C2', // Colors-Brand-500
								width: `${simulationProgress}%`,
							}}
						></div>
					</div>
				</div>
			)}

			{/* KPI Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{kpiData.map((kpi, index) => (
					<div key={index} className="p-6 border rounded-lg">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									{kpi.title}
								</p>
								<p className="text-2xl font-bold text-gray-900 mt-1">
									{kpi.value}
								</p>
								<p
									className={`text-sm mt-1 ${
										kpi.trend === 'up'
											? 'text-green-600'
											: kpi.trend === 'down'
												? 'text-red-600'
												: 'text-gray-600'
									}`}
								>
									{kpi.change}
								</p>
							</div>
							<div
								className={`p-3 rounded-full ${
									kpi.trend === 'up'
										? 'bg-green-100 text-green-600'
										: kpi.trend === 'down'
											? 'bg-red-100 text-red-600'
											: 'bg-gray-100 text-gray-600'
								}`}
							>
								{kpi.icon}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Charts Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="p-6 border rounded-lg">
					<EchartComponent
						options={productionChartOptions}
						height="400px"
					/>
				</div>
				<div className="p-6 border rounded-lg">
					<EchartComponent
						options={completionRateChartOptions}
						height="400px"
					/>
				</div>
			</div>

			{/* Simulation Results Table */}
			<div className="border rounded-lg">
				<DatatableComponent
					table={table}
					classNames={{ container: 'max-h-[500px]' }}
					columns={tableColumns}
					data={simulationData}
					tableTitle="Production Schedule"
					rowCount={simulationData.length}
					useSearch={false}
					enableSingleSelect={false}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
				/>
			</div>
		</div>
	);
};

export default ApsSimulationListPage;
