import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@esg/utils/request';

import {
	GetAllMeterListPayload,
	GetSearchMeterListPayload,
	Meter,
} from '@esg/types/meter';

export const getAllMeters = async (payload: GetAllMeterListPayload) => {
	const res = await FetchApiGet('/init/meter', payload);
	if (res.status !== 'success') {
		throw new Error('계량기 목록 조회 실패');
	}
	return res.data;
};

export const createMeter = async (data: Partial<Meter>) => {
	const {
		name,
		servicePoint,
		component,
		serialNo,
		quantity,
		installedOn,
		installedBy,
		replacedOn,
		replacedBy,
		isUse,
	} = data;

	const cleanedParams = {
		name,
		servicePoint,
		component,
		serialNo,
		quantity,
		installedOn,
		installedBy,
		replacedOn,
		replacedBy,
		isUse,
	};

	const res = await FetchApiPost('/init/meter', cleanedParams);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '계량기 생성 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const updateMeter = async (id: number, data: Partial<Meter>) => {
	const {
		name,
		servicePoint,
		component,
		serialNo,
		quantity,
		installedOn,
		installedBy,
		replacedOn,
		replacedBy,
		isUse,
	} = data;

	const cleanedParams = {
		name,
		servicePoint,
		component,
		serialNo,
		quantity,
		installedOn,
		installedBy,
		replacedOn,
		replacedBy,
		isUse,
	};

	const res = await FetchApiPut(`/init/meter/${id}`, cleanedParams);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '계량기 수정 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const deleteMeter = async (id: number) => {
	const res = await FetchApiDelete(`/init/meter/${id}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '계량기 삭제 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const searchMeters = async (payload: GetSearchMeterListPayload) => {
	const res = await FetchApiGet('/init/meter/search', payload);
	if (res.status !== 'success') {
		throw new Error('계량기 검색 실패');
	}
	return res.data;
};

export const getMeterFieldValues = async (fieldName: string) => {
	const res = await FetchApiGet(`/init/meter/fields/${fieldName}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || '필드 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};
