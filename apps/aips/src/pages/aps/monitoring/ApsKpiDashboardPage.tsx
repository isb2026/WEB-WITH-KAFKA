import React, { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import { useDataTable } from '@radix-ui/hook';
import DatatableComponent from '@aips/components/datatable/DatatableComponent';
import { EchartComponent } from '@repo/echart';
import { Activity, AlertTriangle, TrendingUp, Zap, Bell } from 'lucide-react';

// Types for KPI data
interface KPIData {
	title: string;
	value: string;
	change: string;
	trend: 'up' | 'down' | 'stable';
	icon: React.ReactNode;
	color: string;
}

interface Alert {
	id: string;
	type: 'delay' | 'breakdown' | 'quality' | 'maintenance';
	message: string;
	severity: 'high' | 'medium' | 'low';
	timestamp: string;
	machineId?: string;
	orderId?: string;
}

interface ApsKpiDashboardPageProps {
	refreshInterval?: number;
}

export const ApsKpiDashboardPage: React.FC<ApsKpiDashboardPageProps> = ({
	refreshInterval = 5000,
}) => {
	const { t } = useTranslation('common');
	const [kpiData, setKpiData] = useState<KPIData[]>([]);
	const [alerts, setAlerts] = useState<Alert[]>([]);

	// Initialize dummy data
	useEffect(() => {
		const dummyKPIs: KPIData[] = [
			{
				title: 'Equipment Effectiveness',
				value: '78.5%',
				change: '+2.3% from yesterday',
				trend: 'up',
				icon: <TrendingUp size={24} />,
				color: 'text-green-600',
			},
			{
				title: 'Throughput',
				value: '1,247 units/hr',
				change: '+5.2% from yesterday',
				trend: 'up',
				icon: <Zap size={24} />,
				color: 'text-blue-600',
			},
			{
				title: 'Active Delays',
				value: '3',
				change: '+1 from yesterday',
				trend: 'up',
				icon: <AlertTriangle size={24} />,
				color: 'text-red-600',
			},
			{
				title: 'Machine Utilization',
				value: '72.8%',
				change: '-1.2% from yesterday',
				trend: 'down',
				icon: <Activity size={24} />,
				color: 'text-orange-600',
			},
			{
				title: 'Quality Rate',
				value: '96.2%',
				change: '+0.8% from yesterday',
				trend: 'up',
				icon: <TrendingUp size={24} />,
				color: 'text-green-600',
			},
			{
				title: 'On-Time Delivery',
				value: '89.5%',
				change: '-2.1% from yesterday',
				trend: 'down',
				icon: <AlertTriangle size={24} />,
				color: 'text-yellow-600',
			},
		];

		const dummyAlerts: Alert[] = [
			{
				id: '1',
				type: 'delay',
				message:
					'Work Order WO-2024-002 is running 2 hours behind schedule',
				severity: 'high',
				timestamp: '2024-01-15 14:25:00',
				orderId: 'WO-2024-002',
				machineId: 'M002',
			},
			{
				id: '2',
				type: 'breakdown',
				message: 'Packaging Line #1 has stopped unexpectedly',
				severity: 'high',
				timestamp: '2024-01-15 14:15:00',
				machineId: 'M004',
			},
			{
				id: '3',
				type: 'maintenance',
				message: 'CNC Machine #3 scheduled maintenance in progress',
				severity: 'medium',
				timestamp: '2024-01-15 13:00:00',
				machineId: 'M005',
			},
			{
				id: '4',
				type: 'quality',
				message:
					'Quality check required for completed batch WO-2024-003',
				severity: 'low',
				timestamp: '2024-01-15 14:30:00',
				orderId: 'WO-2024-003',
			},
			{
				id: '5',
				type: 'delay',
				message: 'Material shortage affecting Assembly Line #2',
				severity: 'medium',
				timestamp: '2024-01-15 13:45:00',
				machineId: 'M002',
			},
		];

		setKpiData(dummyKPIs);
		setAlerts(dummyAlerts);
	}, []);

	// Auto-refresh KPI data simulation
	useEffect(() => {
		const interval = setInterval(() => {
			setKpiData((prev) =>
				prev.map((kpi) => {
					// Simulate small changes in KPI values
					if (kpi.title === 'Throughput') {
						const currentValue = parseInt(
							kpi.value.replace(/[^\d]/g, '')
						);
						const change = Math.floor((Math.random() - 0.5) * 20);
						const newValue = Math.max(1000, currentValue + change);
						return {
							...kpi,
							value: `${newValue.toLocaleString()} units/hr`,
						};
					}
					return kpi;
				})
			);
		}, refreshInterval);

		return () => clearInterval(interval);
	}, [refreshInterval]);

	// Chart options for throughput trend
	const throughputChartOptions = {
		title: {
			text: 'Real-time Throughput Trend',
			left: 'center',
			textStyle: { fontSize: 16, fontWeight: 'bold' },
		},
		tooltip: {
			trigger: 'axis',
			formatter: '{b}<br/>{a}: {c} units/hr',
		},
		xAxis: {
			type: 'category',
			data: [
				'08:00',
				'09:00',
				'10:00',
				'11:00',
				'12:00',
				'13:00',
				'14:00',
				'15:00',
			],
		},
		yAxis: {
			type: 'value',
			name: 'Units/Hour',
		},
		series: [
			{
				name: 'Throughput',
				type: 'line',
				data: [1100, 1150, 1200, 1180, 1250, 1300, 1247, 1280],
				smooth: true,
				itemStyle: { color: '#3b82f6' },
				areaStyle: { color: 'rgba(59, 130, 246, 0.1)' },
			},
		],
	};

	// Chart options for work order progress
	const workOrderProgressChartOptions = {
		title: {
			text: 'Work Order Progress Overview',
			left: 'center',
			textStyle: { fontSize: 16, fontWeight: 'bold' },
		},
		tooltip: {
			trigger: 'axis',
			formatter: function (params: any) {
				const data = params[0];
				return `${data.name}<br/>Progress: ${data.value}%`;
			},
		},
		xAxis: {
			type: 'category',
			data: ['WO-001', 'WO-002', 'WO-003', 'WO-004', 'WO-005'],
			axisLabel: {
				rotate: 45,
				interval: 0,
			},
		},
		yAxis: {
			type: 'value',
			max: 100,
			name: 'Progress (%)',
		},
		series: [
			{
				name: 'Progress',
				type: 'bar',
				data: [
					{ value: 75, itemStyle: { color: '#3b82f6' } },
					{ value: 20, itemStyle: { color: '#ef4444' } },
					{ value: 100, itemStyle: { color: '#10b981' } },
					{ value: 0, itemStyle: { color: '#f59e0b' } },
					{ value: 60, itemStyle: { color: '#3b82f6' } },
				],
			},
		],
	};

	// Chart options for machine utilization
	const machineUtilizationChartOptions = {
		title: {
			text: 'Machine Status Distribution',
			left: 'center',
			textStyle: { fontSize: 16, fontWeight: 'bold' },
		},
		tooltip: {
			trigger: 'item',
			formatter: '{b}: {c} machines',
		},
		series: [
			{
				type: 'pie',
				radius: ['40%', '70%'],
				data: [
					{
						value: 3,
						name: 'Running',
						itemStyle: { color: '#10b981' },
					},
					{ value: 2, name: 'Idle', itemStyle: { color: '#f59e0b' } },
					{ value: 1, name: 'Down', itemStyle: { color: '#ef4444' } },
					{
						value: 1,
						name: 'Maintenance',
						itemStyle: { color: '#8b5cf6' },
					},
				],
			},
		],
	};

	// Alert table columns
	const alertColumns = [
		{
			accessorKey: 'type',
			header: 'Type',
			size: 100,
			cell: ({ row }: any) => {
				const type = row.getValue('type');
				const typeConfig = {
					delay: { color: 'bg-red-100 text-red-800', label: 'Delay' },
					breakdown: {
						color: 'bg-red-100 text-red-800',
						label: 'Breakdown',
					},
					quality: {
						color: 'bg-yellow-100 text-yellow-800',
						label: 'Quality',
					},
					maintenance: {
						color: 'bg-blue-100 text-blue-800',
						label: 'Maintenance',
					},
				};
				const config = typeConfig[type as keyof typeof typeConfig];
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
					>
						{config.label}
					</span>
				);
			},
		},
		{
			accessorKey: 'message',
			header: 'Message',
			size: 300,
		},
		{
			accessorKey: 'severity',
			header: 'Severity',
			size: 100,
			cell: ({ row }: any) => {
				const severity = row.getValue('severity');
				const colorClass =
					severity === 'high'
						? 'bg-red-100 text-red-800'
						: severity === 'medium'
							? 'bg-yellow-100 text-yellow-800'
							: 'bg-blue-100 text-blue-800';
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
			accessorKey: 'machineId',
			header: 'Machine',
			size: 100,
			cell: ({ row }: any) => {
				const machineId = row.getValue('machineId');
				return machineId ? (
					<span className="text-blue-600 font-medium">
						{machineId}
					</span>
				) : (
					<span className="text-gray-400">-</span>
				);
			},
		},
		{
			accessorKey: 'orderId',
			header: 'Order',
			size: 120,
			cell: ({ row }: any) => {
				const orderId = row.getValue('orderId');
				return orderId ? (
					<span className="text-blue-600 font-medium">{orderId}</span>
				) : (
					<span className="text-gray-400">-</span>
				);
			},
		},
		{
			accessorKey: 'timestamp',
			header: 'Time',
			size: 140,
			cell: ({ row }: any) => {
				const timestamp = row.getValue('timestamp');
				return (
					<span className="text-xs text-gray-500">{timestamp}</span>
				);
			},
		},
	];

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		alerts,
		alertColumns,
		10,
		Math.ceil(alerts.length / 10),
		0,
		alerts.length,
		() => {}
	);

	return (
		<div className="space-y-6">
			{/* KPI Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
				{kpiData.map((kpi, index) => (
					<div
						key={index}
						className="p-4 bg-white border rounded-lg shadow-sm"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs font-medium text-gray-600">
									{kpi.title}
								</p>
								<p className="text-lg font-bold text-gray-900 mt-1">
									{kpi.value}
								</p>
								<p className={`text-xs mt-1 ${kpi.color}`}>
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
			<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
				<div className="p-6 rounded-lg border">
					<EchartComponent
						options={throughputChartOptions}
						height="350px"
					/>
				</div>
				<div className="p-6 rounded-lg border">
					<EchartComponent
						options={workOrderProgressChartOptions}
						height="350px"
					/>
				</div>
				<div className="p-6 rounded-lg border">
					<EchartComponent
						options={machineUtilizationChartOptions}
						height="350px"
					/>
				</div>
			</div>

			{/* Active Alerts Table */}
			<div className="rounded-lg border">
				<DatatableComponent
					table={table}
					columns={alertColumns}
					data={alerts}
					tableTitle="Active Alerts"
					rowCount={alerts.length}
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

export default ApsKpiDashboardPage;
