import { RadixButton } from '@radix-ui/components';
import { Pen, RotateCw, Trash2, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@repo/i18n';

// TODO: 실제 MaterialOutgoingDetail 타입 정의 필요
interface MaterialOutgoingDetail {
	id: number;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	outAmt: number;
	outUnit: string;
	outUnitName: string;
	outDate: string;
}

interface MaterialOutgoingDetailRegisterActionsProps {
	newMaterialOutgoingMasterId: number | null;
	selectedRows: Set<string>;
	listByMasterId: {
		data?: {
			content?: MaterialOutgoingDetail[];
		};
	};
	onAddClick: () => void;
	onEditClick: (detail: MaterialOutgoingDetail) => void;
	// onDeleteClick: (detail: MaterialOutgoingDetail) => void;
	// onAddRowClick?: () => void;
	onSaveAddRows?: () => void;
	hasAddRowData?: boolean;
}

export const MaterialOutgoingDetailRegisterActions = ({
	newMaterialOutgoingMasterId,
	selectedRows,
	listByMasterId,
	onAddClick,
	onEditClick,
	// onDeleteClick,
	// onAddRowClick,
	onSaveAddRows,
	hasAddRowData,
}: MaterialOutgoingDetailRegisterActionsProps) => {
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
			// onDeleteClick(selectedRowData);
		} else {
			toast.warning(t('pages.actions.noRowSelected'));
		}
	};

	return (
		<div className="flex items-center gap-2.5">
			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
					newMaterialOutgoingMasterId === null
						? 'bg-gray-200 text-gray-400 cursor-not-allowed'
						: 'bg-Colors-Brand-600 text-gray-200'
				}`}
				onClick={onAddClick}
				disabled={!newMaterialOutgoingMasterId}
			>
				<Plus
					size={16}
					className={`${
						newMaterialOutgoingMasterId === null
							? 'text-gray-400'
							: 'text-gray-200'
					}`}
				/>
				{t('pages.actions.newWindowRegister')}
			</RadixButton>

			{/* <RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
					newMaterialOutgoingMasterId === null
						? 'bg-gray-200 text-gray-400 cursor-not-allowed'
						: 'bg-Colors-Brand-600 text-white'
				}`}
				disabled={newMaterialOutgoingMasterId === null}
				onClick={onAddRowClick}
			>
				<RotateCw
					size={16}
					className={`${
						newMaterialOutgoingMasterId === null
							? 'text-gray-400'
							: 'text-gray-200'
					}`}
				/>
				{t('pages.actions.addRow')}
			</RadixButton> */}

			{/* <RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-600 text-white hover:bg-Colors-Brand-700`}
				disabled={newMaterialOutgoingMasterId === null || !hasAddRowData}
				onClick={onSaveAddRows}
			>
				<Save size={16} />
				{t('save')}
			</RadixButton> */}

			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border`}
				onClick={handleEditClick}
				disabled={selectedRows.size === 0 || !newMaterialOutgoingMasterId}
			>
				<Pen size={16} />
				{t('pages.actions.edit')}
			</RadixButton>

			{/* <RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
					newMaterialOutgoingMasterId === null
						? ' cursor-not-allowed bg-gray-200 text-gray-400'
						: ''
				}`}
				disabled={newMaterialOutgoingMasterId === null || selectedRows.size === 0}
				onClick={handleDeleteClick}
			>
				<Trash2
					size={16}
					className={`${
						newMaterialOutgoingMasterId === null
							? 'text-gray-400 '
							: 'text-muted-foreground'
					}`}
				/>
				{t('pages.actions.delete')}
			</RadixButton> */}
		</div>
	);
}; 