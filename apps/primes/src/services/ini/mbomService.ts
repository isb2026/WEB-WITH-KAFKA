import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';
import {
	MbomCreateRequest,
	MbomUpdateRequest,
	MbomUpdateAllRequest,
	MbomSearchRequest,
} from '@primes/types/ini/mbom';

// Mbom 조회 (페이징) - API 스키마 업데이트
export const getMbomList = async (
	searchRequest: MbomSearchRequest = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/init/mbom', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('Mbom 목록 조회 실패');
	}
	return res.data;
};

/**
 * Mbom 일괄 수정
 * PUT /mbom
 */
export const updateAllMbom = async (requests: MbomUpdateAllRequest[]) => {
	const res = await FetchApiPut('/init/mbom', requests);
	if (res.status !== 'success') {
		throw new Error('Mbom 일괄 수정 실패');
	}
	return res.data;
};

/**
 * Mbom 생성 (API 스키마 업데이트)
 * POST /mbom
 */
export const createMbom = async (requests: MbomCreateRequest[]) => {
	// API 스키마에 맞춰 허용된 필드만 추출
	const cleanedRequests = requests.map((request) => {
		const {
			parentItemId,
			itemId,
			isRoot,
			parentProgressId,
			inputNum,
			itemProgressId,
			inputUnitCode,
			inputUnit,
		} = request;

		return {
			parentItemId,
			itemId,
			isRoot,
			parentProgressId,
			inputNum,
			itemProgressId,
			inputUnitCode,
			inputUnit,
		};
	});

	const res = await FetchApiPost('/init/mbom', cleanedRequests);
	if (res.status !== 'success') {
		throw new Error('Mbom 생성 실패');
	}
	return res.data;
};

/**
 * Mbom 삭제
 * DELETE /mbom
 */
export const deleteMbom = async (ids: number[]) => {
	const res = await FetchApiDelete('/init/mbom', ids);
	if (res.status !== 'success') {
		throw new Error('Mbom 삭제 실패');
	}
	return res.data;
};

/**
 * Mbom 수정 (API 스키마 업데이트)
 * PUT /mbom/{id}
 */
export const updateMbom = async (id: number, request: MbomUpdateRequest) => {
	// API 스키마에 맞춰 허용된 필드만 추출
	const {
		parentItemId,
		itemId,
		isRoot,
		parentProgressId,
		inputNum,
		itemProgressId,
		inputUnitCode,
		inputUnit,
	} = request;

	const cleanedParams = {
		parentItemId,
		itemId,
		isRoot,
		parentProgressId,
		inputNum,
		itemProgressId,
		inputUnitCode,
		inputUnit,
	};

	const res = await FetchApiPut(`/init/mbom/${id}`, cleanedParams);
	if (res.status !== 'success') {
		throw new Error('Mbom 수정 실패');
	}
	return res.data;
};

/**
 * TreeView UI용 공정 트리 조회
 * GET /mbom/tree-ui/{itemId}
 */
export const getProcessTreeForUI = async (itemId: number) => {
	const res = await FetchApiGet(`/init/mbom/tree-ui/${itemId}`);
	if (res.status !== 'success') {
		throw new Error('공정 트리 조회 실패');
	}
	return res.data;
};

/**
 * 재귀적 TreeView UI용 공정 트리 조회
 * GET /mbom/tree-ui/{itemId}/recursive
 */
export const getRecursiveProcessTreeForUI = async (
	itemId: number,
	maxDepth?: number
) => {
	const url = maxDepth
		? `/init/mbom/tree-ui/${itemId}/recursive?maxDepth=${maxDepth}`
		: `/init/mbom/tree-ui/${itemId}/recursive`;

	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		throw new Error('재귀 공정 트리 조회 실패');
	}
	return res.data;
};

/**
 * 전체 BOM 트리 조회
 * GET /mbom/full-tree
 */
export const getFullBomTree = async () => {
	const res = await FetchApiGet('/init/mbom/full-tree');
	if (res.status !== 'success') {
		throw new Error('전체 BOM 트리 조회 실패');
	}
	return res.data;
};

/**
 * MBOM 관계 추가 가능 여부 검증 (API 스키마 업데이트)
 * GET /mbom/can-add-relation
 */
export const canAddRelation = async (
	rootItemId: number,
	parentItemId: number,
	childItemId: number
) => {
	const res = await FetchApiGet('/init/mbom/can-add-relation', {
		rootItemId,
		parentItemId,
		childItemId,
	});
	if (res.status !== 'success') {
		throw new Error('BOM 관계 검증 실패');
	}
	return res.data;
};

// Mbom 특정 필드 값 전체 조회 (GET /mbom/fields/{fieldName})
export const getMbomFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(`/init/mbom/fields/${fieldName}`);
	if (res.status !== 'success') {
		throw new Error('Mbom 필드 조회 실패');
	}
	return res.data;
};

/**
 * 완제품별 투입품 리스트 조회 (새로운 API 엔드포인트)
 * GET /mbom/list/{rootItemId}
 */
export const getMbomListByRootItem = async (
	rootItemId: number,
	maxDepth?: number,
	searchRequest: MbomSearchRequest = {}
) => {
	const searchParams = getSearchParams(searchRequest);
	const url = maxDepth
		? `/init/mbom/list/${rootItemId}?maxDepth=${maxDepth}&${searchParams}`
		: `/init/mbom/list/${rootItemId}?${searchParams}`;

	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		throw new Error('완제품별 투입품 리스트 조회 실패');
	}
	return res.data;
};
