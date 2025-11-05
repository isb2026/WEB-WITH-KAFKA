import logoImage from '@primes/assets/img/logos/1x1_logo.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import Tooltip from '../common/Tooltip';

export default function MoornmoLogo() {
	const navigate = useNavigate();
	const { t } = useTranslation('common');

	const handleLogoClick = () => {
		navigate('/');
	};

	return (
		<div
			className="flex items-center gap-2 h-full cursor-pointer"
			onClick={handleLogoClick}
		>
			<img
				src={logoImage}
				alt={t('header.companyName')}
				className="size-8 rounded-sm bg-background"
			/>
			<Tooltip label="Advanced Integrated Planning System" side="right">
				<h1 className="text-lg font-bold text-foreground">AIPS</h1>
			</Tooltip>
		</div>
	);
}
