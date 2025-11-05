import React, { useState, useEffect } from 'react';
import { RadixButton, RadixTextInput } from '@radix-ui/components';
import {
	RadixDialogRoot,
	RadixDialogPortal,
	RadixDialogOverlay,
	RadixDialogContent,
	RadixDialogTitle,
	RadixDialogDescription,
	RadixDialogClose,
} from '@repo/radix-ui/components';
import { AlertTriangle, OctagonAlert } from 'lucide-react';

interface HardDeleteConfirmDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	isDeleting?: boolean;
	title?: string;
	description?: string;
	itemName: string;
	itemIdentifier: string;
	verificationPhrase: string;
	warningMessage?: string;
}

export const HardDeleteConfirmDialog: React.FC<
	HardDeleteConfirmDialogProps
> = ({
	isOpen,
	onOpenChange,
	onConfirm,
	isDeleting = false,
	title = '삭제 확인',
	description = '이 항목과 관련된 모든 데이터가 삭제됩니다.',
	itemName = '',
	itemIdentifier = '',
	verificationPhrase = 'delete my data',
	warningMessage = '이 작업은 되돌릴 수 없습니다. 신중하게 결정해주세요.',
}) => {
	const [nameInput, setNameInput] = useState('');
	const [phraseInput, setPhraseInput] = useState('');
	const [attemptedSubmit, setAttemptedSubmit] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setAttemptedSubmit(false);
			setNameInput('');
			setPhraseInput('');
		}
	}, [isOpen]);

	const nameMatches = nameInput === itemIdentifier;
	const phraseMatches = phraseInput === verificationPhrase;
	const isVerified = nameMatches && phraseMatches;

	const handleConfirmClick = () => {
		setAttemptedSubmit(true);
		if (isVerified) {
			onConfirm();
		}
	};

	return (
		<RadixDialogRoot open={isOpen} onOpenChange={onOpenChange}>
			<RadixDialogPortal>
				<RadixDialogOverlay className="fixed inset-0 bg-black/50 z-50" />
				<RadixDialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 w-[350px] sm:w-[530px]">
					<RadixDialogTitle className="text-xl text-gray-800 font-bold mb-2">
						{title}
					</RadixDialogTitle>

					<RadixDialogDescription className="text-gray-600 mb-4">
						{description}
					</RadixDialogDescription>

					<div className="flex gap-2 items-center bg-red-100 text-red-600 px-4 py-3 rounded mb-6">
						<AlertTriangle size={20} />
						<span className="text-sm">{warningMessage}</span>
					</div>

					{itemIdentifier && (
						<div className="mb-5">
							<p className="text-sm text-gray-600 mb-2">
								계속하려면 {itemName}{' '}
								<strong>{itemIdentifier}</strong> 을(를)
								입력하세요:
							</p>
							<RadixTextInput
								value={nameInput}
								onChange={(e) => setNameInput(e.target.value)}
								className="!py-1.5 !px-2 !rounded"
								required
								autoFocus
							/>
							{attemptedSubmit && nameInput.trim() === '' && (
								<div className="flex items-center gap-1 mt-2">
									<OctagonAlert
										size={18}
										className="text-red-500"
									/>
									<p className="text-red-500 text-xs">
										{itemName}을(를) 입력하세요
									</p>
								</div>
							)}
							{attemptedSubmit &&
								nameInput.trim() !== '' &&
								!nameMatches && (
									<div className="flex items-center gap-1 mt-2">
										<OctagonAlert
											size={18}
											className="text-red-500"
										/>
										<p className="text-red-500 text-xs">
											{itemName} 이(가) 일치하지 않습니다
										</p>
									</div>
								)}
						</div>
					)}

					<div className="mb-8">
						<p className="text-sm text-gray-600 mb-2">
							확인을 위해 아래에{' '}
							<strong>{verificationPhrase}</strong> 을(를)
							입력하세요:
						</p>
						<RadixTextInput
							value={phraseInput}
							onChange={(e) => setPhraseInput(e.target.value)}
							className="!py-1.5 !px-2 !rounded"
							required
						/>
						{attemptedSubmit && phraseInput.trim() === '' && (
							<div className="flex items-center gap-1 mt-2">
								<OctagonAlert
									size={18}
									className="text-red-500"
								/>
								<p className="text-red-500 text-xs">
									검증 문구를 입력하세요
								</p>
							</div>
						)}
						{attemptedSubmit &&
							phraseInput.trim() !== '' &&
							!phraseMatches && (
								<div className="flex items-center gap-1 mt-2">
									<OctagonAlert
										size={18}
										className="text-red-500"
									/>
									<p className="text-red-500 text-xs">
										검증 문구가 일치하지 않습니다
									</p>
								</div>
							)}
					</div>

					<div className="flex justify-between gap-3">
						<RadixDialogClose asChild>
							<RadixButton className="flex gap-1.5 px-5 py-2 rounded-md text-sm text-gray-600 items-center border hover:bg-gray-50">
								취소
							</RadixButton>
						</RadixDialogClose>
						<RadixButton
							className="flex gap-1.5 px-5 py-2 rounded-md text-sm text-white items-center bg-red-600 hover:bg-red-700 disabled:opacity-50"
							onClick={handleConfirmClick}
							disabled={isDeleting}
						>
							삭제
						</RadixButton>
					</div>
				</RadixDialogContent>
			</RadixDialogPortal>
		</RadixDialogRoot>
	);
};
