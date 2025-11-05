import { RadixButton } from '@radix-ui/components';
import { Pen, RotateCw, Trash2, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import { IncomingDetail } from '@primes/types/purchase/incomingDetail';
import { useTranslation } from '@repo/i18n';

interface IncomingOrdersDetailRegisterActionsProps {
	newIncomingMasterId: number | null;
	selectedRows: Set<string>;
	listByMasterId: {
		data?: {
			content?: IncomingDetail[];
		};
	};
	onAddClick: () => void;
	onEditClick: (detail: IncomingDetail) => void;
	onDeleteClick: (detail: IncomingDetail) => void;
	onAddRowClick?: () => void;
	onSaveAddRows?: () => void;
	hasAddRowData?: boolean;
}

export const IncomingOrdersDetailRegisterActions = ({
	newIncomingMasterId,
	selectedRows,
	listByMasterId,
	onAddClick,
	onEditClick,
	onDeleteClick,
	onAddRowClick,
	onSaveAddRows,
	hasAddRowData,
}: IncomingOrdersDetailRegisterActionsProps) => {
	const { t } = useTranslation('common');
	const handleEditClick = () => {
		const selectedRowIndex = Array.from(selectedRows)[0];
		const selectedRowData =
			listByMasterId.data?.content?.[Number(selectedRowIndex)];

		if (selectedRowData) {
			onEditClick(selectedRowData);
		} else {
			toast.warning(t('pages.actions.noRowSelected'));
		}
	};

	const handleDeleteClick = () => {
		const selectedRowIndex = Array.from(selectedRows)[0];
		const selectedRowData =
			listByMasterId.data?.content?.[Number(selectedRowIndex)];

		if (selectedRowData) {
			onDeleteClick(selectedRowData);
		} else {
			toast.warning(t('pages.actions.noRowSelectedDelete'));
		}
	};

	return (
		<div className="flex items-center gap-2.5 ">
			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
					newIncomingMasterId === null
						? 'bg-gray-200 text-gray-400 cursor-not-allowed'
						: 'bg-Colors-Brand-600 text-gray-200'
				}`}
				onClick={onAddClick}
			>
				<Plus
					size={16}
					className={`${
						newIncomingMasterId === null
							? 'text-gray-400'
							: 'text-gray-200'
					}`}
				/>
				{t('pages.actions.newWindowRegister')}
			</RadixButton>

			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
					newIncomingMasterId === null
						? 'bg-gray-200 text-gray-400 cursor-not-allowed'
						: 'bg-Colors-Brand-600 text-white'
				}`}
				disabled={newIncomingMasterId === null}
				onClick={onAddRowClick}
			>
				<RotateCw
					size={16}
					className={`${
						newIncomingMasterId === null
							? 'text-gray-400'
							: 'text-gray-200'
					}`}
				/>
				{t('pages.actions.addRow')}
			</RadixButton>

			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-600 text-white hover:bg-Colors-Brand-700`}
				disabled={newIncomingMasterId === null || !hasAddRowData}
				onClick={onSaveAddRows}
			>
				<Save size={16} />
				{t('save')}
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
					newIncomingMasterId === null
						? ' cursor-not-allowed bg-gray-200 text-gray-400'
						: ''
				}`}
				disabled={newIncomingMasterId === null}
				onClick={handleDeleteClick}
			>
				<Trash2
					size={16}
					className={`${
						newIncomingMasterId === null
							? 'text-gray-400 '
							: 'text-muted-foreground'
					}`}
				/>
				{t('pages.actions.delete')}
			</RadixButton>
		</div>
	);
};

export default IncomingOrdersDetailRegisterActions;
