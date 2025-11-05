import React, { useEffect, useState } from 'react';
import Header from '@primes/components/common/header/Header';
import Aside from '@primes/components/common/AccordionAside';
import { Outlet } from 'react-router-dom';
import { useSidebarMode } from '../hooks/useSidebarMode';
import { useResponsive } from '@primes/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { TenantProvider } from '@primes/contexts/TenantContext';
import { getTenantInfo } from '@primes/utils/tokenUtils';

const DashboardLayout: React.FC = () => {
	const { sidebarMode, handleModeChange } = useSidebarMode();
	const { isMobile, isTablet } = useResponsive();
	const location = useLocation();
	const navigate = useNavigate();
	const [tenantId, setTenantId] = useState<number | undefined>(undefined);
	
	useEffect(() => {
		// 로그인 페이지에서는 아무것도 하지 않음
		if (location.pathname === '/login' || location.pathname === '/signup') {
			return;
		}
		
		// 로그인 시 저장된 테넌트 정보 확인
		const tenantInfo = getTenantInfo();
		if (tenantInfo) {
			// 테넌트 정보가 있으면 인증된 것으로 간주
			setTenantId(tenantInfo.id);
		} else {
			// 테넌트 정보가 없으면 즉시 로그인 페이지로 리다이렉트
			navigate('/login', { replace: true });
			return; // 리다이렉트 후에는 더 이상 실행하지 않음
		}
	}, [location, navigate]);

	// tenantId가 없으면 아무것도 렌더링하지 않음 (즉시 리다이렉트)
	if (!tenantId) {
		return null;
	}

	return (
		<TenantProvider tenantId={tenantId || undefined}>
			<div className="min-h-screen h-screen bg-background flex flex-col">
				<div className="flex-shrink-0">
					<Header
						sidebarMode={sidebarMode}
						onModeChange={handleModeChange}
					/>
				</div>

				<div className="flex flex-1 h-full overflow-hidden">
					{!isMobile && !isTablet && (
						<div className="flex-shrink-0 transition-all duration-300 ease-in-out">
							<Aside sidebarMode={sidebarMode} isDrawer={false} />
						</div>
					)}

					<div className="flex-1 h-full overflow-auto transition-all duration-300 ease-in-out">
						<Outlet />
					</div>
				</div>

				{/* <SidebarModeToggle 
					currentMode={sidebarMode} 
					onModeChange={handleModeChange}
				/> */}
			</div>
		</TenantProvider>
	);
};

export default DashboardLayout;
