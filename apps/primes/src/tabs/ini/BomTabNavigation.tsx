import React, { useState, useEffect } from 'react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@radix-ui/components';
import { Plus, List, GitBranch } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { DraggableDialog } from '@repo/radix-ui/components';
import { IniItemBomListPage } from '@primes/pages/ini/item-bom/IniItemBomListPage';
import { IniItemBomStatusPage } from '@primes/pages/ini/item-bom/IniItemBomStatusPage';
import { IniItemBomRegisterPage } from '@primes/pages/ini/item-bom/IniItemBomRegisterPage';
import { useTranslation } from '@repo/i18n';

interface TabNavigationProps {
	activetab?: string;
}

const BomTabNavigation: React.FC<TabNavigationProps> = ({ activetab }) => {
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'status');
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();
	const { t } = useTranslation('common');

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/ini/items/bom/status')) {
			setCurrentTab('status');
		} else if (pathname.includes('/ini/items/bom/tree-view')) {
			setCurrentTab('tree-view');
		}
	}, [location.pathname]);

	// Tab 아이템 정의
	const tabs: TabItem[] = [
		{
			id: 'status',
			icon: <List size={16} />,
			label: '현황',
			to: '/ini/items/bom/status',
			content: <IniItemBomStatusPage />,
		},
		// 트리보기 탭 임시 숨김
		// {
		// 	id: 'tree-view',
		// 	icon: <GitBranch size={16} />,
		// 	label: '트리보기',
		// 	to: '/ini/items/bom/tree-view',
		// 	content: <IniItemBomListPage />,
		// },
	];

	const RegisterButton = () => {
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
			default:
				return null;
			// return <RegisterButton />;
		}
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={`${t('tabs.titles.itemBomManagement')} ${t('tabs.actions.register')}`}
				content={
					<IniItemBomRegisterPage
						onClose={() => setOpenModal(false)}
					/>
				}
			/>
			<TabLayout
				title={t('tabs.titles.itemBomManagement')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default BomTabNavigation;
