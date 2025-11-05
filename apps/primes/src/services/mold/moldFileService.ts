import { uploadFile, validateFile, getFileUrl } from '@primes/services/common/fileService';
import { FileUploadResponse, FileValidationResult } from '@primes/types/common/file';

/**
 * Mold-specific file upload service
 * Extends the common file service with mold-specific functionality
 */
export const uploadMoldPicture = async (file: File): Promise<FileUploadResponse> => {
	// Use common validation
	const validation = validateFile(file);
	if (!validation.isValid) {
		throw new Error(validation.error || 'File validation failed');
	}

	// Additional mold-specific validation if needed
	if (file.size > 10 * 1024 * 1024) { // 10MB for mold pictures
		throw new Error(`Mold picture size exceeds 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
	}

	// Use common upload service
	return await uploadFile(file);
};

/**
 * Get full URL for uploaded mold picture
 * Uses common getFileUrl function
 */
export const getMoldPictureUrl = (filePath: string): string => {
	return getFileUrl(filePath);
};

/**
 * Validate mold picture file
 * Extends common validation with mold-specific rules
 */
export const validateMoldPicture = (file: File): { isValid: boolean; error?: string } => {
	// Use common validation first
	const commonValidation = validateFile(file);
	if (!commonValidation.isValid) {
		return commonValidation;
	}

	// Additional mold-specific validation
	if (file.size > 10 * 1024 * 1024) { // 10MB limit for mold pictures
		return {
			isValid: false,
			error: `금형 사진 크기가 10MB 제한을 초과합니다. 현재 크기: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
		};
	}

	// Ensure it's an image file
	const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
	if (!allowedTypes.includes(file.type)) {
		return {
			isValid: false,
			error: '금형 사진은 이미지 파일만 업로드 가능합니다. 지원 형식: JPEG, PNG, GIF, WebP',
		};
	}

	return { isValid: true };
};
