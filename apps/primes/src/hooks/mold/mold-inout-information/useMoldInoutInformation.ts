import { useMoldInoutInformationListQuery } from './useMoldInoutInformationListQuery';
import { useMoldInoutInformationRecordsQuery } from './useMoldInoutInformationRecordsQuery';
import { useCreateMoldInoutInformation } from './useCreateMoldInoutInformation';
import { useUpdateMoldInoutInformation } from './useUpdateMoldInoutInformation';
import { useDeleteMoldInoutInformation } from './useDeleteMoldInoutInformation';
import { MoldInoutInformationSearchRequest } from '@primes/types/mold';

export const useMoldInoutInformation = (params: { 
	searchRequest?: MoldInoutInformationSearchRequest;
	page: number; 
	size: number; 
}) => {
	const list = useMoldInoutInformationListQuery(params);
	const createMoldInoutInformation = useCreateMoldInoutInformation(params.page, params.size);
	const updateMoldInoutInformation = useUpdateMoldInoutInformation();
	const removeMoldInoutInformation = useDeleteMoldInoutInformation(params.page, params.size);

	return {
		list,
		createMoldInoutInformation,
		updateMoldInoutInformation,
		removeMoldInoutInformation,
	};
};

// Separate hook for records query (right table)
export const useMoldInoutInformationRecords = (params: { 
	outCommandId?: number;
	page: number; 
	size: number; 
	inoutFlag?: boolean;
}) => {
	const records = useMoldInoutInformationRecordsQuery(params);
	
	return {
		records,
	};
}; 