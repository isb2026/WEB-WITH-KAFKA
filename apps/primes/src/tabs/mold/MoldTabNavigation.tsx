import React, { useState, useEffect } from 'react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@radix-ui/components';
import { Plus, Table, TableProperties } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { DraggableDialog } from '@repo/radix-ui/components';
import { useTranslation } from '@repo/i18n';

import MoldListPage from '@primes/pages/mold/mold/MoldListPage';
import MoldRegisterPage from '@primes/pages/mold/mold/MoldRegisterPage';
import MoldInstanceListPage from '@primes/pages/mold/mold-instance/MoldInstanceListPage';

interface TabNavigationProps {
	activetab?: string;
}

const MoldTabNavigation: React.FC<TabNavigationProps> = ({ activetab }) => {
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();
	const { t } = useTranslation('common');
	const { t: tCommon } = useTranslation('common');

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/mold/mold/master-list')) {
			setCurrentTab('list');
		} else if (pathname.includes('/mold/mold/instance-list')) {
			setCurrentTab('instance-list');
		}
	}, [location.pathname]);

	// Tab 아이템 정의
	const tabs: TabItem[] = [
		{
			id: 'list',
			icon: <TableProperties size={16} />,
			label: '금형마스터 관리',
			to: '/mold/mold/master-list',
			content: <MoldListPage />,
		},
		{
			id: 'instance-list',
			icon: <Table size={16} />,
			label: '실금형 현황',
			to: '/mold/mold/instance-list',
			content: <MoldInstanceListPage />,
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
			case 'instance-list':
				return null; // 실금형 현황에서는 등록 버튼 숨김
			default:
				return <RegisteButton />;
		}
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={tCommon('pages.mold.register')}
				// title={t('pages.mold.register')}
				content={
					<MoldRegisterPage onClose={() => setOpenModal(false)} />
				}
			/>
			<TabLayout
				title={tCommon('pages.mold.management')}
				// title={t('pages.mold.management')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default MoldTabNavigation;
