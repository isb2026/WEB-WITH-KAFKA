// 개발 환경 전용 마이크로서비스 라우터
// 이 파일은 개발 환경에서만 사용되며, 삭제해도 기존 프로덕션 코드에 영향 없음

interface DevServicePortMap {
	[key: string]: number;
}

// 로컬 개발 환경에서 사용할 서비스별 포트 매핑
const DEV_SERVICE_PORTS: DevServicePortMap = {
	init: 8082,
	sales: 8083,
	user: 8084,
	purchase: 8085,
	production: 8086,
	machine: 8087,
	mold: 8088,
	file: 8089,
	quality: 8091,
	tenant: 8092,
};

/**
 * 개발 환경에서만 사용 - URL에서 서비스명을 추출합니다
 * 예: '/init/vendor' -> 'init'
 *     '/user/auth/login' -> 'user'
 */
export const extractDevServiceFromUrl = (url: string): string | null => {
	// 개발 모드가 아니면 null 반환
	if (import.meta.env.VITE_DEV_MODE !== 'true') {
		return null;
	}

	// URL이 '/'로 시작하면 제거
	const cleanUrl = url.startsWith('/') ? url.slice(1) : url;

	// 첫 번째 세그먼트를 서비스명으로 추출
	const segments = cleanUrl.split('/');
	const serviceName = segments[0];

	// 알려진 서비스인지 확인
	if (DEV_SERVICE_PORTS[serviceName]) {
		return serviceName;
	}

	return null;
};

/**
 * 개발 환경에서만 사용 - 마이크로서비스별 baseURL을 반환합니다
 * @param url API URL
 * @param useLocalEndpoints 로컬 엔드포인트 사용 여부 (컨텍스트에서 전달)
 */
export const getDevServiceBaseUrl = (
	url: string,
	useLocalEndpoints?: boolean
): string | null => {
	// 개발 모드가 아니면 null 반환 (기존 로직 사용)
	if (import.meta.env.VITE_DEV_MODE !== 'true') {
		return null;
	}
	// 로컬 엔드포인트를 사용하지 않으면 null 반환 (서버 엔드포인트 사용)
	if (useLocalEndpoints === false) {
		console.log(`🔧 DEV MODE: Using server endpoints for ${url}`);
		return null;
	}

	// 서비스명 추출
	const serviceName = extractDevServiceFromUrl(url);

	if (serviceName && DEV_SERVICE_PORTS[serviceName]) {
		const port = DEV_SERVICE_PORTS[serviceName];
		const baseUrl = `http://localhost:${port}`;
		console.log(`🔧 DEV MODE: Routing ${url} to ${baseUrl} (local)`);
		return baseUrl;
	}

	// 알 수 없는 서비스인 경우 null 반환 (기존 로직 사용)
	return null;
};

/**
 * 개발 환경에서만 사용 - 전체 URL을 생성합니다
 * @param url API URL
 * @param useLocalEndpoints 로컬 엔드포인트 사용 여부
 */
export const buildDevApiUrl = (
	url: string,
	useLocalEndpoints?: boolean
): string | null => {
	const devBaseUrl = getDevServiceBaseUrl(url, useLocalEndpoints);

	if (!devBaseUrl) {
		return null; // 기존 로직 사용
	}

	// URL이 이미 완전한 URL인 경우 그대로 반환
	if (url.startsWith('http://') || url.startsWith('https://')) {
		return url;
	}

	// baseURL과 path를 결합
	const cleanUrl = url.startsWith('/') ? url : `/${url}`;
	return `${devBaseUrl}${cleanUrl}`;
};

/**
 * 개발 환경에서 사용 가능한 서비스 목록을 반환합니다
 */
export const getDevAvailableServices = (): DevServicePortMap => {
	if (import.meta.env.VITE_DEV_MODE !== 'true') {
		return {};
	}
	return { ...DEV_SERVICE_PORTS };
};

/**
 * 개발 환경에서 특정 서비스의 헬스체크 URL을 반환합니다
 */
export const getDevServiceHealthUrl = (serviceName: string): string | null => {
	if (import.meta.env.VITE_DEV_MODE !== 'true') {
		return null;
	}

	if (DEV_SERVICE_PORTS[serviceName]) {
		const port = DEV_SERVICE_PORTS[serviceName];
		return `http://localhost:${port}/health`;
	}
	return null;
};
