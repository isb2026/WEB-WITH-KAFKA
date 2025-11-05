import React, { useState, useEffect } from 'react';
import { RadixButton } from '@repo/radix-ui/components';
import { Pen, Trash2, Download } from 'lucide-react';
import { useTranslation } from '@repo/i18n';
import { MoldOrderMasterDto } from '@primes/types/mold';
import { HardDeleteConfirmDialog } from '@primes/components/common/HardDeleteConfirmDialog';

interface MoldOrderMasterActionsProps {
	selectedRows: Set<string>;
	masterData: MoldOrderMasterDto[];
	removeMaster: any;
	onEditClick?: (item: MoldOrderMasterDto) => void;
}

export const MoldOrderMasterActions = ({
	selectedRows,
	masterData,
	removeMaster,
	onEditClick,
}: MoldOrderMasterActionsProps) => {
	const { t } = useTranslation('common');
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedMasterId, setSelectedMasterId] = useState<number | null>(
		null
	);
	const [selectedOrderCode, setSelectedOrderCode] = useState<string>('');

	const openDeleteDialog = () => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = parseInt(Array.from(selectedRows)[0]);
			const selectedMaster = masterData[selectedRowIndex];
			if (selectedMaster?.id) {
				setSelectedMasterId(selectedMaster.id);
				setSelectedOrderCode(selectedMaster.orderCode || '');
				setIsDialogOpen(true);
			}
		}
	};

	const handleEditClick = () => {
		if (selectedRows.size > 0 && onEditClick) {
			const selectedRowIndex = parseInt(Array.from(selectedRows)[0]);
			const selectedMaster = masterData[selectedRowIndex];
			if (selectedMaster?.id) {
				onEditClick(selectedMaster);
			}
		}
	};

	const handleDelete = () => {
		if (selectedMasterId) {
			removeMaster.mutate([selectedMasterId]);
		}
	};

	useEffect(() => {
		if (!removeMaster.isPending && isDialogOpen) {
			setIsDialogOpen(false);
		}
	}, [removeMaster.isPending]);

	return (
		<>
			<div className="flex items-center gap-1.5">
				<RadixButton
					className="flex gap-1 px-2 py-1.5 rounded-lg text-sm items-center border"
					onClick={handleEditClick}
					disabled={selectedRows.size === 0}
				>
					<Pen size={16} className="text-muted-foreground" />
				</RadixButton>
				<RadixButton
					className="flex gap-1 px-2 py-1.5 rounded-lg text-sm items-center border"
					onClick={openDeleteDialog}
					disabled={selectedRows.size === 0 || removeMaster.isPending}
				>
					<Trash2 size={16} className="text-muted-foreground" />
				</RadixButton>
				<RadixButton
					className="flex gap-1 px-2 py-1.5 rounded-lg text-sm items-center border"
					onClick={openDeleteDialog}
					disabled={selectedRows.size === 0 || removeMaster.isPending}
				>
					<Download size={16} className="text-muted-foreground" />
				</RadixButton>
			</div>

			<HardDeleteConfirmDialog
				isOpen={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				onConfirm={handleDelete}
				isDeleting={removeMaster.isPending}
				title={t('pages.mold.orders.delete')}
				description={`${t('pages.mold.orders.deleteConfirm')} (${selectedOrderCode})`}
				itemName={t('pages.mold.orders.orderNumber')}
				itemIdentifier={selectedOrderCode}
				verificationPhrase={t('pages.mold.orders.deleteVerification')}
				warningMessage={t('pages.mold.orders.deleteWarning')}
			/>
		</>
	);
};

export default MoldOrderMasterActions;
