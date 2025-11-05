import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTenantById, TenantInfo } from '@primes/services/tenant/tenantService';
import { 
	getTenantInfo, 
	saveTenantInfo, 
	clearTenantInfo, 
	hasTenantInfoCache 
} from '@primes/utils/tokenUtils';

interface TenantContextType {
	tenantInfo: TenantInfo | null;
	tenantName: string;
	isLoading: boolean;
	error: string | null;
	refreshTenantInfo: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
	children: ReactNode;
	tenantId?: number; // 로그인한 사용자의 테넌트 ID
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ 
	children, 
	tenantId 
}) => {
	// 캐시된 테넌트 정보가 있으면 즉시 사용
	const cachedTenantInfo = tenantId ? getTenantInfo() : null;
	const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(cachedTenantInfo);
	const [isLoading, setIsLoading] = useState(false); // 캐시된 정보가 있으면 로딩하지 않음
	const [error, setError] = useState<string | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);

	const refreshTenantInfo = async (showLoading = true) => {
		if (!tenantId) {
			setError('테넌트 ID가 없습니다');
			return;
		}

		if (showLoading) {
			setIsLoading(true);
		}
		setError(null);

		try {
			// 로그인 시 받은 tenantId로 테넌트 정보 조회
			const tenant = await getTenantById(tenantId);
			
			// 조회한 테넌트 정보를 캐시에 저장
			saveTenantInfo(tenant);
			setTenantInfo(tenant);
		} catch (err) {
			setError(err instanceof Error ? err.message : '테넌트 정보를 가져올 수 없습니다');
		} finally {
			if (showLoading) {
				setIsLoading(false);
			}
		}
	};

	// 컴포넌트 마운트 시 테넌트 정보 로드 (한 번만 실행)
	useEffect(() => {
		if (tenantId && !isInitialized) {
			setIsInitialized(true);
			
			// 캐시된 정보가 있으면 백그라운드에서 업데이트, 없으면 로딩 표시
			if (cachedTenantInfo && cachedTenantInfo.id === tenantId) {
				// 캐시된 정보가 있으면 백그라운드에서만 업데이트 (로딩 표시 안함)
				refreshTenantInfo(false);
			} else {
				// 캐시된 정보가 없으면 로딩 표시하고 API 호출
				refreshTenantInfo(true);
			}
		}
	}, [tenantId, isInitialized]);

	// tenantId가 변경될 때마다 테넌트 정보 새로고침
	useEffect(() => {
		if (!isInitialized) return;
		
		if (tenantId) {
			// 캐시된 정보가 유효한지 확인 후 새로고침
			const cachedTenantInfo = getTenantInfo();
			if (!cachedTenantInfo || cachedTenantInfo.id !== tenantId) {
				refreshTenantInfo();
			}
		} else {
			// tenantId가 없으면 테넌트 정보 초기화 및 캐시 삭제
			setTenantInfo(null);
			setError(null);
			clearTenantInfo();
		}
	}, [tenantId]);

	const value: TenantContextType = {
		tenantInfo,
		tenantName: tenantInfo?.tenantName || '무른모', // 기본값은 '무른모'
		isLoading,
		error,
		refreshTenantInfo,
	};

	return (
		<TenantContext.Provider value={value}>
			{children}
		</TenantContext.Provider>
	);
};

export const useTenant = (): TenantContextType => {
	const context = useContext(TenantContext);
	if (context === undefined) {
		throw new Error('useTenant must be used within a TenantProvider');
	}
	return context;
};
