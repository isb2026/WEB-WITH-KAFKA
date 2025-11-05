import React, { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	FileText,
	Plus,
	BarChart3,
	CalendarPlus,
	Calendar,
} from 'lucide-react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton, DraggableDialog } from '@repo/radix-ui/components';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import type { PeriodicInspectionPlan } from '@primes/pages/quality/periodic-inspection/QualityPeriodicInspectionPlanPage';

// Page imports - 실제 페이지들
import QualityPeriodicInspectionPlanPage from '@primes/pages/quality/periodic-inspection/QualityPeriodicInspectionPlanPage';
import QualityPeriodicInspectionListPage from '@primes/pages/quality/periodic-inspection/QualityPeriodicInspectionListPage';
import QualityPeriodicInspectionCalendarPage from '@primes/pages/quality/periodic-inspection/QualityPeriodicInspectionCalendarPage';
import QualityPeriodicInspectionReportPage from '@primes/pages/quality/periodic-inspection/QualityPeriodicInspectionReportPage';

// 리포트 페이지는 실제 파일을 사용

interface TabNavigationProps {
	activetab?: string;
}

const PeriodicInspectionTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const { t } = useTranslation('common');
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'plan');
	const location = useLocation();
	const navigate = useNavigate();

	const [openPlanModal, setOpenPlanModal] = useState(false);
	const [editingPlan, setEditingPlan] =
		useState<PeriodicInspectionPlan | null>(null);

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/quality/periodic-inspection/plan')) {
			setCurrentTab('plan');
		} else if (pathname.includes('/quality/periodic-inspection/list')) {
			setCurrentTab('list');
		} else if (pathname.includes('/quality/periodic-inspection/report')) {
			setCurrentTab('report');
		} else if (pathname.includes('/quality/periodic-inspection/calendar')) {
			setCurrentTab('calendar');
		}
	}, [location.pathname]);

	const tabs: TabItem[] = [
		{
			id: 'plan',
			icon: <CalendarPlus size={16} />,
			label: t('tabs.labels.plan'),
			to: '/quality/periodic-inspection/plan',
			content: (
				<QualityPeriodicInspectionPlanPage
					onRequestEdit={(plan) => {
						setEditingPlan(plan);
						setOpenPlanModal(true);
					}}
				/>
			),
		},
		{
			id: 'list',
			icon: <FileText size={16} />,
			label: t('tabs.labels.status'),
			to: '/quality/periodic-inspection/list',
			content: <QualityPeriodicInspectionListPage />,
		},
		{
			id: 'calendar',
			icon: <Calendar size={16} />,
			label: t('tabs.labels.calendar'),
			to: '/quality/periodic-inspection/calendar',
			content: <QualityPeriodicInspectionCalendarPage />,
		},
		{
			id: 'report',
			icon: <BarChart3 size={16} />,
			label: t('tabs.labels.report'),
			to: '/quality/periodic-inspection/report',
			content: <QualityPeriodicInspectionReportPage />,
		},
	];

	const PlanRegisterButton = () => (
		<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
			<RadixIconButton
				className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
				onClick={() => {
					setEditingPlan(null);
					setOpenPlanModal(true);
				}}
			>
				<CalendarPlus size={16} />
				계획 등록
			</RadixIconButton>
		</div>
	);

	const InspectionRegisterButton = () => (
		<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
			<RadixIconButton
				className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
				onClick={() =>
					navigate('/quality/periodic-inspection/register')
				}
			>
				<Plus size={16} />
				정기검사 등록
			</RadixIconButton>
		</div>
	);

	const SetActionButton = (tab: string) => {
		switch (tab) {
			case 'plan':
				return <PlanRegisterButton />;
			case 'list':
			case 'calendar':
				return <InspectionRegisterButton />;
			default:
				return null;
		}
	};

	return (
		<>
			<TabLayout
				title={t('tabs.titles.periodicInspection')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>

			<DraggableDialog
				open={openPlanModal}
				onOpenChange={setOpenPlanModal}
				title={
					editingPlan ? '정기검사 계획 수정' : '정기검사 계획 등록'
				}
				content={
					<DynamicForm
						fields={[
							{
								name: 'equipmentCode',
								label: '설비코드',
								type: 'text',
								required: true,
							},
							{
								name: 'equipment',
								label: '설비명',
								type: 'text',
								required: true,
							},
							{
								name: 'inspectionType',
								label: '검사유형',
								type: 'select',
								options: [
									{ label: '월간정기검사', value: 'monthly' },
									{
										label: '분기정기검사',
										value: 'quarterly',
									},
									{
										label: '반기정기검사',
										value: 'semi-annual',
									},
									{ label: '연간정기검사', value: 'annual' },
								],
								required: true,
							},
							{
								name: 'plannedDate',
								label: '예정일',
								type: 'date',
								required: true,
							},
							{
								name: 'inspector',
								label: '검사자',
								type: 'text',
								required: true,
							},
							{
								name: 'department',
								label: '담당부서',
								type: 'text',
								required: true,
							},
							{
								name: 'priority',
								label: '우선순위',
								type: 'select',
								options: [
									{ label: '높음', value: 'high' },
									{ label: '보통', value: 'medium' },
									{ label: '낮음', value: 'low' },
								],
								required: true,
							},
							{
								name: 'estimatedHours',
								label: '예상시간',
								type: 'number',
								required: true,
							},
							{
								name: 'description',
								label: '검사내용',
								type: 'textarea',
								required: true,
							},
						]}
						initialData={
							(editingPlan ?? undefined) as unknown as Record<
								string,
								unknown
							>
						}
						onSubmit={(data) => {
							console.log('Plan submit:', data);
							setOpenPlanModal(false);
						}}
					/>
				}
			/>
		</>
	);
};

export default PeriodicInspectionTabNavigation;
