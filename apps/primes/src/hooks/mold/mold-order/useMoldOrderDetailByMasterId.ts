import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMoldOrderDetailByMasterId } from '@primes/services/mold/moldOrderService';

// 전역 요청 관리자 - 중복 요청 완전 차단
class MoldOrderDetailRequestManager {
	private static instance: MoldOrderDetailRequestManager;
	private activeRequests = new Map<string, Promise<any>>();
	private requestCounts = new Map<string, number>();

	static getInstance(): MoldOrderDetailRequestManager {
		if (!MoldOrderDetailRequestManager.instance) {
			MoldOrderDetailRequestManager.instance = new MoldOrderDetailRequestManager();
		}
		return MoldOrderDetailRequestManager.instance;
	}

	async getDetailByMasterId(masterId: number | string, page: number, size: number): Promise<any> {
		const key = `${masterId}-${page}-${size}`;
		
		// 요청 횟수 추적
		const currentCount = this.requestCounts.get(key) || 0;
		this.requestCounts.set(key, currentCount + 1);
		
		console.log(`🔍 Request #${currentCount + 1} for key: ${key}`);
		
		// 이미 진행 중인 요청이 있으면 재사용
		if (this.activeRequests.has(key)) {
			console.log(`♻️ Reusing existing request for key: ${key}`);
			return this.activeRequests.get(key);
		}

		// 새로운 요청 생성
		console.log(`🆕 Creating new request for key: ${key}`);
		const requestPromise = getMoldOrderDetailByMasterId(masterId, page, size);
		
		// 활성 요청 맵에 저장
		this.activeRequests.set(key, requestPromise);

		// 요청 완료 후 정리
		requestPromise.finally(() => {
			setTimeout(() => {
				this.activeRequests.delete(key);
				console.log(`🧹 Cleaned up request for key: ${key}`);
			}, 1000); // 1초 후 정리
		});

		return requestPromise;
	}

	getRequestCount(masterId: number | string, page: number, size: number): number {
		const key = `${masterId}-${page}-${size}`;
		return this.requestCounts.get(key) || 0;
	}
}

const requestManager = MoldOrderDetailRequestManager.getInstance();

export const useMoldOrderDetailByMasterId = (
	masterId: number | string | null,
	page: number = 0,
	size: number = 30,
	context?: string
) => {
	// masterId 유효성 검사
	const isValidMasterId: boolean = Boolean(
		masterId &&
			masterId !== '0' &&
			masterId !== 0 &&
			masterId !== null &&
			masterId !== undefined &&
			(typeof masterId === 'number'
				? masterId > 0
				: parseInt(masterId.toString()) > 0)
	);

	// 단순화된 쿼리 키
	const queryKey = ['mold-order-detail-by-master', masterId, page, size];

	// 디버깅 로그
	if (process.env.NODE_ENV === 'development') {
		const requestCount = masterId ? requestManager.getRequestCount(masterId, page, size) : 0;
		console.log(`🎯 useMoldOrderDetailByMasterId called:`, {
			masterId,
			isValidMasterId,
			page,
			size,
			context,
			requestCount,
			queryKey,
		});
	}

	return useQuery({
		queryKey,
		queryFn: () => requestManager.getDetailByMasterId(masterId!, page, size),
		placeholderData: keepPreviousData,
		staleTime: Infinity, // 무한 캐시 - 수동으로만 무효화
		gcTime: 1000 * 60 * 30, // 30분 가비지 컬렉션
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchInterval: false,
		refetchIntervalInBackground: false,
		retry: false,
		enabled: isValidMasterId,
		networkMode: 'offlineFirst',
	});
};
