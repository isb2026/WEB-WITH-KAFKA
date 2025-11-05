import React, { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import { useNavigate, useLocation } from 'react-router-dom';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { AlertCircle, BarChart3, Plus } from 'lucide-react';
import { RadixIconButton } from '@radix-ui/components';
import { DraggableDialog } from '@repo/radix-ui/components';

// Page imports - 불량관리 관련 페이지들
import ProductionQualityDefectsListPage from '@primes/pages/production/quality/ProductionQualityDefectsListPage';
import ProductionDefectsAnalysisPage from '@primes/pages/production/quality/ProductionDefectsAnalysisPage';
import ProductionQualityDefectsRegisterPage from '@primes/pages/production/quality/ProductionQualityDefectsRegisterPage';

interface ProductionDefectsTabNavigationProps {
	activetab?: string;
}

const ProductionDefectsTabNavigation: React.FC<
	ProductionDefectsTabNavigationProps
> = ({ activetab }) => {
	const { t } = useTranslation('common');
	const navigate = useNavigate();
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'status');
	const location = useLocation();
	const [openRegisterModal, setOpenRegisterModal] = useState(false);

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/production/defects/status')) {
			setCurrentTab('status');
		} else if (pathname.includes('/production/defects/analysis')) {
			setCurrentTab('analysis');
		}
	}, [location.pathname]);

	const tabs: TabItem[] = [
		{
			id: 'status',
			icon: <AlertCircle size={16} />,
			label: '불량 현황',
			to: '/production/defects/status',
			content: <ProductionQualityDefectsListPage />,
		},
		{
			id: 'analysis',
			icon: <BarChart3 size={16} />,
			label: '불량률 분석',
			to: '/production/defects/analysis',
			content: <ProductionDefectsAnalysisPage />,
		},
	];

	// 등록 버튼
	const RegisterButton = () => {
		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					onClick={() => setOpenRegisterModal(true)}
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
				>
					<Plus size={16} />
					불량 신고
				</RadixIconButton>
			</div>
		);
	};

	// 탭별 액션 버튼 설정
	const SetActionButton = (tab: string) => {
		switch (tab) {
			case 'status':
				return <RegisterButton />; // 불량 현황에서만 등록 버튼 활성화
			case 'analysis':
				return null; // 분석 탭에서는 등록 버튼 비활성화
			default:
				return null;
		}
	};

	// 불량 신고 저장 처리
	const handleSaveDefect = (data: any) => {
		console.log('불량 신고 저장:', data);
		// 실제로는 API 호출하여 저장
		setOpenRegisterModal(false);
	};

	return (
		<>
			<DraggableDialog
				open={openRegisterModal}
				onOpenChange={setOpenRegisterModal}
				title="불량 신고 등록"
				content={
					<ProductionQualityDefectsRegisterPage
						mode="create"
						onClose={() => setOpenRegisterModal(false)}
						onSave={handleSaveDefect}
					/>
				}
			/>

			<TabLayout
				title="불량 관리"
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default ProductionDefectsTabNavigation;
