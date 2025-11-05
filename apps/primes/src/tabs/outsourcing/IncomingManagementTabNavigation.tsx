import React, { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import { useLocation, useNavigate } from 'react-router-dom';
import { TabItem } from '@primes/templates/TabTemplate';
import TabLayout from '@primes/layouts/TabLayout';
import { InReadyLotListPage } from '@primes/pages/outsourcing/inoutgoing/InReadyLotListPage';
import { IncomingListPage } from '@primes/pages/outsourcing/inoutgoing/IncomingListPage';
import { Clock, BarChart3, Plus } from 'lucide-react';
import { RadixIconButton } from '@repo/radix-ui/components';

interface IncomingManagementTabNavigationProps {
	activetab?: string;
}

const IncomingManagementTabNavigation: React.FC<IncomingManagementTabNavigationProps> = ({
	activetab,
}) => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const navigate = useNavigate();
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'ready'
	);
	
	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/outsourcing/incoming/ready')) {
			setCurrentTab('ready');
		} else if (pathname.includes('/outsourcing/incoming/status')) {
			setCurrentTab('status');
		}
	}, [location.pathname]);

	const RegisterButton = () => {
		const handleRegister = () => {
			// 대기 페이지의 등록 모달을 열도록 이벤트 전달
			const readyPageElement = document.querySelector('[data-ready-page]');
			if (readyPageElement) {
				const event = new CustomEvent('openRegisterModal');
				readyPageElement.dispatchEvent(event);
			}
		};

		// 대기 탭에서만 등록 버튼 표시
		if (currentTab !== 'ready') {
			return null;
		}

		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
					onClick={handleRegister}
				>
					<Plus size={16} />
						{tCommon('pages.outsourcing.register')}
				</RadixIconButton>
			</div>
		);
	};

	const tabs: TabItem[] = [
		{
			id: 'ready',
			icon: <Clock size={16} />,
			label: tCommon('tabs.labels.outsourcingInReadyLot'),
			to: '/outsourcing/incoming/ready',
			content: <InReadyLotListPage />,
		},
		{
			id: 'status',
			icon: <BarChart3 size={16} />,
			label: tCommon('tabs.labels.outsourcingIncoming'),
			to: '/outsourcing/incoming/status',
			content: <IncomingListPage />,
		},
	];

	return (
		<TabLayout
			title={tCommon('menu:outsourcing_incoming_management')}
			tabs={tabs}
			defaultValue={currentTab}
			onValueChange={setCurrentTab}
			buttonSlot={<RegisterButton />}
		/>
	);
};

export default IncomingManagementTabNavigation;
