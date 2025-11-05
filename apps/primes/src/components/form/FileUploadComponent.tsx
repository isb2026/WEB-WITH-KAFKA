import React, { useState, useId, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import { useFileUpload } from '@primes/hooks/common/useFileUpload';
import { toast } from 'sonner';

export interface FileUrl {
	id?: number;
	url: string;
	description?: string;
	isPrimary?: boolean;
}

export interface UploadState {
	isUploading: boolean;
	progress: number;
	error: string | null;
}

export interface FileUploadComponentProps {
	// Form integration props
	value?: File[] | string[]; // For form integration
	onChange?: (files: File[]) => void;
	error?: boolean;
	placeholder?: string;
	disabled?: boolean;

	// File upload specific props
	accept?: string;
	multiple?: boolean;
	maxFiles?: number;
	maxFileSize?: number; // in MB

	// Upload handlers
	onUpload?: (files: File[]) => Promise<void>;
	onDelete?: (fileId: number) => Promise<void>;

	// Existing files (for edit mode)
	existingFiles?: FileUrl[];
	editMode?: boolean;

	// Utility functions
	getFileUrl?: (url: string, size?: 'thumb' | 'medium' | 'large') => string;

	// UI customization
	className?: string;
	showPreview?: boolean;
	previewLimit?: number;
}

export const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
	value = [],
	onChange,
	error = false,
	placeholder,
	disabled = false,
	accept = 'image/*',
	multiple = true,
	maxFiles = 10,
	maxFileSize = 10, // 10MB
	onUpload,
	onDelete,
	existingFiles = [],
	editMode = false,
	getFileUrl = (url) => url,
	className = '',
	showPreview = true,
	previewLimit = 3,
}) => {
	const { t: tCommon } = useTranslation('common');
	const inputId = useId();

	// Use the file upload hook for actual uploading
	const { uploadState, handleFileUpload, resetUpload } = useFileUpload();

	// Local state for file management
	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
	const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);
	const [currentFileUrls, setCurrentFileUrls] = useState<FileUrl[]>(
		() => existingFiles || []
	); // Initialize with function to prevent re-runs

	// Initialize currentFileUrls with existingFiles on mount only
	React.useEffect(() => {
		if (existingFiles && existingFiles.length > 0) {
			setCurrentFileUrls([...existingFiles]);
		}
	}, []); // Empty dependency - only run once on mount

	// Handle file selection and upload
	const handleFileSelect = async (files: File[]) => {
		// Validate file size
		const oversizedFiles = files.filter(
			(file) => file.size > maxFileSize * 1024 * 1024
		);
		if (oversizedFiles.length > 0) {
			toast.error(`파일 크기는 ${maxFileSize}MB를 초과할 수 없습니다.`);
			return;
		}

		// Validate file count
		const totalFiles = uploadedFiles.length + files.length;
		if (totalFiles > maxFiles) {
			toast.error(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
			return;
		}

		try {
			// Process each file and upload to file server
			const newUploadedFiles = [...uploadedFiles];
			const newUploadedFileNames = [...uploadedFileNames];

			for (const file of files) {
				// Store the actual file for preview
				newUploadedFiles.push(file);

				// Upload to file server using the hook
				const result = await handleFileUpload(file);

				if (result) {
					// Store the system file name returned by File API
					const systemFileName = result.data.filePath;
					newUploadedFileNames.push(systemFileName);
				}
			}

			// Update local state
			setUploadedFiles(newUploadedFiles);
			setUploadedFileNames(newUploadedFileNames);

			// Update form value with file names (paths)
			onChange?.(newUploadedFileNames as any);

			toast.success(`${files.length}개 파일이 업로드되었습니다.`);
		} catch (error) {
			console.error('파일 업로드 실패:', error);
			toast.error('파일 업로드에 실패했습니다.');
		}
	};

	// Handle file removal
	const handleFileRemove = async (
		index: number,
		isExisting: boolean = false
	) => {
		if (isExisting) {
			// Remove existing file (기존 파일은 실제 삭제하지 않고 UI에서만 제거)
			const updatedFiles = currentFileUrls.filter((_, i) => i !== index);
			setCurrentFileUrls(updatedFiles);
		} else {
			// Remove uploaded file
			const newFiles = uploadedFiles.filter((_, i) => i !== index);
			const newFileNames = uploadedFileNames.filter(
				(_, i) => i !== index
			);

			setUploadedFiles(newFiles);
			setUploadedFileNames(newFileNames);

			// Update form value with remaining file names
			onChange?.(newFileNames as any);

			if (newFiles.length === 0) {
				resetUpload();
			}
		}
	};

	const borderClass = error
		? 'border-red-300 hover:border-red-500'
		: 'border-gray-300 hover:border-Colors-Brand-500';

	return (
		<div className={`w-full ${className}`}>
			{/* File Upload Area */}
			<div
				className={`flex items-center gap-3 p-3 border rounded-md transition-colors ${borderClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
			>
				<div className="flex items-center justify-center w-8 h-8 bg-Colors-Brand-100 rounded">
					<svg
						className="w-4 h-4 text-Colors-Brand-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
						/>
					</svg>
				</div>
				<div className="flex-1">
					<p
						className={`text-sm font-medium ${error ? 'text-red-600' : 'text-gray-700'}`}
					>
						{error && placeholder
							? placeholder
							: tCommon('fileUpload.dragDrop') ||
								'파일을 드래그하거나 클릭하여 선택하세요'}
					</p>
					<p className="text-xs text-gray-500">
						{tCommon('fileUpload.clickToSelect') ||
							'클릭하여 파일 선택'}
					</p>
				</div>
				<button
					type="button"
					onClick={() =>
						!disabled && document.getElementById(inputId)?.click()
					}
					disabled={disabled}
					className="px-4 py-2 text-sm bg-Colors-Brand-700 text-white rounded hover:bg-Colors-Brand-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{tCommon('fileUpload.selectFile') || '파일 선택'}
				</button>
			</div>

			{/* Hidden File Input */}
			<input
				id={inputId}
				type="file"
				accept={accept}
				multiple={multiple}
				onChange={(e) => {
					const files = Array.from(e.target.files || []);
					if (files.length > 0) {
						handleFileSelect(files);
					}
				}}
				className="hidden"
				disabled={disabled}
			/>

			{/* Upload Progress */}
			{uploadState.isUploading && (
				<div className="mt-2 bg-Colors-Brand-50 border border-Colors-Brand-200 rounded-md p-3">
					<div className="flex items-center justify-between text-sm text-gray-700 mb-2">
						<span className="font-medium">
							{tCommon('fileUpload.uploading') || '업로드 중...'}
						</span>
						<span className="text-Colors-Brand-600 font-semibold">
							{uploadState.progress}%
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-gradient-to-r from-Colors-Brand-500 to-Colors-Brand-600 h-2 rounded-full transition-all duration-500 ease-out"
							style={{
								width: `${uploadState.progress}%`,
							}}
						/>
					</div>
				</div>
			)}

			{/* Error Display */}
			{uploadState.error && (
				<div className="mt-2 text-red-600 text-sm">
					{uploadState.error}
				</div>
			)}

			{/* File Preview */}
			{showPreview &&
				(uploadedFiles.length > 0 || currentFileUrls.length > 0) && (
					<div className="mt-3 space-y-2">
						{/* Existing Files */}
						{editMode &&
							currentFileUrls.map((fileUrl, index) => (
								<FilePreviewItem
									key={`existing-${fileUrl.id || index}`}
									type="existing"
									fileUrl={fileUrl}
									onRemove={() =>
										handleFileRemove(index, true)
									}
									getFileUrl={getFileUrl}
									tCommon={tCommon}
								/>
							))}

						{/* Uploaded Files */}
						{uploadedFiles
							.slice(0, previewLimit)
							.map((file, index) => (
								<FilePreviewItem
									key={`uploaded-${file.name}-${index}`}
									type="uploaded"
									file={file}
									onRemove={() =>
										handleFileRemove(index, false)
									}
									tCommon={tCommon}
								/>
							))}

						{/* Preview Limit Warning */}
						{uploadedFiles.length > previewLimit && (
							<div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md">
								<p className="text-sm text-yellow-800">
									{tCommon('fileUpload.previewLimit', {
										total: uploadedFiles.length,
									}) ||
										`총 ${uploadedFiles.length}개 파일 중 ${previewLimit}개만 미리보기로 표시됩니다.`}
								</p>
							</div>
						)}
					</div>
				)}
		</div>
	);
};

// File Preview Item Component
interface FilePreviewItemProps {
	type: 'existing' | 'uploaded';
	fileUrl?: FileUrl;
	file?: File;
	onRemove: () => void;
	getFileUrl?: (url: string, size?: 'thumb' | 'medium' | 'large') => string;
	tCommon: (key: string, params?: any) => string;
}

const FilePreviewItem: React.FC<FilePreviewItemProps> = React.memo(
	({
		type,
		fileUrl,
		file,
		onRemove,
		getFileUrl = (url: string) => url,
		tCommon,
	}) => {
		const isImage =
			type === 'uploaded'
				? file?.type.startsWith('image/')
				: fileUrl?.url.match(/\.(jpg|jpeg|png|gif|webp)$/i);

		// Memoize URLs to prevent excessive backend requests - FIXED dependencies
		const { thumbnailUrl, previewUrl, displayName } = useMemo(() => {
			const name =
				type === 'existing'
					? fileUrl?.description || `기존 파일`
					: file?.name || 'Unknown file';

			if (type === 'existing' && fileUrl) {
				const urlString =
					typeof fileUrl.url === 'string'
						? fileUrl.url
						: (fileUrl.url as any)?.toString() || '';
				return {
					displayName: name,
					thumbnailUrl: urlString
						? getFileUrl(urlString, 'thumb')
						: '',
					previewUrl: urlString
						? getFileUrl(urlString, 'medium')
						: '',
				};
			} else if (file) {
				const blobUrl = URL.createObjectURL(file);
				return {
					displayName: name,
					thumbnailUrl: blobUrl,
					previewUrl: blobUrl,
				};
			}

			return {
				displayName: name,
				thumbnailUrl: '',
				previewUrl: '',
			};
		}, [type, fileUrl?.url, fileUrl?.description, file?.name]); // FIXED: removed getFileUrl from dependencies

		const handlePreview = () => {
			if (previewUrl) {
				window.open(previewUrl, '_blank');
			}
		};

		return (
			<div className="p-3 border border-Colors-Brand-200 rounded-md bg-Colors-Brand-50 max-w-full overflow-hidden">
				<div className="flex items-center gap-3 min-w-0">
					{/* Thumbnail */}
					{isImage && (
						<div className="flex-shrink-0">
							<div
								className="w-12 h-12 bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-Colors-Brand-300 transition-colors"
								onClick={handlePreview}
								title={
									tCommon('fileUpload.clickToView') ||
									'클릭하여 보기'
								}
							>
								<img
									src={thumbnailUrl}
									alt={displayName}
									className="w-full h-full object-cover"
								/>
							</div>
						</div>
					)}

					{/* File Info */}
					<div className="flex-1 min-w-0 overflow-hidden">
						<div className="flex items-center gap-2 min-w-0">
							<svg
								className="w-4 h-4 text-Colors-Brand-500 flex-shrink-0"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
							<p
								className="text-sm font-medium text-Colors-Brand-800 truncate min-w-0"
								title={displayName}
							>
								{displayName.length > 50
									? `${displayName.substring(0, 45)}...`
									: displayName}
								{fileUrl?.isPrimary && (
									<span className="ml-2 text-xs bg-Colors-Brand-600 text-white px-2 py-0.5 rounded">
										Primary
									</span>
								)}
							</p>
						</div>
						<div className="flex items-center gap-4 mt-1">
							{type === 'uploaded' && file && (
								<span className="text-xs text-Colors-Brand-600 whitespace-nowrap">
									{(file.size / 1024 / 1024).toFixed(2)} MB
								</span>
							)}
							<span className="text-xs text-Colors-Brand-600 whitespace-nowrap">
								{type === 'existing'
									? '기존 파일'
									: tCommon('fileUpload.uploadComplete') ||
										'업로드 완료'}
							</span>
						</div>
					</div>

					{/* Remove Button */}
					<div className="flex items-center flex-shrink-0">
						<button
							type="button"
							onClick={onRemove}
							className="p-2 text-red-400 hover:text-red-600 transition-colors"
							title={tCommon('fileUpload.delete') || '삭제'}
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		);
	}
);

export default FileUploadComponent;
