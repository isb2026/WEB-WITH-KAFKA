import React, { useState, useEffect } from 'react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@radix-ui/components';
import { Plus, Table, FileText, List } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DraggableDialog } from '@repo/radix-ui/components';
import { useTranslation } from '@repo/i18n';
// import { MoldBomListPage } from '@primes/pages/mold/mold-bom/MoldBomListPage'; // Removed - file deleted
import MoldBomRegisterPage from '@primes/pages/mold/mold-bom/MoldBomRegisterPage';
import { MoldBomRelatedListPage } from '@primes/pages/mold/mold-bom/MoldBomRelatedListPage';

interface TabNavigationProps {
	activetab?: string;
}

const MoldBomTabNavigation: React.FC<TabNavigationProps> = ({ activetab }) => {
	const { t: tCommon } = useTranslation('common');
	const { t } = useTranslation('dataTable');
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'related-list'
	);
	const [openModal, setOpenModal] = useState<boolean>(false);

	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/mold/bom/related-list')) {
			setCurrentTab('related-list');
		}
	}, [location.pathname]);

	// Tab 아이템 정의
	const tabs: TabItem[] = [
		{
			id: 'related-list',
			icon: <List size={16} />,
			label: tCommon('tabs.labels.moldBomRelatedList'),
			to: '/mold/bom/related-list',
			content: <MoldBomRelatedListPage />,
		},
	];

	const RegisteButton = () => {
		const navigate = useNavigate();
		
		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
					onClick={() => navigate('/mold/bom/register')}
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
				title={`${tCommon('pages.mold.bom.title', '금형 BOM 관리')} ${t('tabs.register')}`}
				content={
					<MoldBomRegisterPage onClose={() => setOpenModal(false)} />
				}
			/>
			<TabLayout
				title={tCommon('pages.mold.bom.title', '금형 BOM 관리')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default MoldBomTabNavigation;
