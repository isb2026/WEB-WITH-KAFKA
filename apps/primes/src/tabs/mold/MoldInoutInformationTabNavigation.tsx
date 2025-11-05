import React, { useState, useEffect } from 'react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@radix-ui/components';
import { Plus, Table, TableProperties } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DraggableDialog } from '@repo/radix-ui/components';
import { useTranslation } from '@repo/i18n';

import MoldInoutInformationListPage from '@primes/pages/mold/mold-inout-information/MoldInoutInformationListPage';
import MoldInoutInformationRegisterPage from '@primes/pages/mold/mold-inout-information/MoldInoutInformationRegisterPage';

interface TabNavigationProps {
	activetab?: string;
}

const MoldInoutInformationTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const { t: tCommon } = useTranslation('common');
	const { t } = useTranslation('dataTable');
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/mold/inout/list')) {
			setCurrentTab('list');
		}
	}, [location.pathname]);

	// Tab 아이템 정의
	const tabs: TabItem[] = [
		{
			id: 'list',
			icon: <TableProperties size={16} />,
			label: t('tabs.mold_inout_list'),
			to: '/mold/inout/list',
			content: <MoldInoutInformationListPage />,
		},
	];

	const RegisteButton = () => {
		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
					onClick={() => navigate('/mold/inout/input/register')}
				>
					<Plus size={16} />
					{t('tabs.register')}
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
				title={tCommon('pages.mold.inout.register')}
				content={
					<MoldInoutInformationRegisterPage
						onClose={() => setOpenModal(false)}
						onSuccess={() => setOpenModal(false)}
					/>
				}
			/>
			<TabLayout
				title={tCommon('pages.mold.inout.management')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default MoldInoutInformationTabNavigation;
