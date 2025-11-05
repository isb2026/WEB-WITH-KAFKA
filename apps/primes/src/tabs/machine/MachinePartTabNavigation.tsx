import React, { useState, useEffect } from 'react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@radix-ui/components';
import { Plus, TableProperties } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { DraggableDialog } from '@repo/radix-ui/components';
import { MachineMachinePartListPage } from '@primes/pages/machine/machine-part/MachineMachinePartListPage';
import { MachineMachinePartOrderListPage } from '@primes/pages/machine/machine-part-order/MachineMachinePartOrderListPage'
import { MachineMachinePartOrderInListPage } from '@primes/pages/machine/machine-part-order-in/MachineMachinePartOrderInListPage'
import { MachineMachinePartUseInfoListPage } from '@primes/pages/machine/machine-part-use-info/MachineMachinePartUseInfoListPage'
import { MachineMachinePartRegisterPage } from '@primes/pages/machine/machine-part/MachineMachinePartRegisterPage';
import { useTranslation } from '@repo/i18n';

interface TabNavigationProps {
	activetab?: string;
}

const MachinePartTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();
	const { t } = useTranslation('common');

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/machine/part/list')) {
			setCurrentTab('machinePart');
		} else if (pathname.includes('/machine/part/order/list')) {
			setCurrentTab('machinePartOrder');
		} else if (pathname.includes('/machine/part/order/in/list')) {
			setCurrentTab('machinePartOrderIn');
		} else if (pathname.includes('/machine/part/useinfo/list')) {
			setCurrentTab('machinePartUseInfo');
		}
	}, [location.pathname]);

	// Tab 아이템 정의
	const tabs: TabItem[] = [
		{
			id: 'machinePart',
			icon: <TableProperties size={16} />,
			label: t('tabs.titles.machinePart'),
			to: '/machine/part/list',
			content: <MachineMachinePartListPage />,
		},
		{
			id: 'machinePartOrder',
			icon: <TableProperties size={16} />,
			label: t('tabs.titles.machinePartOrder'),
			to: '/machine/part/order/list',
			content: <MachineMachinePartOrderListPage />,
		},
		{
			id: 'machinePartOrderIn',
			icon: <TableProperties size={16} />,
			label: t('tabs.titles.machinePartOrderIn'),
			to: '/machine/part/order/in/list',
			content: <MachineMachinePartOrderInListPage />,
		},
		{
			id: 'machinePartUseInfo',
			icon: <TableProperties size={16} />,
			label: t('tabs.titles.machinePartUseInfo'),
			to: '/machine/part/useinfo/list',
			content: <MachineMachinePartUseInfoListPage />,
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
					{t('tabs.actions.register') || '등록'}
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
				title={t('pages.machinePart.register') || '설비 부품 등록'}
				content={
					<MachineMachinePartRegisterPage
						onClose={() => setOpenModal(false)}
						mode="create"
					/>
				}
			/>
			<TabLayout
				title={
					t('tabs.titles.machinePartManagement') || '설비 부품 관리'
				}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default MachinePartTabNavigation;
