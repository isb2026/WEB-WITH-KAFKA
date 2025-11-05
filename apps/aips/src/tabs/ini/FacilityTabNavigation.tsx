import React, { useState, useEffect } from 'react';
import { RadixIconButton } from '@radix-ui/components';
import { Plus, TableProperties } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { DraggableDialog } from '@repo/radix-ui/components';
import { useTranslation } from '@repo/i18n';
import { TabItem } from '@aips/templates/TabTemplate';
import TabLayout from '@aips/layouts/TabLayout';
import IniFacilityListPage from '@aips/pages/ini/facility/IniFacilityListPage';
import IniFacilityRegisterPage from '@aips/pages/ini/facility/IniFacilityRegisterPage';

interface TabNavigationProps {
	activetab?: string;
}

const FacilityTabNavigation: React.FC<TabNavigationProps> = ({ activetab }) => {
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();
	const { t } = useTranslation('common');

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/ini/facility/list')) {
			setCurrentTab('list');
		}
	}, [location.pathname]);

	// Tab 아이템 정의
	const tabs: TabItem[] = [
		{
			id: 'list',
			icon: <TableProperties size={16} />,
			label: t('tabs.labels.list'),
			to: '/ini/facility/list',
			content: <IniFacilityListPage />,
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
			default:
				return <RegisteButton />;
		}
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={`${t('tabs.titles.facilityManagement')} ${t('tabs.actions.register')}`}
				content={
					<IniFacilityRegisterPage
						onClose={() => setOpenModal(false)}
					/>
				}
			/>
			<TabLayout
				title={t('tabs.titles.facilityManagement')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default FacilityTabNavigation;
