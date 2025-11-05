/**
 * 공통 Field API 타입 정의
 * Custom Select, Autocomplete 등에서 사용하는 간소화된 데이터 타입
 */

// Field API 기본 옵션 타입
export interface FieldOption {
	id: number | string;
	value: string; // 표시용 텍스트
	code?: string;
	disabled?: boolean;
}

// Field API 쿼리 파라미터
export interface FieldQueryParams {
	fieldName?: string;
	search?: string;
	limit?: number;
	enabled?: boolean;
	[key: string]: any;
}

// Field API 응답 타입
export interface FieldApiResponse {
	data: FieldOption[];
	total?: number;
	hasMore?: boolean;
}

// Custom Select Props 기본 인터페이스
export interface BaseSelectProps {
	fieldKey?: string; // Field API에서 사용할 필드명
	valueKey?: string; // 응답에서 value로 사용할 키 (기본: 'id')
	labelKey?: string; // 응답에서 label로 사용할 키 (기본: 'value')
	value?: string | null;
	onChange?: (value: string) => void;
	disabled?: boolean;
	placeholder?: string;
	className?: string;
}
