import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { Calendar, Plus, TrendingUp, CalendarDays } from 'lucide-react';
import { RadixIconButton, DraggableDialog } from '@repo/radix-ui/components';

// Page imports
import { ProductionPlanListPage } from '@primes/pages/production/plan/ProductionPlanListPage';
import { ProductionPlanRegisterPage } from '@primes/pages/production/plan/ProductionPlanRegisterPage';
import { ProductionPlanVsActualPage } from '@primes/pages/production/plan/ProductionPlanVsActualPage';
import { ProductionWorkCalendarPage } from '@primes/pages/production/plan/ProductionWorkCalendarPage';

interface ProductionPlanTabNavigationProps {
	activetab?: string;
}

const ProductionPlanTabNavigation: React.FC<
	ProductionPlanTabNavigationProps
> = ({ activetab }) => {
	const { t } = useTranslation('common');
	const { t: tMenu } = useTranslation('menu');
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'monthly'
	);
	const [openModal, setOpenModal] = useState(false);
	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/production/plan/monthly')) {
			setCurrentTab('monthly');
		} else if (pathname.includes('/production/plan/vs-actual')) {
			setCurrentTab('vs-actual');
		} else if (pathname.includes('/production/plan/calendar')) {
			setCurrentTab('calendar');
		} else if (pathname.includes('/production/plan/list')) {
			setCurrentTab('monthly'); // 기존 list -> monthly로 매핑
		} else if (pathname.includes('/production/plan/status')) {
			setCurrentTab('vs-actual'); // 기존 status -> vs-actual로 매핑
		}
	}, [location.pathname]);

	const tabs: TabItem[] = [
		{
			id: 'monthly',
			icon: <Calendar size={16} />,
			label: t('tabs.labels.monthlyPlan'),
			to: '/production/plan/monthly',
			content: <ProductionPlanListPage />,
		},
		{
			id: 'vs-actual',
			icon: <TrendingUp size={16} />,
			label: t('tabs.labels.planVsActual'),
			to: '/production/plan/vs-actual',
			content: <ProductionPlanVsActualPage />,
		},
		{
			id: 'calendar',
			icon: <CalendarDays size={16} />,
			label: t('tabs.labels.workCalendar'),
			to: '/production/plan/calendar',
			content: <ProductionWorkCalendarPage />,
		},
	];

	const RegisterButton = () => (
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

	const SetActionButton = (tab: string) => {
		switch (tab) {
			case 'vs-actual':
			case 'calendar':
				return null; // 분석/캘린더 페이지는 등록 버튼 없음
			case 'monthly':
				return <RegisterButton />;
			default:
				return <RegisterButton />;
		}
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={`${t('tabs.titles.productionPlan')} ${t('tabs.dialogs.register')}`}
				content={
					<ProductionPlanRegisterPage
						mode="create"
						onClose={() => setOpenModal(false)}
					/>
				}
			/>
			<TabLayout
				title={tMenu('menu.production_plan_management')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default ProductionPlanTabNavigation;
