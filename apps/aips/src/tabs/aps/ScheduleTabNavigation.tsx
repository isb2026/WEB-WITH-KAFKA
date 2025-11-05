import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { TabItem } from '@aips/templates/TabTemplate';
import TabLayout from '@aips/layouts/TabLayout';
import ApsScheduleListPage from '@aips/pages/aps/schedule/ApsScheduleListPage';

interface TabNavigationProps {
	activetab?: string;
}

const ScheduleTabNavigation: React.FC<TabNavigationProps> = ({ activetab }) => {
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const location = useLocation();
	const { t } = useTranslation('common');
	const { t: tMenu } = useTranslation('menu');

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/aps/schedule/list')) {
			setCurrentTab('schedule');
		}
	}, [location.pathname]);

	// Tab 아이템 정의
	const tabs: TabItem[] = [
		{
			id: 'schedule',
			icon: <Calendar size={16} />,
			label: tMenu('menu.aps_schedule'),
			to: '/aps/schedule/list',
			content: <ApsScheduleListPage />,
		},
	];

	return (
		<>
			<TabLayout
				title={t('tabs.titles.scheduleManagement')}
				tabs={tabs}
				defaultValue={currentTab}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default ScheduleTabNavigation;
