import { DataRequestSearchRequest } from './../../types/request';
import { useDataRequestListQuery } from './useDataRequestListQuery';
import { useCreateDataRequest } from './useCreateDataRequest';

// NOTE: Swagger에 따라 엔드포인트 명 확인 필요. 임시로 /data-request 사용
interface dataRequestParams {
	page: number;
	size: number;
	searchRequest?: DataRequestSearchRequest;
}

export const useDataRequest = ({
	page,
	size,
	searchRequest,
}: dataRequestParams) => {
	const dataRequestList = useDataRequestListQuery({
		page,
		size,
		searchRequest,
	});
	const createDataRequest = useCreateDataRequest();

	return {
		dataRequestList,
		createDataRequest,
	};
};
