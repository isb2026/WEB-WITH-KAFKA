import React, { useState, useEffect } from 'react';
import { RadixIconButton } from '@radix-ui/components';
import { Plus, Calendar, Settings, Building } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { TabItem } from '@aips/templates/TabTemplate';
import TabLayout from '@aips/layouts/TabLayout';
import { DraggableDialog } from '@repo/radix-ui/components';
import { MachineMasterPage } from '@aips/pages/resource-data';
import WorkCenterSchedulePage from '@aips/pages/resource-data/work-center';
import WorkCalendarPage from '@aips/pages/resource-data/work-calendar';

interface TabNavigationProps {
	activetab?: string;
}

const ResourceDataTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'product'
	);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();
	const { t } = useTranslation('common');

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/aips/resource/machine-master')) {
			setCurrentTab('machine');
		} else if (pathname.includes('/aips/resource/work-center-management')) {
			setCurrentTab('work-center');
		} else if (pathname.includes('/aips/resource/work-calendar')) {
			setCurrentTab('work-calendar');
		}
	}, [location.pathname]);

	// Tab items definition
	const tabs: TabItem[] = [
		{
			id: 'machine',
			icon: <Settings size={16} />,
			label: 'Machine Master',
			to: '/aips/resource/machine-master',
			content: <MachineMasterPage />,
		},
		{
			id: 'work-center',
			icon: <Building size={16} />,
			label: 'Work Center',
			to: '/aips/resource/work-center-management',
			content: <WorkCenterSchedulePage />,
		},
		{
			id: 'work-calendar',
			icon: <Calendar size={16} />,
			label: 'Work Calendar',
			to: '/aips/resource/work-calendar',
			content: <WorkCalendarPage />,
		},
	];

	// Register button as button slot
	const RegisterButton = () => {
		switch (currentTab) {
			case 'work-center':
				return null;
			default:
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
		}
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={`기준정보 ${t('tabs.actions.register')}`}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							새로운 기준정보를 등록합니다.
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
				title="기준정보 관리"
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={<RegisterButton />}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default ResourceDataTabNavigation;
