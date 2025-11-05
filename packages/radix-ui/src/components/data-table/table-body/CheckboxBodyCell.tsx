// CheckboxBodyCell.tsx
export const CheckboxBodyCell = ({
	isSelected,
	rowId,
	toggleRowSelection,
	className = '',
}: {
	isSelected: boolean;
	rowId: string;
	toggleRowSelection: (rowId: string) => void;
	className?: string;
}) => (
	<td
		className={className}
		style={{
			position: 'sticky',
			left: 0,
			zIndex: 10,
			backgroundColor: isSelected
				? 'rgba(239, 246, 255, 0.8)'
				: 'rgba(255, 255, 255, 0.8)',
			width: '48px',
			minWidth: '48px',
			maxWidth: '48px',
		}}
	>
		<input
			type="checkbox"
			checked={isSelected}
			onChange={() => toggleRowSelection(rowId)}
			className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg"
		/>
	</td>
);
