import React, { useState, useEffect } from 'react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@radix-ui/components';
import { Plus, TableProperties, BarChart3, Users } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { DraggableDialog } from '@repo/radix-ui/components';
import { ProductionCommandListPage } from '@primes/pages/production/command/ProductionCommandListPage';
import { ProductionCommandRegisterPage } from '@primes/pages/production/command/ProductionCommandRegisterPage';

import { ProductionCommandAnalysisPage } from '@primes/pages/production/command/ProductionCommandAnalysisPage';
import { ProductionWorkingUserListPage } from '@primes/pages/production/working-user/ProductionWorkingUserListPage';
import { ProductionWorkingUserRegisterPage } from '@primes/pages/production/working-user/ProductionWorkingUserRegisterPage';
import { useTranslation } from '@repo/i18n';

interface TabNavigationProps {
	activetab?: string;
}

const CommandTabNavigation: React.FC<TabNavigationProps> = ({ activetab }) => {
	const { t } = useTranslation('common');
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/production/command/list')) {
			setCurrentTab('list');
		} else if (pathname.includes('/production/command/analysis')) {
			setCurrentTab('analysis');
			// } else if (
			// 	pathname.includes('/production/command/worker-management') ||
			// 	pathname.includes('/production/working-user/list')
			// ) {
			// 	setCurrentTab('worker-management');
		}
	}, [location.pathname]);

	// Tab 아이템 정의
	const tabs: TabItem[] = [
		{
			id: 'list',
			icon: <TableProperties size={16} />,
			label: t('tabs.titles.commandStatus'),
			to: '/production/command/list',
			content: <ProductionCommandListPage />,
		},
		{
			id: 'analysis',
			icon: <BarChart3 size={16} />,
			label: t('tabs.titles.commandAnalysis'),
			to: '/production/command/analysis',
			content: <ProductionCommandAnalysisPage />,
		},
		// {
		// 	id: 'worker-management',
		// 	icon: <Users size={16} />,
		// 	label: t('tabs.titles.workerManagement'),
		// 	to: '/production/command/worker-management',
		// 	content: <ProductionWorkingUserListPage />,
		// },
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
				return <RegisteButton />; // 작업지시현황에서 작지등록
			case 'analysis':
				return null; // 작지분석 탭에서는 등록 버튼 비활성화
			// case 'worker-management':
			// 	return (
			// 		<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
			// 			<RadixIconButton
			// 				className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
			// 				onClick={() => setOpenModal(true)}
			// 			>
			// 				<Plus size={16} />
			// 				작업자 등록
			// 			</RadixIconButton>
			// 		</div>
			// 	);
			default:
				return <RegisteButton />;
		}
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={
					// currentTab === 'worker-management'
					// 	? '작업자 등록'
					// 	:
					`${t('tabs.titles.workOrder')} ` +
					t('tabs.dialogs.register')
				}
				content={
					// currentTab === 'worker-management' ? (
					// 	<ProductionWorkingUserRegisterPage
					// 		onClose={() => setOpenModal(false)}
					// 	/>
					// ) : (
					<ProductionCommandRegisterPage
						mode="create"
						onClose={() => setOpenModal(false)}
					/>
					// )
				}
			/>
			<TabLayout
				title={t('tabs.titles.commandManagement')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default CommandTabNavigation;
