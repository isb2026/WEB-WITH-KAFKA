import logoImage from '@primes/assets/img/logos/1x1_logo.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { useTenant } from '@primes/contexts/TenantContext';

export default function MoornmoLogo() {
	const navigate = useNavigate();
	const { t } = useTranslation('common');
	const { tenantName, isLoading, tenantInfo, error } = useTenant();

	const handleLogoClick = () => {
		navigate('/');
	};

	// 테넌트 정보가 로드되지 않았거나 로딩 중이면 여백만 표시
	if (isLoading || !tenantInfo) {
		return (
			<div
				className="flex items-center h-full cursor-pointer"
				onClick={handleLogoClick}
			>
				<div className="h-10 w-[120px] rounded-sm bg-background" />
			</div>
		);
	}

	// 테넌트 이미지가 있으면 테넌트 로고, 없으면 기본 로고
	const logoSrc = tenantInfo.tenantImage || logoImage;

	return (
		<div
			className="flex items-center h-full cursor-pointer"
			onClick={handleLogoClick}
		>
			<img
				src={logoSrc}
				alt={tenantName || '무른모'}
				className="h-10 w-auto max-w-[120px] rounded-sm bg-background object-contain"
				onError={(e) => {
					// 테넌트 이미지 로드 실패 시 기본 로고로 fallback
					e.currentTarget.src = logoImage;
				}}
			/>
		</div>
	);
}
