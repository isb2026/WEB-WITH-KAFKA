import { Payment } from '@demo/pages/demo/DataTableDemo';
import { ColumnConfig } from '@radix-ui/hook/useDataTableColumns';

// Enhanced mock data with more columns
export async function getData(): Promise<Payment[]> {
	return [
		{
			id: 'PMT-001',
			amount: 249.99,
			status: 'pending',
			email: 'john.doe@example.com',
			name: 'John Doe',
			createdAt: '2024-01-15',
			updatedAt: '2024-01-15',
			description: 'Monthly subscription payment',
		},
		{
			id: 'PMT-002',
			amount: 149.5,
			status: 'processing',
			email: 'jane.smith@gmail.com',
			name: 'Jane Smith',
			createdAt: '2024-01-14',
			updatedAt: '2024-01-14',
			description: 'Product purchase',
		},
		{
			id: 'PMT-003',
			amount: 499.0,
			status: 'success',
			email: 'alice.johnson@outlook.com',
			name: 'Alice Johnson',
			createdAt: '2024-01-13',
			updatedAt: '2024-01-13',
			description: 'Annual subscription upgrade',
		},
		{
			id: 'PMT-004',
			amount: 89.99,
			status: 'failed',
			email: 'bob.wilson@yahoo.com',
			name: 'Bob Wilson',
			createdAt: '2024-01-12',
			updatedAt: '2024-01-12',
			description: 'One-time purchase',
		},
		{
			id: 'PMT-005',
			amount: 199.95,
			status: 'pending',
			email: 'emma.brown@example.com',
			name: 'Emma Brown',
			createdAt: '2024-01-11',
			updatedAt: '2024-01-11',
			description: 'Service payment',
		},
		{
			id: 'PMT-006',
			amount: 349.75,
			status: 'success',
			email: 'michael.lee@gmail.com',
			name: 'Michael Lee',
			createdAt: '2024-01-10',
			updatedAt: '2024-01-10',
			description: 'Bulk order payment',
		},
		{
			id: 'PMT-007',
			amount: 99.99,
			status: 'processing',
			email: 'sophia.martin@outlook.com',
			name: 'Sophia Martin',
			createdAt: '2024-01-09',
			updatedAt: '2024-01-09',
			description: 'Digital product purchase',
		},
		{
			id: 'PMT-008',
			amount: 299.0,
			status: 'failed',
			email: 'david.taylor@yahoo.com',
			name: 'David Taylor',
			createdAt: '2024-01-08',
			updatedAt: '2024-01-08',
			description: 'Premium service subscription',
		},
		{
			id: 'PMT-009',
			amount: 159.25,
			status: 'pending',
			email: 'olivia.white@example.com',
			name: 'Olivia White',
			createdAt: '2024-01-07',
			updatedAt: '2024-01-07',
			description: 'Monthly recurring payment',
		},
		{
			id: 'PMT-001',
			amount: 249.99,
			status: 'pending',
			email: 'john.doe@example.com',
			name: 'John Doe',
			createdAt: '2024-01-15',
			updatedAt: '2024-01-15',
			description: 'Monthly subscription payment',
		},
		{
			id: 'PMT-002',
			amount: 149.5,
			status: 'processing',
			email: 'jane.smith@gmail.com',
			name: 'Jane Smith',
			createdAt: '2024-01-14',
			updatedAt: '2024-01-14',
			description: 'Product purchase',
		},
		{
			id: 'PMT-003',
			amount: 499.0,
			status: 'success',
			email: 'alice.johnson@outlook.com',
			name: 'Alice Johnson',
			createdAt: '2024-01-13',
			updatedAt: '2024-01-13',
			description: 'Annual subscription upgrade',
		},
		{
			id: 'PMT-004',
			amount: 89.99,
			status: 'failed',
			email: 'bob.wilson@yahoo.com',
			name: 'Bob Wilson',
			createdAt: '2024-01-12',
			updatedAt: '2024-01-12',
			description: 'One-time purchase',
		},
		{
			id: 'PMT-010',
			amount: 399.99,
			status: 'success',
			email: 'james.moore@gmail.com',
			name: 'James Moore',
			createdAt: '2024-01-06',
			updatedAt: '2024-01-06',
			description: 'Enterprise plan upgrade',
		},
	];
}

// Enhanced columns with more data and proper sizing
export const columns: ColumnConfig<Payment>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		size: 120,
		minSize: 120,
	},
	{
		accessorKey: 'name',
		header: 'Name',
		size: 180,
		minSize: 150,
	},
	{
		accessorKey: 'status',
		header: 'Status',
		size: 120,
		minSize: 100,
		cell: ({ row }) => {
			const status = row.getValue('status') as string;
			const statusStyles: Record<string, string> = {
				pending: 'text-yellow-600 bg-yellow-100',
				processing: 'text-blue-600 bg-blue-100',
				success: 'text-green-600 bg-green-100',
				failed: 'text-red-600 bg-red-100',
			};
			return (
				<span
					className={`px-2 py-1 rounded-full text-xs font-medium ${
						statusStyles[status] || 'text-gray-600 bg-gray-100'
					}`}
				>
					{status.charAt(0).toUpperCase() + status.slice(1)}
				</span>
			);
		},
	},
	{
		accessorKey: 'email',
		header: 'Email',
		size: 230,
		minSize: 180,
		cell: ({ row }) => {
			const email = row.getValue('email') as string;
			return (
				<div className="truncate" title={email}>
					{email}
				</div>
			);
		},
	},
	{
		accessorKey: 'amount',
		header: 'Amount',
		size: 130,
		minSize: 100,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('amount') as string);
			const formatted = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			}).format(amount);
			return <div className="font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: 'createdAt',
		header: 'Created',
		size: 130,
		minSize: 100,
		cell: ({ row }) => {
			const date = new Date(row.getValue('createdAt') as string);
			return <div className="text-sm">{date.toLocaleDateString()}</div>;
		},
	},
	{
		accessorKey: 'updatedAt',
		header: 'Updated',
		size: 130,
		minSize: 100,
		cell: ({ row }) => {
			const date = new Date(row.getValue('updatedAt') as string);
			return <div className="text-sm">{date.toLocaleDateString()}</div>;
		},
	},
	{
		accessorKey: 'description',
		header: 'Description',
		size: 250,
		minSize: 200,
		cell: ({ row }) => {
			const description = row.getValue('description') as string;
			return (
				<div className="truncate" title={description}>
					{description}
				</div>
			);
		},
	},
];
