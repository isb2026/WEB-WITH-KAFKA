import { useLotListQuery } from './useLotListQuery';
import { LotSearchRequest } from '@primes/types/production';

interface LotParams {
	page?: number;
	size?: number;
	searchRequest?: LotSearchRequest;
}

export const useLots = (params: LotParams = {}) => {
	const list = useLotListQuery(params);

	return { list };
};