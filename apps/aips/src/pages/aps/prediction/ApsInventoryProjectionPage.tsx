import React, { useState, useEffect } from 'react';
import { useDataTable } from '@radix-ui/hook';
import DatatableComponent from '@aips/components/datatable/DatatableComponent';
import { useTranslation } from '@repo/i18n';

// Types for inventory projection data
interface InventoryProjection {
	id: number;
	itemName: string;
	itemNumber: string;
	currentStock: number;
	projectedStock: number;
	reorderPoint: number;
	safetyStock: number;
	stockoutRisk: 'low' | 'medium' | 'high';
	daysOfSupply: number;
}

interface ApsInventoryProjectionPageProps {
	timeRange?: '7d' | '30d' | '90d';
}

export const ApsInventoryProjectionPage: React.FC<
	ApsInventoryProjectionPageProps
> = ({ timeRange = '30d' }) => {
	const { t } = useTranslation('dataTable');
	const [inventoryData, setInventoryData] = useState<InventoryProjection[]>(
		[]
	);

	// Initialize dummy data
	useEffect(() => {
		const dummyInventoryData: InventoryProjection[] = [
			{
				id: 1,
				itemName: 'Smartphone Case',
				itemNumber: 'ITM-001',
				currentStock: 450,
				projectedStock: 320,
				reorderPoint: 200,
				safetyStock: 100,
				stockoutRisk: 'medium',
				daysOfSupply: 18,
			},
			{
				id: 2,
				itemName: 'Wireless Earphones',
				itemNumber: 'ITM-002',
				currentStock: 280,
				projectedStock: 150,
				reorderPoint: 150,
				safetyStock: 50,
				stockoutRisk: 'high',
				daysOfSupply: 12,
			},
			{
				id: 3,
				itemName: 'USB Cable',
				itemNumber: 'ITM-003',
				currentStock: 800,
				projectedStock: 650,
				reorderPoint: 300,
				safetyStock: 150,
				stockoutRisk: 'low',
				daysOfSupply: 25,
			},
		];

		setInventoryData(dummyInventoryData);
	}, [timeRange]);



	// Table columns
	const inventoryColumns = [
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
			accessorKey: 'currentStock',
			header: 'Current Stock',
			size: 120,
			cell: ({ getValue }: { getValue: () => number }) =>
				getValue().toLocaleString(),
		},
		{
			accessorKey: 'projectedStock',
			header: 'Projected Stock',
			size: 120,
			cell: ({ getValue }: { getValue: () => number }) =>
				getValue().toLocaleString(),
		},
		{
			accessorKey: 'daysOfSupply',
			header: 'Days of Supply',
			size: 120,
			cell: ({ getValue }: { getValue: () => number }) =>
				`${getValue()} days`,
		},
		{
			accessorKey: 'stockoutRisk',
			header: 'Stockout Risk',
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
	];

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		inventoryData,
		inventoryColumns,
		10,
		Math.ceil(inventoryData.length / 10),
		0,
		inventoryData.length,
		() => {}
	);

	return (
		<div className="space-y-6">
			{/* Data Table */}
			<div className="rounded-lg border">
				<DatatableComponent
					table={table}
					columns={inventoryColumns}
					data={inventoryData}
					tableTitle="Inventory Stock Projections"
					rowCount={inventoryData.length}
					useSearch={true}
					enableSingleSelect={false}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
				/>
			</div>
		</div>
	);
};

export default ApsInventoryProjectionPage;
