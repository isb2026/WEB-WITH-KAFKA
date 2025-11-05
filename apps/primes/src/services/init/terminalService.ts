import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';
import {
	TerminalSearchRequest,
	TerminalCreateRequest,
	TerminalUpdateRequest,
	TerminalListCreateRequest,
	TerminalUpdateAllRequest,
} from '@primes/types/terminal';

// Terminal 조회 (GET /terminal)
export const getTerminalList = async ({
	searchRequest,
	page = 0,
	size = 10,
}: {
	searchRequest: TerminalSearchRequest;
	page?: number;
	size?: number;
}) => {
	// searchRequest를 플랫한 쿼리 파라미터로 변환
	const searchParams = getSearchParams(searchRequest);
	const res = await FetchApiGet(
		`/init/terminal?page=${page}&size=${size}&${searchParams}`
	);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Terminal 목록 조회 실패');
	}
	return res.data;
};

// Terminal 생성 (POST /terminal)
export const createTerminal = async (data: Partial<TerminalCreateRequest>) => {
	// Extract only allowed keys based on Swagger
	const {
		accountYear,
		terminalCode,
		terminalName,
		description,
		imageUrl,
	} = data;

	const cleanedParams = {
		accountYear,
		terminalCode,
		terminalName,
		description,
		imageUrl,
	};

	const requestBody: TerminalListCreateRequest = {
		dataList: [cleanedParams],
	};

	const res = await FetchApiPost('/init/terminal', requestBody);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Terminal 생성 실패');
	}
	return res.data;
};

// Terminal 일괄 수정 (PUT /terminal)
export const updateTerminalBulk = async (terminals: TerminalUpdateAllRequest[]) => {
	const res = await FetchApiPut('/init/terminal', terminals);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Terminal 일괄 수정 실패');
	}
	return res.data;
};

// Terminal 수정 (PUT /terminal/{id})
export const updateTerminal = async (id: number, data: Partial<TerminalUpdateRequest>) => {
	const {
		isUse,
		accountYear,
		terminalCode,
		terminalName,
		description,
		imageUrl,
	} = data;

	const cleanedParams = {
		isUse,
		accountYear,
		terminalCode,
		terminalName,
		description,
		imageUrl,
	};

	const res = await FetchApiPut(`/init/terminal/${id}`, cleanedParams);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Terminal 수정 실패');
	}
	return res.data;
};

// Terminal 삭제 (DELETE /terminal)
export const deleteTerminal = async (ids: number[]) => {
	// Pass the array directly as request body, not wrapped in an object
	const res = await FetchApiDelete('/init/terminal', undefined, ids);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Terminal 삭제 실패');
	}
	return res.data;
};

// Terminal 특정 필드 값 전체 조회 (GET /terminal/fields/{fieldName})
export const getTerminalFieldValues = async (fieldName: string, searchRequest: TerminalSearchRequest = {}) => {
	const res = await FetchApiGet(`/init/terminal/fields/${fieldName}`, {
		searchRequest,
	});
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Terminal 필드 조회 실패');
	}
	return res.data;
};

// Legacy function names for backward compatibility
export const getAllTerminalList = getTerminalList;
export const getTerminalFieldName = getTerminalFieldValues;
export const searchTerminal = getTerminalList;
