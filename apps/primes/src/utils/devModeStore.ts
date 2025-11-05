// 개발 모드 전역 상태 관리
// 컨텍스트를 사용할 수 없는 유틸리티 함수에서 사용

class DevModeStore {
	private useLocalEndpoints: boolean = true;
	private listeners: Set<() => void> = new Set();

	constructor() {
		// 🔒 운영 환경 안전 장치: 개발 모드에서만 초기화
		if (import.meta.env.VITE_DEV_MODE === 'true' && import.meta.env.DEV) {
			this.loadFromStorage();
		} else {
			// 운영 환경에서는 항상 false로 고정
			this.useLocalEndpoints = false;
		}
	}

	private loadFromStorage() {
		const saved = localStorage.getItem('dev_endpoint_mode');
		this.useLocalEndpoints = saved ? saved === 'local' : true;
	}

	getUseLocalEndpoints(): boolean {
		return this.useLocalEndpoints;
	}

	setUseLocalEndpoints(value: boolean) {
		this.useLocalEndpoints = value;
		if (import.meta.env.VITE_DEV_MODE === 'true' && import.meta.env.DEV) {
			localStorage.setItem('dev_endpoint_mode', value ? 'local' : 'server');
		}
		this.notifyListeners();
	}

	subscribe(listener: () => void) {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	private notifyListeners() {
		this.listeners.forEach(listener => listener());
	}
}

export const devModeStore = new DevModeStore();