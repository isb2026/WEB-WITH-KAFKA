import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';
import type {
	DefectRecordCreateRequest,
	DefectRecordUpdateRequest,
	DefectRecordSearchRequest,
	CommonResponseDefectRecordDto,
	CommonResponseListDefectRecordDto,
	CommonResponsePageDefectRecordSearchResponse,
} from '@primes/types/production/defectTypes';

// DefectRecord 목록 조회
export const getDefectRecordList = async (
	searchRequest: DefectRecordSearchRequest = {},
	page: number = 0,
	size: number = 10
) => {
	// searchRequest에서 허용된 필드만 추출
	const {
		defectCode,
		itemId,
		itemNo,
		itemNumber,
		itemName,
		defectType,
		defectTypeCode,
		defectReason,
		defectReasonCode,
		reportedBy,
		severity,
		status,
		assignedTo,
		reportDateStart,
		reportDateEnd,
		dueDateStart,
		dueDateEnd,
	} = searchRequest;

	const cleanedSearchRequest = {
		defectCode,
		itemId,
		itemNo,
		itemNumber,
		itemName,
		defectType,
		defectTypeCode,
		defectReason,
		defectReasonCode,
		reportedBy,
		severity,
		status,
		assignedTo,
		reportDateStart,
		reportDateEnd,
		dueDateStart,
		dueDateEnd,
	};

	// getSearchParams 유틸리티 사용
	const searchParams = getSearchParams(cleanedSearchRequest || {});
	const url = `/production/defect-record?page=${page}&size=${size}&${searchParams}`;

	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'DefectRecord 목록 조회 실패';
		throw new Error(errorMessage);
	}
	return res as CommonResponsePageDefectRecordSearchResponse;
};

// DefectRecord 단일 조회
export const getDefectRecordById = async (id: number) => {
	const url = `/production/defect-record/${id}`;
	
	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'DefectRecord 조회 실패';
		throw new Error(errorMessage);
	}
	return res as CommonResponseDefectRecordDto;
};

// 간단한 데이터 검증 함수
const validateDefectRecordData = (data: DefectRecordCreateRequest) => {
	if (!data.defectCode || data.defectCode.trim() === '') {
		throw new Error('불량코드는 필수입니다.');
	}
	if (!data.itemNumber || data.itemNumber.trim() === '') {
		throw new Error('제품코드는 필수입니다.');
	}
	if (data.defectCode.length > 30) {
		throw new Error('불량코드는 30자 이하여야 합니다.');
	}
	if (data.itemNumber.length > 50) {
		throw new Error('제품코드는 50자 이하여야 합니다.');
	}
	if (data.defectQuantity !== undefined && data.defectQuantity < 0) {
		throw new Error('불량 수량은 0 이상이어야 합니다.');
	}
	if (data.expectedLoss !== undefined && data.expectedLoss < 0) {
		throw new Error('예상 손실 금액은 0 이상이어야 합니다.');
	}
};

// DefectRecord 생성
export const createDefectRecord = async (
	data: DefectRecordCreateRequest[]
) => {
	// 입력 데이터를 배열로 변환
	const dataArray = Array.isArray(data) ? data : [data];
	
	// 데이터 검증
	dataArray.forEach(validateDefectRecordData);
	
	// 각 항목에 대해 cleanedParams 패턴 적용
	const cleanedParamsArray = dataArray.map((item: DefectRecordCreateRequest) => {
		// item이 객체인지 확인
		if (!item || typeof item !== 'object') {
			console.error('잘못된 item:', item);
			return {};
		}

		const cleanedItem: DefectRecordCreateRequest = {
			defectCode: item.defectCode,
			itemId: item.itemId,
			itemNo: item.itemNo,
			itemNumber: item.itemNumber,
			itemName: item.itemName,
			defectType: item.defectType,
			defectTypeCode: item.defectTypeCode,
			defectReason: item.defectReason,
			defectReasonCode: item.defectReasonCode,
			defectDescription: item.defectDescription,
			defectQuantity: item.defectQuantity,
			expectedLoss: item.expectedLoss,
			expectedLossCurrency: item.expectedLossCurrency,
			reportDate: item.reportDate,
			reportedBy: item.reportedBy,
			severity: item.severity,
			status: item.status,
			assignedTo: item.assignedTo,
			dueDate: item.dueDate,
			actionPlanDescription: item.actionPlanDescription,
			lotNo: item.lotNo,
			itemProgressId: item.itemProgressId,
			progressName: item.progressName,
		};

		// undefined 값 제거
		Object.keys(cleanedItem).forEach(key => {
			if (cleanedItem[key as keyof DefectRecordCreateRequest] === undefined) {
				delete cleanedItem[key as keyof DefectRecordCreateRequest];
			}
		});

		return cleanedItem;
	});

	// 단일 항목인 경우 배열에서 첫 번째 요소만 전송
	const requestData = cleanedParamsArray;
	
	const res = await FetchApiPost('/production/defect-record', requestData);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'DefectRecord 생성 실패';
		throw new Error(errorMessage);
	}
	return res as CommonResponseListDefectRecordDto;
};

// DefectRecord 수정
export const updateDefectRecord = async (id: number, data: DefectRecordUpdateRequest) => {
	// 허용된 필드만 추출
	const cleanedParams: DefectRecordUpdateRequest = {
		defectCode: data.defectCode,
		itemId: data.itemId,
		itemNo: data.itemNo,
		itemNumber: data.itemNumber,
		itemName: data.itemName,
		defectType: data.defectType,
		defectTypeCode: data.defectTypeCode,
		defectReason: data.defectReason,
		defectReasonCode: data.defectReasonCode,
		defectDescription: data.defectDescription,
		defectQuantity: data.defectQuantity,
		expectedLoss: data.expectedLoss,
		expectedLossCurrency: data.expectedLossCurrency,
		reportDate: data.reportDate,
		reportedBy: data.reportedBy,
		severity: data.severity,
		status: data.status,
		assignedTo: data.assignedTo,
		dueDate: data.dueDate,
		actionPlanDescription: data.actionPlanDescription,
		lotNo: data.lotNo,
		itemProgressId: data.itemProgressId,
		progressName: data.progressName,
	};

	// undefined 값 제거
	Object.keys(cleanedParams).forEach(key => {
		if (cleanedParams[key as keyof DefectRecordUpdateRequest] === undefined) {
			delete cleanedParams[key as keyof DefectRecordUpdateRequest];
		}
	});

	const res = await FetchApiPut(`/production/defect-record/${id}`, cleanedParams);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'DefectRecord 수정 실패';
		throw new Error(errorMessage);
	}
	return res as CommonResponseDefectRecordDto;
};

// DefectRecord 삭제
export const deleteDefectRecord = async (ids: number[]) => {
	const res = await FetchApiDelete('/production/defect-record', undefined, ids);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'DefectRecord 삭제 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

// DefectRecord 일괄 수정 (API에서 지원하는 경우)
export const updateDefectRecordBatch = async (
	updates: Array<{ id: number; data: DefectRecordUpdateRequest }>
) => {
	const cleanedUpdates = updates.map(({ id, data }) => {
		const cleanedData: DefectRecordUpdateRequest = {
			defectCode: data.defectCode,
			itemId: data.itemId,
			itemNo: data.itemNo,
			itemNumber: data.itemNumber,
			itemName: data.itemName,
			defectType: data.defectType,
			defectTypeCode: data.defectTypeCode,
			defectReason: data.defectReason,
			defectReasonCode: data.defectReasonCode,
			defectDescription: data.defectDescription,
			defectQuantity: data.defectQuantity,
			expectedLoss: data.expectedLoss,
			expectedLossCurrency: data.expectedLossCurrency,
			reportDate: data.reportDate,
			reportedBy: data.reportedBy,
			severity: data.severity,
			status: data.status,
			assignedTo: data.assignedTo,
			dueDate: data.dueDate,
			actionPlanDescription: data.actionPlanDescription,
		};

		// undefined 값 제거
		Object.keys(cleanedData).forEach(key => {
			if (cleanedData[key as keyof DefectRecordUpdateRequest] === undefined) {
				delete cleanedData[key as keyof DefectRecordUpdateRequest];
			}
		});

		return { id, ...cleanedData };
	});

	const res = await FetchApiPut('/production/defect-record/batch', cleanedUpdates);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'DefectRecord 일괄 수정 실패';
		throw new Error(errorMessage);
	}
	return res as CommonResponseListDefectRecordDto;
}; 

// Field API for Defect Record
export const getDefectRecordFields = async (fieldName: string) => {
	const res = await FetchApiGet(`/production/defect-record/fields/${fieldName}`);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'Defect Record 필드 조회 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};