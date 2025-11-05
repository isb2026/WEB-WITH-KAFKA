import React, { useState, useEffect } from 'react';
import { RadixIconButton } from '@radix-ui/components';
import {
	Play,
	HelpCircle,
	AlertCircle,
	Brain,
	BarChart3,
	TrendingUp,
	Target,
	Activity,
	Plus,
	Zap,
	Lightbulb,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { TabItem } from '@aips/templates/TabTemplate';
import TabLayout from '@aips/layouts/TabLayout';
import { PlanningSimulationPage } from '@aips/pages/simulation/planning-simulation';
import { WhatIfAnalysisPage } from '@aips/pages/simulation/what-if-analysis';
import { BottleneckAnalysisPage } from '@aips/pages/simulation/bottleneck-analysis';
import { AiOptimizationSimulationPage } from '@aips/pages/simulation/ai-optimization-simulation';
import { DraggableDialog } from '@repo/radix-ui/components';

interface TabNavigationProps {
	activetab?: string;
}

const SimulationTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'planning-simulation'
	);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();
	const { t } = useTranslation('common');

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/aips/simulation/planning-simulation')) {
			setCurrentTab('planning-simulation');
		} else if (pathname.includes('/aips/simulation/what-if-analysis')) {
			setCurrentTab('what-if-analysis');
		} else if (pathname.includes('/aips/simulation/bottleneck-analysis')) {
			setCurrentTab('bottleneck-analysis');
		} else if (
			pathname.includes('/aips/simulation/ai-optimization-simulation')
		) {
			setCurrentTab('ai-optimization-simulation');
		}
	}, [location.pathname]);

	// Tab items definition
	const tabs: TabItem[] = [
		{
			id: 'planning-simulation',
			icon: <Play size={16} />,
			label: '계획 시뮬레이션',
			to: '/aips/simulation/planning-simulation',
			content: <PlanningSimulationPage />,
		},
		{
			id: 'what-if-analysis',
			icon: <HelpCircle size={16} />,
			label: 'What-if 분석',
			to: '/aips/simulation/what-if-analysis',
			content: <WhatIfAnalysisPage />,
		},
		{
			id: 'bottleneck-analysis',
			icon: <AlertCircle size={16} />,
			label: '병목 분석',
			to: '/aips/simulation/bottleneck-analysis',
			content: <BottleneckAnalysisPage />,
		},
		{
			id: 'ai-optimization-simulation',
			icon: <Brain size={16} />,
			label: 'AI 최적화 시뮬레이션',
			to: '/aips/simulation/ai-optimization-simulation',
			content: <AiOptimizationSimulationPage />,
		},
	];

	// Register button as button slot
	const RegisterButton = () => {
		let extraButtons = null;

		switch (currentTab) {
			case 'planning-simulation':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<BarChart3 size={16} />
							시나리오 대시보드
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<TrendingUp size={16} />
							시뮬레이션 실행
						</RadixIconButton>
					</>
				);
				break;

			case 'what-if-analysis':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Zap size={16} />
							인터랙티브 차트
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Target size={16} />
							시나리오 비교
						</RadixIconButton>
					</>
				);
				break;

			case 'bottleneck-analysis':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Activity size={16} />
							병목 식별
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<AlertCircle size={16} />
							해결 방안
						</RadixIconButton>
					</>
				);
				break;

			case 'ai-optimization-simulation':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Brain size={16} />
							AI 분석
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Lightbulb size={16} />
							최적화 제안
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
				title={`시뮬레이션 & 분석 ${t('tabs.actions.register')}`}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							새로운 시뮬레이션 시나리오를 등록합니다.
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
				title="시뮬레이션 & 분석"
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={<RegisterButton />}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default SimulationTabNavigation;
