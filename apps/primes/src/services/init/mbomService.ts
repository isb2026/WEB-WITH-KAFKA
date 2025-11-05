import { FetchApiGet } from '@primes/utils/request';

export const getMbomFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(`/mbom/fields/${fieldName}`);
	if (res.status !== 'success') {
		throw new Error('Mbom 필드 조회 실패');
	}
	return res.data;
};
