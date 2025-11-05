import React, { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, Plus, BarChart3, TrendingUp } from 'lucide-react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@repo/radix-ui/components';
import QualityPrecisionInspectionListPage from '@primes/pages/quality/precision-inspection/QualityPrecisionInspectionListPage';
import QualityPrecisionInspectionReportPage from '@primes/pages/quality/precision-inspection/QualityPrecisionInspectionReportPage';
import QualityPrecisionInspectionAnalysisPage from '@primes/pages/quality/precision-inspection/QualityPrecisionInspectionAnalysisPage';

interface TabNavigationProps {
	activetab?: string;
}

const PrecisionInspectionTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const { t } = useTranslation('common');
	const navigate = useNavigate();
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/quality/precision-inspection/list')) {
			setCurrentTab('list');
		} else if (pathname.includes('/quality/precision-inspection/report')) {
			setCurrentTab('report');
		} else if (
			pathname.includes('/quality/precision-inspection/analysis')
		) {
			setCurrentTab('analysis');
		}
	}, [location.pathname]);

	const tabs: TabItem[] = [
		{
			id: 'list',
			icon: <FileText size={16} />,
			label: t('tabs.labels.status'),
			to: '/quality/precision-inspection/list',
			content: <QualityPrecisionInspectionListPage />,
		},
		{
			id: 'report',
			icon: <BarChart3 size={16} />,
			label: t('tabs.labels.report'),
			to: '/quality/precision-inspection/report',
			content: <QualityPrecisionInspectionReportPage />,
		},
		{
			id: 'analysis',
			icon: <TrendingUp size={16} />,
			label: t('tabs.labels.analysis'),
			to: '/quality/precision-inspection/analysis',
			content: <QualityPrecisionInspectionAnalysisPage />,
		},
	];

	const RegisterButton = () => (
		<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
			<RadixIconButton
				className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
				onClick={() =>
					navigate('/quality/precision-inspection/register')
				}
			>
				<Plus size={16} />
				{t('tabs.actions.register')}
			</RadixIconButton>
		</div>
	);

	const SetActionButton = (tab: string) => {
		switch (tab) {
			default:
				return <RegisterButton />;
		}
	};

	return (
		<TabLayout
			title={t('tabs.titles.precisionInspection')}
			tabs={tabs}
			defaultValue={currentTab}
			buttonSlot={SetActionButton(currentTab)}
			onValueChange={setCurrentTab}
		/>
	);
};

export default PrecisionInspectionTabNavigation;
