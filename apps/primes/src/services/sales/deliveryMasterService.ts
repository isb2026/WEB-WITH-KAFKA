import { FetchApiGet } from '@primes/utils/request';

export const getDeliveryMasterFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(`/delivery/master/fields/${fieldName}`);
	if (res.status !== 'success') {
		throw new Error('DeliveryMaster 필드 조회 실패');
	}
	return res.data;
};