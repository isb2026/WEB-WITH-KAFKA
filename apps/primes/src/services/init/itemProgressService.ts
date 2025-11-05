import { FetchApiGet } from '@primes/utils/request';

export const getItemProgressFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(`/item-progress/fields/${fieldName}`);
	if (res.status !== 'success') {
		throw new Error('ItemProgress 필드 조회 실패');
	}
	return res.data;
};
