import { useState, useEffect } from 'react';
import { RadixButton } from '@radix-ui/components';
import { Trash2, Pen, Download, Search } from 'lucide-react';
import { HardDeleteConfirmDialog } from '@primes/components/common/HardDeleteConfirmDialog';
import { EstimateMaster } from '@primes/types/sales/estimateMaster';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';

interface EstimateMasterActionsProps {
	selectedRows: Set<string>;
	masterData: EstimateMaster[];
	removeMaster: {
		mutate: (variables: { ids: number[] }) => void;
		isPending: boolean;
	};
}

export const EstimateMasterActions = ({
	selectedRows,
	masterData,
	removeMaster,
}: EstimateMasterActionsProps) => {
	const { t } = useTranslation('common');
	const navigate = useNavigate();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedMasterId, setSelectedMasterId] = useState<number | null>(
		null
	);
	const [selectedEstimateCode, setSelectedEstimateCode] =
		useState<string>('');

	const openDeleteDialog = () => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = parseInt(Array.from(selectedRows)[0]);
			const selectedMaster = masterData[selectedRowIndex];
			if (selectedMaster?.id) {
				setSelectedMasterId(selectedMaster.id);
				setSelectedEstimateCode(selectedMaster.estimateCode || '');
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
					'selectedEstimateMasterId',
					selectedMaster.id.toString()
				);
				navigate(`/sales/estimate/${selectedMaster.id}`);
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
				title={t('pages.estimate.delete')}
				description={`${t('pages.estimate.deleteConfirm')} (${selectedEstimateCode})`}
				itemName={t('pages.estimate.estimateNumber')}
				itemIdentifier={selectedEstimateCode}
				verificationPhrase={t('pages.estimate.deleteVerification')}
				warningMessage={t('pages.estimate.deleteWarning')}
			/>
		</div>
	);
};

export default EstimateMasterActions;
