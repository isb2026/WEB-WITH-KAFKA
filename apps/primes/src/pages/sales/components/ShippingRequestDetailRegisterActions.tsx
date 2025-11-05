import { RadixButton } from '@radix-ui/components';
import { Plus, Edit, Trash2, RotateCw, Save } from 'lucide-react';
import { DataTableDataType } from '@primes/schemas/sales/shippingRequestDetailSchemas';
import { useTranslation } from '@repo/i18n';

interface ShippingRequestDetailRegisterActionsProps {
	newShippingRequestMasterId: number | null;
	selectedRows: Set<string>;
	listByMasterId: {
		data?: {
			content?: DataTableDataType[];
		};
	};
	onAddClick: () => void;
	onEditClick: (detail: DataTableDataType) => void;
	onDeleteClick: (detail: DataTableDataType) => void;
	onAddRowClick?: () => void;
	onSaveAddRows?: () => void;
	hasAddRowData?: boolean;
}

export const ShippingRequestDetailRegisterActions = ({
	newShippingRequestMasterId,
	selectedRows,
	listByMasterId,
	onAddClick,
	onEditClick,
	onDeleteClick,
	onAddRowClick,
	onSaveAddRows,
	hasAddRowData = false,
}: ShippingRequestDetailRegisterActionsProps) => {
	const { t } = useTranslation('common');

	const handleEditClick = () => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Number(Array.from(selectedRows)[0]);
			const selectedData =
				listByMasterId.data?.content?.[selectedRowIndex];
			if (selectedData) {
				onEditClick(selectedData);
			}
		}
	};

	const handleDeleteClick = () => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Number(Array.from(selectedRows)[0]);
			const selectedData =
				listByMasterId.data?.content?.[selectedRowIndex];
			if (selectedData) {
				onDeleteClick(selectedData);
			}
		}
	};

	return (
		<div className="flex items-center gap-2.5">
			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
					newShippingRequestMasterId === null
						? 'bg-gray-200 text-gray-400 cursor-not-allowed'
						: 'bg-Colors-Brand-600 text-white'
				}`}
				onClick={onAddClick}
				disabled={newShippingRequestMasterId === null}
			>
				<Plus size={16} />
				{t('pages.actions.newWindowRegister')}
			</RadixButton>

			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
					newShippingRequestMasterId === null
						? 'bg-gray-200 text-gray-400 cursor-not-allowed'
						: 'bg-Colors-Brand-600 text-white'
				}`}
				disabled={newShippingRequestMasterId === null}
				onClick={onAddRowClick}
			>
				<RotateCw
					size={16}
					className={`${
						newShippingRequestMasterId === null
							? 'text-gray-400'
							: 'text-gray-200'
					}`}
				/>
				{t('pages.actions.addRow')}
			</RadixButton>

			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-600 text-white hover:bg-Colors-Brand-700`}
				disabled={newShippingRequestMasterId === null || !hasAddRowData}
				onClick={onSaveAddRows}
			>
				<Save size={16} />
				{t('save')}
			</RadixButton>

			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border`}
				onClick={handleEditClick}
				disabled={selectedRows.size === 0}
			>
				<Edit size={16} />
				{t('pages.actions.edit')}
			</RadixButton>

			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
					newShippingRequestMasterId === null
						? ' cursor-not-allowed bg-gray-200 text-gray-400'
						: ''
				}`}
				onClick={handleDeleteClick}
				disabled={selectedRows.size === 0}
			>
				<Trash2 size={16} />
				{t('pages.actions.delete')}
			</RadixButton>
		</div>
	);
};

export default ShippingRequestDetailRegisterActions;
