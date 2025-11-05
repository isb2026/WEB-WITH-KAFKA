import { EditorOutputData } from '@editor-js/types';

export type ReportType = 'DRAFT' | 'PUBLISHED' | 'TEMPLATE';
export interface ReportBlock {
	id: number;
	reportTabId: number;
	tenantId: number;
	blockOrder: number;
	type: string;
	data: string; // API sends data as stringified JSON
	updatedAt: string;
	updatedBy: string;
}

export interface ReportTab {
	tabId: number; // Changed from string to number
	name: string;
	tabOrder: number;
	blocks: ReportBlock[];
	createdAt?: string;
	updatedAt?: string;
}

export interface Report {
	reportId: number;
	title: string;
	titleImage?: string;
	description?: string;
	type: ReportType;
	tabs: ReportTab[];
	createdAt: string;
	updatedAt: string;
	createdBy: string;
}

export interface CreateReportPayload {
	title?: string;
	description?: string;
	type?: ReportType;
	initialTab?: {
		title: string;
		content?: EditorOutputData;
	};
}

export interface ReportListResponse {
	content: Report[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface CreateTabPayload {
	name?: string;
	content?: EditorOutputData;
	tabOrder?: number;
}

export interface CreateTabResponse {
	id: number;
	name: string;
	blocks: [];
	tabOrder: number;
	createdAt: string;
	updatedAt: string;
}

export interface UpdateTabPayload {
	name?: string;
	tabOrder?: number;
}

export interface UpdateTabData {
	id: number;
	reportId: number;
	tenantId: number;
	tabOrder: number;
	name: string;
	updatedAt: string;
	updatedBy: string;
}

export interface UpdateTabResponse {
	status: string;
	data: UpdateTabData;
	message: string;
}

export interface BlockPayload {
	blocks: string;
}

export interface BlockResponse {
	tabId: number;
	reportId: number;
	tabOrder: number;
	blocks: string;
}
