import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { Settings, Wrench, BarChart3, Cog, Plus, ArrowDownToLine } from 'lucide-react';
import { RadixIconButton } from '@radix-ui/components';

// Page imports
import MoldInoutInformationListPage from '@primes/pages/mold/mold-inout-information/MoldInoutInformationListPage';
import { ProductionMoldMaintenanceListPage } from '@primes/pages/production/mold/ProductionMoldMaintenanceListPage';
import { ProductionMoldAnalysisPage } from '@primes/pages/production/mold/ProductionMoldAnalysisPage';
import { MoldInoutInformationRegisterPage } from '@primes/pages/mold/mold-inout-information/MoldInoutInformationRegisterPage';

interface MoldManagementTabNavigationProps {
	activetab?: string;
}

const MoldManagementTabNavigation: React.FC<
	MoldManagementTabNavigationProps
> = ({ activetab }) => {
	const { t } = useTranslation('common');
	const navigate = useNavigate();
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'setup');
	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/production/mold/setup')) {
			setCurrentTab('setup');
		} else if (pathname.includes('/production/mold/input')) {
			setCurrentTab('input');
		} else if (pathname.includes('/production/mold/maintenance')) {
			setCurrentTab('maintenance');
		} else if (pathname.includes('/production/mold/analysis')) {
			setCurrentTab('analysis');
		}
	}, [location.pathname]);

	const tabs: TabItem[] = [
		{
			id: 'setup',
			icon: <Settings size={16} />,
			label: t('tabs.labels.moldSetup'),
			to: '/production/mold/setup',
			content: <MoldInoutInformationListPage />,
		},
		{
			id: 'input',
			icon: <ArrowDownToLine size={16} />,
			label: '금형 투입',
			to: '/production/mold/input',
			content: <MoldInoutInformationRegisterPage />,
		},
		{
			id: 'maintenance',
			icon: <Wrench size={16} />,
			label: t('tabs.labels.moldMaintenance'),
			to: '/production/mold/maintenance',
			content: <ProductionMoldMaintenanceListPage />,
		},
		{
			id: 'analysis',
			icon: <BarChart3 size={16} />,
			label: t('tabs.labels.moldAnalysis'),
			to: '/production/mold/analysis',
			content: <ProductionMoldAnalysisPage />,
		},
	];

	const RegisterButton = () => {
		const handleRegister = () => {
			if (currentTab === 'setup') {
				navigate('/production/mold/input');
			} else if (currentTab === 'maintenance') {
				// 금형 점검 등록 페이지로 이동 또는 모달 열기
				// navigate('/production/mold/maintenance/register');
			}
		};

		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
					onClick={handleRegister}
				>
					<Plus size={16} />
					{currentTab === 'setup'
						? t('tabs.actions.register')
						: currentTab === 'input'
							? '등록'
							: currentTab === 'maintenance'
								? t('tabs.actions.moldMaintenanceRegister')
								: t('tabs.actions.register')}
				</RadixIconButton>
			</div>
		);
	};

	const SetActionButton = (tab: string) => {
		switch (tab) {
			case 'analysis':
				return null; // 분석 탭에서는 등록 버튼 비활성화
			default:
				return <RegisterButton />;
		}
	};

	return (
		<>
			<TabLayout
				title={t('tabs.titles.moldManagement')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default MoldManagementTabNavigation;
