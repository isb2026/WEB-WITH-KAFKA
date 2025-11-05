import { useState, useEffect } from 'react';
import { RadixButton } from '@radix-ui/components';
import { Trash2, Pen, Download, Search } from 'lucide-react';
import { HardDeleteConfirmDialog } from '@primes/components/common/HardDeleteConfirmDialog';
import { TaxInvoiceMaster } from '@primes/types/sales/taxInvoiceMaster';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';

interface TaxInvoiceMasterActionsProps {
	selectedRows: Set<string>;
	masterData: TaxInvoiceMaster[];
	removeMaster: {
		mutate: (variables: { ids: number[] }) => void;
		isPending: boolean;
	};
}

export const TaxInvoiceMasterActions = ({
	selectedRows,
	masterData,
	removeMaster,
}: TaxInvoiceMasterActionsProps) => {
	const { t } = useTranslation('common');
	const navigate = useNavigate();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedMasterId, setSelectedMasterId] = useState<number | null>(
		null
	);
	const [selectedTaxInvoiceCode, setSelectedTaxInvoiceCode] =
		useState<string>('');

	const openDeleteDialog = () => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = parseInt(Array.from(selectedRows)[0]);
			const selectedMaster = masterData[selectedRowIndex];
			if (selectedMaster?.id) {
				setSelectedMasterId(selectedMaster.id);
				setSelectedTaxInvoiceCode(selectedMaster.taxInvoiceCode || '');
				setIsDialogOpen(true);
			}
		}
	};

	const handleEditClick = () => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = parseInt(Array.from(selectedRows)[0]);
			const selectedMaster = masterData[selectedRowIndex];
			if (selectedMaster?.id) {
				// ✅ 로컬 스토리지에 선택된 masterId 저장
				localStorage.setItem(
					'selectedTaxInvoiceMasterId',
					selectedMaster.id.toString()
				);
				navigate(`/sales/tax-invoice/${selectedMaster.id}`);
			}
		}
	};

	const handleDelete = () => {
		if (selectedMasterId) {
			removeMaster.mutate({ ids: [selectedMasterId] });
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
				className="flex gap-1 px-2 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-700 text-white"
			>
				<Search
					size={16}
					className="text-muted-foreground text-white"
				/>
				{t('table.search.searchF3')}
			</RadixButton>
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

			<HardDeleteConfirmDialog
				isOpen={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				onConfirm={handleDelete}
				isDeleting={removeMaster.isPending}
				title={t('pages.taxInvoice.delete')}
				description={`${t('pages.taxInvoice.deleteConfirm')} (${selectedTaxInvoiceCode})`}
				itemName={t('pages.taxInvoice.taxInvoiceNumber')}
				itemIdentifier={selectedTaxInvoiceCode}
				verificationPhrase={t('pages.taxInvoice.deleteVerification')}
				warningMessage={t('pages.taxInvoice.deleteWarning')}
			/>
		</div>
	);
};

export default TaxInvoiceMasterActions;
