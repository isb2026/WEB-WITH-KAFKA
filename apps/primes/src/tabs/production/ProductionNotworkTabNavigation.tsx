import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { Clock, BarChart3, Plus } from 'lucide-react';
import { RadixIconButton, DraggableDialog } from '@repo/radix-ui/components';

// Page imports
import { ProductionNotworkMasterDetailPage } from '@primes/pages/production/notwork/ProductionNotworkMasterDetailPage';
import ProductionNotworkAnalysisPage from '@primes/pages/production/notwork/ProductionNotworkAnalysisPage';
import { ProductionNotworkRegisterPage } from '@primes/pages/production/notwork/ProductionNotworkRegisterPage';

interface ProductionNotworkTabNavigationProps {
	activetab?: string;
}

const ProductionNotworkTabNavigation: React.FC<
	ProductionNotworkTabNavigationProps
> = ({ activetab }) => {
	const { t } = useTranslation('common');
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'status');
	const location = useLocation();
	const [openRegisterModal, setOpenRegisterModal] = useState(false);

	useEffect(() => {
		const pathname = location.pathname;
		if (
			pathname.includes('/production/notwork/related-list') ||
			pathname.includes('/production/notwork/status')
		) {
			setCurrentTab('status');
		} else if (pathname.includes('/production/notwork/analysis')) {
			setCurrentTab('analysis');
		}
	}, [location.pathname]);

	const tabs: TabItem[] = [
		{
			id: 'status',
			icon: <Clock size={16} />,
			label: '비가동 현황',
			to: '/production/notwork/related-list',
			content: <ProductionNotworkMasterDetailPage />,
		},
		{
			id: 'analysis',
			icon: <BarChart3 size={16} />,
			label: '다운타임 분석',
			to: '/production/notwork/analysis',
			content: <ProductionNotworkAnalysisPage />,
		},
	];

	const RegisterButton = () => (
		<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
			<RadixIconButton
				className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
				onClick={() => setOpenRegisterModal(true)}
			>
				<Plus size={16} />
				비가동 등록
			</RadixIconButton>
		</div>
	);

	// 탭별 액션 버튼 설정
	const SetActionButton = (tab: string) => {
		switch (tab) {
			case 'status':
				return <RegisterButton />; // 비가동 현황에서만 등록 버튼 활성화
			case 'analysis':
				return null; // 분석 탭에서는 등록 버튼 비활성화
			default:
				return null;
		}
	};

	return (
		<>
			<DraggableDialog
				open={openRegisterModal}
				onOpenChange={setOpenRegisterModal}
				title={t('tabs.actions.register')}
				content={
					<ProductionNotworkRegisterPage
						mode="create"
						type="master"
						onSubmit={(data) => {
							console.log('Register data:', data);
							setOpenRegisterModal(false);
						}}
						onClose={() => setOpenRegisterModal(false)}
					/>
				}
			/>
			<TabLayout
				title={t('tabs.titles.notworkManagement')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default ProductionNotworkTabNavigation;
