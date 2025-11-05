import { useState, useCallback } from 'react';
import { uploadMoldPicture, validateMoldPicture } from '@primes/services/mold/moldFileService';
import { toast } from 'sonner';

export interface MoldFileUploadState {
	isUploading: boolean;
	progress: number;
	uploadedFile: any | null;
	error: string | null;
}

export interface UseMoldFileUploadReturn {
	uploadState: MoldFileUploadState;
	handleMoldPictureUpload: (file: File) => Promise<any | null>;
	resetUpload: () => void;
	clearError: () => void;
}

/**
 * Hook for handling mold picture uploads
 * Provides upload state, progress tracking, and error handling
 */
export const useMoldFileUpload = (): UseMoldFileUploadReturn => {
	const [uploadState, setUploadState] = useState<MoldFileUploadState>({
		isUploading: false,
		progress: 0,
		uploadedFile: null,
		error: null,
	});

	const handleMoldPictureUpload = useCallback(async (file: File): Promise<any | null> => {
		// Reset previous state
		setUploadState(prev => ({
			...prev,
			error: null,
			progress: 0,
		}));

		// Validate file first
		const validation = validateMoldPicture(file);
		if (!validation.isValid) {
			const errorMessage = validation.error || 'File validation failed';
			setUploadState(prev => ({
				...prev,
				error: errorMessage,
			}));
			toast.error('Mold Picture Upload Failed', {
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
			// Simulate progress updates
			const progressInterval = setInterval(() => {
				setUploadState(prev => ({
					...prev,
					progress: Math.min(prev.progress + 20, 90),
				}));
			}, 300);

			// Perform upload
			const result = await uploadMoldPicture(file);

			// Clear progress interval and complete upload
			clearInterval(progressInterval);
			setUploadState(prev => ({
				...prev,
				isUploading: false,
				progress: 100,
				uploadedFile: result,
			}));

			toast.success('Mold Picture Upload Successful', {
				description: `${file.name} has been uploaded successfully`,
			});

			return result;
		} catch (error: any) {
			const errorMessage = error.message || 'Mold picture upload failed';
			setUploadState(prev => ({
				...prev,
				isUploading: false,
				progress: 0,
				error: errorMessage,
			}));

			toast.error('Mold Picture Upload Failed', {
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
		handleMoldPictureUpload,
		resetUpload,
		clearError,
	};
};
