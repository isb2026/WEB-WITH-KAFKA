import { RadixIconButton } from '@repo/radix-ui/components';
import { Pen, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from '@repo/i18n';

interface ActionButtonsClassNames {
	container?: string;
	button?: string;
	buttonEdit?: string;
	buttonRemove?: string;
	buttonCreate?: string;
}

interface ActionButtonsComponentProps {
	create?: () => void | null;
	edit?: () => void | null;
	remove?: () => void | null;
	useCreate?: boolean;
	useEdit?: boolean;
	useRemove?: boolean;
	topNodes?: React.ReactNode;
	bottomNodes?: React.ReactNode;
	classNames?: ActionButtonsClassNames;
	visibleText?: boolean;
}

export const ActionButtonsComponent = ({
	create,
	edit,
	remove,
	useCreate = false,
	useEdit = false,
	useRemove = false,
	topNodes,
	bottomNodes,
	classNames = {},
	visibleText = false,
}: ActionButtonsComponentProps) => {
	const { t: tCommon } = useTranslation('common');

	return (
		<div className={`flex gap-1.5 ${classNames?.container}`}>
			{topNodes}
			{useCreate && (
				<RadixIconButton
					onClick={create}
					className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${classNames?.buttonCreate}`}
				>
					<Plus size={16} />
					{visibleText && tCommon('add')}
				</RadixIconButton>
			)}
			{useEdit && (
				<RadixIconButton
					onClick={() => {
						console.log(
							'Edit button clicked in ActionButtonsComponent'
						);
						if (edit) edit();
					}}
					className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${classNames?.buttonEdit}`}
				>
					<Pen size={16} />
					{visibleText && tCommon('edit')}
				</RadixIconButton>
			)}
			{useRemove && (
				<RadixIconButton
					onClick={() => {
						console.log(
							'Delete button clicked in ActionButtonsComponent'
						);
						if (remove) remove();
					}}
					className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${classNames?.buttonRemove}`}
				>
					<Trash2 size={16} />
					{visibleText && tCommon('delete')}
				</RadixIconButton>
			)}
			{bottomNodes}
		</div>
	);
};
