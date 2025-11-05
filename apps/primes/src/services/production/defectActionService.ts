import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';
import type {
	DefectActionCreateRequest,
	DefectActionUpdateRequest,
	DefectActionSearchRequest,
	CommonResponseDefectActionDto,
	CommonResponseListDefectActionDto,
	CommonResponsePageDefectActionSearchResponse,
} from '@primes/types/production/defectTypes';

// DefectAction 목록 조회
export const getDefectActionList = async (
	searchRequest: DefectActionSearchRequest = {},
	page: number = 0,
	size: number = 10
) => {
	// searchRequest에서 허용된 필드만 추출
	const {
		defectRecordId,
		actionDateStart,
		actionDateEnd,
		actionPlanDescription,
		actionBy,
		actionType,
	} = searchRequest;

	const cleanedSearchRequest = {
		defectRecordId,
		actionDateStart,
		actionDateEnd,
		actionPlanDescription,
		actionBy,
		actionType,
	};

	// getSearchParams 유틸리티 사용
	const searchParams = getSearchParams(cleanedSearchRequest || {});
	const url = `/production/defect-action?page=${page}&size=${size}&${searchParams}`;

	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'DefectAction 목록 조회 실패';
		throw new Error(errorMessage);
	}
	return res as CommonResponsePageDefectActionSearchResponse;
};

// DefectAction 단일 조회
export const getDefectActionById = async (id: number) => {
	const url = `/production/defect-action/${id}`;
	
	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'DefectAction 조회 실패';
		throw new Error(errorMessage);
	}
	return res as CommonResponseDefectActionDto;
};

// 특정 DefectRecord의 DefectAction 목록 조회
export const getDefectActionsByRecordId = async (
	defectRecordId: number,
	page: number = 0,
	size: number = 10
) => {
	const searchRequest: DefectActionSearchRequest = { defectRecordId };
	return getDefectActionList(searchRequest, page, size);
};

// 간단한 데이터 검증 함수
const validateDefectActionData = (data: DefectActionCreateRequest) => {
	if (!data.defectRecordId || data.defectRecordId <= 0) {
		throw new Error('불량 기록 ID는 필수입니다.');
	}
	if (!data.actionTaken || data.actionTaken.trim() === '') {
		throw new Error('조치내용은 필수입니다.');
	}
	if (data.actionBy && data.actionBy.length > 50) {
		throw new Error('조치 담당자는 50자 이하여야 합니다.');
	}
	if (data.actionType && !['TEMPORARY', 'ROOT_CAUSE', 'PREVENTIVE', 'CORRECTIVE'].includes(data.actionType)) {
		throw new Error('유효하지 않은 조치 유형입니다.');
	}
	if (data.workingHours && (data.workingHours < 0 || data.workingHours > 999.99)) {
		throw new Error('소요시간은 0 이상 999.99 이하여야 합니다.');
	}
};

// DefectAction 생성
export const createDefectAction = async (
	data: DefectActionCreateRequest[]
) => {
	// 입력 데이터를 배열로 변환
	const dataArray = data;
	
	// 데이터 검증
	dataArray.forEach(validateDefectActionData);
	
	// 각 항목에 대해 cleanedParams 패턴 적용
	const cleanedParamsArray = dataArray.map((item: DefectActionCreateRequest) => {
		// item이 객체인지 확인
		if (!item || typeof item !== 'object') {
			console.error('잘못된 item:', item);
			return {};
		}

		const cleanedItem: DefectActionCreateRequest = {
			defectRecordId: item.defectRecordId,
			actionTaken: item.actionTaken,
			actionDate: item.actionDate,
			actionBy: item.actionBy,
			actionType: item.actionType,
			workingHours: item.workingHours,
		};

		// undefined 값 제거
		Object.keys(cleanedItem).forEach(key => {
			if (cleanedItem[key as keyof DefectActionCreateRequest] === undefined) {
				delete cleanedItem[key as keyof DefectActionCreateRequest];
			}
		});

		return cleanedItem;
	});

	// 단일 항목인 경우 배열에서 첫 번째 요소만 전송
	const requestData = Array.isArray(data) ? cleanedParamsArray : cleanedParamsArray[0];
	
	const res = await FetchApiPost('/production/defect-action', requestData);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'DefectAction 생성 실패';
		throw new Error(errorMessage);
	}
	return res as CommonResponseListDefectActionDto;
};

// DefectAction 수정
export const updateDefectAction = async (id: number, data: DefectActionUpdateRequest) => {
	// 허용된 필드만 추출
	const cleanedParams: DefectActionUpdateRequest = {
		defectRecordId: data.defectRecordId,
		actionTaken: data.actionTaken,
		actionDate: data.actionDate,
		actionBy: data.actionBy,
		actionType: data.actionType,
		workingHours: data.workingHours,
	};

	// undefined 값 제거
	Object.keys(cleanedParams).forEach(key => {
		if (cleanedParams[key as keyof DefectActionUpdateRequest] === undefined) {
			delete cleanedParams[key as keyof DefectActionUpdateRequest];
		}
	});

	const res = await FetchApiPut(`/production/defect-action/${id}`, cleanedParams);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'DefectAction 수정 실패';
		throw new Error(errorMessage);
	}
	return res as CommonResponseDefectActionDto;
};

// DefectAction 삭제
export const deleteDefectAction = async (ids: number[]) => {
	const res = await FetchApiDelete('/production/defect-action', undefined, ids);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'DefectAction 삭제 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

// DefectAction 일괄 수정 (API에서 지원하는 경우)
export const updateDefectActionBatch = async (
	updates: Array<{ id: number; data: DefectActionUpdateRequest }>
) => {
	const cleanedUpdates = updates.map(({ id, data }) => {
		const cleanedData: DefectActionUpdateRequest = {
			defectRecordId: data.defectRecordId,
			actionTaken: data.actionTaken,
			actionDate: data.actionDate,
			actionBy: data.actionBy,
			actionType: data.actionType,
			workingHours: data.workingHours,
		};

		// undefined 값 제거
		Object.keys(cleanedData).forEach(key => {
			if (cleanedData[key as keyof DefectActionUpdateRequest] === undefined) {
				delete cleanedData[key as keyof DefectActionUpdateRequest];
			}
		});

		return { id, ...cleanedData };
	});

	const res = await FetchApiPut('/production/defect-action/batch', cleanedUpdates);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'DefectAction 일괄 수정 실패';
		throw new Error(errorMessage);
	}
	return res as CommonResponseListDefectActionDto;
}; 

// Field API for Defect Record
export const getDefectActionField = async (fieldName: string) => {
	const res = await FetchApiGet(`/production/defect-action/fields/${fieldName}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'Defect Action 필드 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};
