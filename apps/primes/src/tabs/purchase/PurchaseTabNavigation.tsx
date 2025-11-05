import React, { useState, useEffect } from 'react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@radix-ui/components';
import { Plus, Table, FileText } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PurchaseOrdersMasterDetailPage } from '@primes/pages/purchase/purchase-orders/PurchaseOrdersMasterDetailPage';
import { PurchaseOrdersListPage } from '@primes/pages/purchase/purchase-orders/PurchaseOrdersListPage';
import { useTranslation } from '@repo/i18n';

interface TabNavigationProps {
	activetab?: string;
}

const PurchaseTabNavigation: React.FC<TabNavigationProps> = ({ activetab }) => {
	const { t } = useTranslation('common');
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'related-list'
	);

	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/purchase/request/related-list')) {
			setCurrentTab('related-list');
		} else if (pathname.includes('/purchase/request/list')) {
			setCurrentTab('list');
		}
	}, [location.pathname]);

	// Tab 아이템 정의
	const tabs: TabItem[] = [
		{
			id: 'related-list',
			icon: <Table size={16} />,
			label: t('pages.purchaseOrder.relatedList'),
			to: '/purchase/request/related-list',
			content: <PurchaseOrdersMasterDetailPage />,
		},
		{
			id: 'list',
			icon: <FileText size={16} />,
			label: t('pages.purchaseOrder.list'),
			to: '/purchase/request/list',
			content: <PurchaseOrdersListPage />,
		},
	];

	const RegisterButton = () => {
		const navigate = useNavigate();

		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
					onClick={() => navigate('/purchase/request/register')}
				>
					<Plus size={16} />
					{t('pages.purchaseOrder.register')}
				</RadixIconButton>
			</div>
		);
	};

	const SetActionButton = (tab: string) => {
		switch (tab) {
			default:
				return <RegisterButton />;
		}
	};

	return (
		<>
			<TabLayout
				title={t('pages.purchase.list')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default PurchaseTabNavigation;
