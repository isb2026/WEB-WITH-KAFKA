import React, { useState, useEffect } from 'react';
import { useDataTable } from '@radix-ui/hook';
import DatatableComponent from '@aips/components/datatable/DatatableComponent';
import { EchartComponent } from '@repo/echart';
import { useTranslation } from '@repo/i18n';
import {
	AlertTriangle,
	Clock,
	Package,
	BarChart3,
	Calendar,
	Target,
} from 'lucide-react';

// Types for risk alert data
interface RiskAlert {
	id: number;
	type: 'delay' | 'shortage' | 'overload' | 'maintenance';
	severity: 'low' | 'medium' | 'high' | 'critical';
	title: string;
	description: string;
	affectedItems: string[];
	estimatedImpact: string;
	recommendedAction: string;
	dueDate: string;
}

interface ApsPredictionStatusPageProps {
	timeRange?: '7d' | '30d' | '90d';
}

export const ApsPredictionStatusPage: React.FC<
	ApsPredictionStatusPageProps
> = ({ timeRange = '30d' }) => {
	const { t } = useTranslation('dataTable');
	const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);

	// Initialize dummy data
	useEffect(() => {
		const dummyRiskAlerts: RiskAlert[] = [
			{
				id: 1,
				type: 'shortage',
				severity: 'high',
				title: 'Potential Stock Shortage',
				description:
					'Wireless Earphones inventory projected to fall below safety stock',
				affectedItems: ['ITM-002'],
				estimatedImpact: 'Production delay of 3-5 days',
				recommendedAction: 'Increase procurement order by 200 units',
				dueDate: '2024-02-20',
			},
			{
				id: 2,
				type: 'overload',
				severity: 'medium',
				title: 'Machine Capacity Alert',
				description: 'Assembly Line B approaching maximum capacity',
				affectedItems: ['ASM-002'],
				estimatedImpact: 'Potential bottleneck in production',
				recommendedAction:
					'Schedule maintenance or redistribute workload',
				dueDate: '2024-02-18',
			},
			{
				id: 3,
				type: 'delay',
				severity: 'critical',
				title: 'Demand Spike Warning',
				description: 'Smartphone Case demand exceeding forecast by 25%',
				affectedItems: ['ITM-001'],
				estimatedImpact: 'Customer order delays possible',
				recommendedAction: 'Expedite production schedule',
				dueDate: '2024-02-15',
			},
		];

		setRiskAlerts(dummyRiskAlerts);
	}, [timeRange]);

	// Chart options for demand forecast
	const demandForecastChartOptions = {
		title: {
			text: 'Demand Forecast Trends',
			left: 'center',
			textStyle: { fontSize: 16, fontWeight: 'bold' },
		},
		tooltip: {
			trigger: 'axis',
			formatter: '{b}<br/>{a0}: {c0}<br/>{a1}: {c1}',
		},
		legend: {
			data: ['Current Demand', 'Predicted Demand'],
			top: '10%',
		},
		xAxis: {
			type: 'category',
			data: [
				'Smartphone Case',
				'Wireless Earphones',
				'USB Cable',
				'Power Bank',
			],
			axisLabel: {
				rotate: 45,
				interval: 0,
			},
		},
		yAxis: {
			type: 'value',
			name: 'Units',
		},
		series: [
			{
				name: 'Current Demand',
				type: 'bar',
				data: [150, 200, 300, 120],
				itemStyle: { color: '#3b82f6' },
			},
			{
				name: 'Predicted Demand',
				type: 'bar',
				data: [180, 160, 320, 95],
				itemStyle: { color: '#ef4444' },
			},
		],
	};

	// Chart options for capacity utilization
	const capacityForecastChartOptions = {
		title: {
			text: 'Machine Capacity Forecast',
			left: 'center',
			textStyle: { fontSize: 16, fontWeight: 'bold' },
		},
		tooltip: {
			trigger: 'axis',
			formatter: '{b}<br/>{a0}: {c0}%<br/>{a1}: {c1}%',
		},
		legend: {
			data: ['Current Load', 'Predicted Load'],
			top: '10%',
		},
		xAxis: {
			type: 'category',
			data: ['Injection Molding A', 'Assembly Line B', 'Quality Control'],
			axisLabel: {
				rotate: 45,
				interval: 0,
			},
		},
		yAxis: {
			type: 'value',
			max: 100,
			name: 'Utilization (%)',
		},
		series: [
			{
				name: 'Current Load',
				type: 'bar',
				data: [75, 60, 45],
				itemStyle: { color: '#f59e0b' },
			},
			{
				name: 'Predicted Load',
				type: 'bar',
				data: [85, 90, 55],
				itemStyle: { color: '#ef4444' },
			},
		],
	};

	// Chart options for inventory projection
	const inventoryProjectionChartOptions = {
		title: {
			text: 'Inventory Stock Projections',
			left: 'center',
			textStyle: { fontSize: 16, fontWeight: 'bold' },
		},
		tooltip: {
			trigger: 'axis',
			formatter: '{b}<br/>{a0}: {c0}<br/>{a1}: {c1}',
		},
		legend: {
			data: ['Current Stock', 'Projected Stock'],
			top: '10%',
		},
		xAxis: {
			type: 'category',
			data: [
				'Raw Material A',
				'Component B',
				'Packaging C',
				'Finished Goods',
			],
			axisLabel: {
				rotate: 45,
				interval: 0,
			},
		},
		yAxis: {
			type: 'value',
			name: 'Units',
		},
		series: [
			{
				name: 'Current Stock',
				type: 'line',
				data: [1200, 800, 450, 320],
				smooth: true,
				itemStyle: { color: '#10b981' },
			},
			{
				name: 'Projected Stock',
				type: 'line',
				data: [900, 600, 380, 280],
				smooth: true,
				itemStyle: { color: '#f59e0b' },
			},
		],
	};

	// Risk alerts table columns
	const riskColumns = [
		{
			accessorKey: 'type',
			header: 'Type',
			size: 100,
			cell: ({ row }: any) => {
				const type = row.getValue('type');
				const typeConfig = {
					delay: {
						color: 'bg-red-100 text-red-800',
						icon: <Clock size={12} />,
					},
					shortage: {
						color: 'bg-orange-100 text-orange-800',
						icon: <Package size={12} />,
					},
					overload: {
						color: 'bg-yellow-100 text-yellow-800',
						icon: <BarChart3 size={12} />,
					},
					maintenance: {
						color: 'bg-blue-100 text-blue-800',
						icon: <Calendar size={12} />,
					},
				};
				const config = typeConfig[type as keyof typeof typeConfig];
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}
					>
						{config.icon}
						{type.charAt(0).toUpperCase() + type.slice(1)}
					</span>
				);
			},
		},
		{
			accessorKey: 'severity',
			header: 'Severity',
			size: 100,
			cell: ({ row }: any) => {
				const severity = row.getValue('severity');
				const colorClass =
					severity === 'critical'
						? 'bg-red-100 text-red-800'
						: severity === 'high'
							? 'bg-orange-100 text-orange-800'
							: severity === 'medium'
								? 'bg-yellow-100 text-yellow-800'
								: 'bg-green-100 text-green-800';
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
					>
						{severity.toUpperCase()}
					</span>
				);
			},
		},
		{
			accessorKey: 'title',
			header: 'Alert Title',
			size: 200,
		},
		{
			accessorKey: 'description',
			header: 'Description',
			size: 250,
		},
		{
			accessorKey: 'estimatedImpact',
			header: 'Impact',
			size: 180,
		},
		{
			accessorKey: 'recommendedAction',
			header: 'Recommended Action',
			size: 200,
		},
		{
			accessorKey: 'dueDate',
			header: 'Due Date',
			size: 120,
			cell: ({ row }: any) => {
				const dueDate = row.getValue('dueDate');
				return <span className="text-sm text-gray-600">{dueDate}</span>;
			},
		},
	];

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		riskAlerts,
		riskColumns,
		10,
		Math.ceil(riskAlerts.length / 10),
		0,
		riskAlerts.length,
		() => {}
	);

	return (
		<div className="space-y-4">
			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				{[
					{
						title: 'Critical Alerts',
						count: riskAlerts.filter(
							(r) => r.severity === 'critical'
						).length,
						color: 'bg-red-100 text-red-800',
						icon: (
							<AlertTriangle className="w-5 h-5 text-red-600" />
						),
					},
					{
						title: 'High Priority',
						count: riskAlerts.filter((r) => r.severity === 'high')
							.length,
						color: 'bg-orange-100 text-orange-800',
						icon: <Clock className="w-5 h-5 text-orange-600" />,
					},
					{
						title: 'Medium Priority',
						count: riskAlerts.filter((r) => r.severity === 'medium')
							.length,
						color: 'bg-yellow-100 text-yellow-800',
						icon: <Target className="w-5 h-5 text-yellow-600" />,
					},
					{
						title: 'Low Priority',
						count: riskAlerts.filter((r) => r.severity === 'low')
							.length,
						color: 'bg-green-100 text-green-800',
						icon: <Calendar className="w-5 h-5 text-green-600" />,
					},
				].map((card, index) => (
					<div key={index} className="p-6 rounded-lg border">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									{card.title}
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{card.count}
								</p>
							</div>
							<div className={`p-3 rounded-full ${card.color}`}>
								{card.icon}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Charts Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
				<div className="p-6 rounded-lg border">
					<EchartComponent
						options={demandForecastChartOptions}
						height="350px"
					/>
				</div>
				<div className="p-6 rounded-lg border">
					<EchartComponent
						options={capacityForecastChartOptions}
						height="350px"
					/>
				</div>
				<div className="p-6 rounded-lg border">
					<EchartComponent
						options={inventoryProjectionChartOptions}
						height="350px"
					/>
				</div>
			</div>

			{/* Risk Alerts Table */}
			<div className="rounded-lg border">
				<DatatableComponent
					table={table}
					columns={riskColumns}
					data={riskAlerts}
					tableTitle="Prediction Risk Alerts"
					rowCount={riskAlerts.length}
					useSearch={true}
					enableSingleSelect={false}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					classNames={{ container: 'max-h-[500px]' }}
				/>
			</div>
		</div>
	);
};

export default ApsPredictionStatusPage;
