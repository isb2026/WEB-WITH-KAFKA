import React from 'react';
import { RadixButton } from '@radix-ui/components';
import { Plus, RotateCw, Pen, Trash2 } from 'lucide-react';
import { useTranslation } from '@repo/i18n';
import { toast } from 'sonner';

interface MoldBomDetailRegisterActionsProps {
	newMoldBomMasterId: number | null;
	selectedRows: Set<string>;
	listByMasterId: any;
	onAddClick: () => void;
	onEditClick: () => void;
	onDeleteClick: (detail: any) => void;
	onAddRowClick?: () => void;
}

export const MoldBomDetailRegisterActions = ({
	newMoldBomMasterId,
	selectedRows,
	listByMasterId,
	onAddClick,
	onEditClick,
	onDeleteClick,
	onAddRowClick,
}: MoldBomDetailRegisterActionsProps) => {
	const { t } = useTranslation('common');

	const handleEditClick = () => {
		if (selectedRows.size === 0) {
			toast.warning(t('pages.actions.noRowSelectedEdit'));
			return;
		}
		onEditClick();
	};

	const handleDeleteClick = () => {
		if (selectedRows.size === 0) {
			toast.warning(t('pages.actions.noRowSelectedDelete'));
			return;
		} else {
			// 선택된 행의 데이터를 가져와서 삭제 처리
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex = parseInt(selectedRowIndex);
			if (
				!isNaN(rowIndex) &&
				rowIndex >= 0 &&
				listByMasterId?.data &&
				Array.isArray(listByMasterId.data) &&
				rowIndex < listByMasterId.data.length
			) {
				const selectedRow = listByMasterId.data[rowIndex];
				onDeleteClick(selectedRow);
			}
		}
	};

	return (
		<div className="flex items-center gap-2.5 ">
			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
					newMoldBomMasterId === null
						? 'bg-gray-200 text-gray-400 cursor-not-allowed'
						: 'bg-Colors-Brand-600 text-gray-200'
				}`}
				onClick={onAddClick}
			>
				<Plus
					size={16}
					className={`${
						newMoldBomMasterId === null
							? 'text-gray-400'
							: 'text-gray-200'
					}`}
				/>
				{t('pages.actions.newWindowRegister')}
			</RadixButton>

			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
					newMoldBomMasterId === null
						? 'bg-gray-200 text-gray-400 cursor-not-allowed'
						: 'bg-Colors-Brand-600 text-white'
				}`}
				disabled={newMoldBomMasterId === null}
				onClick={onAddRowClick}
			>
				<RotateCw
					size={16}
					className={`${
						newMoldBomMasterId === null
							? 'text-gray-400'
							: 'text-gray-200'
					}`}
				/>
				{t('pages.actions.addRow')}
			</RadixButton>

			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border`}
				onClick={handleEditClick}
			>
				<Pen size={16} />
				{t('pages.actions.edit')}
			</RadixButton>

			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
					newMoldBomMasterId === null
						? ' cursor-not-allowed bg-gray-200 text-gray-400'
						: ''
				}`}
				disabled={newMoldBomMasterId === null}
				onClick={handleDeleteClick}
			>
				<Trash2
					size={16}
					className={`${
						newMoldBomMasterId === null
							? 'text-gray-400 '
							: 'text-muted-foreground'
					}`}
				/>
				{t('pages.actions.delete')}
			</RadixButton>
		</div>
	);
};

export default MoldBomDetailRegisterActions;
