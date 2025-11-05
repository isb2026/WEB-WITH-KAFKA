import React, { useEffect } from 'react';
import { PageTemplate } from '@primes/templates';
import {
	DataTable,
	useDataTable,
	createColumn,
	createPinnedColumn,
	dateFormatter,
	currencyFormatter,
} from '../../../../../packages/datatables-net/src';

const DataTablesNetTest: React.FC = () => {
	const { handleRowSelect } = useDataTable({
		onSelectionChange: (rows) => console.log('Selected rows:', rows),
	});

	// Ensure required libraries are loaded for Excel export
	useEffect(() => {
		// This ensures the DOM is ready before initializing
		const script = document.createElement('script');
		script.src =
			'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
		script.async = true;
		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	// Generate sample data using a loop
	const generateSampleData = (count: number) => {
		const result = [];
		for (let i = 1; i <= count; i++) {
			result.push({
				id: i,
				name: `User${(i % 10) + 1}`,
				position: `Position${(i % 5) + 1}`,
				office: `Office${(i % 8) + 1}`,
				age: 25 + (i % 25),
				startDate: `2023-${((i % 12) + 1).toString().padStart(2, '0')}-${((i % 28) + 1).toString().padStart(2, '0')}`,
				salary: 50000 + i * 500,
			});
		}
		return result;
	};

	const data = generateSampleData(100);

	const formatDate = dateFormatter();
	const formatCurrency = currencyFormatter();

	const columns = [
		createPinnedColumn('ID', 'id', 'left'),
		createPinnedColumn('Name', 'name', 'left'),
		createColumn('Position', 'position'),
		createColumn('Office', 'office'),
		createColumn('Age', 'age'),
		createColumn('Start Date', 'startDate', {
			render: (data) => formatDate(data),
		}),
		createColumn('Salary', 'salary', {
			render: (data) => formatCurrency(data),
		}),
	];

	return (
		<PageTemplate>
			<DataTable
				data={data}
				columns={columns}
				options={{
					pinnedColumns: { left: 2, right: 1 },
					select: { style: 'multi' },
					buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
					scrollX: true,
					responsive: true,
					paging: true,
					info: true,
					searching: true,
					pageLength: 15,
				}}
				onRowSelect={handleRowSelect}
			/>
		</PageTemplate>
	);
};

export default DataTablesNetTest;
