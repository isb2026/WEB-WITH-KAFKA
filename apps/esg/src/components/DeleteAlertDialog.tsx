import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface DeleteAlertDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	content?: string;
}

export default function DeleteAlertDialog({
	open,
	onClose,
	onConfirm,
	title = '이 내용을 삭제하시겠습니까?',
	content = '이 내용과 내용에 포함된 콘텐츠가 삭제됩니다.',
}: DeleteAlertDialogProps) {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{title}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{content}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>취소</Button>
				<Button variant="contained" onClick={onConfirm} autoFocus>
					삭제
				</Button>
			</DialogActions>
		</Dialog>
	);
}
