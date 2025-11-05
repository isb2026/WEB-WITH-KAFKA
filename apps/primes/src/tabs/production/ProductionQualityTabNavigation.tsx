import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { CheckCircle, BarChart3, AlertCircle, Plus } from 'lucide-react';
import { RadixIconButton } from '@radix-ui/components';

// Page imports - 품질관리 관련 페이지들
import ProductionQualityInspectionListPage from '@primes/pages/quality/self/QualitySelfInspectionListPage';
import ProductionQualityAnalysisPage from '@primes/pages/production/quality/ProductionQualityAnalysisPage';

interface ProductionQualityTabNavigationProps {
	activetab?: string;
}

const ProductionQualityTabNavigation: React.FC<
	ProductionQualityTabNavigationProps
> = ({ activetab }) => {
	const { t } = useTranslation('common');
	const navigate = useNavigate();
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'inspection'
	);
	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/production/quality/inspection/list')) {
			setCurrentTab('inspection');
		} else if (pathname.includes('/production/quality/analysis')) {
			setCurrentTab('analysis');
		}
	}, [location.pathname]);

	const tabs: TabItem[] = [
		{
			id: 'inspection',
			icon: <CheckCircle size={16} />,
			label: '자주 검사',
			to: '/production/quality/inspection/list',
			content: <ProductionQualityInspectionListPage />,
		},
		{
			id: 'analysis',
			icon: <BarChart3 size={16} />,
			label: '품질 분석',
			to: '/production/quality/analysis',
			content: <ProductionQualityAnalysisPage />,
		},
	];

	const RegisterButton = () => {
		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
					onClick={() => {
						navigate('/production/quality/inspection/register');
					}}
				>
					<Plus size={16} />
					{t('tabs.actions.register')}
				</RadixIconButton>
			</div>
		);
	};

	const SetActionButton = (tab: string) => {
		switch (tab) {
			case 'inspection':
				return <RegisterButton />; // 자주검사만 등록 버튼 활성화
			case 'analysis':
				return null; // 분석 탭에서는 등록 버튼 비활성화
			default:
				return null;
		}
	};

	return (
		<>
			<TabLayout
				title="품질 관리"
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default ProductionQualityTabNavigation;
