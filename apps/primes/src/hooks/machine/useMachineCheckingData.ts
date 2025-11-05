// import { useMachineCheckingData } from './useMachineCheckingData';

// Temporary implementation for build fix
const useMachineCheckingData = (params: any) => ({
  data: null,
  isLoading: false,
  error: null,
  refetch: () => Promise.resolve(),
});


/**
 * 생성된 페이지에서 사용하는 이름과 일치하는 Hook (별칭)
 */
export const useMachinecheckingdata = (params: {
	searchRequest?: any;
	page: number;
	size: number;
}) => {
	return useMachineCheckingData(params);
};