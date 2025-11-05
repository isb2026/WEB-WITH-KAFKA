import React, { useState, useEffect } from 'react';
import { RadixIconButton } from '@radix-ui/components';
import {
	Brain,
	BarChart3,
	TrendingUp,
	Target,
	FileText,
	Download,
	Zap,
	RefreshCw,
	CheckCircle,
	AlertCircle,
	Plus,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { TabItem } from '@aips/templates/TabTemplate';
import TabLayout from '@aips/layouts/TabLayout';
import { AiPlanSummaryPage } from '@aips/pages/ai-insights/ai-plan-summary';
import { AiPlanCorrectionPage } from '@aips/pages/ai-insights/ai-plan-correction';
import { AiWhatIfPage } from '@aips/pages/ai-insights/ai-what-if';
import { AiAutoReportsPage } from '@aips/pages/ai-insights/ai-auto-reports';
import { DraggableDialog } from '@repo/radix-ui/components';

interface TabNavigationProps {
	activetab?: string;
}

const AiInsightsTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'ai-plan-summary'
	);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();
	const { t } = useTranslation('common');

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/aips/ai-insights/ai-plan-summary')) {
			setCurrentTab('ai-plan-summary');
		} else if (pathname.includes('/aips/ai-insights/ai-plan-correction')) {
			setCurrentTab('ai-plan-correction');
		} else if (pathname.includes('/aips/ai-insights/ai-what-if')) {
			setCurrentTab('ai-what-if');
		} else if (pathname.includes('/aips/ai-insights/ai-auto-reports')) {
			setCurrentTab('ai-auto-reports');
		}
	}, [location.pathname]);

	// Tab items definition
	const tabs: TabItem[] = [
		{
			id: 'ai-plan-summary',
			icon: <Brain size={16} />,
			label: 'AI 계획 요약',
			to: '/aips/ai-insights/ai-plan-summary',
			content: <AiPlanSummaryPage />,
		},
		{
			id: 'ai-plan-correction',
			icon: <Target size={16} />,
			label: 'AI 계획 조정',
			to: '/aips/ai-insights/ai-plan-correction',
			content: <AiPlanCorrectionPage />,
		},
		{
			id: 'ai-what-if',
			icon: <Zap size={16} />,
			label: 'AI What-if',
			to: '/aips/ai-insights/ai-what-if',
			content: <AiWhatIfPage />,
		},
		{
			id: 'ai-auto-reports',
			icon: <FileText size={16} />,
			label: 'AI 자동 보고서',
			to: '/aips/ai-insights/ai-auto-reports',
			content: <AiAutoReportsPage />,
		},
	];

	// Register button as button slot
	const RegisterButton = () => {
		let extraButtons = null;

		switch (currentTab) {
			case 'ai-plan-summary':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<RefreshCw size={16} />
							AI 분석 새로고침
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<BarChart3 size={16} />
							차트 보기
						</RadixIconButton>
					</>
				);
				break;

			case 'ai-plan-correction':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<CheckCircle size={16} />
							제안 수락
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<AlertCircle size={16} />
							제안 거부
						</RadixIconButton>
					</>
				);
				break;

			case 'ai-what-if':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Zap size={16} />
							시나리오 실행
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<TrendingUp size={16} />
							결과 비교
						</RadixIconButton>
					</>
				);
				break;

			case 'ai-auto-reports':
				extraButtons = (
					<>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Download size={16} />
							내보내기
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<FileText size={16} />새 템플릿
						</RadixIconButton>
						<RadixIconButton className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border">
							<Zap size={16} />
							일괄 생성
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
					<Plus size={16} />새 AI 분석
				</RadixIconButton>
			</div>
		);
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title="새 AI 분석 생성"
				content={
					<div className="p-6">
						<p className="text-gray-600">
							새로운 AI 기반 분석을 생성합니다.
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
				title="AI 인사이트"
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={<RegisterButton />}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default AiInsightsTabNavigation;
