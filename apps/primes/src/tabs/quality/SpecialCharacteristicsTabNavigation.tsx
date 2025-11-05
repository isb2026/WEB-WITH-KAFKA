import React, { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import { useLocation } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';

// Page imports - 현재는 XR 관리만, 추후 확장 예정
import QualitySpecialCharacteristicsPage from '@primes/pages/quality/special-characteristics/QualitySpecialCharacteristicsPage';

interface TabNavigationProps {
	activetab?: string;
}

const SpecialCharacteristicsTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const { t } = useTranslation('common');
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'xr-analysis'
	);
	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/quality/special-characteristics/xr-analysis')) {
			setCurrentTab('xr-analysis');
		}
		// 추후 다른 탭들 추가 예정
		// else if (pathname.includes('/quality/special-characteristics/other-feature')) {
		//   setCurrentTab('other-feature');
		// }
	}, [location.pathname]);

	const tabs: TabItem[] = [
		{
			id: 'xr-analysis',
			icon: <BarChart3 size={16} />,
			label: 'XR 분석', // 또는 t('tabs.labels.xrAnalysis')
			to: '/quality/special-characteristics/xr-analysis',
			content: <QualitySpecialCharacteristicsPage />,
		},
		// 추후 확장을 위한 예시 (주석처리)
		/*
		{
			id: 'statistics',
			icon: <TrendingUp size={16} />,
			label: '통계 분석',
			to: '/quality/special-characteristics/statistics',
			content: <QualitySpecialCharacteristicsStatisticsPage />,
		},
		{
			id: 'reports',
			icon: <FileText size={16} />,
			label: '보고서',
			to: '/quality/special-characteristics/reports',
			content: <QualitySpecialCharacteristicsReportsPage />,
		},
		*/
	];

	return (
		<TabLayout
			title={t('tabs.titles.specialCharacteristics')}
			tabs={tabs}
			defaultValue={currentTab}
			onValueChange={setCurrentTab}
		/>
	);
};

export default SpecialCharacteristicsTabNavigation;
