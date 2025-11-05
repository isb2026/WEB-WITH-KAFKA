import { RadixButton } from '@radix-ui/components';
import { Pen, RotateCw, Trash2, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import { OrderDetail } from '@primes/types/sales/orderDetail';
import { useTranslation } from '@repo/i18n';

interface OrderDetailRegisterActionsProps {
	newOrderMasterId: number | null;
	selectedRows: Set<string>;
	listByMasterId: OrderDetail[];
	onAddClick: () => void;
	onEditClick: (detail: OrderDetail) => void;
	onDeleteClick: (detail: OrderDetail) => void;
	onAddRowClick?: () => void;
	onSaveAddRows?: () => void;
	hasAddRowData?: boolean;
}

export const OrderDetailRegisterActions = ({
	newOrderMasterId,
	selectedRows,
	listByMasterId,
	onAddClick,
	onEditClick,
	onDeleteClick,
	onAddRowClick,
	onSaveAddRows,
	hasAddRowData = false,
}: OrderDetailRegisterActionsProps) => {
	const { t } = useTranslation('common');

	const handleEditClick = () => {
		if (selectedRows.size === 1) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const selectedDetail = listByMasterId[Number(selectedRowIndex)];
			if (selectedDetail) {
				onEditClick(selectedDetail);
			} else {
				toast.warning(t('pages.actions.noRowSelectedEdit'));
			}
		} else {
			toast.warning(t('pages.actions.noRowSelectedEdit'));
		}
	};

	const handleDeleteClick = () => {
		if (selectedRows.size === 1) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const selectedDetail = listByMasterId[Number(selectedRowIndex)];
			if (selectedDetail) {
				onDeleteClick(selectedDetail);
			} else {
				toast.warning(t('pages.actions.noRowSelectedDelete'));
			}
		} else {
			toast.warning(t('pages.actions.noRowSelectedDelete'));
		}
	};

	return (
		<div className="flex items-center gap-2.5 ">
			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
					newOrderMasterId === null
						? 'bg-gray-200 text-gray-400 cursor-not-allowed'
						: 'bg-Colors-Brand-600 text-gray-200'
				}`}
				onClick={onAddClick}
			>
				<Plus
					size={16}
					className={`${
						newOrderMasterId === null
							? 'text-gray-400'
							: 'text-gray-200'
					}`}
				/>
				{t('pages.actions.newWindowRegister')}
			</RadixButton>

			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
					newOrderMasterId === null
						? 'bg-gray-200 text-gray-400 cursor-not-allowed'
						: 'bg-Colors-Brand-600 text-white'
				}`}
				disabled={newOrderMasterId === null}
				onClick={onAddRowClick}
			>
				<RotateCw
					size={16}
					className={`${
						newOrderMasterId === null
							? 'text-gray-400'
							: 'text-gray-200'
					}`}
				/>
				{t('pages.actions.addRow')}
			</RadixButton>

			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-600 text-white hover:bg-Colors-Brand-700`}
				disabled={newOrderMasterId === null || !hasAddRowData}
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
					newOrderMasterId === null
						? ' cursor-not-allowed bg-gray-200 text-gray-400'
						: ''
				}`}
				disabled={newOrderMasterId === null}
				onClick={handleDeleteClick}
			>
				<Trash2
					size={16}
					className={`${
						newOrderMasterId === null
							? 'text-gray-400 '
							: 'text-muted-foreground'
					}`}
				/>
				{t('pages.actions.delete')}
			</RadixButton>
		</div>
	);
};
