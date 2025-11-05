import React, { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import { useDataTable } from '@radix-ui/hook';
import DatatableComponent from '@aips/components/datatable/DatatableComponent';
import { Play, Clock, XCircle, Settings } from 'lucide-react';

// Types for machine status data
interface MachineStatus {
	id: string;
	name: string;
	code: string;
	status: 'running' | 'idle' | 'down' | 'maintenance';
	currentOrder?: string;
	utilization: number;
	temperature?: number;
	speed?: number;
	lastUpdate: string;
	location: string;
	operator?: string;
}

interface ApsMachineStatusPageProps {
	refreshInterval?: number;
}

export const ApsMachineStatusPage: React.FC<ApsMachineStatusPageProps> = ({
	refreshInterval = 5000,
}) => {
	const { t } = useTranslation('common');
	const [machines, setMachines] = useState<MachineStatus[]>([]);

	// Initialize dummy data
	useEffect(() => {
		const dummyMachines: MachineStatus[] = [
			{
				id: 'M001',
				name: 'Injection Molding #1',
				code: 'IM-001',
				status: 'running',
				currentOrder: 'WO-2024-001',
				utilization: 85,
				temperature: 180,
				speed: 95,
				lastUpdate: '2024-01-15 14:30:15',
				location: 'Production Floor A',
				operator: 'John Smith',
			},
			{
				id: 'M002',
				name: 'Assembly Line #2',
				code: 'AL-002',
				status: 'running',
				currentOrder: 'WO-2024-002',
				utilization: 60,
				speed: 75,
				lastUpdate: '2024-01-15 14:30:10',
				location: 'Production Floor B',
				operator: 'Sarah Johnson',
			},
			{
				id: 'M003',
				name: 'Quality Control #1',
				code: 'QC-001',
				status: 'idle',
				utilization: 0,
				lastUpdate: '2024-01-15 14:25:00',
				location: 'Quality Lab',
				operator: 'Mike Davis',
			},
			{
				id: 'M004',
				name: 'Packaging Line #1',
				code: 'PL-001',
				status: 'down',
				currentOrder: 'WO-2024-004',
				utilization: 0,
				lastUpdate: '2024-01-15 14:15:00',
				location: 'Packaging Area',
				operator: 'Lisa Wilson',
			},
			{
				id: 'M005',
				name: 'CNC Machine #3',
				code: 'CNC-003',
				status: 'maintenance',
				utilization: 0,
				lastUpdate: '2024-01-15 13:00:00',
				location: 'Machine Shop',
			},
			{
				id: 'M006',
				name: 'Injection Molding #2',
				code: 'IM-002',
				status: 'running',
				currentOrder: 'WO-2024-005',
				utilization: 92,
				temperature: 175,
				speed: 88,
				lastUpdate: '2024-01-15 14:30:20',
				location: 'Production Floor A',
				operator: 'Tom Brown',
			},
			{
				id: 'M007',
				name: 'Assembly Line #3',
				code: 'AL-003',
				status: 'idle',
				utilization: 0,
				lastUpdate: '2024-01-15 14:20:00',
				location: 'Production Floor C',
				operator: 'Emma Garcia',
			},
		];

		setMachines(dummyMachines);
	}, []);

	// Auto-refresh data simulation
	useEffect(() => {
		const interval = setInterval(() => {
			setMachines((prev) =>
				prev.map((machine) => {
					if (machine.status === 'running') {
						// Simulate small variations in utilization and temperature
						const utilizationChange = (Math.random() - 0.5) * 5;
						const tempChange = machine.temperature
							? (Math.random() - 0.5) * 3
							: 0;

						return {
							...machine,
							utilization: Math.max(
								0,
								Math.min(
									100,
									machine.utilization + utilizationChange
								)
							),
							temperature: machine.temperature
								? Math.max(
										150,
										Math.min(
											200,
											machine.temperature + tempChange
										)
									)
								: undefined,
							lastUpdate: new Date()
								.toLocaleString('sv-SE')
								.replace('T', ' ')
								.slice(0, 19),
						};
					}
					return machine;
				})
			);
		}, refreshInterval);

		return () => clearInterval(interval);
	}, [refreshInterval]);

	// Machine Status table columns
	const machineColumns = [
		{
			accessorKey: 'code',
			header: 'Machine Code',
			size: 120,
		},
		{
			accessorKey: 'name',
			header: 'Machine Name',
			size: 180,
		},
		{
			accessorKey: 'status',
			header: 'Status',
			size: 120,
			cell: ({ row }: any) => {
				const status = row.getValue('status');
				const statusConfig = {
					running: {
						color: 'bg-green-100 text-green-800',
						icon: <Play size={12} />,
					},
					idle: {
						color: 'bg-gray-100 text-gray-800',
						icon: <Clock size={12} />,
					},
					down: {
						color: 'bg-red-100 text-red-800',
						icon: <XCircle size={12} />,
					},
					maintenance: {
						color: 'bg-purple-100 text-purple-800',
						icon: <Settings size={12} />,
					},
				};
				const config =
					statusConfig[status as keyof typeof statusConfig];
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}
					>
						{config.icon}
						{status.charAt(0).toUpperCase() + status.slice(1)}
					</span>
				);
			},
		},
		{
			accessorKey: 'currentOrder',
			header: 'Current Order',
			size: 140,
			cell: ({ row }: any) => {
				const order = row.getValue('currentOrder');
				return order ? (
					<span className="text-blue-600 font-medium">{order}</span>
				) : (
					<span className="text-gray-400">-</span>
				);
			},
		},
		{
			accessorKey: 'utilization',
			header: 'Utilization',
			size: 140,
			cell: ({ row }: any) => {
				const utilization = row.getValue('utilization');
				return (
					<div className="flex items-center space-x-2">
						<div className="flex-1 bg-gray-200 rounded-full h-2">
							<div
								className={`h-2 rounded-full ${
									utilization > 80
										? 'bg-green-500'
										: utilization > 50
											? 'bg-yellow-500'
											: 'bg-red-500'
								}`}
								style={{ width: `${utilization}%` }}
							/>
						</div>
						<span className="text-sm font-medium w-12">
							{utilization.toFixed(1)}%
						</span>
					</div>
				);
			},
		},
		{
			accessorKey: 'temperature',
			header: 'Temp (°C)',
			size: 100,
			cell: ({ row }: any) => {
				const temp = row.getValue('temperature');
				return temp ? (
					<span
						className={`text-sm ${temp > 185 ? 'text-red-600 font-medium' : 'text-gray-700'}`}
					>
						{temp.toFixed(1)}°C
					</span>
				) : (
					<span className="text-gray-400">-</span>
				);
			},
		},
		{
			accessorKey: 'speed',
			header: 'Speed (%)',
			size: 100,
			cell: ({ row }: any) => {
				const speed = row.getValue('speed');
				return speed ? (
					<span className="text-sm">{speed}%</span>
				) : (
					<span className="text-gray-400">-</span>
				);
			},
		},
		{
			accessorKey: 'location',
			header: 'Location',
			size: 150,
		},
		{
			accessorKey: 'operator',
			header: 'Operator',
			size: 120,
			cell: ({ row }: any) => {
				const operator = row.getValue('operator');
				return operator ? (
					<span className="text-sm">{operator}</span>
				) : (
					<span className="text-gray-400">-</span>
				);
			},
		},
		{
			accessorKey: 'lastUpdate',
			header: 'Last Update',
			size: 140,
			cell: ({ row }: any) => {
				const lastUpdate = row.getValue('lastUpdate');
				return (
					<span className="text-xs text-gray-500">{lastUpdate}</span>
				);
			},
		},
	];

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		machines,
		machineColumns,
		10,
		Math.ceil(machines.length / 10),
		0,
		machines.length,
		() => {}
	);

	return (
		<div className="space-y-6">
			{/* Machine Status Table */}
			<div className="rounded-lg border">
				<DatatableComponent
					table={table}
					columns={machineColumns}
					data={machines}
					tableTitle="Machine Status Monitor"
					rowCount={machines.length}
					useSearch={true}
					enableSingleSelect={false}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
				/>
			</div>
		</div>
	);
};

export default ApsMachineStatusPage;
