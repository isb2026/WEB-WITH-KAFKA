import React, { useState, useEffect } from 'react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@radix-ui/components';
import { Plus, Table, TableProperties } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { DraggableDialog } from '@repo/radix-ui/components';
import { useTranslation } from '@repo/i18n';

import MoldUsingInformationListPage from '@primes/pages/mold/mold-using-information/MoldUsingInformationListPage';
import MoldUsingInformationRegisterPage from '@primes/pages/mold/mold-using-information/MoldUsingInformationRegisterPage';

interface TabNavigationProps {
	activetab?: string;
}

const MoldUsingInformationTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const { t: tCommon } = useTranslation('common');
	const { t } = useTranslation('dataTable');
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/mold/using/list')) {
			setCurrentTab('list');
		}
	}, [location.pathname]);

	// Tab 아이템 정의
	const tabs: TabItem[] = [
		{
			id: 'list',
			icon: <TableProperties size={16} />,
			label: t('tabs.status'),
			to: '/mold/using/list',
			content: <MoldUsingInformationListPage />,
		},
	];

	// 주석 처리: READ ONLY 모드 - 등록 버튼 비활성화
	// const RegisteButton = () => {
	// 	return (
	// 		<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
	// 			<RadixIconButton
	// 				className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
	// 				onClick={() => setOpenModal(true)}
	// 			>
	// 				<Plus size={16} />
	// 				{t('tabs.register')}
	// 			</RadixIconButton>
	// 		</div>
	// 	);
	// };

	const SetActionButton = (tab: string) => {
		switch (tab) {
			default:
				return null; // 주석 처리: READ ONLY 모드 - 등록 버튼 비활성화
		}
	};

	return (
		<>
			{/* 주석 처리: READ ONLY 모드 - 등록 모달 비활성화 */}
			{/* <DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={tCommon('pages.mold.using.register')}
				content={
					<MoldUsingInformationRegisterPage
						onClose={() => setOpenModal(false)}
					/>
				}
			/> */}
			<TabLayout
				title={tCommon('pages.mold.using.management')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default MoldUsingInformationTabNavigation;
