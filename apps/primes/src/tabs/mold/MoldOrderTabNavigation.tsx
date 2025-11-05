import React, { useState, useEffect } from 'react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton, DraggableDialog } from '@radix-ui/components';
import { List, PlusCircle } from 'lucide-react';
import { Plus, Table, FileText } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
import { MoldOrderMasterDto, MoldOrderDetailDto } from '@primes/types/mold';

import MoldOrderRelatedListPage from '@primes/pages/mold/mold-order/MoldOrderRelatedListPage';
import MoldOrderListPage from '@primes/pages/mold/mold-order/MoldOrderListPage';
import { MoldOrderDetailEditForm } from '@primes/pages/mold/components/MoldOrderDetailEditForm';
import { MoldIngoingListPage } from '@primes/pages/mold/mold-ingoing/MoldIngoingListPage';

interface TabNavigationProps {
	activetab?: string;
}

const MoldOrderTabNavigation: React.FC<TabNavigationProps> = ({
	activetab,
}) => {
	const { t: tCommon } = useTranslation('common');
	const { t } = useTranslation('dataTable');
	const navigate = useNavigate();
	const [currentTab, setCurrentTab] = useState<string>(
		activetab || 'related-list'
	);

	// 상세 수정 모달 상태
	const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
	const [editingDetail, setEditingDetail] = useState<MoldOrderDetailDto | null>(null);

	// 상세 추가 모달 상태
	const [openDetailAddModal, setOpenDetailAddModal] = useState<boolean>(false);
	const [selectedMasterId, setSelectedMasterId] = useState<number | null>(null);

	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.includes('/mold/orders/related-list')) {
			setCurrentTab('related-list');
		} else if (pathname.includes('/mold/orders/list')) {
			setCurrentTab('list');
		} else if (pathname.includes('/mold/orders/ingoing-list')) {
			setCurrentTab('ingoing-list');
		}
	}, [location.pathname]);

	// 페이지 이동 핸들러 (수정용)
	const handleEditClick = (item: MoldOrderMasterDto) => {
		// state로 데이터를 직접 전달
		navigate('/mold/orders/register', {
			state: {
				mode: 'edit',
				masterData: item
			}
		});
	};

	// 상세 수정 모달 핸들러
	const handleOpenDetailEditModal = (detail: MoldOrderDetailDto) => {
		setEditingDetail(detail);
		setOpenDetailModal(true);
	};

	const handleCloseDetailModal = () => {
		setOpenDetailModal(false);
		setEditingDetail(null);
	};

	// 상세 추가 모달 핸들러
	const handleOpenDetailAddModal = () => {
		setOpenDetailAddModal(true);
	};

	const handleCloseDetailAddModal = () => {
		setOpenDetailAddModal(false);
	};

	// Tab 아이템 정의 - 등록 관련 탭들은 제거하고 목록 탭들만 유지
	const tabs: TabItem[] = [
		{
			id: 'related-list',
			icon: <Table size={16} />,
			label: tCommon('pages.mold.orders.relatedList'),
			to: '/mold/orders/related-list',
			content: <MoldOrderRelatedListPage 
				onEditClick={handleEditClick} 
			/>,
		},
		{
			id: 'list',
			icon: <FileText size={16} />,
			label: tCommon('pages.mold.orders.list'),
			to: '/mold/orders/list',
			content: <MoldOrderListPage onEditClick={handleEditClick} />,
		},
		{
			id: 'ingoing-list',
			icon: <FileText size={16} />,
			label: tCommon('pages.mold.ingoing.list.title', '입고 현황'),
			to: '/mold/orders/ingoing-list',
			content: <MoldIngoingListPage />,
		}
	];

	const RegisteButton = () => {
		const navigate = useNavigate();

		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
					onClick={() => navigate('/mold/orders/register')}
				>
					<Plus size={16} />
					{t('tabs.register')}
				</RadixIconButton>
			</div>
		);
	};

	const IngoingRegisteButton = () => {
		const navigate = useNavigate();

		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
					onClick={() => navigate('/mold/orders/ingoing-register')}
				>
					<Plus size={16} />
					{t('tabs.register')}
				</RadixIconButton>
			</div>
		);
	};

	const SetActionButton = (tab: string) => {
		switch (tab) {
			case 'ingoing-list':
				return <IngoingRegisteButton />;
			default:
				return <RegisteButton />;
		}
	};

	return (
		<>

			{/* 상세 수정 모달 */}
			<DraggableDialog
				open={openDetailModal}
				onOpenChange={setOpenDetailModal}
				title={tCommon('pages.mold.orders.editDetail')}
				content={
					<MoldOrderDetailEditForm
						detail={editingDetail}
						onClose={handleCloseDetailModal}
						onSuccess={() => {
							// 상세 데이터 수정 성공 시 처리
							console.log('Detail updated successfully');
							// 모달 닫기
							handleCloseDetailModal();
							// RelatedListPage에 새로고침 신호 전달
							// (이 부분은 RelatedListPage에서 직접 처리하도록 수정)
						}}
					/>
				}
			/>

			{/* 상세 추가 모달 */}
			<DraggableDialog
				open={openDetailAddModal}
				onOpenChange={setOpenDetailAddModal}
				title={tCommon('pages.mold.orders.addDetail')}
				content={
					<div className="max-w-2xl">
						<MoldOrderDetailEditForm
							detail={null} // 새로 추가할 상세 데이터
							moldOrderMasterId={selectedMasterId || undefined}
							onClose={handleCloseDetailAddModal}
							onSuccess={() => {
								// 상세 데이터 추가 성공 시 처리
								console.log('Detail added successfully');
								// 모달 닫기
								handleCloseDetailAddModal();
								// RelatedListPage에 새로고침 신호 전달
								// (이 부분은 RelatedListPage에서 직접 처리하도록 수정)
							}}
						/>
					</div>
				}
			/>

			<TabLayout
				title={tCommon('pages.mold.orders.management')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default MoldOrderTabNavigation;
