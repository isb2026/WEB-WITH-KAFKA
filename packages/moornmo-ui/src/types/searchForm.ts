// Types for SearchBarTemplate props

/**
 * 허용 가능한 입력 필드 타입
 */
export type SearchFieldType =
	| 'text'
	| 'number'
	| 'email'
	| 'password'
	| 'textarea'
	| 'select'
	| 'checkbox'
	| 'radio'
	| 'btnInput'
	| 'spacing'
	| 'toggle'
	| 'yearMonth'
	| 'date'
	| 'dateRange'
	| 'monthRange';

/**
 * 각 필드에 전달할 추가 설정
 */
export interface SearchFieldProps {
	placeholder?: string;
	options?: Array<{ label: string; value: string | number }>;
	rows?: number;
	is_default?: boolean;
	buttonLabel?: string;
	// 기타 커스텀 속성
	[key: string]: any;
}

/**
 * 다이내믹 검색 필드 한 항목의 설정
 */
export interface SearchOption {
	/** 폼 데이트 key */
	name: string;
	/** 레이블 텍스트 */
	label: string;
	/** 입력 필드 타입 */
	type: SearchFieldType;
	/** 타입별 추가 속성 */
	props?: SearchFieldProps;
	/** 그리드(span) 크기 (1~12) */
	span?: number;
	labelWidth?: number | string;
}

/**
 * 퀵 검색용 설정
 */
export interface QuickSearchOption {
	/** 화면에 보일 이름 */
	name: string;
	/** 실제 검색에 사용할 key */
	key: string;
}

/**
 * SearchBarTemplate 에 전달할 전체 props
 */
export interface SearchBarTemplateProps {
	searchConfigs: SearchOption[];
	quickSearchAble?: boolean;
	quickSearchConfigs?: QuickSearchOption[];
	// onSubmit 등 나머지 핸들러/초기값은 별도 정의
}
