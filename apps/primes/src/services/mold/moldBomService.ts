import {
	FetchApiPost,
	FetchApiGet,
	FetchApiPut,
	FetchApiDelete,
} from '@primes/utils/request';
import {
	MoldBomMasterDto,
	MoldBomDetailDto,
	MoldBomMasterSearchRequest,
	MoldBomDetailSearchRequest,
	MoldBomMasterCreateRequest,
	MoldBomMasterUpdateRequest,
	MoldBomDetailCreateRequest,
	MoldBomDetailUpdateRequest,
	MoldBomMasterUpdateAllRequest,
	MoldBomDetailUpdateAllRequest,
	MoldBomDetailSetAssignedInstanceDto,
} from '@primes/types/mold';

// MoldBomMaster API 호출
export const getMoldBomMasterList = async (
	searchRequest: MoldBomMasterSearchRequest = {},
	page: number = 0,
	size: number = 10
): Promise<{ status: string; data: MoldBomMasterDto[]; message: string; totalElements?: number }> => {
	const params = {
		page,
		size,
		...searchRequest,
	};
	
	const res = await FetchApiGet('mold/mold-bom/master', params);
	
	if (res.status !== 'success') {
		console.error('API error:', res);
		throw new Error('MoldBomMaster 목록 조회 실패');
	}

	let moldBomData: MoldBomMasterDto[] = [];
	let totalElements = 0;

	if (res.data && Array.isArray(res.data)) {
		moldBomData = res.data;
	} else if (res.data && res.data.content && Array.isArray(res.data.content)) {
		moldBomData = res.data.content;
		totalElements = res.data.totalElements || 0;
	} else if (res.data && res.data.data && Array.isArray(res.data.data)) {
		moldBomData = res.data.data;
		totalElements = res.data.totalElements || 0;
	} else {
		console.warn('Unexpected response structure:', res);
		moldBomData = [];
	}

	return {
		status: 'success',
		data: moldBomData,
		message: 'MoldBomMaster 목록 조회 성공',
		totalElements,
	};
};

export const createMoldBomMaster = async (data: MoldBomMasterCreateRequest): Promise<MoldBomMasterDto[]> => {
	const res = await FetchApiPost('mold/mold-bom/master', [data]);
	
	if (res.status !== 'success') {
		console.error('API error response:', res);
		throw new Error(`MoldBomMaster 생성 실패: ${res.message || 'Unknown error'}`);
	}
	return res.data;
};

export const updateMoldBomMaster = async (id: number, data: MoldBomMasterUpdateRequest): Promise<MoldBomMasterDto> => {
	const res = await FetchApiPut(`mold/mold-bom/master/${id}`, data);
	
	if (res.status !== 'success') {
		throw new Error('MoldBomMaster 수정 실패');
	}
	return res.data;
};

export const updateAllMoldBomMaster = async (data: MoldBomMasterUpdateAllRequest): Promise<MoldBomMasterDto[]> => {
	const res = await FetchApiPut('mold/mold-bom/master', data);
	
	if (res.status !== 'success') {
		throw new Error('MoldBomMaster 일괄 수정 실패');
	}
	return res.data;
};

export const deleteMoldBomMaster = async (ids: number[]): Promise<any> => {
	const res = await FetchApiDelete('mold/mold-bom/master', undefined, ids);
	
	if (res.status !== 'success') {
		throw new Error('MoldBomMaster 삭제 실패');
	}
	return res.data;
};

// MoldBomDetail API 호출
export const getMoldBomDetailList = async (
	searchRequest: MoldBomDetailSearchRequest = {},
	page: number = 0,
	size: number = 10
): Promise<{ status: string; data: MoldBomDetailDto[]; message: string; totalElements?: number }> => {
	const params = {
		page,
		size,
		...searchRequest,
	};
	
	const res = await FetchApiGet('mold/mold-bom/detail', params);
	
	if (res.status !== 'success') {
		console.error('API error:', res);
		throw new Error('MoldBomDetail 목록 조회 실패');
	}

	let moldBomDetailData: MoldBomDetailDto[] = [];
	let totalElements = 0;

	if (res.data && Array.isArray(res.data)) {
		moldBomDetailData = res.data;
	} else if (res.data && res.data.content && Array.isArray(res.data.content)) {
		moldBomDetailData = res.data.content;
		totalElements = res.data.totalElements || 0;
	} else if (res.data && res.data.data && Array.isArray(res.data.data)) {
		moldBomDetailData = res.data.data;
		totalElements = res.data.totalElements || 0;
	} else {
		console.warn('Unexpected response structure:', res);
		moldBomDetailData = [];
	}

	return {
		status: 'success',
		data: moldBomDetailData,
		message: 'MoldBomDetail 목록 조회 성공',
		totalElements,
	};
};

export const createMoldBomDetail = async (data: MoldBomDetailCreateRequest): Promise<MoldBomDetailDto[]> => {
	const res = await FetchApiPost('mold/mold-bom/detail', [data]);
	
	if (res.status !== 'success') {
		console.error('API error response:', res);
		throw new Error(`MoldBomDetail 생성 실패: ${res.message || 'Unknown error'}`);
	}
	return res.data;
};

export const updateMoldBomDetail = async (id: number, data: MoldBomDetailUpdateRequest): Promise<MoldBomDetailDto> => {
	const res = await FetchApiPut(`mold/mold-bom/detail/${id}`, data);
	
	if (res.status !== 'success') {
		throw new Error('MoldBomDetail 수정 실패');
	}
	return res.data;
};

export const updateAllMoldBomDetail = async (data: MoldBomDetailUpdateAllRequest): Promise<MoldBomDetailDto[]> => {
	const res = await FetchApiPut('mold/mold-bom/detail', data);
	
	if (res.status !== 'success') {
		throw new Error('MoldBomDetail 일괄 수정 실패');
	}
	return res.data;
};

export const deleteMoldBomDetail = async (ids: number[]): Promise<any> => {
	const res = await FetchApiDelete('mold/mold-bom/detail', undefined, ids);
	
	if (res.status !== 'success') {
		throw new Error('MoldBomDetail 삭제 실패');
	}
	return res.data;
};

// 통합 MoldBom API 호출 (Master와 Detail을 함께 처리)
export const createMoldBom = async (data: any): Promise<any> => {
	// Master 데이터가 있는 경우 Master를 먼저 생성
	if (data.master) {
		const masterRes = await createMoldBomMaster(data.master);
		const masterId = masterRes[0]?.id;
		
		// Detail 데이터가 있고 Master ID가 생성된 경우 Detail 생성
		if (data.details && masterId) {
			const detailsWithMasterId = data.details.map((detail: any) => ({
				...detail,
				masterId: masterId
			}));
			await createMoldBomDetail(detailsWithMasterId);
		}
		
		return masterRes;
	}
	
	// Master 데이터가 없는 경우 Detail만 생성
	if (data.details) {
		return await createMoldBomDetail(data.details);
	}
	
	throw new Error('생성할 데이터가 없습니다.');
};

export const updateMoldBom = async (data: any): Promise<any> => {
	// Master 데이터가 있는 경우 Master 업데이트
	if (data.master && data.master.id) {
		await updateMoldBomMaster(data.master.id, data.master);
	}
	
	// Detail 데이터가 있는 경우 Detail 업데이트
	if (data.details) {
		for (const detail of data.details) {
			if (detail.id) {
				await updateMoldBomDetail(detail.id, detail);
			}
		}
	}
	
	return { status: 'success', message: 'MoldBom 업데이트 완료' };
};

export const deleteMoldBom = async (ids: number[]): Promise<any> => {
	// Master ID인 경우 Master와 관련 Detail 모두 삭제
	// Detail ID인 경우 Detail만 삭제
	const masterIds: number[] = [];
	const detailIds: number[] = [];
	
	// 실제 구현에서는 ID 타입을 구분하는 로직이 필요할 수 있습니다
	// 여기서는 간단히 처리합니다
	for (const id of ids) {
		// TODO: ID가 Master인지 Detail인지 구분하는 로직 필요
		// 임시로 모든 ID를 Master로 처리
		masterIds.push(id);
	}
	
	if (masterIds.length > 0) {
		await deleteMoldBomMaster(masterIds);
	}
	
	if (detailIds.length > 0) {
		await deleteMoldBomDetail(detailIds);
	}
	
	return { status: 'success', message: 'MoldBom 삭제 완료' };
};

// MoldBomDetail Set Assigned Instances API 호출
export const getMoldBomDetailSetAssignedInstances = async (
	moldBomMasterId: number
): Promise<{ status: string; data: MoldBomDetailSetAssignedInstanceDto[]; message: string }> => {
	const res = await FetchApiGet(`mold/mold-bom/detail/set-assigned-instances`, {
		moldBomMasterId
	});
	
	if (res.status !== 'success') {
		console.error('API error:', res);
		throw new Error('MoldBomDetail Set Assigned Instances 조회 실패');
	}

	return {
		status: 'success',
		data: res.data || [],
		message: 'MoldBomDetail Set Assigned Instances 조회 성공',
	};
};
