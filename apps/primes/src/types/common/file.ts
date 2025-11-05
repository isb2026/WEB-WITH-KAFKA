/**
 * File upload related type definitions
 * Based on Swagger File API specification
 */

export interface FileUploadResponse {
	status: string;
	data: {
		filePath: string;
		fileName: string;
		fileSize: number;
		originalName: string;
	};
	message: string;
}

export interface FileUploadError {
	status: string;
	errorMessage: string;
}

export interface FileInfo {
	id: string;
	fileName: string;
	originalName: string;
	filePath: string;
	fileSize: number;
	fileType: string;
	uploadedAt: string;
	uploadedBy: string;
}

export interface FileUploadProgress {
	loaded: number;
	total: number;
	percentage: number;
}

export interface FileValidationResult {
	isValid: boolean;
	error?: string;
	warnings?: string[];
}

export interface FileUploadOptions {
	maxSize?: number;
	allowedTypes?: string[];
	allowedExtensions?: string[];
	compressImage?: boolean;
	imageQuality?: number;
	generateThumbnail?: boolean;
}

export interface FileUploadState {
	isUploading: boolean;
	progress: number;
	uploadedFile: FileUploadResponse | null;
	error: string | null;
	uploadId?: string;
}

export interface FileDeleteResponse {
	status: string;
	message: string;
	deletedFile: {
		filePath: string;
		fileName: string;
	};
}

export interface FileListResponse {
	status: string;
	data: {
		files: FileInfo[];
		total: number;
		page: number;
		limit: number;
	};
	message: string;
}

export interface FileSearchParams {
	query?: string;
	fileType?: string;
	uploadedBy?: string;
	dateFrom?: string;
	dateTo?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}

// File type constants
export const FILE_TYPES = {
	IMAGE: {
		JPEG: 'image/jpeg',
		JPG: 'image/jpg',
		PNG: 'image/png',
		GIF: 'image/gif',
		WEBP: 'image/webp',
	},
	DOCUMENT: {
		PDF: 'application/pdf',
		DOC: 'application/msword',
		DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		XLS: 'application/vnd.ms-excel',
		XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	},
	ARCHIVE: {
		ZIP: 'application/zip',
		RAR: 'application/x-rar-compressed',
		SEVEN_ZIP: 'application/x-7z-compressed',
	},
} as const;

// File size constants (in bytes)
export const FILE_SIZE_LIMITS = {
	SMALL: 1024 * 1024,        // 1MB
	MEDIUM: 5 * 1024 * 1024,   // 5MB
	LARGE: 10 * 1024 * 1024,   // 10MB
	XLARGE: 50 * 1024 * 1024,  // 50MB
} as const;

// File extension constants
export const FILE_EXTENSIONS = {
	IMAGE: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'],
	DOCUMENT: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'],
	ARCHIVE: ['.zip', '.rar', '.7z', '.tar', '.gz'],
} as const; 