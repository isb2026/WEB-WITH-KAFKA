import React, { useState, useEffect } from 'react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@radix-ui/components';
import { Plus, TableProperties } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { DraggableDialog } from '@repo/radix-ui/components';
import { IniUserListPage } from '@primes/pages/ini/users/IniUserListPage';
import { IniUserRegisterPage } from '@primes/pages/ini/users/IniUserRegisterPage';
import { IniUserListByGroupPage } from '@primes/pages/ini/users/iniUserListByGroupPage';
import { useTranslation } from '@repo/i18n';

interface TabNavigationProps {
	activetab?: string;
}

const UsersTabNavigation: React.FC<TabNavigationProps> = ({ activetab }) => {
	const { t } = useTranslation('menu');
	const { t: tCommon } = useTranslation('common');
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();

	useEffect(() => {
		const path = location.pathname;

		if (path.includes('/ini/user/list')) {
			setCurrentTab('list');
		}
		if (path.includes('/ini/user/group-list')) {
			setCurrentTab('group-list');
		}
	}, [location]);

	// Tab 아이템을 정의하고, 각각의 콘텐츠를 라우팅 경로로 연결
	const tabs: TabItem[] = [
		{
			id: 'list',
			icon: <TableProperties size={16} />,
			label: t('menu.ini_user_list'),
			to: '/ini/user/list',
			content: <IniUserListPage />,
		},
		{
			id: 'group-list',
			icon: <TableProperties size={16} />,
			label: t('menu.ini_user_group_list'),
			to: '/ini/user/group-list',
			content: <IniUserListByGroupPage />,
		},
	];

	const RegisteButton = () => {
		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center"
					onClick={() => {
						setOpenModal(true);
					}}
				>
					<Plus size={16} />
					{tCommon('tabs.actions.register')}
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
				onOpenChange={(open: boolean) => {
					setOpenModal(open);
				}}
				title={tCommon('tabs.dialogs.userRegister')}
				content={
					<IniUserRegisterPage
						onClose={() => {
							setOpenModal(false);
						}}
					/>
				}
			/>
			<TabLayout
				title={tCommon('tabs.titles.userManagement')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={(tab) => {
					setCurrentTab(tab);
				}}
			/>
		</>
	);
};

export default UsersTabNavigation;
