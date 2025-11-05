import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { uploadFile, validateFile } from '@primes/services/common/fileService';
import { FileUploadResponse, FileUploadState } from '@primes/types/common/file';

export interface UseFileUploadReturn {
	uploadState: FileUploadState;
	handleFileUpload: (file: File) => Promise<FileUploadResponse | null>;
	resetUpload: () => void;
	clearError: () => void;
}

/**
 * Hook for handling file uploads in ini domain
 * Provides upload state, progress tracking, and error handling
 * Uses actual File API /upload endpoint
 */
export const useFileUpload = (): UseFileUploadReturn => {
	const [uploadState, setUploadState] = useState<FileUploadState>({
		isUploading: false,
		progress: 0,
		uploadedFile: null,
		error: null,
	});

	const handleFileUpload = useCallback(async (file: File): Promise<FileUploadResponse | null> => {
		// Reset previous state
		setUploadState(prev => ({
			...prev,
			error: null,
			progress: 0,
		}));

		// Validate file first
		const validation = validateFile(file);
		if (!validation.isValid) {
			const errorMessage = validation.error || 'File validation failed';
			setUploadState(prev => ({
				...prev,
				error: errorMessage,
			}));
			toast.error('파일 업로드 실패', {
				description: errorMessage,
			});
			return null;
		}

		// Start upload
		setUploadState(prev => ({
			...prev,
			isUploading: true,
			progress: 0,
		}));

		try {
			// Start upload progress
			setUploadState(prev => ({
				...prev,
				progress: 10,
			}));

			// Perform actual upload using File API
			const result = await uploadFile(file);

			// Complete upload
			setUploadState(prev => ({
				...prev,
				isUploading: false,
				progress: 100,
				uploadedFile: result,
			}));

			toast.success('파일 업로드 성공', {
				description: `${file.name} 파일이 성공적으로 업로드되었습니다`,
			});

			return result;
		} catch (error: any) {
			const errorMessage = error.message || '파일 업로드에 실패했습니다';
			setUploadState(prev => ({
				...prev,
				isUploading: false,
				progress: 0,
				error: errorMessage,
			}));

			toast.error('파일 업로드 실패', {
				description: errorMessage,
			});

			return null;
		}
	}, []);

	const resetUpload = useCallback(() => {
		setUploadState({
			isUploading: false,
			progress: 0,
			uploadedFile: null,
			error: null,
		});
	}, []);

	const clearError = useCallback(() => {
		setUploadState(prev => ({
			...prev,
			error: null,
		}));
	}, []);

	return {
		uploadState,
		handleFileUpload,
		resetUpload,
		clearError,
	};
}; 