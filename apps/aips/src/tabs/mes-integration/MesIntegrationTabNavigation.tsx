import React, { useState, useEffect } from 'react';
import { RadixIconButton } from '@radix-ui/components';
import { Table, Code, RefreshCw, Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { TabItem } from '@aips/templates/TabTemplate';
import TabLayout from '@aips/layouts/TabLayout';
import { TableMappingPage } from '@aips/pages/mes-integration/table-mapping';
import { CodeConversionPage } from '@aips/pages/mes-integration/code-conversion';
import { DataSyncPage } from '@aips/pages/mes-integration/data-sync';
import { DraggableDialog } from '@repo/radix-ui/components';

interface TabNavigationProps {
	activetab?: string;
}

const MesIntegrationTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'table-mapping'
	);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();
	const { t } = useTranslation('common');

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/aips/mes-integration/table-mapping')) {
			setCurrentTab('table-mapping');
		} else if (pathname.includes('/aips/mes-integration/code-conversion')) {
			setCurrentTab('code-conversion');
		} else if (pathname.includes('/aips/mes-integration/data-sync')) {
			setCurrentTab('data-sync');
		}
	}, [location.pathname]);

	// Tab items definition
	const tabs: TabItem[] = [
		{
			id: 'table-mapping',
			icon: <Table size={16} />,
			label: '테이블 매핑',
			to: '/aips/mes-integration/table-mapping',
			content: <TableMappingPage />,
		},
		{
			id: 'code-conversion',
			icon: <Code size={16} />,
			label: '코드 변환',
			to: '/aips/mes-integration/code-conversion',
			content: <CodeConversionPage />,
		},
		{
			id: 'data-sync',
			icon: <RefreshCw size={16} />,
			label: '데이터 동기화',
			to: '/aips/mes-integration/data-sync',
			content: <DataSyncPage />,
		},
	];

	// Register button as button slot
	const RegisterButton = () => {
		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
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
				title={`MES 통합 설정 ${t('tabs.actions.register')}`}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							새로운 MES 통합 설정을 등록합니다.
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
				title="MES 통합 설정"
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={<RegisterButton />}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default MesIntegrationTabNavigation;
