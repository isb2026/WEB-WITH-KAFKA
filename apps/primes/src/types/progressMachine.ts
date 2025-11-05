import { Pageable, Sort } from './common';

// ProgressMachine Types

// ProgressMachineSearchRequest - ProgressMachine 검색 요청
export interface ProgressMachineSearchRequest {
	isUse?: boolean; // 사용 여부
	createdAtStart?: string; // 생성일시 시작
	createdAtEnd?: string; // 생성일시 종료
	createdBy?: string; // 생성자
	updatedAtStart?: string; // 수정일시 시작
	updatedAtEnd?: string; // 수정일시 종료
	updatedBy?: string; // 수정자
	id?: number; // ID
	progressId?: number; // progress_id
	machineId?: number; // machine_id
	isDefault?: boolean; // 대표설비 여부
}

// ProgressMachineCreateRequest - ProgressMachine Create 요청
export interface ProgressMachineCreateRequest {
	progressId: number; // progress_id
	machineId: number; // machine_id
	isDefault?: boolean; // 대표설비 여부
}

// ProgressMachineUpdateRequest - ProgressMachine Update 요청
export interface ProgressMachineUpdateRequest {
	isDefault?: boolean; // 대표설비 여부
}

// ProgressMachineDto - ProgressMachine 응답 데이터
export interface ProgressMachineDto {
	id: number; // ID
	tenantId?: number; // 테넌트 ID
	isDelete?: boolean; // 삭제 여부
	isUse?: boolean; // 사용 여부
	progressId: number; // progress_id
	machineId: number; // machine_id
	isDefault?: boolean; // 대표설비 여부
	createdBy?: string; // 생성자
	createdAt?: string; // 생성일시
	updatedBy?: string; // 수정자
	updatedAt?: string; // 수정일시
}

// ProgressMachineSearchResponse - ProgressMachine 검색 응답 (Swagger에서 정의된 확장 정보 포함)
export interface ProgressMachineSearchResponse {
	id: number; // ID
	tenantId?: number; // 테넌트 ID
	isDelete?: boolean; // 삭제 여부
	isUse?: boolean; // 사용 여부
	progressId: number; // progress_id
	machineId: number; // machine_id
	isDefault?: boolean; // 대표설비 여부
	createdBy?: string; // 생성자
	createdAt?: string; // 생성일시
	updatedBy?: string; // 수정자
	updatedAt?: string; // 수정일시
	// 검색 응답에서 추가로 제공되는 Machine 정보
	machineCode?: string; // 설비 코드
	machineName?: string; // 설비명
	machineType?: string; // 설비 타입
	machineGrade?: string; // 설비 등급
	machineSpec?: string; // 설비 규격
	modelName?: string; // 모델명
}

// Page 타입 정의
export interface PageProgressMachineSearchResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: ProgressMachineSearchResponse[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

// CommonResponse 타입들 (Swagger 문서에 맞춤)
export interface CommonResponsePageProgressMachineSearchResponse {
	status: string;
	message?: string;
	errorMessage?: string;
	data: PageProgressMachineSearchResponse;
}

export interface CommonResponseListProgressMachineDto {
	status: string;
	message?: string;
	errorMessage?: string;
	data: ProgressMachineDto[];
}

export interface CommonResponseProgressMachineDto {
	status: string;
	message?: string;
	errorMessage?: string;
	data: ProgressMachineDto;
}

export interface CommonResponseObject {
	status: string;
	message?: string;
	errorMessage?: string;
	data: ProgressMachineDto | ProgressMachineDto[] | null;
}
