import React, { useState, useEffect } from 'react';
import { useDataTable } from '@radix-ui/hook';
import DatatableComponent from '@aips/components/datatable/DatatableComponent';
import { useTranslation } from '@repo/i18n';

// Types for capacity forecast data
interface CapacityForecast {
	id: number;
	machineName: string;
	machineCode: string;
	currentLoad: number;
	predictedLoad: number;
	maxCapacity: number;
	utilizationRate: number;
	bottleneckRisk: 'low' | 'medium' | 'high';
	maintenanceSchedule: string;
}

interface ApsCapacityForecastPageProps {
	timeRange?: '7d' | '30d' | '90d';
}

export const ApsCapacityForecastPage: React.FC<
	ApsCapacityForecastPageProps
> = ({ timeRange = '30d' }) => {
	const { t } = useTranslation('dataTable');
	const [capacityData, setCapacityData] = useState<CapacityForecast[]>([]);

	// Initialize dummy data
	useEffect(() => {
		const dummyCapacityData: CapacityForecast[] = [
			{
				id: 1,
				machineName: 'Injection Molding Machine A',
				machineCode: 'IMM-001',
				currentLoad: 75,
				predictedLoad: 85,
				maxCapacity: 100,
				utilizationRate: 85,
				bottleneckRisk: 'medium',
				maintenanceSchedule: '2024-02-15',
			},
			{
				id: 2,
				machineName: 'Assembly Line B',
				machineCode: 'ASM-002',
				currentLoad: 60,
				predictedLoad: 90,
				maxCapacity: 100,
				utilizationRate: 90,
				bottleneckRisk: 'high',
				maintenanceSchedule: '2024-02-20',
			},
			{
				id: 3,
				machineName: 'Quality Control Station',
				machineCode: 'QCS-003',
				currentLoad: 45,
				predictedLoad: 55,
				maxCapacity: 100,
				utilizationRate: 55,
				bottleneckRisk: 'low',
				maintenanceSchedule: '2024-03-01',
			},
		];

		setCapacityData(dummyCapacityData);
	}, [timeRange]);

	// Table columns
	const capacityColumns = [
		{
			accessorKey: 'machineCode',
			header: 'Machine Code',
			size: 120,
		},
		{
			accessorKey: 'machineName',
			header: 'Machine Name',
			size: 200,
		},
		{
			accessorKey: 'currentLoad',
			header: 'Current Load (%)',
			size: 120,
			cell: ({ getValue }: { getValue: () => number }) =>
				`${getValue()}%`,
		},
		{
			accessorKey: 'predictedLoad',
			header: 'Predicted Load (%)',
			size: 120,
			cell: ({ getValue }: { getValue: () => number }) =>
				`${getValue()}%`,
		},
		{
			accessorKey: 'utilizationRate',
			header: 'Utilization Rate',
			size: 120,
			cell: ({ getValue }: { getValue: () => number }) =>
				`${getValue()}%`,
		},
		{
			accessorKey: 'bottleneckRisk',
			header: 'Bottleneck Risk',
			size: 120,
			cell: ({ getValue }: { getValue: () => string }) => {
				const risk = getValue();
				const colorClass =
					risk === 'high'
						? 'text-red-600 bg-red-100'
						: risk === 'medium'
							? 'text-yellow-600 bg-yellow-100'
							: 'text-green-600 bg-green-100';
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
					>
						{risk.toUpperCase()}
					</span>
				);
			},
		},
		{
			accessorKey: 'maintenanceSchedule',
			header: 'Next Maintenance',
			size: 140,
		},
	];

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		capacityData,
		capacityColumns,
		10,
		Math.ceil(capacityData.length / 10),
		0,
		capacityData.length,
		() => {}
	);

	return (
		<div className="space-y-4">
			{/* Data Table */}
			<div className="rounded-lg border">
				<DatatableComponent
					table={table}
					columns={capacityColumns}
					data={capacityData}
					tableTitle="Machine Capacity Analysis"
					rowCount={capacityData.length}
					useSearch={true}
					enableSingleSelect={false}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
				/>
			</div>
		</div>
	);
};

export default ApsCapacityForecastPage;
