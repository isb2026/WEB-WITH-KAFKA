import React, { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import { useDataTable } from '@radix-ui/hook';
import DatatableComponent from '@aips/components/datatable/DatatableComponent';
import { Play, Pause, CheckCircle, AlertTriangle } from 'lucide-react';

// Types for work order data
interface WorkOrder {
	id: string;
	orderId: string;
	productName: string;
	quantity: number;
	completedQuantity: number;
	machineId: string;
	machineName: string;
	status: 'running' | 'paused' | 'completed' | 'delayed';
	startTime: string;
	estimatedEndTime: string;
	actualEndTime?: string;
	progress: number;
	priority: 'high' | 'medium' | 'low';
}

interface ApsWorkOrdersPageProps {
	refreshInterval?: number;
}

export const ApsWorkOrdersPage: React.FC<ApsWorkOrdersPageProps> = ({
	refreshInterval = 5000,
}) => {
	const { t } = useTranslation('common');
	const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

	// Initialize dummy data
	useEffect(() => {
		const dummyWorkOrders: WorkOrder[] = [
			{
				id: '1',
				orderId: 'WO-2024-001',
				productName: 'Smartphone Case A',
				quantity: 500,
				completedQuantity: 375,
				machineId: 'M001',
				machineName: 'Injection Molding #1',
				status: 'running',
				startTime: '2024-01-15 08:00',
				estimatedEndTime: '2024-01-15 16:00',
				progress: 75,
				priority: 'high',
			},
			{
				id: '2',
				orderId: 'WO-2024-002',
				productName: 'USB Cable B',
				quantity: 1000,
				completedQuantity: 200,
				machineId: 'M002',
				machineName: 'Assembly Line #2',
				status: 'delayed',
				startTime: '2024-01-15 09:00',
				estimatedEndTime: '2024-01-15 17:00',
				progress: 20,
				priority: 'medium',
			},
			{
				id: '3',
				orderId: 'WO-2024-003',
				productName: 'Power Bank C',
				quantity: 300,
				completedQuantity: 300,
				machineId: 'M003',
				machineName: 'Quality Control #1',
				status: 'completed',
				startTime: '2024-01-15 07:00',
				estimatedEndTime: '2024-01-15 15:00',
				actualEndTime: '2024-01-15 14:30',
				progress: 100,
				priority: 'low',
			},
			{
				id: '4',
				orderId: 'WO-2024-004',
				productName: 'Wireless Earphones',
				quantity: 200,
				completedQuantity: 0,
				machineId: 'M004',
				machineName: 'Packaging Line #1',
				status: 'paused',
				startTime: '2024-01-15 10:00',
				estimatedEndTime: '2024-01-15 18:00',
				progress: 0,
				priority: 'high',
			},
			{
				id: '5',
				orderId: 'WO-2024-005',
				productName: 'Tablet Stand',
				quantity: 150,
				completedQuantity: 90,
				machineId: 'M001',
				machineName: 'Injection Molding #1',
				status: 'running',
				startTime: '2024-01-15 11:00',
				estimatedEndTime: '2024-01-15 19:00',
				progress: 60,
				priority: 'medium',
			},
			{
				id: '6',
				orderId: 'WO-2024-006',
				productName: 'Phone Charger',
				quantity: 800,
				completedQuantity: 480,
				machineId: 'M002',
				machineName: 'Assembly Line #2',
				status: 'running',
				startTime: '2024-01-15 12:00',
				estimatedEndTime: '2024-01-15 20:00',
				progress: 60,
				priority: 'low',
			},
		];

		setWorkOrders(dummyWorkOrders);
	}, []);

	// Auto-refresh data simulation
	useEffect(() => {
		const interval = setInterval(() => {
			setWorkOrders((prev) =>
				prev.map((order) => {
					if (order.status === 'running' && order.progress < 100) {
						const newProgress = Math.min(
							order.progress + Math.random() * 2,
							100
						);
						const newCompletedQuantity = Math.floor(
							(order.quantity * newProgress) / 100
						);
						return {
							...order,
							progress: newProgress,
							completedQuantity: newCompletedQuantity,
							status:
								newProgress >= 100 ? 'completed' : 'running',
						};
					}
					return order;
				})
			);
		}, refreshInterval);

		return () => clearInterval(interval);
	}, [refreshInterval]);

	// Work Orders table columns
	const workOrderColumns = [
		{
			accessorKey: 'orderId',
			header: 'Order ID',
			size: 120,
		},
		{
			accessorKey: 'productName',
			header: 'Product',
			size: 180,
		},
		{
			accessorKey: 'machineName',
			header: 'Machine',
			size: 150,
		},
		{
			accessorKey: 'progress',
			header: 'Progress',
			size: 140,
			cell: ({ row }: any) => {
				const progress = row.getValue('progress');
				const status = row.original.status;
				return (
					<div className="flex items-center space-x-2">
						<div className="flex-1 bg-gray-200 rounded-full h-2">
							<div
								className={`h-2 rounded-full ${
									status === 'completed'
										? 'bg-green-500'
										: status === 'delayed'
											? 'bg-red-500'
											: status === 'paused'
												? 'bg-yellow-500'
												: 'bg-blue-500'
								}`}
								style={{ width: `${progress}%` }}
							/>
						</div>
						<span className="text-sm font-medium w-12">
							{progress.toFixed(1)}%
						</span>
					</div>
				);
			},
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
					paused: {
						color: 'bg-yellow-100 text-yellow-800',
						icon: <Pause size={12} />,
					},
					completed: {
						color: 'bg-blue-100 text-blue-800',
						icon: <CheckCircle size={12} />,
					},
					delayed: {
						color: 'bg-red-100 text-red-800',
						icon: <AlertTriangle size={12} />,
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
			accessorKey: 'priority',
			header: 'Priority',
			size: 100,
			cell: ({ row }: any) => {
				const priority = row.getValue('priority');
				const colorClass =
					priority === 'high'
						? 'bg-red-100 text-red-800'
						: priority === 'medium'
							? 'bg-yellow-100 text-yellow-800'
							: 'bg-green-100 text-green-800';
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
					>
						{priority.charAt(0).toUpperCase() + priority.slice(1)}
					</span>
				);
			},
		},
		{
			accessorKey: 'completedQuantity',
			header: 'Completed/Total',
			size: 140,
			cell: ({ row }: any) => {
				const completed = row.getValue('completedQuantity');
				const total = row.original.quantity;
				return (
					<span className="text-sm">
						{completed.toLocaleString()} / {total.toLocaleString()}
					</span>
				);
			},
		},
		{
			accessorKey: 'estimatedEndTime',
			header: 'Est. End Time',
			size: 140,
			cell: ({ row }: any) => {
				const endTime = row.getValue('estimatedEndTime');
				return <span className="text-xs text-gray-600">{endTime}</span>;
			},
		},
	];

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		workOrders,
		workOrderColumns,
		10,
		Math.ceil(workOrders.length / 10),
		0,
		workOrders.length,
		() => {}
	);

	return (
		<div className="space-y-6">
			{/* Work Orders Table */}
			<div className="rounded-lg border">
				<DatatableComponent
					table={table}
					columns={workOrderColumns}
					data={workOrders}
					tableTitle="Live Work Order Progress"
					rowCount={workOrders.length}
					useSearch={true}
					enableSingleSelect={false}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
				/>
			</div>
		</div>
	);
};

export default ApsWorkOrdersPage;
