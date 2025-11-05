import { DataTable } from '@repo/radix-ui/components';
import React, { useEffect, useState } from 'react';
import {
	useDataTableColumns,
	type ProcessedColumnConfig,
} from '../../../../../packages/radix-ui/src/hook/useDataTableColumns';
import { columns, getData } from '../../utils/data-table';

// Define your data type
export type Payment = {
	id: string;
	amount: number;
	status: 'pending' | 'processing' | 'success' | 'failed';
	email: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	description: string;
};

const DataTableDemo: React.FC = () => {
	const [data, setData] = useState<Payment[]>([]);
	// Define your columns that matches what you want
	const processedColumns = useDataTableColumns<Payment>(columns);

	useEffect(() => {
		// This is mock data, Welcome to use your nice real data from db
		getData().then(setData);
	}, []);

	return (
		<div className="py-2 space-y-8">
			<DataTable
				columns={processedColumns as ProcessedColumnConfig<Payment>[]}
				data={data}
			/>
		</div>
	);
};

export default DataTableDemo;
