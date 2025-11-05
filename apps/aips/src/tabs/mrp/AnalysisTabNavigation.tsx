import React, { useState, useEffect } from 'react';
import { BarChart3, TableProperties } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { TabItem } from '@aips/templates/TabTemplate';
import TabLayout from '@aips/layouts/TabLayout';
import MrpAnalysisListPage from '@aips/pages/mrp/analysis/MrpAnalysisListPage';

interface TabNavigationProps {
	activetab?: string;
}

const AnalysisTabNavigation: React.FC<TabNavigationProps> = ({ activetab }) => {
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const location = useLocation();
	const { t } = useTranslation('common');
	const { t: tMenu } = useTranslation('menu');

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/mrp/analysis/list')) {
			setCurrentTab('analysis');
		}
	}, [location.pathname]);

	// Tab 아이템 정의
	const tabs: TabItem[] = [
		{
			id: 'analysis',
			icon: <BarChart3 size={16} />,
			label: tMenu('menu.mrp_analysis'),
			to: '/mrp/analysis/list',
			content: <MrpAnalysisListPage />,
		},
	];

	return (
		<>
			<TabLayout
				title={t('tabs.titles.analysisManagement')}
				tabs={tabs}
				defaultValue={currentTab}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default AnalysisTabNavigation;
