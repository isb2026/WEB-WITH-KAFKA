import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	VendorSearchRequest,
	VendorCreateRequest,
	VendorUpdateRequest,
	VendorUpdateAllRequest,
} from '@primes/types/vendor';

// Vendor 조회 (GET /vendor)
export const getVendorList = async ({
	searchRequest,
	page = 0,
	size = 10,
}: {
	searchRequest: VendorSearchRequest;
	page?: number;
	size?: number;
}) => {
	// searchRequest 객체를 URL 파라미터로 풀어서 전달
	const params = {
		page,
		size,
		...searchRequest, // searchRequest의 모든 속성을 직접 파라미터로 풀어서 전달
	};

	const res = await FetchApiGet('/init/vendor', params);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Vendor 목록 조회 실패');
	}
	return res.data;
};

// Vendor 리스트 생성 (POST /vendor) - 여러 공급업체를 한 번에 생성
export const createVendor = async (
	dataList: Partial<VendorCreateRequest>[]
) => {
	// 각 항목에 대해 cleanedParams 적용
	const cleanedDataList = dataList.map((data) => {
		const {
			compType,
			licenseNo,
			compName,
			ceoName,
			compEmail,
			telNumber,
			faxNumber,
			zipCode,
			addressDtl,
			addressMst,
		} = data;

		return {
			compType,
			licenseNo,
			compName,
			ceoName,
			compEmail,
			telNumber,
			faxNumber,
			zipCode,
			addressDtl,
			addressMst,
		};
	});

	// 백엔드에서 List<VendorCreateRequest> 형태로 받으므로 배열로 전송
	const requestBody: VendorCreateRequest[] = cleanedDataList;

	const res = await FetchApiPost('/init/vendor', requestBody);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Vendor 리스트 생성 실패');
	}
	return res.data;
};

// Vendor 일괄 수정 (PUT /vendor)
export const updateVendorBulk = async (vendors: VendorUpdateAllRequest[]) => {
	const res = await FetchApiPut('/init/vendor', vendors);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Vendor 일괄 수정 실패');
	}
	return res.data;
};

// Vendor 수정 (PUT /vendor/{id})
export const updateVendor = async (
	id: number,
	data: Partial<VendorUpdateRequest>
) => {
	const {
		compType,
		licenseNo,
		compName,
		ceoName,
		compEmail,
		telNumber,
		faxNumber,
		zipCode,
		addressDtl,
		addressMst,
	} = data;

	const cleanedParams = {
		compType,
		licenseNo,
		compName,
		ceoName,
		compEmail,
		telNumber,
		faxNumber,
		zipCode,
		addressDtl,
		addressMst,
	};
	const res = await FetchApiPut(`/init/vendor/${id}`, cleanedParams);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Vendor 수정 실패');
	}
	return res.data;
};

// Vendor 삭제 (DELETE /vendor)
export const deleteVendor = async (ids: number[]) => {
	const res = await FetchApiDelete('/init/vendor', undefined, ids);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Vendor 삭제 실패');
	}
	return res.data;
};

// Vendor 특정 필드 값 전체 조회 (GET /vendor/fields/{fieldName})
export const getVendorFieldValues = async (
	fieldName: string,
	searchRequest: VendorSearchRequest = {}
) => {
	// searchRequest 객체를 URL 파라미터로 풀어서 전달
	const params = {
		...searchRequest, // searchRequest의 모든 속성을 직접 파라미터로 풀어서 전달
	};

	const res = await FetchApiGet(`/init/vendor/fields/${fieldName}`, params);
	if (res.status !== 'success') {
		throw new Error(res.errorMessage || 'Vendor 필드 조회 실패');
	}
	return res.data;
};

// Legacy function names for backward compatibility
export const getAllVendorList = getVendorList;
export const getVendorFieldName = getVendorFieldValues;
