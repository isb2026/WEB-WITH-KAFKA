// Machine Check Spec 관련 타입 정의
export type { FieldQueryParams, FieldOption } from './common';

export interface MachineCheckSpec {
	id: number;
	machineId: number;
	machineName: string;
	specName: string;
	specType: string;
	standardValue: number;
	upperLimit: number;
	lowerLimit: number;
	unit: string;
	checkCycle: string;
	checkMethod: string;
	description: string;
	isActive: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateMachineCheckSpecPayload {
	machineId: number;
	specName: string;
	specType: string;
	standardValue: number;
	upperLimit?: number;
	lowerLimit?: number;
	unit?: string;
	checkCycle?: string;
	checkMethod?: string;
	description?: string;
	isActive?: boolean;
}

export interface UpdateMachineCheckSpecPayload
	extends Partial<CreateMachineCheckSpecPayload> {
	id: number;
}

export interface MachineCheckSpecListParams {
	page?: number;
	size?: number;
	searchRequest?: Record<string, unknown>;
}

export interface MachineCheckSpecListResponse {
	content: MachineCheckSpec[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
}

// FieldQueryParams와 FieldOption은 common.ts에서 import
