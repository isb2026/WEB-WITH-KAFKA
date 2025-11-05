import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
	Box,
	Typography,
	List,
	ListItem,
	ListItemText,
	LinearProgress,
	Alert,
	IconButton,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button,
	Link,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ReplayIcon from '@mui/icons-material/Replay';
import DownloadIcon from '@mui/icons-material/Download';
import { uploadToOrca } from '@moornmo/utils/uploadToOrca';
import { fetchBusinessStatus } from '@moornmo/utils/businessAPI';

interface FileInputProps {
	name: string;
	onUpload?: (fieldName: string, file: File) => Promise<string>; // returns URL or ID
	showBizNoCheck?: boolean;
}

const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 15;

interface UploadingFile {
	file: File;
	progress: number;
	status: 'uploading' | 'done' | 'error';
	fileName?: string;
}

export const FileInput: React.FC<FileInputProps> = ({
	name,
	onUpload,
	showBizNoCheck,
}) => {
	const [files, setFiles] = useState<UploadingFile[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [fileToDelete, setFileToDelete] = useState<File | null>(null);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [bizNo, setBizNo] = useState('');
	const [checking, setChecking] = useState(false);

	const handleDownload = (fileName: string) => {
		const link = document.createElement('a');
		link.href = `https://file.orcamaas.com/download/${encodeURIComponent(fileName)}`;
		link.download = fileName;
		link.click();
	};

	const getTotalSize = () => {
		const totalBytes = files.reduce((sum, f) => sum + f.file.size, 0);
		const totalMB = totalBytes / (1024 * 1024);
		return `${files.length} files — ${totalMB.toFixed(2)} MB`;
	};

	const confirmDelete = (file: File) => {
		setFileToDelete(file);
		setShowConfirmDialog(true);
	};

	const handleDeleteConfirmed = () => {
		if (fileToDelete) {
			setFiles((prev) =>
				prev.filter((f) => f.file.name !== fileToDelete.name)
			);
		}
		setFileToDelete(null);
		setShowConfirmDialog(false);
	};

	const handleClearAll = () => {
		if (window.confirm('모든 파일을 삭제하시겠습니까?')) {
			setFiles([]);
		}
	};

	const retryUpload = async (file: File) => {
		setFiles((prev) =>
			prev.map((f) =>
				f.file.name === file.name
					? { ...f, progress: 0, status: 'uploading' }
					: f
			)
		);
		try {
			const fileName = await uploadToOrca(file);
			setFiles((prev) =>
				prev.map((f) =>
					f.file.name === file.name
						? { ...f, status: 'done', fileName }
						: f
				)
			);
			console.log('✅ Uploaded file name:', fileName);
		} catch (err) {
			console.log('⛔ Error uploading this file:', file.name);
			setFiles((prev) =>
				prev.map((f) =>
					f.file.name === file.name ? { ...f, status: 'error' } : f
				)
			);
		}
	};

	const uploadWithProgress = async (file: File) => {
		try {
			// Start upload
			setFiles((prev) =>
				prev.map((f) =>
					f.file.name === file.name
						? { ...f, progress: 0, status: 'uploading' }
						: f
				)
			);

			// Simulate upload progress
			const progressInterval = setInterval(() => {
				setFiles((prev) =>
					prev.map((f) =>
						f.file.name === file.name && f.status === 'uploading'
							? { ...f, progress: Math.min(f.progress + 20, 90) }
							: f
					)
				);
			}, 500);

			// Actual upload
			const fileName = await uploadToOrca(file);

			// Clear interval and set as done
			clearInterval(progressInterval);
			setFiles((prev) =>
				prev.map((f) =>
					f.file.name === file.name
						? { ...f, progress: 100, status: 'done', fileName }
						: f
				)
			);

			console.log('✅ Uploaded file name:', fileName);
		} catch (err) {
			console.log('⛔ Error uploading this file:', file.name);
			setFiles((prev) =>
				prev.map((f) =>
					f.file.name === file.name ? { ...f, status: 'error' } : f
				)
			);
		}
	};

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			setError(null);

			const newFiles: UploadingFile[] = [];

			for (const file of acceptedFiles) {
				const isTooLarge = file.size > MAX_FILE_SIZE_MB * 1024 * 1024;

				if (isTooLarge) {
					setError(
						`"${file.name}" is larger than ${MAX_FILE_SIZE_MB}MB.`
					);
					continue;
				}

				if (files.length + newFiles.length >= MAX_FILES) {
					setError(`Cannot upload more than ${MAX_FILES} files.`);
					break;
				}

				newFiles.push({ file, progress: 0, status: 'uploading' });
			}

			setFiles((prev) => [...prev, ...newFiles]);

			// Upload each file
			for (const { file } of newFiles) {
				await uploadWithProgress(file);
			}
		},
		[files]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: true,
		accept: {
			'application/pdf': ['.pdf'],
			'image/*': ['.jpg', '.jpeg', '.png', '.svg'],
			'application/vnd.ms-excel': ['.xls'],
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
				['.xlsx'],
			'application/msword': ['.doc'],
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
				['.docx'],
			'application/x-hwp': ['.hwp'],
			'application/octet-stream': ['.hwt'],
		},
	});

	// Get successfully uploaded files
	const uploadedFiles = files
		.filter((f) => f.status === 'done' && f.fileName)
		.map((f) => f.fileName as string);

	return (
		<Box>
			<Box
				{...getRootProps()}
				sx={{
					border: '2px dashed #ccc',
					borderRadius: 2,
					padding: 2,
					textAlign: 'center',
					cursor: 'pointer',
					bgcolor: isDragActive ? '#f0f0f0' : 'transparent',
				}}
			>
				<input {...getInputProps()} name={name} />
				<Typography>
					{isDragActive
						? '여기에 파일을 놓으세요...'
						: '파일을 드래그하거나 클릭하여 업로드하세요 (최대 10개, 각 15MB)'}
				</Typography>
			</Box>

			{showBizNoCheck && (
				<Box sx={{ mt: 2 }}>
					<Typography
						component="label"
						sx={{
							display: 'block',
							mb: 0.5,
							fontWeight: 500,
						}}
					>
						사업자등록번호
					</Typography>
					<Box sx={{ display: 'flex', gap: 1 }}>
						<input
							type="text"
							placeholder="10자리 숫자만 입력"
							value={bizNo}
							onChange={(e) => setBizNo(e.target.value)}
							style={{
								width: '100%',
								padding: '8px',
								border: '1px solid #ccc',
								borderRadius: '4px',
							}}
						/>
						<Button
							variant="contained"
							disabled={checking}
							onClick={async () => {
								if (!bizNo || bizNo.length !== 10) {
									alert('10자리 사업자번호를 입력하세요.');
									return;
								}

								setChecking(true);
								try {
									const res =
										await fetchBusinessStatus(bizNo);
									const status = res?.data?.[0]?.b_stt;

									if (status === '01') {
										alert(
											'✅ 사업자등록번호가 확인되었습니다.'
										);
									} else {
										alert(
											'❌ 유효하지 않은 사업자등록번호입니다.'
										);
									}
								} catch (e) {
									alert('❌ 조회 중 오류가 발생했습니다.');
								} finally {
									setChecking(false);
								}
							}}
						>
							{checking ? '확인 중...' : '등록번호 확인'}
						</Button>
					</Box>
				</Box>
			)}

			{error && (
				<Alert severity="error" sx={{ mt: 2 }}>
					{error}
				</Alert>
			)}

			{files.length > 0 && (
				<>
					<List sx={{ mt: 2 }}>
						{files.map((f, i) => (
							<Box
								key={i}
								sx={{
									border: '1px solid #e0e0e0',
									borderRadius: 1,
									padding: 1,
									mb: 1,
									backgroundColor: 'background.paper',
								}}
							>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: 1,
									}}
								>
									{f.file.type.startsWith('image/') && (
										<Box
											component="img"
											src={URL.createObjectURL(f.file)}
											alt={f.file.name}
											sx={{
												width: 40,
												height: 40,
												objectFit: 'cover',
												borderRadius: 0.5,
											}}
										/>
									)}
									<Box sx={{ flexGrow: 1, minWidth: 0 }}>
										<Typography
											variant="body2"
											sx={{
												fontSize: '0.875rem',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap',
											}}
										>
											{f.file.name}
										</Typography>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												gap: 1,
												mt: 0.5,
											}}
										>
											<LinearProgress
												variant="determinate"
												value={
													f.status === 'done'
														? 100
														: f.progress
												}
												color={
													f.status === 'done'
														? 'success'
														: f.status === 'error'
															? 'error'
															: 'primary'
												}
												sx={{ flexGrow: 1, height: 4 }}
											/>
											<Typography
												variant="caption"
												sx={{ minWidth: '45px' }}
											>
												{f.status === 'done'
													? '완료'
													: f.status === 'error'
														? '실패'
														: `${f.progress}%`}
											</Typography>
										</Box>
									</Box>
									<Box sx={{ display: 'flex', gap: 0.5 }}>
										{f.status === 'error' && (
											<IconButton
												size="small"
												onClick={() =>
													retryUpload(f.file)
												}
												color="primary"
											>
												<ReplayIcon fontSize="small" />
											</IconButton>
										)}
										<IconButton
											size="small"
											onClick={() =>
												confirmDelete(f.file)
											}
											disabled={f.status === 'uploading'}
											color="error"
										>
											<DeleteIcon fontSize="small" />
										</IconButton>
									</Box>
								</Box>
							</Box>
						))}
					</List>

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							mt: 1,
							px: 1,
						}}
					>
						<Typography variant="caption" color="text.secondary">
							총: {getTotalSize()}
						</Typography>
						<Button
							size="small"
							variant="outlined"
							color="error"
							startIcon={<ClearAllIcon fontSize="small" />}
							onClick={handleClearAll}
							sx={{ py: 0.5 }}
						>
							모든 파일 삭제
						</Button>
					</Box>
				</>
			)}

			{uploadedFiles.length > 0 && (
				<Box mt={2}>
					<List disablePadding>
						{uploadedFiles.map((fileName) => (
							<Box
								key={fileName}
								sx={{
									border: '1px solid #e0e0e0',
									borderRadius: 1,
									padding: 1,
									mb: 1,
									backgroundColor: 'background.paper',
									display: 'flex',
									alignItems: 'center',
									gap: 1,
								}}
							>
								{fileName.match(
									/\.(jpg|jpeg|png|gif|svg)$/i
								) ? (
									<Box
										component="img"
										src={`https://file.orcamaas.com/${fileName}`}
										alt={fileName}
										sx={{
											width: 40,
											height: 40,
											objectFit: 'cover',
											borderRadius: 0.5,
										}}
									/>
								) : (
									<Box
										sx={{
											width: 40,
											height: 40,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											backgroundColor: '#f5f5f5',
											borderRadius: 0.5,
										}}
									>
										📎
									</Box>
								)}
								<Typography
									variant="body2"
									sx={{
										flexGrow: 1,
										fontSize: '0.875rem',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
									}}
								>
									{fileName}
								</Typography>
								<Button
									size="small"
									startIcon={
										<DownloadIcon fontSize="small" />
									}
									onClick={() => handleDownload(fileName)}
									variant="outlined"
									sx={{
										py: 0.5,
										minWidth: 'auto',
										fontSize: '0.75rem',
									}}
								>
									다운로드
								</Button>
							</Box>
						))}
					</List>
				</Box>
			)}

			<Dialog
				open={showConfirmDialog}
				onClose={() => setShowConfirmDialog(false)}
			>
				<DialogTitle>파일 삭제</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<strong>{fileToDelete?.name}</strong> 파일을
						삭제하시겠습니까?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setShowConfirmDialog(false)}>
						취소
					</Button>
					<Button onClick={handleDeleteConfirmed} color="error">
						삭제
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};
