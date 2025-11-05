import { useState, useEffect } from 'react';
import {
	getMbomList,
	createMbom,
	updateMbom,
	updateAllMbom,
	deleteMbom,
	getProcessTreeForUI,
	getRecursiveProcessTreeForUI,
	getFullBomTree,
	canAddRelation,
	getMbomListByRootItem,
} from '@primes/services/ini/mbomService';

import {
	MbomCreateRequest,
	MbomUpdateRequest,
	MbomUpdateAllRequest,
	MbomDto,
	MbomListDto,
	ProcessTreeNodeDto,
	FullBomTreeDto,
	MbomSearchRequest,
	PageResponse,
} from '@primes/types/ini/mbom';

/**
 * Mbom 조회 훅 (페이징)
 */
export const useMbomSearch = (
	searchRequest: MbomSearchRequest = {},
	page: number = 0,
	size: number = 10,
	enabled: boolean = true
) => {
	const [data, setData] = useState<PageResponse<MbomDto> | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchData = async () => {
		if (!enabled) return;

		try {
			setLoading(true);
			setError(null);
			const data = await getMbomList(searchRequest, page, size);
			setData(data);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Mbom 조회 중 오류가 발생했습니다.'
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [JSON.stringify(searchRequest), page, size, enabled]);

	return {
		data,
		loading,
		error,
		refetch: fetchData,
	};
};

/**
 * TreeView UI용 공정 트리 조회 훅
 */
export const useProcessTreeForUI = (
	itemId: number | null,
	enabled: boolean = true
) => {
	const [data, setData] = useState<ProcessTreeNodeDto[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchData = async () => {
		if (!enabled || !itemId) return;

		try {
			setLoading(true);
			setError(null);
			const data = await getProcessTreeForUI(itemId);
			setData(data);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: '공정 트리 조회 중 오류가 발생했습니다.'
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [itemId, enabled]);

	return {
		data,
		loading,
		error,
		refetch: fetchData,
	};
};

/**
 * 재귀적 TreeView UI용 공정 트리 조회 훅
 */
export const useRecursiveProcessTreeForUI = (
	itemId: number | null,
	maxDepth?: number,
	enabled: boolean = true
) => {
	const [data, setData] = useState<ProcessTreeNodeDto[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchData = async () => {
		if (!enabled || !itemId) return;

		try {
			setLoading(true);
			setError(null);
			const data = await getRecursiveProcessTreeForUI(itemId, maxDepth);
			setData(data);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: '재귀 공정 트리 조회 중 오류가 발생했습니다.'
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [itemId, maxDepth, enabled]);

	return {
		data,
		loading,
		error,
		refetch: fetchData,
	};
};

/**
 * 전체 BOM 트리 조회 훅
 */
export const useFullBomTree = (enabled: boolean = true) => {
	const [data, setData] = useState<FullBomTreeDto | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchData = async () => {
		if (!enabled) return;

		try {
			setLoading(true);
			setError(null);
			const data = await getFullBomTree();
			setData(data);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: '전체 BOM 트리 조회 중 오류가 발생했습니다.'
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [enabled]);

	return {
		data,
		loading,
		error,
		refetch: fetchData,
	};
};

/**
 * Mbom 생성 훅
 */
export const useMbomCreate = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createMbomData = async (
		requests: MbomCreateRequest[]
	): Promise<MbomDto[] | null> => {
		try {
			setLoading(true);
			setError(null);
			const data = await createMbom(requests);
			return data;
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: 'Mbom 생성 중 오류가 발생했습니다.';
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	return {
		createMbom: createMbomData,
		loading,
		error,
	};
};

/**
 * Mbom 수정 훅
 */
export const useMbomUpdate = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const updateMbomData = async (
		id: number,
		request: MbomUpdateRequest
	): Promise<MbomDto | null> => {
		try {
			setLoading(true);
			setError(null);
			const data = await updateMbom(id, request);
			return data;
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: 'Mbom 수정 중 오류가 발생했습니다.';
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	const updateAllMbomData = async (
		requests: MbomUpdateAllRequest[]
	): Promise<MbomDto[] | null> => {
		try {
			setLoading(true);
			setError(null);
			const data = await updateAllMbom(requests);
			return data;
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: 'Mbom 일괄 수정 중 오류가 발생했습니다.';
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	return {
		updateMbom: updateMbomData,
		updateAllMbom: updateAllMbomData,
		loading,
		error,
	};
};

/**
 * Mbom 삭제 훅
 */
export const useMbomDelete = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const deleteMbomData = async (ids: number[]): Promise<boolean> => {
		try {
			setLoading(true);
			setError(null);
			await deleteMbom(ids);
			return true;
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: 'Mbom 삭제 중 오류가 발생했습니다.';
			setError(errorMessage);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return {
		deleteMbom: deleteMbomData,
		loading,
		error,
	};
};

/**
 * BOM 관계 추가 가능 여부 검증 훅
 */
export const useCanAddRelation = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const checkCanAddRelation = async (
		rootItemId: number,
		parentItemId: number | null,
		childItemId: number
	) => {
		try {
			setLoading(true);
			setError(null);
			const data = await canAddRelation(
				rootItemId,
				parentItemId || 0,
				childItemId
			);
			return data;
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: '관계 검증 중 오류가 발생했습니다.';
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	return {
		checkCanAddRelation,
		loading,
		error,
	};
};

/**
 * 완제품별 투입품 리스트 조회 훅 (새로운 API)
 */
export const useMbomListByRootItem = (
	rootItemId: number | null,
	maxDepth?: number,
	enabled: boolean = true,
	searchRequest: MbomSearchRequest = {}
) => {
	const [data, setData] = useState<MbomListDto[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchData = async () => {
		if (!enabled || !rootItemId) return;

		try {
			setLoading(true);
			setError(null);
			const data = await getMbomListByRootItem(rootItemId, maxDepth, searchRequest);
			setData(data);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: '완제품별 투입품 리스트 조회 중 오류가 발생했습니다.'
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [rootItemId, maxDepth, enabled, JSON.stringify(searchRequest)]);

	return {
		data,
		loading,
		error,
		refetch: fetchData,
	};
};
