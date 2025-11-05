import React, { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import { TrendingUp, Clock, Target, Factory } from 'lucide-react';
import { EchartComponent } from '@repo/echart/components';
import DatatableComponent from '@aips/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';

// Types for optimization data
interface OptimizationKPI {
	id: string;
	title: string;
	value: string;
	change: string;
	trend: 'up' | 'down' | 'stable';
	icon: React.ReactNode;
	color: string;
}

interface ScheduleItem {
	id: string;
	orderId: string;
	productName: string;
	quantity: number;
	machine: string;
	currentStartTime: string;
	currentEndTime: string;
	currentDuration: number;
	optimizedStartTime: string;
	optimizedEndTime: string;
	optimizedDuration: number;
	priority: 'High' | 'Medium' | 'Low';
	status: 'Scheduled' | 'In Progress' | 'Completed' | 'Delayed';
}

interface OptimizationResult {
	scenario: string;
	improvement: {
		efficiency: number;
		leadTime: number;
		utilization: number;
		cost: number;
	};
	status: 'running' | 'completed' | 'pending' | 'failed';
}

interface ApsOptimizationListPageProps {
	isOptimizing?: boolean;
	optimizationProgress?: number;
}

// Dumm data
const dummyKPIs: OptimizationKPI[] = [
	{
		id: '1',
		title: 'Overall Efficiency',
		value: '87.5%',
		change: '+2.3%',
		trend: 'up',
		icon: <Target className="w-5 h-5" />,
		color: 'text-green-600',
	},
	{
		id: '2',
		title: 'Resource Utilization',
		value: '92.1%',
		change: '+1.8%',
		trend: 'up',
		icon: <Factory className="w-5 h-5" />,
		color: 'text-blue-600',
	},
	{
		id: '3',
		title: 'Lead Time Reduction',
		value: '15.2%',
		change: '-2.1%',
		trend: 'down',
		icon: <Clock className="w-5 h-5" />,
		color: 'text-orange-600',
	},
	{
		id: '4',
		title: 'Cost Savings',
		value: '$12.4K',
		change: '+$1.2K',
		trend: 'up',
		icon: <TrendingUp className="w-5 h-5" />,
		color: 'text-purple-600',
	},
];

const dummyScheduleData: ScheduleItem[] = [
	{
		id: '1',
		orderId: 'ORD-001',
		productName: 'Widget A',
		quantity: 100,
		machine: 'Machine-01',
		currentStartTime: '2024-01-15 08:00',
		currentEndTime: '2024-01-15 12:00',
		currentDuration: 4,
		optimizedStartTime: '2024-01-15 08:00',
		optimizedEndTime: '2024-01-15 11:30',
		optimizedDuration: 3.5,
		priority: 'High',
		status: 'Scheduled',
	},
	{
		id: '2',
		orderId: 'ORD-002',
		productName: 'Widget B',
		quantity: 150,
		machine: 'Machine-02',
		currentStartTime: '2024-01-15 09:00',
		currentEndTime: '2024-01-15 14:00',
		currentDuration: 5,
		optimizedStartTime: '2024-01-15 08:30',
		optimizedEndTime: '2024-01-15 13:00',
		optimizedDuration: 4.5,
		priority: 'Medium',
		status: 'In Progress',
	},
	{
		id: '3',
		orderId: 'ORD-003',
		productName: 'Widget C',
		quantity: 80,
		machine: 'Machine-01',
		currentStartTime: '2024-01-15 13:00',
		currentEndTime: '2024-01-15 16:00',
		currentDuration: 3,
		optimizedStartTime: '2024-01-15 12:00',
		optimizedEndTime: '2024-01-15 14:30',
		optimizedDuration: 2.5,
		priority: 'Low',
		status: 'Scheduled',
	},
	{
		id: '4',
		orderId: 'ORD-004',
		productName: 'Widget D',
		quantity: 200,
		machine: 'Machine-03',
		currentStartTime: '2024-01-15 10:00',
		currentEndTime: '2024-01-15 16:00',
		currentDuration: 6,
		optimizedStartTime: '2024-01-15 08:00',
		optimizedEndTime: '2024-01-15 13:30',
		optimizedDuration: 5.5,
		priority: 'High',
		status: 'Delayed',
	},
];

export const ApsOptimizationListPage: React.FC<
	ApsOptimizationListPageProps
> = ({ isOptimizing = false, optimizationProgress = 0 }) => {
	const { t } = useTranslation('common');
	const [kpiData, setKpiData] = useState<OptimizationKPI[]>([]);
	const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);

	// Initialize dummy data
	useEffect(() => {
		setKpiData(dummyKPIs);
		setScheduleData(dummyScheduleData);
	}, []);

	// Table columns for schedule comparison
	const scheduleColumns = [
		{
			accessorKey: 'orderId',
			header: 'Order ID',
			size: 120,
		},
		{
			accessorKey: 'productName',
			header: 'Product',
			size: 150,
		},
		{
			accessorKey: 'quantity',
			header: 'Quantity',
			size: 100,
		},
		{
			accessorKey: 'machine',
			header: 'Machine',
			size: 120,
		},
		{
			accessorKey: 'priority',
			header: 'Priority',
			size: 100,
			cell: ({ row }: any) => {
				const priority = row.getValue('priority');
				const colorClass =
					priority === 'High'
						? 'bg-red-100 text-red-800'
						: priority === 'Medium'
							? 'bg-yellow-100 text-yellow-800'
							: 'bg-green-100 text-green-800';
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
					>
						{priority}
					</span>
				);
			},
		},
		{
			accessorKey: 'status',
			header: 'Status',
			size: 120,
			cell: ({ row }: any) => {
				const status = row.getValue('status');
				const colorClass =
					status === 'Completed'
						? 'bg-green-100 text-green-800'
						: status === 'In Progress'
							? 'bg-blue-100 text-blue-800'
							: status === 'Delayed'
								? 'bg-red-100 text-red-800'
								: 'bg-gray-100 text-gray-800';
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
					>
						{status}
					</span>
				);
			},
		},
		{
			accessorKey: 'currentStartTime',
			header: 'Current Start',
			size: 150,
		},
		{
			accessorKey: 'currentEndTime',
			header: 'Current End',
			size: 150,
		},
		{
			accessorKey: 'currentDuration',
			header: 'Current Duration (hrs)',
			size: 140,
		},
		{
			accessorKey: 'optimizedStartTime',
			header: 'Optimized Start',
			size: 150,
			cell: ({ row }: any) => (
				<span className="text-green-700 font-medium">
					{row.getValue('optimizedStartTime')}
				</span>
			),
		},
		{
			accessorKey: 'optimizedEndTime',
			header: 'Optimized End',
			size: 150,
			cell: ({ row }: any) => (
				<span className="text-green-700 font-medium">
					{row.getValue('optimizedEndTime')}
				</span>
			),
		},
		{
			accessorKey: 'optimizedDuration',
			header: 'Optimized Duration (hrs)',
			size: 240,
			cell: ({ row }: any) => {
				const current = row.original.currentDuration;
				const optimized = row.getValue('optimizedDuration');
				const improvement = current - optimized;
				return (
					<div className="flex items-center gap-2">
						<span className="text-green-700 font-medium">
							{optimized}
						</span>
						{improvement > 0 && (
							<span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
								-{improvement.toFixed(1)}h
							</span>
						)}
					</div>
				);
			},
		},
	];

	// Data table hook
	const table = useDataTable(
		scheduleData,
		scheduleColumns,
		10,
		1,
		0,
		scheduleData.length,
		() => {}
	);

	const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

	const toggleRowSelection = (rowId: string) => {
		const newSelection = new Set(selectedRows);
		if (newSelection.has(rowId)) {
			newSelection.delete(rowId);
		} else {
			newSelection.add(rowId);
		}
		setSelectedRows(newSelection);
	};

	// Chart options for utilization comparison
	const utilizationChartOptions = {
		title: {
			text: 'Machine Utilization Comparison',
			left: 'center',
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		legend: {
			data: ['Current', 'Optimized'],
			top: 30,
		},
		xAxis: {
			type: 'category',
			data: [
				'Machine-01',
				'Machine-02',
				'Machine-03',
				'Machine-04',
				'Machine-05',
			],
		},
		yAxis: {
			type: 'value',
			max: 100,
			axisLabel: {
				formatter: '{value}%',
			},
		},
		series: [
			{
				name: 'Current',
				type: 'bar',
				data: [75, 82, 68, 91, 77],
				itemStyle: {
					color: '#ef4444',
				},
			},
			{
				name: 'Optimized',
				type: 'bar',
				data: [88, 94, 85, 96, 89],
				itemStyle: {
					color: '#22c55e',
				},
			},
		],
	};

	// Chart options for efficiency metrics
	const efficiencyChartOptions = {
		title: {
			text: 'Optimization Impact',
			left: 'center',
		},
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c}% improvement',
		},
		legend: {
			orient: 'vertical',
			left: 'left',
			top: 50,
		},
		series: [
			{
				name: 'Improvement',
				type: 'pie',
				radius: '50%',
				data: [
					{
						value: 12.5,
						name: 'Efficiency',
						itemStyle: { color: '#3b82f6' },
					},
					{
						value: 18.3,
						name: 'Lead Time',
						itemStyle: { color: '#10b981' },
					},
					{
						value: 8.7,
						name: 'Utilization',
						itemStyle: { color: '#f59e0b' },
					},
					{
						value: 15.2,
						name: 'Cost Savings',
						itemStyle: { color: '#ef4444' },
					},
				],
				label: {
					show: true,
					formatter: '{b}\n{c}%',
					fontSize: 12,
					fontWeight: 'bold',
				},
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

	return (
		<div className="space-y-4 min-h-screen">
			{/* Optimization Progress */}
			{isOptimizing && (
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium text-blue-900">
							AI Optimization in Progress
						</span>
						<span className="text-sm text-blue-700">
							{optimizationProgress}%
						</span>
					</div>
					<div className="w-full bg-blue-200 rounded-full h-2">
						<div
							className="bg-blue-600 h-2 rounded-full transition-all duration-500"
							style={{ width: `${optimizationProgress}%` }}
						></div>
					</div>
				</div>
			)}

			{/* KPI Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{kpiData.map((kpi) => (
					<div key={kpi.id} className="p-6 border rounded-lg">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									{kpi.title}
								</p>
								<p className="text-2xl font-bold text-gray-900 mt-1">
									{kpi.value}
								</p>
								<p className={`text-sm mt-1 ${kpi.color}`}>
									{kpi.trend === 'up'
										? '↗'
										: kpi.trend === 'down'
											? '↘'
											: '→'}{' '}
									{kpi.change}
								</p>
							</div>
							<div
								className={`p-3 rounded-full bg-gray-100 ${kpi.color}`}
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
						options={utilizationChartOptions}
						height="350px"
					/>
				</div>
				<div className="p-6 border rounded-lg">
					<EchartComponent
						options={efficiencyChartOptions}
						height="350px"
					/>
				</div>
			</div>

			{/* Schedule Comparison Table */}
			<div className="border rounded-lg">
				<DatatableComponent
					table={table.table}
					columns={scheduleColumns}
					data={scheduleData}
					tableTitle="Production Schedule Optimization"
					rowCount={scheduleData.length}
					useSearch={true}
					enableSingleSelect={false}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					classNames={{ container: 'max-h-[600px]' }}
				/>
			</div>
		</div>
	);
};

export default ApsOptimizationListPage;
