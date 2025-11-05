import { useState, useEffect } from 'react';
import { RadixButton } from '@radix-ui/components';
import { Trash2, Pen, Download, Search } from 'lucide-react';
import { HardDeleteConfirmDialog } from '@primes/components/common/HardDeleteConfirmDialog';
import { IncomingMaster } from '@primes/types/purchase/incomingMaster';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';

interface IncomingOrdersMasterActionsProps {
	selectedRows: Set<string>;
	masterData: IncomingMaster[];
	removeMaster: {
		mutate: (variables: { ids: number[] }) => void;
		isPending: boolean;
	};
}

export const IncomingOrdersMasterActions = ({
	selectedRows,
	masterData,
	removeMaster,
}: IncomingOrdersMasterActionsProps) => {
	const { t } = useTranslation('common');
	const navigate = useNavigate();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedMasterId, setSelectedMasterId] = useState<number | null>(
		null
	);
	const [selectedIncomingCode, setSelectedIncomingCode] =
		useState<string>('');

	const openDeleteDialog = () => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = parseInt(Array.from(selectedRows)[0]);
			const selectedMaster = masterData[selectedRowIndex];
			if (selectedMaster?.id) {
				setSelectedMasterId(selectedMaster.id);
				setSelectedIncomingCode(selectedMaster.incomingCode || '');
				setIsDialogOpen(true);
			}
		}
	};

	const handleEditClick = () => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = parseInt(Array.from(selectedRows)[0]);
			const selectedMaster = masterData[selectedRowIndex];
			if (selectedMaster?.id) {
				navigate(`/purchase/incoming/${selectedMaster.id}`);
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
				title={t('pages.purchase.incomingDelete')}
				description={`${t('pages.purchase.incomingDeleteConfirm')} (${selectedIncomingCode})`}
				itemName={t('pages.purchase.incomingNumber')}
				itemIdentifier={selectedIncomingCode}
				verificationPhrase={t(
					'pages.purchase.incomingDeleteVerification'
				)}
				warningMessage={t('pages.purchase.incomingDeleteWarning')}
			/>
		</div>
	);
};

export default IncomingOrdersMasterActions;
