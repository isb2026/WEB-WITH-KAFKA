import {
	useState,
	useCallback,
	createContext,
	useContext,
	ReactNode,
} from 'react';
import React from 'react';

// Dialog imports
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

type DialogOptions = {
	open: boolean;
	title: string;
	content: string;
	onConfirm: () => void;
	onCancel?: () => void;
	confirmText?: string;
	cancelText?: string;
	severity?: 'warning' | 'error' | 'info';
};

type DialogContextType = {
	showDialog: (options: Omit<DialogOptions, 'open'>) => void;
	hideDialog: () => void;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [dialogState, setDialogState] = useState<DialogOptions>({
		open: false,
		title: '',
		content: '',
		onConfirm: () => {},
		onCancel: () => {},
		confirmText: '확인',
		cancelText: '취소',
		severity: 'warning',
	});

	const showDialog = useCallback((options: Omit<DialogOptions, 'open'>) => {
		setDialogState({
			...options,
			open: true,
			confirmText: options.confirmText || '확인',
			cancelText: options.cancelText || '취소',
			severity: options.severity || 'warning',
		});
	}, []);

	const hideDialog = useCallback(() => {
		setDialogState((prev) => ({ ...prev, open: false }));
	}, []);

	const handleDialogConfirm = useCallback(() => {
		dialogState.onConfirm();
		hideDialog();
	}, [dialogState.onConfirm, hideDialog]);

	const handleDialogCancel = useCallback(() => {
		if (dialogState.onCancel) {
			dialogState.onCancel();
		}
		hideDialog();
	}, [dialogState.onCancel, hideDialog]);

	return (
		<DialogContext.Provider value={{ showDialog, hideDialog }}>
			{children}
			<Dialog
				open={dialogState.open}
				onClose={handleDialogCancel}
				aria-labelledby="dialog-title"
				aria-describedby="dialog-description"
			>
				<DialogTitle id="dialog-title">{dialogState.title}</DialogTitle>
				<DialogContent>
					<DialogContentText id="dialog-description">
						{dialogState.content}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogCancel} color="inherit">
						{dialogState.cancelText}
					</Button>
					<Button
						onClick={handleDialogConfirm}
						color={
							dialogState.severity === 'error'
								? 'error'
								: 'primary'
						}
						variant="contained"
					>
						{dialogState.confirmText}
					</Button>
				</DialogActions>
			</Dialog>
		</DialogContext.Provider>
	);
};

export const useDialog = () => {
	const context = useContext(DialogContext);
	if (!context) {
		throw new Error('useDialog must be used within a DialogProvider');
	}
	return context;
};
