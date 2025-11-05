import { useState, useEffect } from 'react';
import { RadixButton } from '@radix-ui/components';
import { Trash2, Pen, Search } from 'lucide-react';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { ItemsVendor } from '@primes/types/purchase/itemsVendor';
import { useTranslation } from '@repo/i18n';
import { toast } from 'sonner';

interface ItemsVendorActionsProps {
	selectedRows: Set<string>;
	data: ItemsVendor[];
	onEditClick: (item: ItemsVendor) => void;
	removeItemsVendor: {
		mutate: (variables: { ids: number[] }) => void;
		isPending: boolean;
	};
}

export const ItemsVendorActions = ({
	selectedRows,
	data,
	onEditClick,
	removeItemsVendor,
}: ItemsVendorActionsProps) => {
	const { t } = useTranslation('common');
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedItemsVendor, setSelectedItemsVendor] =
		useState<ItemsVendor | null>(null);

	const handleEditClick = () => {
		if (selectedRows.size === 1) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const selectedItem = data[Number(selectedRowIndex)];
			if (selectedItem) {
				onEditClick(selectedItem);
			} else {
				toast.warning('선택된 항목을 찾을 수 없습니다.');
			}
		} else if (selectedRows.size === 0) {
			toast.warning(t('pages.actions.noRowSelectedEdit'));
		}
	};

	const openDeleteDialog = () => {
		if (selectedRows.size === 1) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const selectedItem = data[Number(selectedRowIndex)];
			if (selectedItem) {
				setSelectedItemsVendor(selectedItem);
				setIsDialogOpen(true);
			} else {
				toast.warning('선택된 항목을 찾을 수 없습니다.');
			}
		} else if (selectedRows.size === 0) {
			toast.warning(t('pages.actions.noRowSelectedDelete'));
		} else {
			toast.warning(t('pages.actions.multipleRowsSelectedDelete'));
		}
	};

	const handleDeleteConfirm = () => {
		if (selectedItemsVendor) {
			removeItemsVendor.mutate({ ids: [selectedItemsVendor.id] });
		}
	};

	// Close dialog when deletion is complete - following IncomingOrdersMasterActions pattern
	useEffect(() => {
		if (!removeItemsVendor.isPending && isDialogOpen) {
			setIsDialogOpen(false);
		}
	}, [removeItemsVendor.isPending]);

	return (
		<div className="flex items-center gap-2">
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
				disabled={selectedRows.size !== 1}
			>
				<Pen size={16} className="text-muted-foreground" />
				{t('pages.actions.edit')}
			</RadixButton>
			<RadixButton
				className="flex gap-1 px-2.5 py-1.5 rounded-lg text-sm items-center border"
				onClick={openDeleteDialog}
				disabled={
					selectedRows.size !== 1 || removeItemsVendor.isPending
				}
			>
				<Trash2 size={16} className="text-muted-foreground" />
				{t('pages.actions.delete')}
			</RadixButton>

			<DeleteConfirmDialog
				isOpen={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				onConfirm={handleDeleteConfirm}
				isDeleting={removeItemsVendor.isPending}
				title={t('pages.itemsVendor.delete')}
				description={t('pages.itemsVendor.deleteConfirm')}
			/>
		</div>
	);
};

export default ItemsVendorActions;
