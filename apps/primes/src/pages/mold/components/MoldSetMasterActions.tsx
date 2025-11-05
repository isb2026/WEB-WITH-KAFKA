import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { MoldSetMasterDto } from '@primes/types/mold';

interface MoldSetMasterActionsProps {
	selectedRows: Set<string>;
	masterData: MoldSetMasterDto[];
	removeMaster: (ids: number[]) => Promise<void>;
	onEditClick?: (item: MoldSetMasterDto) => void;
}

export const MoldSetMasterActions: React.FC<MoldSetMasterActionsProps> = ({
	selectedRows,
	masterData,
	removeMaster,
	onEditClick,
}) => {
	const handleEdit = () => {
		if (selectedRows.size === 0) {
			return;
		}

		const selectedId = Array.from(selectedRows)[0] as string;
		
		// 방법 1: ID로 찾기 (현재 방식)
		const selectedItemById = masterData.find(
			(item) => item.id.toString() === selectedId
		);
		
		// 방법 2: 인덱스로 찾기 (다른 컴포넌트 방식)
		const rowIndex = parseInt(selectedId);
		const selectedItemByIndex = isNaN(rowIndex) ? null : masterData[rowIndex];

		const selectedItem = selectedItemById || selectedItemByIndex;

		if (selectedItem && onEditClick) {
			onEditClick(selectedItem);
		}
	};

	const handleDelete = () => {
		if (selectedRows.size === 0) {
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