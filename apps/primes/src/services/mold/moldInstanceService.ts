import {
	FetchApiGet,
	FetchApiPost,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	MoldInstanceDto,
	MoldInstanceSearchRequest,
	MoldInstanceCreateRequest,
	MoldInstanceListCreateRequest,
	MoldInstanceInputRequest,
	MoldInstanceCollectRequest,
} from '@primes/types/mold';

// API 응답 타입 정의
export interface MoldInstanceApiResponse {
	status?: string;
	data?: {
		content: MoldInstanceDto[];
		pageable: {
			pageNumber: number;
			pageSize: number;
			sort: {
				empty: boolean;
				unsorted: boolean;
				sorted: boolean;
			};
			offset: number;
			paged: boolean;
			unpaged: boolean;
		};
		totalElements: number;
		totalPages: number;
		last: boolean;
		size: number;
		number: number;
		sort: {
			empty: boolean;
			unsorted: boolean;
			sorted: boolean;
		};
		numberOfElements: number;
		first: boolean;
		empty: boolean;
	};
}

// inputCommandId로 MoldInstance 목록 조회
export const getMoldInstanceByInputCommandId = async (
	inputCommandId: number,
	isInput: boolean = true,
	page: number = 0,
	size: number = 10
): Promise<MoldInstanceApiResponse> => {
	const params = {
		inputCommandId,
		isInput,
		page,
		size,
	};

	const res = await FetchApiGet('/mold/mold-instance', params);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'MoldInstance 조회 실패');
	}
	return res;
};

// MoldInstance 목록 조회
export const getMoldInstanceList = async (
	searchRequest: MoldInstanceSearchRequest = {},
	page: number = 0,
	size: number = 10
): Promise<MoldInstanceApiResponse> => {
	const params = {
		page,
		size,
		...searchRequest,
	};


	const res = await FetchApiGet('mold/mold-instance', params);

	if (res.status !== 'success') {
		console.error('API error:', res);
		throw new Error('MoldInstance 목록 조회 실패');
	}

	return {
		status: 'success',
		data: res.data,
	} as MoldInstanceApiResponse;
};

// MoldInstance 단일 조회
export const getMoldInstanceById = async (id: number): Promise<{ status: string; data: MoldInstanceDto }> => {
	const res = await FetchApiGet('mold/mold-instance', { id });
	
	if (res.status !== 'success') {
		console.error('API error:', res);
		throw new Error('MoldInstance 조회 실패');
	}

	// API 응답이 페이지네이션 구조이므로 첫 번째 요소를 가져옴
	const moldInstance = res.data?.content?.[0];
	
	if (!moldInstance) {
		throw new Error('MoldInstance를 찾을 수 없습니다');
	}

	return {
		status: res.status || 'success',
		data: moldInstance,
	};
};

// MoldInstance 생성
export const createMoldInstance = async (
	data: MoldInstanceCreateRequest
): Promise<{
	status: string;
	data: MoldInstanceDto;
}> => {
	const res = await FetchApiPost('mold/mold-instance', data);

	if (res.status !== 'success') {
		console.error('API error:', res);
		throw new Error('MoldInstance 생성 실패');
	}

	return {
		status: res.status || 'success',
		data: res.data,
	};
};

// MoldInstance 일괄 생성
export const createMoldInstanceList = async (
	data: MoldInstanceListCreateRequest
): Promise<{
	status: string;
	data: MoldInstanceDto[];
}> => {
	const res = await FetchApiPost('mold/mold-instance/list', data);

	if (res.status !== 'success') {
		console.error('API error:', res);
		throw new Error('MoldInstance 일괄 생성 실패');
	}

	return {
		status: res.status || 'success',
		data: res.data,
	};
};

// MoldInstance 수정
export const updateMoldInstance = async (
	id: number,
	data: Partial<MoldInstanceCreateRequest>
): Promise<{
	status: string;
	data: MoldInstanceDto;
}> => {
	const res = await FetchApiPut(`mold/mold-instance/${id}`, data);

	if (res.status !== 'success') {
		console.error('API error:', res);
		throw new Error('MoldInstance 수정 실패');
	}

	return {
		status: res.status || 'success',
		data: res.data,
	};
};

// MoldInstance 삭제
export const deleteMoldInstance = async (
	ids: number[]
): Promise<{ status: string; data: any }> => {
	const res = await FetchApiDelete('mold/mold-instance', { ids });

	if (res.status !== 'success') {
		console.error('API error:', res);
		throw new Error('MoldInstance 삭제 실패');
	}

	return {
		status: res.status || 'success',
		data: res.data,
	};
};

// Field API - Custom Select용 간소화된 데이터
export interface FieldOption {
	id: number | string;
	name: string;
	code?: string;
	disabled?: boolean;
	moldLocations?: any[]; // 위치 정보 추가
}

export interface FieldQueryParams {
	search?: string;
	limit?: number;
	active?: boolean;
	isInput?: boolean;
	moldMasterId?: number; // moldMasterId 추가
}

// MoldInstance Field 조회 (Custom Select용) - 기존 목록 API 사용
export const getMoldInstanceFields = async (params?: FieldQueryParams): Promise<{ status: string; data: FieldOption[] }> => {
	// 기존 목록 API를 사용하되 페이지 크기를 크게 설정
	const searchRequest: MoldInstanceSearchRequest = {
		...(params?.search && { moldInstanceName: params.search }),
		isInput: params?.isInput,
		moldMasterId: params?.moldMasterId,
	};
	
	
	const res = await getMoldInstanceList(searchRequest, 0, params?.limit || 100);
	
	if (res.status !== 'success') {
		console.error('API error:', res);
		throw new Error('MoldInstance Field 조회 실패');
	}

	// API 응답을 FieldOption 형태로 변환 (moldLocations 정보 포함)
	const fieldOptions: FieldOption[] = (res.data?.content || []).map((item: MoldInstanceDto) => {
		
		return {
			id: item.id,
			name: item.moldInstanceName || item.moldInstanceCode || `금형-${item.id}`,
			code: item.moldInstanceCode,
			disabled: !item.isUse,
			moldLocations: item.moldLocations, // 위치 정보 추가
		};
	});
	

	return {
		status: 'success',
		data: fieldOptions,
	};
};

// MoldInstance Field Name 조회
export const getMoldInstanceFieldName = async (fieldName: string): Promise<{ status: string; data: any }> => {
	const res = await FetchApiGet(`mold/mold-instance/fields/${fieldName}`);
	
	if (res.status !== 'success') {
		console.error('API error:', res);
		throw new Error('MoldInstance Field Name 조회 실패');
	}

	// API 응답 데이터를 컴포넌트에서 사용할 수 있는 형태로 변환
	const transformedData = Array.isArray(res.data)
		? res.data.map((item: any) => ({
				id: item.id,
				value: item.value,
				// 추가 필드들이 있다면 여기에 매핑
				moldInstanceName: item.value, // value를 moldInstanceName으로도 사용
				moldInstanceCode: item.value, // value를 moldInstanceCode로도 사용
			}))
		: [];


	return {
		status: res.status || 'success',
		data: transformedData,
	};
};

// 새로운 금형 투입 API
export const inputMoldInstances = async (
	data: MoldInstanceInputRequest
): Promise<{ status: string; data: any }> => {
	const res = await FetchApiPut('mold/mold-instance/input', data);

	if (res.status !== 'success') {
		console.error('API error:', res);
		throw new Error('금형 투입 실패');
	}

	return {
		status: res.status || 'success',
		data: res.data,
	};
};

// 새로운 금형 회수 API
export const collectMoldInstances = async (
	moldInstanceIds: MoldInstanceCollectRequest
): Promise<{ status: string; data: any }> => {
	const res = await FetchApiPut('mold/mold-instance/collect', moldInstanceIds);

	if (res.status !== 'success') {
		console.error('API error:', res);
		throw new Error('금형 회수 실패');
	}

	return {
		status: res.status || 'success',
		data: res.data,
	};
};
