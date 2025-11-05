import React, { useState, useEffect } from 'react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@radix-ui/components';
import { Plus, Table, TableProperties, Trash, Star, Clock, Wrench, Activity } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { DraggableDialog } from '@repo/radix-ui/components';
import { useTranslation } from '@repo/i18n';

import MoldInstanceListPage from '@primes/pages/mold/mold-instance/MoldInstanceListPage';
import MoldInstanceRegisterPage from '@primes/pages/mold/mold-instance/MoldInstanceRegisterPage';
import MoldDisposeListPage from '@primes/pages/mold/mold-dispose/MoldDisposeListPage';
import MoldDisposeRegisterPage from '@primes/pages/mold/mold-dispose/MoldDisposeRegisterPage';
import MoldGradeListPage from '@primes/pages/mold/mold-grade/MoldGradeListPage';
import MoldGradeRegisterPage from '@primes/pages/mold/mold-grade/MoldGradeRegisterPage';
import MoldLifeChangeHistoryListPage from '@primes/pages/mold/mold-life-change-history/MoldLifeChangeHistoryListPage';
import MoldLifeChangeHistoryRegisterPage from '@primes/pages/mold/mold-life-change-history/MoldLifeChangeHistoryRegisterPage';
import MoldRepairListPage from '@primes/pages/mold/mold-repair/MoldRepairListPage';
import MoldRepairRegisterPage from '@primes/pages/mold/mold-repair/MoldRepairRegisterPage';
import MoldUsingInformationListPage from '@primes/pages/mold/mold-using-information/MoldUsingInformationListPage';
import MoldUsingInformationRegisterPage from '@primes/pages/mold/mold-using-information/MoldUsingInformationRegisterPage';

interface TabNavigationProps {
	activetab?: string;
}

const MoldInstanceTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const { t: tCommon } = useTranslation('common');
	const { t } = useTranslation('dataTable');
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/mold/instance/instance-list')) {
			setCurrentTab('instance-list');
		} else if (pathname.includes('/mold/instance/dispose-list')) {
			setCurrentTab('dispose-list');
		} else if (pathname.includes('/mold/instance/grade-list')) {
			setCurrentTab('grade-list');
		} else if (pathname.includes('/mold/instance/life-list')) {
			setCurrentTab('life-list');
		} else if (pathname.includes('/mold/instance/repair-list')) {
			setCurrentTab('repair-list');
		} else if (pathname.includes('/mold/instance/using-list')) {
			setCurrentTab('using-list');
		}
	}, [location.pathname]);

	// Tab 아이템 정의
	const tabs: TabItem[] = [
		{
			id: 'instance-list',
			icon: <TableProperties size={16} />,
			label: tCommon('pages.mold.instance.list', '실금형 현황'),
			to: '/mold/instance/instance-list',
			content: <MoldInstanceListPage />,
		},
		{
			id: 'using-list',
			icon: <Activity size={16} />,
			label: tCommon('pages.mold.using.list', '타발수 현황'),
			to: '/mold/instance/using-list',
			content: <MoldUsingInformationListPage />,
		},
		{
			id: 'dispose-list',
			icon: <Trash size={16} />,
			label: tCommon('pages.mold.dispose.list', '폐기'),
			to: '/mold/instance/dispose-list',
			content: <MoldDisposeListPage />,
		},
		{
			id: 'life-list',
			icon: <Clock size={16} />,
			label: tCommon('pages.mold.life.list', '수명'),
			to: '/mold/instance/life-list',
			content: <MoldLifeChangeHistoryListPage />,
		},
		{
			id: 'repair-list',
			icon: <Wrench size={16} />,
			label: tCommon('pages.mold.repair.list', '수리'),
			to: '/mold/instance/repair-list',
			content: <MoldRepairListPage />,
		},
		{
			id: 'grade-list',
			icon: <Star size={16} />,
			label: tCommon('pages.mold.grade.list', '등급'),
			to: '/mold/instance/grade-list',
			content: <MoldGradeListPage />,
		},
	];

	const RegisteButton = (tabId: string, label: string) => {
		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
					onClick={() => setOpenModal(true)}
				>
					<Plus size={16} />
					{label}
				</RadixIconButton>
			</div>
		);
	};

	const SetActionButton = (tab: string) => {
		switch (tab) {
			case 'instance-list':
				return null; // 실금형 현황에서는 등록 버튼 숨김
			case 'using-list':
				return null; // 금형타발수현황에서는 등록 버튼 숨김
			default:
				return RegisteButton(tab, '등록');
		}
	};

	// 각 탭에 맞는 등록 페이지 컴포넌트 반환
	const getRegisterPageComponent = () => {
		switch (currentTab) {
			case 'instance-list':
				return (
					<MoldInstanceRegisterPage
						onClose={() => setOpenModal(false)}
					/>
				);
			case 'dispose-list':
				return (
					<MoldDisposeRegisterPage
						onClose={() => setOpenModal(false)}
					/>
				);
			case 'grade-list':
				return (
					<MoldGradeRegisterPage
						onClose={() => setOpenModal(false)}
					/>
				);
			case 'life-list':
				return (
					<MoldLifeChangeHistoryRegisterPage
						onClose={() => setOpenModal(false)}
					/>
				);
			case 'repair-list':
				return (
					<MoldRepairRegisterPage
						onClose={() => setOpenModal(false)}
					/>
				);
			case 'using-list':
				return (
					<MoldUsingInformationRegisterPage
						onClose={() => setOpenModal(false)}
					/>
				);
			default:
				return (
					<MoldInstanceRegisterPage
						onClose={() => setOpenModal(false)}
					/>
				);
		}
	};

	// 각 탭에 맞는 모달 제목 반환
	const getModalTitle = () => {
		switch (currentTab) {
			case 'instance-list':
				return tCommon('pages.mold.instance.register', '실금형 등록');
			case 'dispose-list':
				return tCommon('pages.mold.dispose.register', '폐기 등록');
			case 'grade-list':
				return tCommon('pages.mold.grade.register', '금형등급 등록');
			case 'life-list':
				return tCommon('pages.mold.life.register', '수명관리 등록');
			case 'repair-list':
				return tCommon('pages.mold.repair.register', '수리 등록');
			case 'using-list':
				return tCommon('pages.mold.using.register', '타발수 등록');
			default:
				return tCommon('pages.mold.instance.register', '등록');
		}
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={getModalTitle()}
				content={getRegisterPageComponent()}
			/>
			<TabLayout
				title={tCommon('pages.mold.instance.management')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default MoldInstanceTabNavigation;
