import {
	FetchApiGet,
	FetchApiPost,
	FetchApiPut,
	FetchApiDelete,
} from '@esg/utils/request';

import { CompanyManager } from '@esg/types/company_manager';

export const getChargerList = async ({
	companyId,
	page,
	size,
	searchRequest,
}: {
	companyId: string;
	page: number;
	size: number;
	searchRequest?: Partial<
		import('@esg/types/company_manager').GetAllCompanyManagerListPayload['searchRequest']
	>;
}): Promise<CompanyManager[]> => {
	const res = await FetchApiGet('/charger', {
		companyId,
		page,
		size,
		searchRequest,
	});

	if (res.status !== 'success') {
		throw new Error('담당자 목록 조회 실패');
	}

	// Handle different response structures
	let chargerData = res.data;

	if (res.data && res.data.content) {
		chargerData = res.data.content;
	} else if (Array.isArray(res.data)) {
		chargerData = res.data;
	} else {
		chargerData = [];
	}

	return chargerData;
};

export const createCharger = async (data: Partial<CompanyManager>) => {
	const cleanedParams = Object.fromEntries(
		Object.entries(data).filter(([_, v]) => v !== undefined)
	);

	try {
		const res = await FetchApiPost('/charger', cleanedParams);

		// Check multiple possible success conditions
		const isSuccess = res.status === 'success' || !res.errorMessage;

		if (!isSuccess) {
			const errorMessage =
				res.errorMessage || res.message || '담당자 등록 실패';
			throw new Error(errorMessage);
		}
		return res.data;
	} catch (error) {
		throw error;
	}
};

export const updateCharger = async ({
	id,
	data,
}: {
	id: number;
	data: Partial<CompanyManager>;
}) => {
	const cleanedParams = Object.fromEntries(
		Object.entries(data).filter(([_, v]) => v !== undefined)
	);

	const res = await FetchApiPut(`/charger/${id}`, cleanedParams);

	const isSuccess = res?.status === 'success' || !res?.errorMessage;
	if (!isSuccess) {
		const errorMessage =
			res?.errorMessage || res?.message || '담당자 수정 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const deleteCharger = async (id: number) => {
	const res = await FetchApiDelete(`/charger/${id}`);
	const isSuccess =
		res?.status === 'success' ||
		(typeof res?.status === 'string' &&
			res?.status.toLowerCase() === 'success') ||
		!res?.errorMessage;

	if (!isSuccess) {
		const errorMessage =
			res?.errorMessage || res?.message || '충전 담당자 삭제 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const getChargerDetail = async (id: number): Promise<CompanyManager> => {
	const res = await FetchApiGet(`/charger/${id}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '충전 담당자 상세 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const getChargersByCompanyId = async (
	companyId: string
): Promise<Pick<CompanyManager, 'id' | 'username' | 'name' | 'department'>[]> => {
	const page = 0;
	const size = 100;

	const chargerList = await getChargerList({ companyId, page, size });

	if (!Array.isArray(chargerList)) {
		return [];
	}

	return chargerList.map((charger) => ({
		id: charger.id,
		username: charger.username,
		name: charger.name,
		department: charger.department,
	}));
};
