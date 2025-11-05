import React from 'react';
import { useDataTable } from '@radix-ui/hook';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { DataTableRowType } from '@radix-ui/components/data-table';

interface FinancialData {
	id: string;
	category: string;
	total: number;
	[key: string]: any; // Allow dynamic period columns
}

interface FinancialSummaryTableProps {
	customData?: { labels: string[]; series: any[] };
	timeRange?: 'yearly' | 'monthly' | 'weekly' | 'daily';
}

// Mobile detection hook
const useIsMobile = () => {
	const [isMobile, setIsMobile] = React.useState(false);

	React.useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkIsMobile();
		window.addEventListener('resize', checkIsMobile);
		return () => window.removeEventListener('resize', checkIsMobile);
	}, []);

	return isMobile;
};

export const FinancialSummaryTable = ({ customData, timeRange = 'monthly' }: FinancialSummaryTableProps = {}) => {
	const PAGE_SIZE = 3; 
	const [currentPage, setCurrentPage] = React.useState(0);
	const [data, setData] = React.useState<FinancialData[]>([]);
	const [totalElements, setTotalElements] = React.useState(0);
	const [pageCount, setPageCount] = React.useState(0);
	const isMobile = useIsMobile();

	// Mock data based on the screenshot
	const mockData: FinancialData[] = [
		{
			id: '1',
			category: '매입금액',
			january: 0,
			february: 0,
			march: 0,
			april: 0,
			may: 2625,
			june: 200,
			july: 0,
			august: 0,
			september: 0,
			october: 0,
			november: 0,
			december: 0,
			total: 2825
		},
		{
			id: '2',
			category: '매출금액',
			january: 0,
			february: 0,
			march: 0,
			april: 0,
			may: 2000,
			june: 0,
			july: 0,
			august: 0,
			september: 0,
			october: 0,
			november: 0,
			december: 0,
			total: 2000
		},
		{
			id: '3',
			category: '매입률',
			january: 0,
			february: 0,
			march: 0,
			april: 0,
			may: 131,
			june: 0,
			july: 0,
			august: 0,
			september: 0,
			october: 0,
			november: 0,
			december: 0,
			total: 131
		}
	];

	// Format number with Korean thousands separator
	const formatNumber = (value: number) => {
		if (value === 0) return '0';
		return value.toLocaleString('ko-KR');
	};

	// Generate dynamic columns based on timeRange
	const generateTableColumns = () => {
		const baseColumns = [
			{ 
				accessorKey: 'category', 
				header: '구분', 
				size: isMobile ? 80 : 120,
				cell: ({ row }: { row: DataTableRowType<FinancialData> }) => (
					<span className="font-medium text-sm">{row.original.category}</span>
				)
			}
		];

		// Add time period columns based on timeRange
		if (customData && customData.labels) {
			customData.labels.forEach((label, index) => {
				baseColumns.push({
					accessorKey: `period_${index}`,
					header: label,
					size: isMobile ? 60 : 80,
					cell: ({ row }: { row: DataTableRowType<FinancialData> }) => (
						<span className="text-right text-sm">
							{formatNumber((row.original as any)[`period_${index}`] || 0)}
						</span>
					)
				});
			});
		}

		// Add total column
		baseColumns.push({
			accessorKey: 'total',
			header: '총합',
			size: isMobile ? 70 : 100,
			cell: ({ row }: { row: DataTableRowType<FinancialData> }) => (
				<span className="text-right font-bold bg-gray-50 px-2 py-1 rounded text-sm">
					{formatNumber(row.original.total)}
				</span>
			)
		});

		return baseColumns;
	};

	const FinancialTableColumns = generateTableColumns();

	// Page change handler
	const onPageChange = (pagination: { pageIndex: number }) => {
		setCurrentPage(pagination.pageIndex);
	};

	// Convert AnalysisChart data to table format
	const convertChartDataToTable = (chartData: { labels: string[]; series: any[] }) => {
		const tableData: FinancialData[] = [];
		
		chartData.series.forEach((series, index) => {
			const rowData: any = {
				id: (index + 1).toString(),
				category: series.name,
				total: 0
			};

			// Map data to dynamic periods based on labels
			series.data.forEach((value: number, periodIndex: number) => {
				rowData[`period_${periodIndex}`] = value;
			});

			// Calculate total
			rowData.total = series.data.reduce((sum: number, val: number) => sum + val, 0);

			tableData.push(rowData);
		});

		return tableData;
	};

	// Initialize data
	React.useEffect(() => {
		if (customData) {
			const convertedData = convertChartDataToTable(customData);
			setData(convertedData);
			setTotalElements(convertedData.length);
			setPageCount(Math.ceil(convertedData.length / PAGE_SIZE));
		} else {
			setData(mockData);
			setTotalElements(mockData.length);
			setPageCount(Math.ceil(mockData.length / PAGE_SIZE));
		}
	}, [customData, timeRange]);

	// DataTable hook
	const {
		table,
		toggleRowSelection,
		selectedRows,
	} = useDataTable(
		data,
		FinancialTableColumns,
		PAGE_SIZE,
		pageCount,
		currentPage,
		totalElements,
		onPageChange
	);

	// Custom search slot with unit information
	const CustomSearchSlot = (
		<div className="flex items-center gap-4">
			<div className="flex items-center gap-2">
				<span className="text-sm text-gray-600">단위:</span>
				<span className="text-sm font-medium">1,000(원)</span>
			</div>
		</div>
	);

	// Mobile version - Simplified card layout
	if (isMobile) {
		return (
			<div className="space-y-3">
				{/* Header */}
				<div className="flex items-center justify-between">
					<h3 className="text-sm font-bold text-gray-900">재무 요약</h3>
					<div className="flex items-center gap-2">
						<span className="text-xs text-gray-600">단위:</span>
						<span className="text-xs font-medium">1,000(원)</span>
					</div>
				</div>

				{/* Mobile cards for each row */}
				{data.map((row) => (
					<div key={row.id} className="bg-gray-50 rounded-lg p-3">
						<div className="flex justify-between items-center mb-2">
							<span className="font-medium text-sm text-gray-900">{row.category}</span>
							<span className="font-bold text-sm bg-blue-100 px-2 py-1 rounded">
								총합: {formatNumber(row.total)}
							</span>
						</div>
						
						{/* Period values in a grid */}
						<div className="grid grid-cols-4 gap-2">
							{customData?.labels.map((label, index) => (
								<div key={index} className="text-center">
									<div className="text-xs text-gray-500 mb-1">{label}</div>
									<div className="text-sm font-medium">
										{formatNumber((row as any)[`period_${index}`] || 0)}
									</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		);
	}

	// Desktop version
	return (
		<div style={{ height: 'auto', maxHeight: '250px' }}>
			<DatatableComponent
				table={table}
				columns={FinancialTableColumns}
				data={data}
				tableTitle="표"
				rowCount={data.length}
				useSearch={false}
				selectedRows={selectedRows}
				toggleRowSelection={toggleRowSelection}
				searchSlot={CustomSearchSlot}
				usePageNation={false}
			/>
		</div>
	);
};

export default FinancialSummaryTable; 