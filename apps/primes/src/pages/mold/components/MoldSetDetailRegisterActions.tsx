import React from 'react';
import { RadixButton } from '@radix-ui/components';
import { Plus, RotateCw, Pen, Trash2, Save } from 'lucide-react';
import { useTranslation } from '@repo/i18n';
import { toast } from 'sonner';

interface MoldSetDetailRegisterActionsProps {
	newMoldSetMasterId: number | null;
	selectedRows: Set<string>;
	detailData: any[];
	onAddClick: () => void;
	onEditClick: () => void;
	onDeleteClick: (detail: any) => void;
	onSaveClick: () => void;
	isSaving?: boolean;
	isDetailsSaved?: boolean;
}

export const MoldSetDetailRegisterActions = ({
	newMoldSetMasterId,
	selectedRows,
	detailData,
	onAddClick,
	onEditClick,
	onDeleteClick,
	onSaveClick,
	isSaving = false,
	isDetailsSaved = false,
}: MoldSetDetailRegisterActionsProps) => {
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
				detailData &&
				Array.isArray(detailData) &&
				rowIndex < detailData.length
			) {
				const selectedRow = detailData[rowIndex];
				onDeleteClick(selectedRow);
			}
		}
	};

	return (
		<div className="flex items-center gap-2.5 ">
			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
					newMoldSetMasterId === null
						? 'bg-gray-200 text-gray-400 cursor-not-allowed'
						: 'bg-Colors-Brand-600 text-white hover:bg-Colors-Brand-700'
				}`}
				onClick={onAddClick}
				disabled={newMoldSetMasterId === null}
			>
				<Plus
					size={16}
					className={`${
						newMoldSetMasterId === null
							? 'text-gray-400'
							: 'text-white'
					}`}
				/>
				{t('pages.actions.newWindowRegister')}
			</RadixButton>

			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
					newMoldSetMasterId === null || detailData.length === 0 || isSaving || isDetailsSaved
						? ' cursor-not-allowed bg-gray-200 text-gray-400'
						: 'bg-Colors-Brand-600 text-white hover:bg-Colors-Brand-700'
				}`}
				disabled={newMoldSetMasterId === null || detailData.length === 0 || isSaving || isDetailsSaved}
				onClick={onSaveClick}
			>
				<Save
					size={16}
					className={`${
						newMoldSetMasterId === null || detailData.length === 0 || isSaving || isDetailsSaved
							? 'text-gray-400'
							: 'text-white'
					}`}
				/>
				{isSaving ? '저장 중...' : isDetailsSaved ? '저장 완료' : '저장'}
			</RadixButton>

			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
					newMoldSetMasterId === null
						? ' cursor-not-allowed bg-gray-200 text-gray-400'
						: ''
				}`}
				disabled={newMoldSetMasterId === null}
				onClick={handleDeleteClick}
			>
				<Trash2
					size={16}
					className={`${
						newMoldSetMasterId === null
							? 'text-gray-400 '
							: 'text-muted-foreground'
					}`}
				/>
				{t('pages.actions.delete')}
			</RadixButton>
		</div>
	);
};

export default MoldSetDetailRegisterActions;