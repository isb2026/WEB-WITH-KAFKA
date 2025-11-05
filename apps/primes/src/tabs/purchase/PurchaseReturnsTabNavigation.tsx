import React, { useState, useEffect } from 'react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@radix-ui/components';
import { Plus, Table } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DraggableDialog } from '@repo/radix-ui/components';
import { useTranslation } from '@repo/i18n';

import PurchaseReturnsListPage from '@primes/pages/purchase/purchase-returns/PurchaseReturnsListPage';
import PurchaseReturnsRegisterPage from '@primes/pages/purchase/purchase-returns/PurchaseReturnsRegisterPage';

interface TabNavigationProps {
	activetab?: string;
}

const PurchaseReturnsTabNavigation: React.FC<TabNavigationProps> = ({ activetab }) => {
	const { t } = useTranslation('common');
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const [openModal, setOpenModal] = useState<boolean>(false);

	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/purchase/returns/list')) {
			setCurrentTab('list');
		}
	}, [location.pathname]);

	// Tab 아이템 정의
	const tabs: TabItem[] = [
		{
			id: 'list',
			icon: <Table size={16} />,
			label: t('pages.purchase.returnsList'),
			to: '/purchase/returns/list',
			content: <PurchaseReturnsListPage />,
		},
	];

	const RegisteButton = () => {
		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
					onClick={() => setOpenModal(true)}
				>
					<Plus size={16} />
					{t('tabs.actions.register')}
				</RadixIconButton>
			</div>
		);
	};

	const SetActionButton = (tab: string) => {
		switch (tab) {
			case 'list':
				return <RegisteButton />;
			default:
				return <RegisteButton />;
		}
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={t('pages.purchase.returnRegister')}
				content={
					<PurchaseReturnsRegisterPage onClose={() => setOpenModal(false)} />
				}
			/>
			<TabLayout
				title={t('pages.purchase.returns')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default PurchaseReturnsTabNavigation;
