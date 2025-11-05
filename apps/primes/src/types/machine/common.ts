// Machine 도메인 공통 타입 정의

export interface FieldQueryParams {
	search?: string;
	limit?: number;
}

export interface FieldOption {
	id: number | string;
	value: string;
	code?: string;
	disabled?: boolean;
}
