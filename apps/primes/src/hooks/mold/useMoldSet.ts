// Re-export from the new mold-set directory
export { useMoldSet } from './mold-set/useMoldSet';
export { useMoldSetListQuery } from './mold-set/useMoldSetListQuery';
export { useMoldSetDetailByMasterId } from './mold-set/useMoldSetDetailByMasterId';
export { useCreateMoldSet } from './mold-set/useCreateMoldSet';
export { useUpdateMoldSet } from './mold-set/useUpdateMoldSet';
export { useDeleteMoldSet } from './mold-set/useDeleteMoldSet';

/**
 * 생성된 페이지에서 사용하는 이름과 일치하는 Hook (별칭)
 */
export const useMoldset = (params: {
	searchRequest?: any;
	page: number;
	size: number;
}) => {
	const { useMoldSet } = require('./mold-set/useMoldSet');
	return useMoldSet(params);
};

export const useMoldsetMaster = (params: {
	searchRequest?: any;
	page: number;
	size: number;
}) => {
	const { useMoldSet } = require('./mold-set/useMoldSet');
	return useMoldSet(params);
};

export const useMoldsetDetail = (params: {
	searchRequest?: any;
	masterId?: number;
	page: number;
	size: number;
}) => {
	const { useMoldSetDetailByMasterId } = require('./mold-set/useMoldSetDetailByMasterId');
	return useMoldSetDetailByMasterId(params.masterId || 0, params.page, params.size);
};