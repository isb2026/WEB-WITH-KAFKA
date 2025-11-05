import React, { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, FilePlus, Settings } from 'lucide-react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import QualityCertificateGeneratePage from '@primes/pages/quality/certificate/QualityCertificateGeneratePage';
import QualityCertificateListPage from '@primes/pages/quality/certificate/QualityCertificateListPage';
import QualityCertificateTemplatePage from '@primes/pages/quality/certificate/QualityCertificateTemplatePage';

// 페이지 구현 파일 사용

interface TabNavigationProps {
	activetab?: string;
}

const CertificateTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const { t } = useTranslation('common');
	const navigate = useNavigate();
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/quality/certificate/list')) {
			setCurrentTab('list');
		} else if (pathname.includes('/quality/certificate/generate')) {
			setCurrentTab('generate');
		} else if (pathname.includes('/quality/certificate/template')) {
			setCurrentTab('template');
		}
	}, [location.pathname]);

	const tabs: TabItem[] = [
		{
			id: 'list',
			icon: <FileText size={16} />,
			label: t('tabs.labels.list'),
			to: '/quality/certificate/list',
			content: <QualityCertificateListPage />,
		},
		{
			id: 'generate',
			icon: <FilePlus size={16} />,
			label: t('tabs.labels.generate'),
			to: '/quality/certificate/generate',
			content: <QualityCertificateGeneratePage />,
		},
		{
			id: 'template',
			icon: <Settings size={16} />,
			label: t('tabs.labels.template'),
			to: '/quality/certificate/template',
			content: <QualityCertificateTemplatePage />,
		},
	];

	const SetActionButton = (tab: string) => {
		// 성적서는 특별한 액션 버튼이 필요하지 않음 (각 탭에서 자체 처리)
		return null;
	};

	return (
		<TabLayout
			title={t('tabs.titles.certificate')}
			tabs={tabs}
			defaultValue={currentTab}
			buttonSlot={SetActionButton(currentTab)}
			onValueChange={setCurrentTab}
		/>
	);
};

export default CertificateTabNavigation;
