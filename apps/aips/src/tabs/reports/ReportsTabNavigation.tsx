import React, { useState, useEffect } from 'react';
import { RadixIconButton } from '@radix-ui/components';
import {
	FileText,
	BarChart3,
	Calendar,
	TrendingUp,
	Activity,
	Truck,
	Download,
	Printer,
	Eye,
	Plus,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { TabItem } from '@aips/templates/TabTemplate';
import TabLayout from '@aips/layouts/TabLayout';
import { MonthlyProductionReportPage } from '@aips/pages/reports/monthly-production-report';
import { WeeklyProductionReportPage } from '@aips/pages/reports/weekly-production-report';
import { DailyWorkOrderReportPage } from '@aips/pages/reports/daily-work-order-report';
import { PlanVsActualAnalysisPage } from '@aips/pages/reports/plan-vs-actual-analysis';
import { EquipmentEfficiencyReportPage } from '@aips/pages/reports/equipment-efficiency-report';
import { DeliveryComplianceAnalysisPage } from '@aips/pages/reports/delivery-compliance-analysis';
import { DraggableDialog } from '@repo/radix-ui/components';

interface TabNavigationProps {
	activetab?: string;
}

const ReportsTabNavigation: React.FC<TabNavigationProps> = ({ activetab }) => {
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'monthly-production-report'
	);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();
	const { t } = useTranslation('common');

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/aips/reports/monthly-production-report')) {
			setCurrentTab('monthly-production-report');
		} else if (
			pathname.includes('/aips/reports/weekly-production-report')
		) {
			setCurrentTab('weekly-production-report');
		} else if (pathname.includes('/aips/reports/daily-work-order-report')) {
			setCurrentTab('daily-work-order-report');
		} else if (pathname.includes('/aips/reports/plan-vs-actual-analysis')) {
			setCurrentTab('plan-vs-actual-analysis');
		} else if (
			pathname.includes('/aips/reports/equipment-efficiency-report')
		) {
			setCurrentTab('equipment-efficiency-report');
		} else if (
			pathname.includes('/aips/reports/delivery-compliance-analysis')
		) {
			setCurrentTab('delivery-compliance-analysis');
		}
	}, [location.pathname]);

	// Tab items definition
	const tabs: TabItem[] = [
		{
			id: 'monthly-production-report',
			icon: <Calendar size={16} />,
			label: '월간 생산 계획 보고서',
			to: '/aips/reports/monthly-production-report',
			content: <MonthlyProductionReportPage />,
		},
		{
			id: 'weekly-production-report',
			icon: <Calendar size={16} />,
			label: '주간 생산 계획 보고서',
			to: '/aips/reports/weekly-production-report',
			content: <WeeklyProductionReportPage />,
		},
		{
			id: 'daily-work-order-report',
			icon: <FileText size={16} />,
			label: '일일 작업 지시 보고서',
			to: '/aips/reports/daily-work-order-report',
			content: <DailyWorkOrderReportPage />,
		},
		{
			id: 'plan-vs-actual-analysis',
			icon: <TrendingUp size={16} />,
			label: '계획 vs 실제 분석',
			to: '/aips/reports/plan-vs-actual-analysis',
			content: <PlanVsActualAnalysisPage />,
		},
		{
			id: 'equipment-efficiency-report',
			icon: <Activity size={16} />,
			label: '설비 효율성 보고서',
			to: '/aips/reports/equipment-efficiency-report',
			content: <EquipmentEfficiencyReportPage />,
		},
		{
			id: 'delivery-compliance-analysis',
			icon: <Truck size={16} />,
			label: '납기 준수도 분석',
			to: '/aips/reports/delivery-compliance-analysis',
			content: <DeliveryComplianceAnalysisPage />,
		},
	];

	// Register button as button slot
	const RegisterButton = () => {
		let extraButtons = null;

		switch (currentTab) {
			case 'monthly-production-report':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Download size={16} />
							PDF 내보내기
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Download size={16} />
							Excel 내보내기
						</RadixIconButton>
					</>
				);
				break;

			case 'weekly-production-report':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Download size={16} />
							Excel 내보내기
						</RadixIconButton>
					</>
				);
				break;

			case 'daily-work-order-report':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Printer size={16} />
							인쇄
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Download size={16} />
							내보내기
						</RadixIconButton>
					</>
				);
				break;

			case 'plan-vs-actual-analysis':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<TrendingUp size={16} />
							트렌드 분석
						</RadixIconButton>
					</>
				);
				break;

			case 'equipment-efficiency-report':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<BarChart3 size={16} />
							효율성 분석
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
				title={`보고서 ${t('tabs.actions.register')}`}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							새로운 보고서를 생성합니다.
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
				title="보고서"
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={<RegisterButton />}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default ReportsTabNavigation;
