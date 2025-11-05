import React, { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, Plus, BarChart3 } from 'lucide-react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@repo/radix-ui/components';
import {
	QualitySelfAnalysisPage,
	QualitySelfInspectionListPage,
} from '@primes/pages/quality/self';

// Page imports - 샘플 페이지들

interface TabNavigationProps {
	activetab?: string;
}

const SelfInspectionTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const { t } = useTranslation('common');
	const navigate = useNavigate();
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/quality/self-inspection/list')) {
			setCurrentTab('list');
		} else if (pathname.includes('/quality/self-inspection/report')) {
			setCurrentTab('report');
		}
	}, [location.pathname]);

	const tabs: TabItem[] = [
		{
			id: 'list',
			icon: <FileText size={16} />,
			label: t('tabs.labels.status'),
			to: '/quality/self-inspection/list',
			content: <QualitySelfInspectionListPage />,
		},
		{
			id: 'analysis',
			icon: <BarChart3 size={16} />,
			label: t('tabs.labels.analysis'),
			to: '/quality/self-inspection/analysis',
			content: <QualitySelfAnalysisPage />,
		},
	];

	const RegisterButton = () => (
		<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
			<RadixIconButton
				className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
				onClick={() => navigate('/quality/self-inspection/register')}
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
			title={t('tabs.titles.selfInspection')}
			tabs={tabs}
			defaultValue={currentTab}
			buttonSlot={SetActionButton(currentTab)}
			onValueChange={setCurrentTab}
		/>
	);
};

export default SelfInspectionTabNavigation;
