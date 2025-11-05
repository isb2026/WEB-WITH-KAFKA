import { RadixButton } from '@radix-ui/components';
import { Pen, RotateCw, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@repo/i18n';

interface MoldOrderDetailRegisterActionsProps {
	newOrderMasterId: number | null;
	selectedRows: Set<string>;
	listByMasterId: {
		content?: any[];
		data?: {
			content?: any[];
		};
		dataList?: any[];
	} | null | undefined;
	onAddClick: () => void;
	onEditClick: (detail: any) => void;
	onDeleteClick: (detail: any) => void;
}

export const MoldOrderDetailRegisterActions = ({
	newOrderMasterId,
	selectedRows,
	listByMasterId,
	onAddClick,
	onEditClick,
	onDeleteClick,
}: MoldOrderDetailRegisterActionsProps) => {
	const { t } = useTranslation('common');
	
	const handleEditClick = () => {
		if (selectedRows.size === 0) {
			toast.warning(t('pages.actions.noRowSelected'));
			return;
		}

		const selectedRowIndex = Array.from(selectedRows)[0];
		// 다양한 데이터 구조를 지원하도록 수정
		const selectedRowData = 
			listByMasterId?.content?.[Number(selectedRowIndex)] ||
			listByMasterId?.data?.content?.[Number(selectedRowIndex)] ||
			listByMasterId?.dataList?.[Number(selectedRowIndex)];

		if (selectedRowData) {
			onEditClick(selectedRowData);
		} else {
			toast.warning(t('pages.actions.noRowSelected'));
		}
	};

	const handleDeleteClick = () => {
		if (selectedRows.size === 0) {
			toast.warning(t('pages.actions.noRowSelectedDelete'));
			return;
		}

		const selectedRowIndex = Array.from(selectedRows)[0];
		// 다양한 데이터 구조를 지원하도록 수정
		const selectedRowData = 
			listByMasterId?.content?.[Number(selectedRowIndex)] ||
			listByMasterId?.data?.content?.[Number(selectedRowIndex)] ||
			listByMasterId?.dataList?.[Number(selectedRowIndex)];

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
				onClick={handleEditClick}
			>
				<Pen 
					size={16} 
					className={`${
						newOrderMasterId === null
							? 'text-gray-400'
							: 'text-white'
					}`}
				/>
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
