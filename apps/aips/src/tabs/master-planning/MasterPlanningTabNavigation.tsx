import React, { useState, useEffect } from 'react';
import { RadixIconButton } from '@radix-ui/components';
import {
	Calendar,
	CalendarDays,
	BarChart3,
	Calculator,
	Package,
	ShoppingBag,
	Activity,
	Plus,
	TrendingUp,
	Target,
	AlertCircle,
	CheckCircle,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { TabItem } from '@aips/templates/TabTemplate';
import TabLayout from '@aips/layouts/TabLayout';
import { MonthlyProductionPlanPage } from '@aips/pages/master-planning/monthly-production-plan';
import { WeeklyProductionPlanPage } from '@aips/pages/master-planning/weekly-production-plan';
import { ProductionLevelingPage } from '@aips/pages/master-planning/production-leveling';
import { MrpPage } from '@aips/pages/master-planning/mrp';
import { InventoryAvailabilityPage } from '@aips/pages/master-planning/inventory-availability';
import { PurchaseRequestsPage } from '@aips/pages/master-planning/purchase-requests';
import { CapacityAnalysisPage } from '@aips/pages/master-planning/capacity-analysis';
import { DraggableDialog } from '@repo/radix-ui/components';

interface TabNavigationProps {
	activetab?: string;
}

const MasterPlanningTabNavigation: React.FC<TabNavigationProps> = ({ activetab }) => {
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'monthly-production-plan'
	);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();
	const { t } = useTranslation('common');

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/aips/master-planning/monthly-production-plan')) {
			setCurrentTab('monthly-production-plan');
		} else if (pathname.includes('/aips/master-planning/weekly-production-plan')) {
			setCurrentTab('weekly-production-plan');
		} else if (pathname.includes('/aips/master-planning/production-leveling')) {
			setCurrentTab('production-leveling');
		} else if (pathname.includes('/aips/master-planning/mrp')) {
			setCurrentTab('mrp');
		} else if (pathname.includes('/aips/master-planning/inventory-availability')) {
			setCurrentTab('inventory-availability');
		} else if (pathname.includes('/aips/master-planning/purchase-requests')) {
			setCurrentTab('purchase-requests');
		} else if (pathname.includes('/aips/master-planning/capacity-analysis')) {
			setCurrentTab('capacity-analysis');
		}
	}, [location.pathname]);

	// Tab items definition
	const tabs: TabItem[] = [
		{
			id: 'monthly-production-plan',
			icon: <Calendar size={16} />,
			label: '월간 생산 계획',
			to: '/aips/master-planning/monthly-production-plan',
			content: <MonthlyProductionPlanPage />,
		},
		{
			id: 'weekly-production-plan',
			icon: <CalendarDays size={16} />,
			label: '주간 생산 계획',
			to: '/aips/master-planning/weekly-production-plan',
			content: <WeeklyProductionPlanPage />,
		},
		{
			id: 'production-leveling',
			icon: <BarChart3 size={16} />,
			label: '생산 평준화',
			to: '/aips/master-planning/production-leveling',
			content: <ProductionLevelingPage />,
		},
		{
			id: 'mrp',
			icon: <Calculator size={16} />,
			label: 'MRP',
			to: '/aips/master-planning/mrp',
			content: <MrpPage />,
		},
		{
			id: 'inventory-availability',
			icon: <Package size={16} />,
			label: '재고 가용성',
			to: '/aips/master-planning/inventory-availability',
			content: <InventoryAvailabilityPage />,
		},
		{
			id: 'purchase-requests',
			icon: <ShoppingBag size={16} />,
			label: '구매 요청',
			to: '/aips/master-planning/purchase-requests',
			content: <PurchaseRequestsPage />,
		},
		{
			id: 'capacity-analysis',
			icon: <Activity size={16} />,
			label: '능력 분석',
			to: '/aips/master-planning/capacity-analysis',
			content: <CapacityAnalysisPage />,
		},
	];

	// Register button as button slot
	const RegisterButton = () => {
		let extraButtons = null;

		switch (currentTab) {
			case 'monthly-production-plan':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<BarChart3 size={16} />
							차트 보기
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<TrendingUp size={16} />
							계획 분석
						</RadixIconButton>
					</>
				);
				break;

			case 'weekly-production-plan':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<BarChart3 size={16} />
							차트 보기
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Target size={16} />
							계획 검증
						</RadixIconButton>
					</>
				);
				break;

			case 'production-leveling':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<BarChart3 size={16} />
							평준화 분석
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<TrendingUp size={16} />
							최적화 제안
						</RadixIconButton>
					</>
				);
				break;

			case 'mrp':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Calculator size={16} />
							MRP 실행
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<AlertCircle size={16} />
							부족량 분석
						</RadixIconButton>
					</>
				);
				break;

			case 'inventory-availability':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Package size={16} />
							재고 현황
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<AlertCircle size={16} />
							부족 경고
						</RadixIconButton>
					</>
				);
				break;

			case 'purchase-requests':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<ShoppingBag size={16} />
							PR 생성
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<CheckCircle size={16} />
							승인 현황
						</RadixIconButton>
					</>
				);
				break;

			case 'capacity-analysis':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Activity size={16} />
							능력 분석
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<AlertCircle size={16} />
							병목 식별
						</RadixIconButton>
					</>
				);
				break;

			default:
				extraButtons = null;
		}

		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				{extraButtons}

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

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={`마스터 플래닝 ${t('tabs.actions.register')}`}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							새로운 마스터 플래닝 항목을 등록합니다.
						</p>
						<div className="mt-4 flex justify-end gap-2">
							<RadixIconButton
								onClick={() => setOpenModal(false)}
								className="px-4 py-2 border rounded-lg"
							>
								닫기
							</RadixIconButton>
						</div>
					</div>
				}
			/>
			<TabLayout
				title="마스터 플래닝"
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={<RegisterButton />}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default MasterPlanningTabNavigation;
