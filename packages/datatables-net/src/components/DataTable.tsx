import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';
import 'datatables.net-buttons/js/buttons.colVis.min.js';
// Ensure JSZip and pdfmake are loaded before buttons
import 'jszip';
import 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';
import 'datatables.net-fixedcolumns';
import 'datatables.net-select';
import 'datatables.net-responsive';

// Import styles for buttons
import 'datatables.net-buttons-dt/css/buttons.dataTables.min.css';
import 'datatables.net-fixedcolumns-dt/css/fixedColumns.dataTables.min.css';
import 'datatables.net-select-dt/css/select.dataTables.min.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.min.css';

export interface Column {
	title: string;
	data: string | null;
	render?: (data: any, type: string, row: any) => string | JSX.Element;
	className?: string;
	width?: string;
	visible?: boolean;
	orderable?: boolean;
	searchable?: boolean;
	pinned?: 'left' | 'right';
}

export interface DataTableProps {
	data: any[];
	columns: Column[];
	options?: {
		pageLength?: number;
		searching?: boolean;
		ordering?: boolean;
		paging?: boolean;
		info?: boolean;
		responsive?: boolean;
		scrollX?: boolean;
		select?: boolean | { style: 'single' | 'multi' | 'os' | 'multi+shift' };
		pinnedColumns?: {
			left?: number;
			right?: number;
		};
		buttons?: string[];
		className?: string;
		darkMode?: boolean;
	};
	onRowSelect?: (selectedRows: any[]) => void;
}

const DataTable: React.FC<DataTableProps> = ({
	data,
	columns,
	options = {},
	onRowSelect,
}) => {
	const tableRef = useRef<HTMLTableElement>(null);
	const [selectedRows, setSelectedRows] = useState<any[]>([]);
	const dtRef = useRef<any>(null);

	const {
		pageLength = 10,
		searching = true,
		ordering = true,
		paging = true,
		info = true,
		responsive = true,
		scrollX = true,
		select = true,
		pinnedColumns = { left: 0, right: 0 },
		buttons = ['copy', 'csv', 'excel', 'pdf', 'print', 'colvis'],
		className = '',
		darkMode = false,
	} = options;

	// Process columns to identify pinned columns
	const processedColumns = columns.map((col) => {
		const column = { ...col };
		delete column.pinned;
		return column;
	});

	// Count pinned columns
	const leftPinnedCount = columns.filter(
		(col) => col.pinned === 'left'
	).length;
	const rightPinnedCount = columns.filter(
		(col) => col.pinned === 'right'
	).length;

	useEffect(() => {
		if (!tableRef.current) return;

		// Initialize DataTable with type assertion to avoid TypeScript errors
		const dt = $(tableRef.current).DataTable({
			data,
			columns: processedColumns,
			pageLength,
			searching,
			ordering,
			paging,
			info,
			responsive,
			scrollX,
			select: select
				? {
						style:
							typeof select === 'object' ? select.style : 'multi',
					}
				: false,
			// @ts-ignore - fixedColumns is provided by datatables.net-fixedcolumns plugin
			fixedColumns: {
				left: Math.max(leftPinnedCount, pinnedColumns.left || 0),
				right: Math.max(rightPinnedCount, pinnedColumns.right || 0),
			},
			dom: 'Bfrtip',
			buttons: buttons,
			language: {
				search: '검색:',
				lengthMenu: '_MENU_ 개씩 보기',
				info: '_START_ - _END_ / _TOTAL_',
				infoEmpty: '데이터가 없습니다',
				infoFiltered: '(전체 _MAX_ 개 중 검색결과)',
				paginate: {
					first: '처음',
					last: '마지막',
					next: '다음',
					previous: '이전',
				},
			},
		});

		dtRef.current = dt;

		// Handle row selection
		if (onRowSelect) {
			dt.on('select', () => {
				const selectedData = dt
					.rows({ selected: true })
					.data()
					.toArray();
				setSelectedRows(selectedData);
				onRowSelect(selectedData);
			});

			dt.on('deselect', () => {
				const selectedData = dt
					.rows({ selected: true })
					.data()
					.toArray();
				setSelectedRows(selectedData);
				onRowSelect(selectedData);
			});
		}

		return () => {
			dt.destroy();
		};
	}, [data, columns, options, onRowSelect]);

	return (
		<div className={`datatable-wrapper ${darkMode ? 'dark' : ''}`}>
			<table
				ref={tableRef}
				className={`display nowrap w-full ${className}`}
			>
				<thead>
					<tr>
						{columns.map((column, index) => (
							<th key={index}>{column.title}</th>
						))}
					</tr>
				</thead>
			</table>
		</div>
	);
};

export default DataTable;
