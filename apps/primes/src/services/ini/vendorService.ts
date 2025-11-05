import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';

// Vendor Master API calls
export const getVendorList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10
) => {
	const res = await FetchApiGet('/ini/vendor', {
		searchRequest,
		page,
		size,
	});
	if (res.status !== 'success') {
		throw new Error('Vendor 목록 조회 실패');
	}
	return res.data;
};

export const createVendor = async (data: any) => {
	// dataList가 있는 경우, 배열인 경우, 단일 객체인 경우 모두 처리
	let vendorData;
	if (data.dataList) {
		vendorData = Array.isArray(data.dataList) ? data.dataList[0] : data.dataList;
	} else if (Array.isArray(data)) {
		vendorData = data[0];
	} else {
		vendorData = data;
	}
	
	// 필수 필드 검증
	if (!vendorData?.compName || !vendorData?.compCode || !vendorData?.compType) {
		throw new Error('필수 필드(compName, compCode, compType)가 누락되었습니다.');
	}

	// cleanedParams 패턴 적용 - API 스키마에 맞춰 허용된 필드만 추출
	const {
		compName,
		compCode,
		compType,
		ceoName,
		licenseNo,
		compEmail,
		telNumber,
		faxNumber,
		businessType,
		industry,
		zipCode,
		addressDtl,
		addressMst,
		memo,
		usageStatus,
		attachments,
		isUse,
	} = vendorData;

	const cleanedParams = {
		compName,
		compCode,
		compType,
		ceoName,
		licenseNo,
		compEmail,
		telNumber,
		faxNumber,
		businessType,
		industry,
		zipCode,
		addressDtl,
		addressMst,
		memo,
		usageStatus,
		attachments,
		isUse,
	};

	const res = await FetchApiPost('/ini/vendor', [cleanedParams]);
	if (res.status !== 'success') {
		throw new Error('Vendor 생성 실패');
	}
	return res.data;
};

export const updateVendor = async (id: number, data: any) => {
	const res = await FetchApiPut(`/ini/vendor/${id}`, data);
	if (res.status !== 'success') {
		throw new Error('Vendor 수정 실패');
	}
	return res.data;
};

export const deleteVendor = async (ids: number[]) => {
	const res = await FetchApiDelete('/ini/vendor', ids);
	if (res.status !== 'success') {
		throw new Error('Vendor 삭제 실패');
	}
	return res.data;
};