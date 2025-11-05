import React, { useState, useEffect } from 'react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@radix-ui/components';
import { Plus, Table, TableProperties } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { DraggableDialog } from '@repo/radix-ui/components';
import { useTranslation } from '@repo/i18n';
import { MoldLocationListPage } from '@primes/pages/mold/mold-location/MoldLocationListPage';
import { MoldLocationRegisterPage } from '@primes/pages/mold/mold-location/MoldLocationRegisterPage';

interface TabNavigationProps {
	activetab?: string;
}

const MoldLocationTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const { t: tCommon } = useTranslation('common');
	const { t } = useTranslation('dataTable');
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/mold/mold-location/list')) {
			setCurrentTab('list');
		}
	}, [location.pathname]);

	// Tab 아이템 정의
	const tabs: TabItem[] = [
		{
			id: 'list',
			icon: <TableProperties size={16} />,
			label: t('tabs.status'),
			to: '/mold/mold-location/list',
			content: <MoldLocationListPage />,
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
				title={tCommon('pages.mold.location.register')}
				content={
					<MoldLocationRegisterPage
						onClose={() => setOpenModal(false)}
					/>
				}
			/>
			<TabLayout
				title={tCommon('pages.mold.location.management')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default MoldLocationTabNavigation;
