import React, { useState, useEffect } from 'react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@radix-ui/components';
import { Plus, TableProperties } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { DraggableDialog } from '@repo/radix-ui/components';
import { IniCodeListPage } from '@primes/pages/ini/code/IniCodeListPage';
import IniCodeRegisterPage from '@primes/pages/ini/code/IniCodeRegisterPage';
import { useTranslation } from '@repo/i18n';

interface TabNavigationProps {
	activetab?: string;
}

const CodesTabNavigation: React.FC<TabNavigationProps> = ({ activetab }) => {
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const location = useLocation();
	const { t } = useTranslation('common');

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/ini/codes/list')) {
			setCurrentTab('list');
		}
	}, [location.pathname]);

	// Tab 아이템 정의
	const tabs: TabItem[] = [
		{
			id: 'list',
			icon: <TableProperties size={16} />,
			label: '현황',
			to: '/ini/codes/list',
			content: <IniCodeListPage />,
		},
	];

	return (
		<>
			<TabLayout
				title={t('tabs.titles.code')}
				tabs={tabs}
				defaultValue={currentTab}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default CodesTabNavigation;
