import * as Dialog from '@radix-ui/react-dialog';
import { ReactNode, useRef } from 'react';
import Draggable from 'react-draggable';
import DynamicIconButton from './DynamicIconButton';
import { X } from 'lucide-react';

interface DraggableDialogProps {
	title: string;
	content: ReactNode;
	trigger?: ReactNode;
	defaultPosition?: { x: number; y: number };
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	description?: string;
}

export const DraggableDialog = ({
	title,
	content,
	trigger,
	defaultPosition = { x: 0, y: 0 },
	open,
	onOpenChange,
	description,
}: DraggableDialogProps) => {
	const draggableRef = useRef<HTMLDivElement>(null);

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			{trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 data-[state=open]:animate-overlayShow" />
				<Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 focus:outline-none">
					<Draggable
						handle=".dialog-handle"
						defaultPosition={defaultPosition}
						nodeRef={draggableRef}
					>
						<div
							ref={draggableRef}
							className="bg-white border rounded-xl shadow-xl min-w-max md:min-w-[688px]"
						>
							<div className="dialog-handle cursor-move p-4 bg-Colors-Brand-700 rounded-t-xl overflow-hidden">
								<div className="flex justify-between items-center ">
									<Dialog.Title className="text-lg font-semibold text-gray-900 cursor-text text-white">
										{title}
									</Dialog.Title>
									<Dialog.Close asChild>
										<DynamicIconButton aria-label="Close">
											<X className="text-white" />
										</DynamicIconButton>
									</Dialog.Close>
								</div>
								{description && (
									<Dialog.Description className="text-sm text-gray-200 mt-1">
										{description}
									</Dialog.Description>
								)}
							</div>
							<div className="p-6 rounded-b-xl">{content}</div>
						</div>
					</Draggable>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
