import React, { useState, useEffect } from 'react';
import { useDataTable } from '@radix-ui/hook';
import DatatableComponent from '@aips/components/datatable/DatatableComponent';
import { useTranslation } from '@repo/i18n';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

// Types for demand forecast data
interface DemandForecast {
	id: number;
	itemName: string;
	itemNumber: string;
	currentDemand: number;
	predictedDemand: number;
	trend: 'up' | 'down' | 'stable';
	confidence: number;
	forecastPeriod: string;
	riskLevel: 'low' | 'medium' | 'high';
}

interface ApsDemandForecastPageProps {
	timeRange?: '7d' | '30d' | '90d';
}

export const ApsDemandForecastPage: React.FC<ApsDemandForecastPageProps> = ({
	timeRange = '30d',
}) => {
	const { t } = useTranslation('dataTable');
	const [demandData, setDemandData] = useState<DemandForecast[]>([]);

	// Initialize dummy data
	useEffect(() => {
		const dummyDemandData: DemandForecast[] = [
			{
				id: 1,
				itemName: 'Smartphone Case',
				itemNumber: 'ITM-001',
				currentDemand: 150,
				predictedDemand: 180,
				trend: 'up',
				confidence: 85,
				forecastPeriod: '30 days',
				riskLevel: 'low',
			},
			{
				id: 2,
				itemName: 'Wireless Earphones',
				itemNumber: 'ITM-002',
				currentDemand: 200,
				predictedDemand: 160,
				trend: 'down',
				confidence: 78,
				forecastPeriod: '30 days',
				riskLevel: 'medium',
			},
			{
				id: 3,
				itemName: 'USB Cable',
				itemNumber: 'ITM-003',
				currentDemand: 300,
				predictedDemand: 320,
				trend: 'up',
				confidence: 92,
				forecastPeriod: '30 days',
				riskLevel: 'low',
			},
			{
				id: 4,
				itemName: 'Power Bank',
				itemNumber: 'ITM-004',
				currentDemand: 120,
				predictedDemand: 95,
				trend: 'down',
				confidence: 71,
				forecastPeriod: '30 days',
				riskLevel: 'high',
			},
		];

		setDemandData(dummyDemandData);
	}, [timeRange]);



	// Table columns
	const demandColumns = [
		{
			accessorKey: 'itemNumber',
			header: 'Item Code',
			size: 120,
		},
		{
			accessorKey: 'itemName',
			header: 'Item Name',
			size: 200,
		},
		{
			accessorKey: 'currentDemand',
			header: 'Current Demand',
			size: 120,
			cell: ({ getValue }: { getValue: () => number }) =>
				getValue().toLocaleString(),
		},
		{
			accessorKey: 'predictedDemand',
			header: 'Predicted Demand',
			size: 120,
			cell: ({ getValue }: { getValue: () => number }) =>
				getValue().toLocaleString(),
		},
		{
			accessorKey: 'trend',
			header: 'Trend',
			size: 100,
			cell: ({ getValue }: { getValue: () => string }) => {
				const trend = getValue();
				return (
					<div className="flex items-center gap-1">
						{trend === 'up' ? (
							<TrendingUp className="w-4 h-4 text-green-500" />
						) : trend === 'down' ? (
							<TrendingDown className="w-4 h-4 text-red-500" />
						) : (
							<Activity className="w-4 h-4 text-gray-500" />
						)}
						<span className="capitalize">{trend}</span>
					</div>
				);
			},
		},
		{
			accessorKey: 'confidence',
			header: 'Confidence',
			size: 100,
			cell: ({ getValue }: { getValue: () => number }) =>
				`${getValue()}%`,
		},
		{
			accessorKey: 'riskLevel',
			header: 'Risk Level',
			size: 100,
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
	];

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		demandData,
		demandColumns,
		10,
		Math.ceil(demandData.length / 10),
		0,
		demandData.length,
		() => {}
	);

	return (
		<div className="space-y-6">
			{/* Data Table */}
			<div className="rounded-lg border">
				<DatatableComponent
					table={table}
					columns={demandColumns}
					data={demandData}
					tableTitle="Demand Forecast Details"
					rowCount={demandData.length}
					useSearch={true}
					enableSingleSelect={false}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
				/>
			</div>
		</div>
	);
};

export default ApsDemandForecastPage;
