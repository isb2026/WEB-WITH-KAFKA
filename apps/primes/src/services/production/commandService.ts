import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
	getSearchParams,
} from '@primes/utils/request';

// Command 관련 타입 정의
export interface CreateCommandPayload {
	accountMon: string;
	planId?: number;
	planCode?: string;
	commandNo?: string;
	commandGroupNo?: string;
	commandProgressSeq?: string;
	itemId?: number;
	itemNo?: number;
	itemNumber?: string;
	itemName?: string;
	itemSpec?: string;
	progressId?: number;
	progressTypeCode?: string;
	progressName?: string;
	progressOrder?: number;
	isOutsourcing?: boolean;
	commandAmount?: number;
	commandWeight?: number;
	unit?: string;
	startDate?: string;
	endDate?: string;
	startTime?: string;
	endTime?: string;
	status?: string;
	isClose?: boolean;
	closeBy?: string;
	closeAt?: string;
}

export interface UpdateCommandPayload extends Partial<CreateCommandPayload> {
	id: number;
}

export interface CommandListParams {
	searchRequest?: {
		accountMon?: string;
		commandNo?: string;
		commandGroupNo?: string;
		itemNumber?: string;
		[key: string]: unknown;
	};
	page?: number;
	size?: number;
}

// Command Master API calls
export const getCommandList = async (
	searchRequest: any = {},
	page: number = 0,
	size: number = 10,
	includeProductionProgress: boolean = false
) => {
	if (searchRequest.commandId == 0 || searchRequest.commandNo == 0) {
		return {
			content: [],
			totalElements: 0,
			totalPages: 0,
			size: 0,
			number: 0,
			numberOfElements: 0,
			first: true,
			last: true,
			empty: true,
		};
	}

	// searchRequest에서 허용된 필드만 추출
	const { accountMon, commandNo, commandGroupNo, itemNumber, progressId } = searchRequest;
	const cleanedSearchRequest = {
		accountMon,
		commandNo,
		commandGroupNo,
		progressId,
		itemNumber,
	};

	// getSearchParams 유틸리티 사용
	const searchParams = getSearchParams(cleanedSearchRequest || {});
	const includeProgressParam = includeProductionProgress
		? '&includeProductionProgress=true'
		: '';
	const url = `/production/command?page=${page}&size=${size}&${searchParams}${includeProgressParam}`;

	const res = await FetchApiGet(url);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'Command 목록 조회 실패';
		throw new Error(errorMessage);
	}
	return res;
};

export const createCommand = async (
	data: Partial<CreateCommandPayload> | Partial<CreateCommandPayload>[]
) => {
	// 입력 데이터를 배열로 변환
	const dataArray = Array.isArray(data) ? data : [data];
	console.log('dataArray', dataArray);
	// 각 항목에 대해 cleanedParams 패턴 적용
	const cleanedParamsArray = dataArray.map((item: any) => {
		// item이 객체인지 확인
		if (!item || typeof item !== 'object') {
			console.error('잘못된 item:', item);
			return {};
		}

		const cleanedItem = {
			accountMon: item.accountMon,
			planId: item.planId,
			planCode: item.planCode,
			commandNo: item.commandNo,
			commandGroupNo: item.commandGroupNo,
			commandProgressSeq: item.commandProgressSeq,
			itemId: item.itemId,
			itemNo: item.itemNo,
			itemNumber: item.itemNumber,
			itemName: item.itemName,
			itemSpec: item.itemSpec,
			progressId: item.progressId,
			progressTypeCode: item.progressTypeCode,
			progressName: item.progressName,
			progressOrder: item.progressOrder,
			unitTypeCode: item.unitTypeCode,
			unitTypeName: item.unitTypeName,
			unitWeight: item.unitWeight,
			isOutsourcing: item.isOutsourcing,
			commandAmount: item.commandAmount,
			commandWeight: item.commandWeight,
			unit: item.unit,
			startDate: item.startDate,
			endDate: item.endDate,
			startTime: item.startTime,
			endTime: item.endTime,
			status: item.status,
			isClose: item.isClose,
			closeBy: item.closeBy,
			closeAt: item.closeAt,
		};

		return cleanedItem;
	});

	// 무조건 배열로 전송
	const res = await FetchApiPost('/production/command', cleanedParamsArray);

	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'Command 생성 실패';
		throw new Error(errorMessage);
	}

	return res.data;
};

export const updateCommand = async (
	id: number,
	data: Partial<CreateCommandPayload>
) => {
	// 허용된 필드만 추출 (cleanedParams 패턴)
	const {
		accountMon,
		planId,
		planCode,
		commandNo,
		commandGroupNo,
		commandProgressSeq,
		itemId,
		itemNo,
		itemNumber,
		itemName,
		itemSpec,
		progressId,
		progressTypeCode,
		progressName,
		progressOrder,
		isOutsourcing,
		commandAmount,
		commandWeight,
		unit,
		startDate,
		endDate,
		startTime,
		endTime,
		status,
		isClose,
		closeBy,
		closeAt,
	} = data;

	const cleanedParams = {
		accountMon,
		planId,
		planCode,
		commandNo,
		commandGroupNo,
		commandProgressSeq,
		itemId,
		itemNo,
		itemNumber,
		itemName,
		itemSpec,
		progressId,
		progressTypeCode,
		progressName,
		progressOrder,
		isOutsourcing,
		commandAmount,
		commandWeight,
		unit,
		startDate,
		endDate,
		startTime,
		endTime,
		status,
		isClose,
		closeBy,
		closeAt,
	};

	const res = await FetchApiPut(`/production/command/${id}`, cleanedParams);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'Command 수정 실패';
		console.error('❌ Command Update API 에러:', errorMessage);
		throw new Error(errorMessage);
	}
	return res.data;
};

export const deleteCommand = async (ids: number[]) => {
	const res = await FetchApiDelete('/production/command', undefined, ids);
	if (res.status !== 'success') {
		const errorMessage = res.errorMessage || 'Command 삭제 실패';
		throw new Error(errorMessage);
	}
	return res.data;
};

export const getCommandFieldName = async (fieldName: string) => {
	const res = await FetchApiGet(`/production/command/fields/${fieldName}`);
	if (res.status !== 'success') {
		throw new Error('Command 필드 조회 실패');
	}
	return res.data;
};
