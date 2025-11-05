import { FetchApiGet, FetchApiPost } from '@esg/utils/request';

// Record Matrix API 타입 정의
export interface RecordMatrixRequest {
	companyId: number;
	accountYear: number;
	year: number;
	records: RecordRowData[];
}

export interface RecordRowData {
	accountId: number;
	accountName?: string;
	monthlyQuantities: (number | null)[]; // 12개월 배열 (1월~12월)
	monthlyCosts?: (number | null)[]; // 12개월 배열 (선택사항)
}

export interface RecordMatrixResponse {
	companyId: number;
	accountYear: number;
	year: number;
	records: RecordRowResponse[];
}

export interface MonthlyDataItem {
	month: number;
	recordId: number | null;
	quantity: number | null;
	totalCost: number | null;
	accountMonth: string | null;
	exists: boolean;
}

export interface RecordRowResponse {
	accountId: number;
	accountName?: string;
	unit?: string;
	accountStyleName?: string;
	accountStyleCaption?: string;
	uom?: string | null;
	monthlyQuantities?: (number | null)[];
	monthlyCosts?: (number | null)[];
	monthlyData?: MonthlyDataItem[]; // 실제 Matrix API 응답 구조
}

// Record Matrix 조회 API
export const getRecordMatrix = async (
	companyId: number,
	accountYear: number
): Promise<RecordMatrixResponse> => {
	const res = await FetchApiGet('/record/matrix', {
		companyId,
		accountYear,
	});

	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'Record Matrix 조회 실패';
		throw new Error(errorMessage);
	}

	return res.data;
};

// Record Matrix 저장 API
export const saveRecordMatrix = async (
	payload: RecordMatrixRequest
): Promise<RecordMatrixResponse> => {
	const res = await FetchApiPost('/record/matrix', payload);

	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'Record Matrix 저장 실패';
		throw new Error(errorMessage);
	}

	return res.data;
};
