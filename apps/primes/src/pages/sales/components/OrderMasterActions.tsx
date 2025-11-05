import { useState, useEffect } from 'react';
import { RadixButton } from '@radix-ui/components';
import { Trash2, Pen, Download, Search } from 'lucide-react';
import { HardDeleteConfirmDialog } from '@primes/components/common/HardDeleteConfirmDialog';
import { OrderMaster } from '@primes/types/sales';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';

interface OrderMasterActionsProps {
	selectedRows: Set<string>;
	masterData: OrderMaster[];
	removeMaster: {
		mutate: (ids: number[]) => void;
		isPending: boolean;
	};
}

export const OrderMasterActions = ({
	selectedRows,
	masterData,
	removeMaster,
}: OrderMasterActionsProps) => {
	const { t } = useTranslation('common');
	const navigate = useNavigate();
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
		if (selectedRows.size > 0) {
			const selectedRowIndex = parseInt(Array.from(selectedRows)[0]);
			const selectedMaster = masterData[selectedRowIndex];
			if (selectedMaster?.id) {
				localStorage.setItem(
					'selectedOrderMasterId',
					selectedMaster.id.toString()
				);
				navigate(`/sales/orders/${selectedMaster.id}`);
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
		<div className="flex items-center gap-1.5">
			<RadixButton
				variant="outline"
				className="flex gap-1 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-700 text-white"
			>
				<Search
					size={16}
					className="text-muted-foreground text-white"
				/>
				{t('table.search.searchF3')}
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
				onClick={openDeleteDialog}
				disabled={selectedRows.size === 0 || removeMaster.isPending}
			>
				<Trash2 size={16} className="text-muted-foreground" />
			</RadixButton>
			<RadixButton
				className="flex gap-1 px-2.5 py-1.5 rounded-lg text-sm items-center border"
				onClick={openDeleteDialog}
				disabled={selectedRows.size === 0 || removeMaster.isPending}
			>
				<Download size={16} className="text-muted-foreground" />
			</RadixButton>

			<HardDeleteConfirmDialog
				isOpen={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				onConfirm={handleDelete}
				isDeleting={removeMaster.isPending}
				title={t('pages.order.delete')}
				description={`${t('pages.order.deleteConfirm')} (${selectedOrderCode})`}
				itemName={t('pages.order.orderNumber')}
				itemIdentifier={selectedOrderCode}
				verificationPhrase={t('pages.order.deleteVerification')}
				warningMessage={t('pages.order.deleteWarning')}
			/>
		</div>
	);
};

export default OrderMasterActions;
