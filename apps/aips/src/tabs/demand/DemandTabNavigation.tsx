import React, { useState, useEffect } from 'react';
import { RadixIconButton } from '@radix-ui/components';
import {
	ShoppingCart,
	TrendingUp,
	History,
	Calendar,
	CalendarDays,
	CheckCircle,
	Plus,
	BarChart3,
	AlertCircle,
	Calculator,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { TabItem } from '@aips/templates/TabTemplate';
import TabLayout from '@aips/layouts/TabLayout';
import { SalesOrderManagementPage } from '@aips/pages/demand/sales-order-management';
import { ForecastDemandManagementPage } from '@aips/pages/demand/forecast-demand-management';
import { OrderChangeHistoryPage } from '@aips/pages/demand/order-change-history';
import { MonthlyDemandPlanningPage } from '@aips/pages/demand/monthly-demand-planning';
import { WeeklyDemandAdjustmentPage } from '@aips/pages/demand/weekly-demand-adjustment';
import { AtpPage } from '@aips/pages/demand/atp';
import { DraggableDialog } from '@repo/radix-ui/components';

interface TabNavigationProps {
	activetab?: string;
}

const DemandTabNavigation: React.FC<TabNavigationProps> = ({ activetab }) => {
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'sales-order'
	);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();
	const { t } = useTranslation('common');

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/aips/demand/sales-order-management')) {
			setCurrentTab('sales-order');
		} else if (
			pathname.includes('/aips/demand/forecast-demand-management')
		) {
			setCurrentTab('forecast');
		} else if (pathname.includes('/aips/demand/order-change-history')) {
			setCurrentTab('change-history');
		} else if (pathname.includes('/aips/demand/monthly-demand-planning')) {
			setCurrentTab('monthly-planning');
		} else if (pathname.includes('/aips/demand/weekly-demand-adjustment')) {
			setCurrentTab('weekly-adjustment');
		} else if (pathname.includes('/aips/demand/atp')) {
			setCurrentTab('atp');
		}
	}, [location.pathname]);

	// Tab items definition
	const tabs: TabItem[] = [
		{
			id: 'sales-order',
			icon: <ShoppingCart size={16} />,
			label: '주문 관리',
			to: '/aips/demand/sales-order-management',
			content: <SalesOrderManagementPage />,
		},
		{
			id: 'forecast',
			icon: <TrendingUp size={16} />,
			label: '수요 예측',
			to: '/aips/demand/forecast-demand-management',
			content: <ForecastDemandManagementPage />,
		},
		{
			id: 'change-history',
			icon: <History size={16} />,
			label: '변경 이력',
			to: '/aips/demand/order-change-history',
			content: <OrderChangeHistoryPage />,
		},
		{
			id: 'monthly-planning',
			icon: <Calendar size={16} />,
			label: '월간 계획',
			to: '/aips/demand/monthly-demand-planning',
			content: <MonthlyDemandPlanningPage />,
		},
		{
			id: 'weekly-adjustment',
			icon: <CalendarDays size={16} />,
			label: '주간 조정',
			to: '/aips/demand/weekly-demand-adjustment',
			content: <WeeklyDemandAdjustmentPage />,
		},
		{
			id: 'atp',
			icon: <CheckCircle size={16} />,
			label: '납기 가능일',
			to: '/aips/demand/atp',
			content: <AtpPage />,
		},
	];

	// Register button as button slot
	const RegisterButton = () => {
		let extraButtons = null;

		switch (currentTab) {
			case 'forecast':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<BarChart3 size={16} />
							차트 보기
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<TrendingUp size={16} />
							예측 분석
						</RadixIconButton>
					</>
				);
				break;

			case 'change-history':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<History size={16} />
							이력 내보내기
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<AlertCircle size={16} />
							승인 대기
						</RadixIconButton>
					</>
				);
				break;

			case 'monthly-planning':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<BarChart3 size={16} />
							계획 분석
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<TrendingUp size={16} />
							트렌드 보기
						</RadixIconButton>
					</>
				);
				break;

			case 'atp':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<BarChart3 size={16} />
							트렌드 분석
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<TrendingUp size={16} />
							조정 내역
						</RadixIconButton>
					</>
				);
				break;

			case 'weekly-adjustment':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Calculator size={16} />
							ATP 분석
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<TrendingUp size={16} />
							트렌드 보기
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
				title={`수요 관리 ${t('tabs.actions.register')}`}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							새로운 수요 관리 항목을 등록합니다.
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
				title="수요 관리"
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={<RegisterButton />}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export { DemandTabNavigation };
export default DemandTabNavigation;
