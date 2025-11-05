import React, { useState, useEffect } from 'react';
import { RadixIconButton } from '@radix-ui/components';
import {
	Target,
	ClipboardList,
	Settings,
	FileText,
	Send,
	ArrowUpDown,
	Plus,
	BarChart3,
	Calendar,
	GanttChart,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { TabItem } from '@aips/templates/TabTemplate';
import TabLayout from '@aips/layouts/TabLayout';
import { DraggableDialog } from '@repo/radix-ui/components';
import {
	DailyProductionTargetsPage,
	MachineSchedulingPage,
	MesWorkOrderSendPage,
	ProcessInputPlanPage,
	WorkOrderCreationPage,
	WorkPriorityAdjustmentPage,
} from '@aips/pages/detail-scheduling';

interface TabNavigationProps {
	activetab?: string;
}

const DetailSchedulingTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'daily-production-targets'
	);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();
	const { t } = useTranslation('common');

	useEffect(() => {
		const pathname = location.pathname;
		if (
			pathname.includes(
				'/aips/detail-scheduling/daily-production-targets'
			)
		) {
			setCurrentTab('daily-production-targets');
		} else if (
			pathname.includes('/aips/detail-scheduling/process-input-plan')
		) {
			setCurrentTab('process-input-plan');
		} else if (
			pathname.includes('/aips/detail-scheduling/machine-scheduling')
		) {
			setCurrentTab('machine-scheduling');
		} else if (
			pathname.includes('/aips/detail-scheduling/work-order-creation')
		) {
			setCurrentTab('work-order-creation');
		} else if (
			pathname.includes('/aips/detail-scheduling/mes-work-order-send')
		) {
			setCurrentTab('mes-work-order-send');
		} else if (
			pathname.includes(
				'/aips/detail-scheduling/work-priority-adjustment'
			)
		) {
			setCurrentTab('work-priority-adjustment');
		}
	}, [location.pathname]);

	// Tab items definition
	const tabs: TabItem[] = [
		{
			id: 'daily-production-targets',
			icon: <Target size={16} />,
			label: '일일 생산 목표',
			to: '/aips/detail-scheduling/daily-production-targets',
			content: <DailyProductionTargetsPage />,
		},
		{
			id: 'process-input-plan',
			icon: <ClipboardList size={16} />,
			label: '공정 투입 계획',
			to: '/aips/detail-scheduling/process-input-plan',
			content: <ProcessInputPlanPage />,
		},
		{
			id: 'machine-scheduling',
			icon: <Settings size={16} />,
			label: '설비 스케줄링',
			to: '/aips/detail-scheduling/machine-scheduling',
			content: <MachineSchedulingPage />,
		},
		{
			id: 'work-order-creation',
			icon: <FileText size={16} />,
			label: '작업지시 생성/해제',
			to: '/aips/detail-scheduling/work-order-creation',
			content: <WorkOrderCreationPage />,
		},
		{
			id: 'mes-work-order-send',
			icon: <Send size={16} />,
			label: 'MES 작업지시 전송',
			to: '/aips/detail-scheduling/mes-work-order-send',
			content: <MesWorkOrderSendPage />,
		},
		{
			id: 'work-priority-adjustment',
			icon: <ArrowUpDown size={16} />,
			label: '작업 우선순위 조정',
			to: '/aips/detail-scheduling/work-priority-adjustment',
			content: <WorkPriorityAdjustmentPage />,
		},
	];

	// Register button as button slot
	const RegisterButton = () => {
		let extraButtons = null;

		switch (currentTab) {
			case 'daily-production-targets':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<BarChart3 size={16} />
							대시보드 보기
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Calendar size={16} />
							계획 수립
						</RadixIconButton>
					</>
				);
				break;

			case 'process-input-plan':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<ClipboardList size={16} />
							자재 확인
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<BarChart3 size={16} />
							투입 분석
						</RadixIconButton>
					</>
				);
				break;

			case 'machine-scheduling':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<GanttChart size={16} />
							간트 차트
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Settings size={16} />
							설비 관리
						</RadixIconButton>
					</>
				);
				break;

			case 'work-order-creation':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<FileText size={16} />
							지시서 보기
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<BarChart3 size={16} />
							생성 이력
						</RadixIconButton>
					</>
				);
				break;

			case 'mes-work-order-send':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Send size={16} />
							전송 이력
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<BarChart3 size={16} />
							연동 상태
						</RadixIconButton>
					</>
				);
				break;

			case 'work-priority-adjustment':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<ArrowUpDown size={16} />
							우선순위 정렬
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<GanttChart size={16} />
							간트 보기
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
				title={`일일 작업지시 ${t('tabs.actions.register')}`}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							새로운 일일 작업지시를 등록합니다.
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
				title="일일 작업지시"
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={<RegisterButton />}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default DetailSchedulingTabNavigation;
