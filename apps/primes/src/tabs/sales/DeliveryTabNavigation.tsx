import React, { useState, useEffect } from 'react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@radix-ui/components';
import { Plus, Table, FileText } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SalesDeliveryListPage } from '@primes/pages/sales/delivery/SalesDeliveryListPage';
import SalesDeliveryMasterDetailPage from '@primes/pages/sales/delivery/SalesDeliveryMasterDetailPage';
import { useTranslation } from '@repo/i18n';

interface TabNavigationProps {
	activetab?: string;
}

const DeliveryTabNavigation: React.FC<TabNavigationProps> = ({ activetab }) => {
	const { t } = useTranslation('common');
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'related-list'
	);

	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/sales/delivery/related-list')) {
			setCurrentTab('related-list');
		} else if (pathname.includes('/sales/delivery/list')) {
			setCurrentTab('list');
		}
	}, [location.pathname]);

	// Tab 아이템 정의
	const tabs: TabItem[] = [
		{
			id: 'related-list',
			icon: <Table size={16} />,
			label: t('tabs.labels.detailList'),
			to: '/sales/delivery/related-list',
			content: <SalesDeliveryMasterDetailPage />,
		},
		{
			id: 'list',
			icon: <FileText size={16} />,
			label: t('tabs.labels.totalStatus'),
			to: '/sales/delivery/list',
			content: <SalesDeliveryListPage />,
		},
	];

	const RegisteButton = () => {
		const navigate = useNavigate();

		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
					onClick={() => navigate('/sales/delivery/register')}
				>
					<Plus size={16} />
					{t('tabs.actions.register')}
				</RadixIconButton>
			</div>
		);
	};

	const SetActionButton = (tab: string) => {
		switch (tab) {
			default:
				return <RegisteButton />;
		}
	};

	return (
		<>
			<TabLayout
				title={t('tabs.titles.delivery')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default DeliveryTabNavigation;
