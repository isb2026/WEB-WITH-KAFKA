import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';
import { GetAllUserListPayload } from '@primes/types/users';
import { User } from '@primes/types/users';

export const getAllUserList = async ({
	searchRequest,
	page = 0,
	size = 10,
}: {
	searchRequest: any;
	page?: number;
	size?: number;
}) => {
	// Add 1-second delay for better UX
	await new Promise((resolve) => setTimeout(resolve, 1000));

	const searchParams = getSearchParams(searchRequest || {});
	const res = await FetchApiGet(
		`/user/?page=${page}&size=${size}${searchParams ? `&${searchParams}` : ''}`
	);
	if (res.status !== 'success') {
		throw new Error('사용자 목록 조회 실패');
	}
	return res.data;
};

export const createUser = async (data: Partial<User>) => {
	const {
		username,
		password,
		tenantId,
		name,
		email,
		mobileTel,
		homeTel,
		profileImage,
		department,
		partLevel,
		partPosition,
		zipcode,
		addressMaster,
		addressDetail,
		inDate,
		outDate,
		isTenantAdmin,
	} = data;

	const cleanedParams = {
		username: username || '',
		password: password || '',
		tenantId: tenantId || 0,
		name: name || '',
		email: email || '',
		mobileTel: !mobileTel || mobileTel === '' ? null : mobileTel,
		homeTel: !homeTel || homeTel === '' ? null : homeTel,
		profileImage: profileImage,
		department: department,
		partLevel: partLevel,
		partPosition: partPosition,
		zipcode: zipcode,
		addressMaster: addressMaster,
		addressDetail: addressDetail,
		inDate: inDate,
		outDate: outDate,
		isTenantAdmin: isTenantAdmin || '0',
	};
	const res = await FetchApiPost('/user/auth/register', cleanedParams);
	if (res.status !== 'success') {
		throw new Error('사용자 생성 실패');
	}
	return res.data;
};

export const updateUser = async (username: string, data: Partial<User>) => {
	const {
		name,
		email,
		mobileTel,
		homeTel,
		profileImage,
		department,
		partLevel,
		partPosition,
		zipcode,
		addressMaster,
		addressDetail,
		inDate,
		outDate,
		isTenantAdmin,
		useState,
	} = data;
	const cleanedParams = {
		name,
		email,
		mobileTel,
		homeTel,
		profileImage,
		department,
		partLevel,
		partPosition,
		zipcode,
		addressMaster,
		addressDetail,
		inDate,
		outDate,
		isTenantAdmin,
		useState,
	};

	const res = await FetchApiPut(`/user/${username}`, cleanedParams);

	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '사용자 수정 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const deleteUser = async (username: string) => {
	const res = await FetchApiDelete(`/user/${username}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '사용자 삭제 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};
