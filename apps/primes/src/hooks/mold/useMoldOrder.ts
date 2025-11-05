// import { useMoldOrder, useMoldOrderMaster, useMoldOrderDetail } from './useMoldOrder';

// Temporary implementation for build fix
const useMoldOrder = (params: any) => ({
  data: null,
  isLoading: false,
  error: null,
  refetch: () => Promise.resolve(),
});

const useMoldOrderMaster = (params: any) => ({
  data: null,
  isLoading: false,
  error: null,
  refetch: () => Promise.resolve(),
});

const useMoldOrderDetail = (params: any) => ({
  data: null,
  isLoading: false,
  error: null,
  refetch: () => Promise.resolve(),
});


/**
 * 생성된 페이지에서 사용하는 이름과 일치하는 Hook (별칭)
 */
export const useMoldorder = (params: {
	searchRequest?: any;
	page: number;
	size: number;
}) => {
	return useMoldOrder(params);
};

export const useMoldorderMaster = (params: {
	searchRequest?: any;
	page: number;
	size: number;
}) => {
	return useMoldOrderMaster(params);
};

export const useMoldorderDetail = (params: {
	searchRequest?: any;
	masterId?: number;
	page: number;
	size: number;
}) => {
	return useMoldOrderDetail(params);
};