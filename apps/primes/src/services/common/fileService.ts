import { FetchApiUpload } from '@primes/utils/request';
import {
	FileUploadResponse,
	FileUploadError,
	FileValidationResult,
	FILE_TYPES,
	FILE_SIZE_LIMITS,
} from '@primes/types/common/file';

/**
 * File upload service using actual File API
 * Calls /upload endpoint from Swagger API specification
 */
export const uploadFile = async (file: File): Promise<FileUploadResponse> => {
	// Validate file size (max 5MB)
	const maxSize = FILE_SIZE_LIMITS.MEDIUM; // 5MB in bytes
	if (file.size > maxSize) {
		throw new Error(
			`파일 크기가 5MB 제한을 초과합니다. 현재 크기: ${(file.size / 1024 / 1024).toFixed(2)}MB`
		);
	}

	// Validate file type (images only)
	const allowedTypes = [
		FILE_TYPES.IMAGE.JPEG,
		FILE_TYPES.IMAGE.JPG,
		FILE_TYPES.IMAGE.PNG,
		FILE_TYPES.IMAGE.GIF,
		FILE_TYPES.IMAGE.WEBP,
	];
	if (!allowedTypes.includes(file.type as any)) {
		throw new Error(
			`지원하지 않는 파일 형식입니다. 지원 형식: JPEG, PNG, GIF, WebP`
		);
	}

	try {
		// Extract file extension from file name
		const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
		const uploadFileRealName = file.name;

		// Create FormData for file upload according to File API specification
		const formData = new FormData();
		formData.append('uploadFileRealName', uploadFileRealName);
		formData.append('fileExtension', fileExtension);
		formData.append('file', file);

		// Call actual File API /upload endpoint
		const response = await FetchApiUpload<FileUploadResponse>(
			'/file/upload',
			formData
		);

		console.log('🔄 File upload successful:', {
			originalName: file.name,
			size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
			type: file.type,
			response: response,
		});

		// File API returns system file name (UUID + extension) as string
		const systemFileName =
			typeof response.data === 'string'
				? response.data
				: (response.data as any)?.filePath || '';

		// Transform ApiResponse to FileUploadResponse
		const fileResponse: FileUploadResponse = {
			status: response.status || 'success',
			data: {
				filePath: systemFileName, // File API returns system file name
				fileName: systemFileName,
				fileSize: file.size,
				originalName: file.name,
			},
			message: response.message || 'File uploaded successfully',
		};

		return fileResponse;
	} catch (error: any) {
		console.error('❌ File upload failed:', {
			originalName: file.name,
			error: error.message || error,
		});

		// Enhanced error handling based on API response
		if (error.response?.data) {
			throw new Error(
				error.response.data.message || 'File upload failed'
			);
		} else if (error.message) {
			throw new Error(error.message);
		} else {
			throw new Error('File upload failed due to unknown error');
		}
	}
};

// Simple URL cache to prevent duplicate requests
const urlCache = new Map<string, string>();

// Clear cache periodically to prevent memory leaks
let cacheCleanupInterval: NodeJS.Timeout | null = null;
const MAX_CACHE_SIZE = 1000;

const initCacheCleanup = () => {
	if (!cacheCleanupInterval) {
		cacheCleanupInterval = setInterval(() => {
			if (urlCache.size > MAX_CACHE_SIZE) {
				// Keep only the most recent 500 entries
				const entries = Array.from(urlCache.entries());
				urlCache.clear();
				entries.slice(-500).forEach(([key, value]) => {
					urlCache.set(key, value);
				});
			}
		}, 60000); // Clean every minute
	}
};

/**
 * Get full URL for uploaded file
 * Uses File API endpoint structure: /file/{fileName}?size={size}
 */
export const getFileUrl = (
	fileName: string | any,
	size: 'original' | 'thumb' | 'medium' | 'large' = 'original'
): string => {
	// Handle non-string inputs gracefully
	if (!fileName) return '';
	
	// Convert to string if it's not already a string
	let fileNameStr: string;
	if (typeof fileName === 'string') {
		fileNameStr = fileName;
	} else if (fileName && typeof fileName === 'object') {
		// Log warning for debugging
		console.warn('⚠️ getFileUrl received object instead of string:', fileName);
		// Try to extract string representation
		fileNameStr = fileName.toString();
		// If toString() doesn't give us a useful result, return empty string
		if (fileNameStr === '[object Object]') {
			console.error('❌ Cannot convert object to valid file name:', fileName);
			return '';
		}
	} else {
		// Convert other types to string
		fileNameStr = String(fileName);
	}

	// Initialize cache cleanup on first use
	initCacheCleanup();

	// Create cache key
	const cacheKey = `${fileNameStr}:${size}`;
	
	// Check cache first
	if (urlCache.has(cacheKey)) {
		return urlCache.get(cacheKey)!;
	}

	// Get base URL from environment or use default
	const baseUrl =
		import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

	let finalUrl: string;
	// File API endpoint structure
	if (fileNameStr.startsWith('http')) {
		finalUrl = fileNameStr; // Already a full URL
	} else {
		// Construct File API URL: /file/{fileName}?size={size}
		const sizeParam = size !== 'original' ? `?size=${size}` : '';
		finalUrl = `${baseUrl}/file/${fileNameStr}${sizeParam}`;
	}

	// Cache the result
	urlCache.set(cacheKey, finalUrl);
	
	return finalUrl;
};

/**
 * Validate file before upload
 * Enhanced validation with better error messages
 */
export const validateFile = (file: File): FileValidationResult => {
	const maxSize = FILE_SIZE_LIMITS.MEDIUM; // 5MB
	const allowedTypes = [
		FILE_TYPES.IMAGE.JPEG,
		FILE_TYPES.IMAGE.JPG,
		FILE_TYPES.IMAGE.PNG,
		FILE_TYPES.IMAGE.GIF,
		FILE_TYPES.IMAGE.WEBP,
	];

	// File size validation
	if (file.size > maxSize) {
		return {
			isValid: false,
			error: `파일 크기가 5MB 제한을 초과합니다. 현재 크기: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
		};
	}

	// File type validation
	if (!allowedTypes.includes(file.type as any)) {
		return {
			isValid: false,
			error: `지원하지 않는 파일 형식입니다. 지원 형식: JPEG, PNG, GIF, WebP`,
		};
	}

	// File name validation
	if (!file.name || file.name.trim().length === 0) {
		return {
			isValid: false,
			error: '파일명이 유효하지 않습니다.',
		};
	}

	// File name length validation
	if (file.name.length > 255) {
		return {
			isValid: false,
			error: '파일명이 너무 깁니다. 255자 이하로 입력해주세요.',
		};
	}

	return { isValid: true };
};

/**
 * Enhanced file upload with progress tracking
 * Returns upload progress and result
 */
export const uploadFileWithProgress = async (
	file: File,
	onProgress?: (progress: number) => void
): Promise<FileUploadResponse> => {
	// Initial validation
	const validation = validateFile(file);
	if (!validation.isValid) {
		throw new Error(validation.error || 'File validation failed');
	}

	// Start progress
	if (onProgress) {
		onProgress(10);
	}

	try {
		const result = await uploadFile(file);

		// Complete progress
		if (onProgress) {
			onProgress(100);
		}

		return result;
	} catch (error) {
		// Reset progress on error
		if (onProgress) {
			onProgress(0);
		}
		throw error;
	}
};
