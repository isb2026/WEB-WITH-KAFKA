import React, { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, Plus, BarChart3 } from 'lucide-react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@repo/radix-ui/components';
import {
	QualityPatrolAnalysisPage,
	QualityPatrolInspectionListPage,
} from '@primes/pages/quality/patrol';

interface TabNavigationProps {
	activetab?: string;
}

const PatrolInspectionTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const { t } = useTranslation('common');
	const navigate = useNavigate();
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/quality/patrol-inspection/list')) {
			setCurrentTab('list');
		} else if (pathname.includes('/quality/patrol-inspection/report')) {
			setCurrentTab('report');
		}
	}, [location.pathname]);

	const tabs: TabItem[] = [
		{
			id: 'list',
			icon: <FileText size={16} />,
			label: t('tabs.labels.status'),
			to: '/quality/patrol-inspection/list',
			content: <QualityPatrolInspectionListPage />,
		},
		{
			id: 'analysis',
			icon: <BarChart3 size={16} />,
			label: t('tabs.labels.analysis'),
			to: '/quality/patrol-inspection/analysis',
			content: <QualityPatrolAnalysisPage />,
		},
	];

	const RegisterButton = () => (
		<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
			<RadixIconButton
				className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
				onClick={() => navigate('/quality/patrol-inspection/register')}
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
			title={t('tabs.titles.patrolInspection')}
			tabs={tabs}
			defaultValue={currentTab}
			buttonSlot={SetActionButton(currentTab)}
			onValueChange={setCurrentTab}
		/>
	);
};

export default PatrolInspectionTabNavigation;
