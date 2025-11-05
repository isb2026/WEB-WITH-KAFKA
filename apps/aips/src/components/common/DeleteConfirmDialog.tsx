import React from 'react';
import { RadixButton } from '@radix-ui/components';
import {
	RadixDialogRoot,
	RadixDialogPortal,
	RadixDialogOverlay,
	RadixDialogContent,
	RadixDialogTitle,
	RadixDialogDescription,
	RadixDialogClose,
} from '@repo/radix-ui/components';

interface DeleteConfirmDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	isDeleting?: boolean;
	title?: string;
	description?: string;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
	isOpen,
	onOpenChange,
	onConfirm,
	isDeleting = false,
	title = '삭제 확인',
	description = '선택한 항목을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.',
}) => {
	return (
		<RadixDialogRoot open={isOpen} onOpenChange={onOpenChange}>
			<RadixDialogPortal>
				<RadixDialogOverlay className="fixed inset-0 bg-black/50 z-50" />
				<RadixDialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 w-[400px]">
					<RadixDialogTitle className="text-lg text-gray-600 font-bold mb-2">
						{title}
					</RadixDialogTitle>
					<RadixDialogDescription className="text-gray-600 text-sm mb-6">
						{description}
						<span></span>
					</RadixDialogDescription>
					<div className="flex justify-end gap-3">
						<RadixDialogClose asChild>
							<RadixButton className="flex gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 items-center border">
								취소
							</RadixButton>
						</RadixDialogClose>
						<RadixButton
							className="flex gap-1.5 px-5 py-1.5 rounded-lg text-sm text-white items-center border bg-black"
							onClick={onConfirm}
							disabled={isDeleting}
						>
							확인
						</RadixButton>
					</div>
				</RadixDialogContent>
			</RadixDialogPortal>
		</RadixDialogRoot>
	);
};
