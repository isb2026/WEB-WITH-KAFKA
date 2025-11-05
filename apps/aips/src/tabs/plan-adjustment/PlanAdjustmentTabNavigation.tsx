import React, { useState, useEffect } from 'react';
import { RadixIconButton } from '@radix-ui/components';
import {
	Calendar,
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
	History,
	GitBranch,
	RotateCcw,
	FileText,
	Clock,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { TabItem } from '@aips/templates/TabTemplate';
import TabLayout from '@aips/layouts/TabLayout';
import { ManualPlanAdjustmentPage } from '@aips/pages/plan-adjustment/manual-plan-adjustment';
import { EmergencyOrderInsertionPage } from '@aips/pages/plan-adjustment/emergency-order-insertion';
import { PlanConfirmationApprovalPage } from '@aips/pages/plan-adjustment/plan-confirmation-approval';
import { PlanHistoryManagementPage } from '@aips/pages/plan-adjustment/plan-history-management';
import { VersionManagementPage } from '@aips/pages/plan-adjustment/version-management';
import { ChangeReasonManagementPage } from '@aips/pages/plan-adjustment/change-reason-management';
import { RollbackFunctionPage } from '@aips/pages/plan-adjustment/rollback-function';
import { DraggableDialog } from '@repo/radix-ui/components';

interface TabNavigationProps {
	activetab?: string;
}

const PlanAdjustmentTabNavigation: React.FC<TabNavigationProps> = ({ activetab }) => {
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'manual-plan-adjustment'
	);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();
	const { t } = useTranslation('common');

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/aips/adjustment/manual-plan-adjustment')) {
			setCurrentTab('manual-plan-adjustment');
		} else if (pathname.includes('/aips/adjustment/emergency-order-insertion')) {
			setCurrentTab('emergency-order-insertion');
		} else if (pathname.includes('/aips/adjustment/plan-confirmation-approval')) {
			setCurrentTab('plan-confirmation-approval');
		} else if (pathname.includes('/aips/adjustment/plan-history-management')) {
			setCurrentTab('plan-history-management');
		} else if (pathname.includes('/aips/adjustment/version-management')) {
			setCurrentTab('version-management');
		} else if (pathname.includes('/aips/adjustment/change-reason-management')) {
			setCurrentTab('change-reason-management');
		} else if (pathname.includes('/aips/adjustment/rollback-function')) {
			setCurrentTab('rollback-function');
		}
	}, [location.pathname]);

	// Tab items definition
	const tabs: TabItem[] = [
		{
			id: 'manual-plan-adjustment',
			icon: <Calendar size={16} />,
			label: '수동 계획 조정',
			to: '/aips/adjustment/manual-plan-adjustment',
			content: <ManualPlanAdjustmentPage />,
		},
		{
			id: 'emergency-order-insertion',
			icon: <AlertCircle size={16} />,
			label: '긴급 주문 삽입',
			to: '/aips/adjustment/emergency-order-insertion',
			content: <EmergencyOrderInsertionPage />,
		},
		{
			id: 'plan-confirmation-approval',
			icon: <CheckCircle size={16} />,
			label: '계획 확인/승인',
			to: '/aips/adjustment/plan-confirmation-approval',
			content: <PlanConfirmationApprovalPage />,
		},
		{
			id: 'plan-history-management',
			icon: <History size={16} />,
			label: '계획 이력 관리',
			to: '/aips/adjustment/plan-history-management',
			content: <PlanHistoryManagementPage />,
		},
		{
			id: 'version-management',
			icon: <GitBranch size={16} />,
			label: '버전 관리',
			to: '/aips/adjustment/version-management',
			content: <VersionManagementPage />,
		},
		{
			id: 'change-reason-management',
			icon: <FileText size={16} />,
			label: '변경 사유 관리',
			to: '/aips/adjustment/change-reason-management',
			content: <ChangeReasonManagementPage />,
		},
		{
			id: 'rollback-function',
			icon: <RotateCcw size={16} />,
			label: '롤백 기능',
			to: '/aips/adjustment/rollback-function',
			content: <RollbackFunctionPage />,
		},
	];

	// Register button as button slot
	const RegisterButton = () => {
		let extraButtons = null;

		switch (currentTab) {
			case 'manual-plan-adjustment':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<BarChart3 size={16} />
							간트 차트 보기
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<TrendingUp size={16} />
							계획 분석
						</RadixIconButton>
					</>
				);
				break;

			case 'emergency-order-insertion':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Clock size={16} />
							스케줄 업데이트
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<AlertCircle size={16} />
							긴급 주문 현황
						</RadixIconButton>
					</>
				);
				break;

			case 'plan-confirmation-approval':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<CheckCircle size={16} />
							승인 현황
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Activity size={16} />
							워크플로우 현황
						</RadixIconButton>
					</>
				);
				break;

			case 'plan-history-management':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<History size={16} />
							이력 조회
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Clock size={16} />
							타임라인 보기
						</RadixIconButton>
					</>
				);
				break;

			case 'version-management':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<GitBranch size={16} />
							버전 비교
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<FileText size={16} />
							변경 내역
						</RadixIconButton>
					</>
				);
				break;

			case 'change-reason-management':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<FileText size={16} />
							사유 조회
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Activity size={16} />
							사용자 로그
						</RadixIconButton>
					</>
				);
				break;

			case 'rollback-function':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<RotateCcw size={16} />
							롤백 실행
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<History size={16} />
							복원 로그
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
				title={`계획 조정 ${t('tabs.actions.register')}`}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							새로운 계획 조정 항목을 등록합니다.
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
				title="계획 조정"
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={<RegisterButton />}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default PlanAdjustmentTabNavigation;
