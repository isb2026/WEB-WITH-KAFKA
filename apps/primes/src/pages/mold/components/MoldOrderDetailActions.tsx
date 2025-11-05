import React from 'react';
import { RadixButton } from '@repo/radix-ui/components';
import { Pen, Trash2, Plus } from 'lucide-react';
import { useTranslation } from '@repo/i18n';
import { MoldOrderDetailDto } from '@primes/types/mold';

interface MoldOrderDetailActionsProps {
	selectedRows: Set<string>;
	detailData: MoldOrderDetailDto[];
	onEditClick?: (item: MoldOrderDetailDto) => void;
	onDeleteClick?: (item: MoldOrderDetailDto) => void;
	onAddClick?: () => void;
}

export const MoldOrderDetailActions = ({
	selectedRows,
	detailData,
	onEditClick,
	onDeleteClick,
	onAddClick,
}: MoldOrderDetailActionsProps) => {
	const { t } = useTranslation('common');

	const handleAddClick = () => {
		if (onAddClick) {
			onAddClick();
		}
	};

	const handleEditClick = () => {
		if (selectedRows.size > 0 && onEditClick) {
			const selectedRowIndex = parseInt(Array.from(selectedRows)[0]);
			const selectedDetail = detailData[selectedRowIndex];
			console.log('MoldOrderDetailActions - handleEditClick:', {
				selectedRowIndex,
				selectedDetail,
				detailDataLength: detailData.length
			});
			if (selectedDetail) {
				onEditClick(selectedDetail);
			}
		}
	};

	const handleDeleteClick = () => {
		if (selectedRows.size > 0 && onDeleteClick) {
			const selectedRowIndex = parseInt(Array.from(selectedRows)[0]);
			const selectedDetail = detailData[selectedRowIndex];
			if (selectedDetail) {
				onDeleteClick(selectedDetail);
			}
		}
	};

	return (
		<div className="flex items-center gap-2">
			<RadixButton
				className="flex gap-1 px-2.5 py-1.5 rounded-lg text-sm items-center border"
				onClick={handleAddClick}
			>
				<Plus size={16} className="text-muted-foreground" />
			</RadixButton>
			<RadixButton
				className="flex gap-1 px-2.5 py-1.5 rounded-lg text-sm items-center border"
				onClick={handleEditClick}
				disabled={selectedRows.size === 0}
			>
				<Pen size={16} className="text-muted-foreground" />
			</RadixButton>
			<RadixButton
				className="flex gap-1 px-2.5 py-1.5 rounded-lg text-sm items-center border"
				onClick={handleDeleteClick}
				disabled={selectedRows.size === 0}
			>
				<Trash2 size={16} className="text-muted-foreground" />
			</RadixButton>
		</div>
	);
};
