import React from 'react';
import { CHECKBOX_COL_WIDTH, SEQ_COL_WIDTH } from '..';

interface CheckboxHeaderCellProps {
	allRows: any[];
	selectedRows: Set<string>;
	toggleAllRows: (checked: boolean) => void;
	className?: string;
}

const CheckboxHeaderCell: React.FC<CheckboxHeaderCellProps> = ({
	allRows,
	selectedRows,
	toggleAllRows,
	className,
}) => {
	const allSelected =
		selectedRows.size === allRows.length && allRows.length > 0;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		toggleAllRows(e.target.checked);
	};

	return (
		<th
			className={`${className} bg-muted`}
			style={{
				position: 'sticky',
				top: 0,
				left: `${SEQ_COL_WIDTH}px`,
				width: `${CHECKBOX_COL_WIDTH}px`,
				minWidth: `${CHECKBOX_COL_WIDTH}px`,
				maxWidth: `${CHECKBOX_COL_WIDTH}px`,
				zIndex: 21,
				boxShadow: '2px 0 4px rgba(0, 0, 0, 0.06)',
			}}
		>
			<input
				type="checkbox"
				checked={allSelected}
				onChange={handleChange}
				className="h-3.5 w-3.5 text-blue-600 border-gray-300 rounded outline-none"
			/>
		</th>
	);
};

export default CheckboxHeaderCell;
