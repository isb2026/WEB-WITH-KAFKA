import React, { useState, useEffect } from 'react';
import { RadixIconButton } from '@radix-ui/components';
import {
	Monitor,
	Activity,
	BarChart3,
	AlertTriangle,
	Link,
	CheckCircle,
	Settings,
	Award,
	RefreshCw,
	TrendingUp,
	AlertCircle,
	CheckCircle2,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { TabItem } from '@aips/templates/TabTemplate';
import TabLayout from '@aips/layouts/TabLayout';
import { RealTimeWorkStatusPage } from '@aips/pages/execution-monitoring/real-time-work-status';
import { PlanVsActualPage } from '@aips/pages/execution-monitoring/plan-vs-actual';
import { DeliveryDelayAlertsPage } from '@aips/pages/execution-monitoring/delivery-delay-alerts';
import { MesIntegrationMonitoringPage } from '@aips/pages/execution-monitoring/mes-integration-monitoring';
import { WorkCompletionFeedbackPage } from '@aips/pages/execution-monitoring/work-completion-feedback';
import { EquipmentStatusIntegrationPage } from '@aips/pages/execution-monitoring/equipment-status-integration';
import { QualityInfoReflectionPage } from '@aips/pages/execution-monitoring/quality-info-reflection';
import { DraggableDialog } from '@repo/radix-ui/components';

interface TabNavigationProps {
	activetab?: string;
}

const ExecutionMonitoringTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'realtime-work-status'
	);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();
	const { t } = useTranslation('common');

	useEffect(() => {
		const pathname = location.pathname;
		if (
			pathname.includes('/aips/execution-monitoring/realtime-work-status')
		) {
			setCurrentTab('realtime-work-status');
		} else if (
			pathname.includes('/aips/execution-monitoring/plan-vs-actual')
		) {
			setCurrentTab('plan-vs-actual');
		} else if (
			pathname.includes(
				'/aips/execution-monitoring/delivery-delay-alerts'
			)
		) {
			setCurrentTab('delivery-delay-alerts');
		} else if (
			pathname.includes(
				'/aips/execution-monitoring/mes-integration-monitoring'
			)
		) {
			setCurrentTab('mes-integration-monitoring');
		} else if (
			pathname.includes(
				'/aips/execution-monitoring/work-completion-feedback'
			)
		) {
			setCurrentTab('work-completion-feedback');
		} else if (
			pathname.includes(
				'/aips/execution-monitoring/equipment-status-integration'
			)
		) {
			setCurrentTab('equipment-status-integration');
		} else if (
			pathname.includes(
				'/aips/execution-monitoring/quality-info-reflection'
			)
		) {
			setCurrentTab('quality-info-reflection');
		}
	}, [location.pathname]);

	// Tab items definition
	const tabs: TabItem[] = [
		{
			id: 'realtime-work-status',
			icon: <Activity size={16} />,
			label: '실시간 작업 현황',
			to: '/aips/execution-monitoring/realtime-work-status',
			content: <RealTimeWorkStatusPage />,
		},
		{
			id: 'plan-vs-actual',
			icon: <BarChart3 size={16} />,
			label: '계획 vs 실제 성과',
			to: '/aips/execution-monitoring/plan-vs-actual',
			content: <PlanVsActualPage />,
		},
		{
			id: 'delivery-delay-alerts',
			icon: <AlertTriangle size={16} />,
			label: '납기 지연 알림',
			to: '/aips/execution-monitoring/delivery-delay-alerts',
			content: <DeliveryDelayAlertsPage />,
		},
		{
			id: 'mes-integration-monitoring',
			icon: <Link size={16} />,
			label: 'MES 연동 모니터링',
			to: '/aips/execution-monitoring/mes-integration-monitoring',
			content: <MesIntegrationMonitoringPage />,
		},
		{
			id: 'work-completion-feedback',
			icon: <CheckCircle size={16} />,
			label: '작업 완료 피드백',
			to: '/aips/execution-monitoring/work-completion-feedback',
			content: <WorkCompletionFeedbackPage />,
		},
		{
			id: 'equipment-status-integration',
			icon: <Settings size={16} />,
			label: '설비 상태 연동',
			to: '/aips/execution-monitoring/equipment-status-integration',
			content: <EquipmentStatusIntegrationPage />,
		},
		{
			id: 'quality-info-reflection',
			icon: <Award size={16} />,
			label: '품질 정보 반영',
			to: '/aips/execution-monitoring/quality-info-reflection',
			content: <QualityInfoReflectionPage />,
		},
	];

	// Register button as button slot
	const RegisterButton = () => {
		let extraButtons = null;

		switch (currentTab) {
			case 'realtime-work-status':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<RefreshCw size={16} />
							새로고침
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Monitor size={16} />
							실시간 모니터링
						</RadixIconButton>
					</>
				);
				break;

			case 'plan-vs-actual':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<BarChart3 size={16} />
							차트 보기
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<TrendingUp size={16} />
							성과 분석
						</RadixIconButton>
					</>
				);
				break;

			case 'delivery-delay-alerts':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<AlertTriangle size={16} />
							알림 설정
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<AlertCircle size={16} />
							지연 분석
						</RadixIconButton>
					</>
				);
				break;

			case 'mes-integration-monitoring':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Link size={16} />
							연동 상태
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<RefreshCw size={16} />
							동기화
						</RadixIconButton>
					</>
				);
				break;

			case 'work-completion-feedback':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<CheckCircle size={16} />
							완료 현황
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<CheckCircle2 size={16} />
							피드백 관리
						</RadixIconButton>
					</>
				);
				break;

			case 'equipment-status-integration':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Settings size={16} />
							설비 상태
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Activity size={16} />
							실시간 모니터링
						</RadixIconButton>
					</>
				);
				break;

			case 'quality-info-reflection':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Award size={16} />
							품질 현황
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<BarChart3 size={16} />
							품질 분석
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
					<Monitor size={16} />
					모니터링
				</RadixIconButton>
			</div>
		);
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={`실행 모니터링`}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							실행 모니터링 설정을 관리합니다.
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
				title="실행 모니터링"
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={<RegisterButton />}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default ExecutionMonitoringTabNavigation;
