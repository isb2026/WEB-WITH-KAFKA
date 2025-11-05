import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { MoldBomMasterDto } from '@primes/types/mold';

interface MoldBomMasterActionsProps {
	selectedRows: Set<string>;
	masterData: MoldBomMasterDto[];
	removeMaster: (ids: number[]) => Promise<void>;
	onEditClick?: (item: MoldBomMasterDto) => void;
}

export const MoldBomMasterActions: React.FC<MoldBomMasterActionsProps> = ({
	selectedRows,
	masterData,
	removeMaster,
	onEditClick,
}) => {
	const handleEdit = () => {
		if (selectedRows.size === 0) {
			console.warn('No row selected for editing');
			return;
		}

		const selectedRowIndex = Array.from(selectedRows)[0] as string;
		const rowIndex = parseInt(selectedRowIndex);
		
		if (isNaN(rowIndex) || rowIndex < 0 || rowIndex >= masterData.length) {
			console.warn('Invalid row index:', rowIndex);
			return;
		}
		
		const selectedItem = masterData[rowIndex];

		if (selectedItem && onEditClick) {
			onEditClick(selectedItem);
		} else {
			console.warn('selectedItem not found or onEditClick not provided');
		}
	};

	const handleDelete = () => {
		if (selectedRows.size === 0) {
			console.warn('No rows selected for deletion');
			return;
		}

		const selectedIds = Array.from(selectedRows).map((id) =>
			parseInt(id as string)
		);

		removeMaster(selectedIds).catch((error) => {
			console.error('Delete failed:', error);
		});
	};

	return (
		<ActionButtonsComponent
			useEdit={true}
			useRemove={true}
			edit={handleEdit}
			remove={handleDelete}
		/>
	);
};
