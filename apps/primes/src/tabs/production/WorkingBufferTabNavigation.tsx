import React, { useState, useEffect } from 'react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@radix-ui/components';
import { Plus, Table, TableProperties } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { DraggableDialog } from '@repo/radix-ui/components';
import { ProductionWorkingBufferListPage } from '@primes/pages/production/working-buffer/ProductionWorkingBufferListPage'
import { ProductionWorkingBufferRegisterPage } from '@primes/pages/production/working-buffer/ProductionWorkingBufferRegisterPage'

interface TabNavigationProps {
	activetab?: string;
}

const WorkingBufferTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const [currentTab, setCurrentTab] = useState<string>(activetab || 'list');
	const [openModal, setOpenModal] = useState<boolean>(false);
	const location = useLocation();

		useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/production/working-buffer/list')) {
			setCurrentTab('list');
		}
	}, [location.pathname]);

	// Tab 아이템 정의
	const tabs: TabItem[] = [
		{
			id: 'list',
			icon: <TableProperties size={16} />,
			label: '현황',
			to: '/production/working-buffer/list',
			content: <ProductionWorkingBufferListPage />,
		},
	];

	const RegisteButton = () => {
		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
					onClick={() => setOpenModal(true)}
				>
					<Plus size={16} />
					등록
				</RadixIconButton>
			</div>
		);
	};

	const SetActionButton = (tab: string) => {
		switch (tab) {
			default:
				return <RegisteButton />;
		}
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title="working-buffer 관리 등록"
				content={
					<ProductionWorkingBufferRegisterPage
						onClose={() => setOpenModal(false)}
					/>
				}
			/>
			<TabLayout
				title="working-buffer 관리"
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default WorkingBufferTabNavigation;
