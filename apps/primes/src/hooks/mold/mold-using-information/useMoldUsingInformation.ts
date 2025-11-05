import { useMoldUsingInformationListQuery } from './useMoldUsingInformationListQuery';
// 주석 처리: READ ONLY 모드 - create, update, delete 기능 비활성화
// import { useCreateMoldUsingInformation } from './useCreateMoldUsingInformation';
// import { useUpdateMoldUsingInformation } from './useUpdateMoldUsingInformation';
// import { useDeleteMoldUsingInformation } from './useDeleteMoldUsingInformation';
import { MoldUsingInformationSearchRequest } from '@primes/types/mold';

export const useMoldUsingInformation = (params: { 
	searchRequest?: MoldUsingInformationSearchRequest;
	page: number; 
	size: number; 
}) => {
	const list = useMoldUsingInformationListQuery(params);
	// 주석 처리: READ ONLY 모드 - Mold Using Info는 Kafka를 통해서만 등록됨
	// const createMoldUsingInformation = useCreateMoldUsingInformation(params.page, params.size);
	// const updateMoldUsingInformation = useUpdateMoldUsingInformation();
	// const removeMoldUsingInformation = useDeleteMoldUsingInformation(params.page, params.size);

	return {
		list,
		// createMoldUsingInformation, // 주석 처리
		// updateMoldUsingInformation, // 주석 처리
		// removeMoldUsingInformation, // 주석 처리
	};
}; 