import React, { useState, useMemo } from 'react';
import {
	useFullBomTree,
	useMbomCreate,
	useMbomUpdate,
	useMbomDelete,
	useMbomListByRootItem,
} from '@primes/hooks/ini/useMbom';
import { useItem } from '@primes/hooks';
import { PageTemplate } from '@primes/templates/PageTemplate';
import { Package } from 'lucide-react';
import { RadixIconButton } from '@repo/radix-ui/components';
import {
	MbomCreateRequest,
	MbomUpdateRequest,
	RootItemTreeDto,
	MbomListDto,
} from '@primes/types/ini/mbom';
import { ItemDto } from '@primes/types/item';
import { toast } from 'sonner';

// 분리된 컴포넌트들 import
import { RootItemsPanel } from './panels/RootItemsPanel';
import { BomDetailPanel, BomDetailItem } from './panels/BomDetailPanel';
import {
	MaterialRegistrationModal,
	MaterialEditModal,
	RootProductRegistrationModal,
} from './register';

export const IniItemBomStatusPage: React.FC = () => {
	// 상태 관리
	const [selectedRootItem, setSelectedRootItem] =
		useState<RootItemTreeDto | null>(null);
	const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
	const [bomDetailSelectedRows, setBomDetailSelectedRows] = useState<
		Set<string>
	>(new Set());

	// 모달 상태
	const [isRootProductModalOpen, setIsRootProductModalOpen] = useState(false);
	const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
	const [isMaterialEditModalOpen, setIsMaterialEditModalOpen] =
		useState(false);
	const [selectedItemsForEdit, setSelectedItemsForEdit] = useState<
		BomDetailItem[]
	>([]);

	// API 훅들
	const { data: fullBomTreeData, loading, error, refetch } = useFullBomTree();
	const { createMbom } = useMbomCreate();
	const { updateMbom } = useMbomUpdate();
	const { deleteMbom } = useMbomDelete();
	const { data: bomDetailData, refetch: refetchBomDetail } =
		useMbomListByRootItem(selectedRootItem?.rootItemId || null);

	// 제품 목록 조회
	const { list: itemListData } = useItem({
		page: 0,
		size: 100,
		searchRequest: {},
	});

	// 데이터 가공
	const rootItems = useMemo(() => {
		if (!fullBomTreeData?.rootItems) return [];
		return fullBomTreeData.rootItems;
	}, [fullBomTreeData]);

	const productOptions = useMemo(() => {
		if (!itemListData?.data) return [];

		const items = itemListData.data.content || itemListData.data;
		if (!Array.isArray(items)) return [];

		return items
			.filter((item: ItemDto) => item.itemNumber && item.itemName) // 빈 값 필터링
			.map((item: ItemDto) => ({
				label: `${item.itemNumber} - ${item.itemName}`,
				value: item.id.toString(),
			}));
	}, [itemListData]);

	const bomDetails: BomDetailItem[] = useMemo(() => {
		if (!bomDetailData || !Array.isArray(bomDetailData)) return [];

		return bomDetailData.map((item: MbomListDto) => {
			return {
				id: item.id,
				mbomId: item.id,
				itemId: item.itemId,
				itemName: item.item?.itemName || '',
				itemCode: item.item?.itemNumber || '',
				itemSpec: item.item?.itemSpec || '',
				parentProgressName: item.parentProgress?.progressName || '',
				itemProgressName: item.itemProgress?.progressName || '',
				processName:
					item.itemProgress?.progressName || item.parentProgress?.progressName || '',
				inputNum: item.inputNum || 0,
				inputUnit: item.inputUnit || '',
				path: item.path || '',
				depth: item.depth || 0,
				isRoot: item.isRoot || false, // 루트 제품 여부
			};
		});
	}, [bomDetailData]);

	// 이벤트 핸들러들
	const handleRootItemSelect = (item: RootItemTreeDto) => {
		setSelectedRootItem(item);
		setSelectedRows(new Set());
	};

	const handleRootProductSubmit = async (
		createRequest: MbomCreateRequest
	) => {
		const result = await createMbom([createRequest]);
		if (result) {
			refetch();
		}
	};

	const handleMaterialSubmit = async (createRequest: MbomCreateRequest) => {
		const result = await createMbom([createRequest]);
		if (result) {
			refetch();
			refetchBomDetail();
		}
	};

	const handleMaterialEdit = (selectedItems: BomDetailItem[]) => {
		setSelectedItemsForEdit(selectedItems);
		setIsMaterialEditModalOpen(true);
	};

	const handleMaterialEditSubmit = async (
		updateRequests: { id: number; data: MbomUpdateRequest }[]
	) => {
		try {
			// 각 아이템별로 수정 API 호출
			for (const request of updateRequests) {
				await updateMbom(request.id, request.data);
			}
			toast.success(
				`${updateRequests.length}개 투입품이 성공적으로 수정되었습니다.`
			);
			refetch();
			refetchBomDetail();
			setBomDetailSelectedRows(new Set()); // 선택 초기화
		} catch (error) {
			console.error('투입품 수정 실패:', error);
			toast.error('투입품 수정 중 오류가 발생했습니다.');
		}
	};

	const handleMaterialDelete = async (selectedItems: BomDetailItem[]) => {
		try {
			const confirmed = window.confirm(
				`선택된 ${selectedItems.length}개 투입품을 삭제하시겠습니까?\n\n` +
					selectedItems
						.map((item) => `- ${item.itemCode}: ${item.itemName}`)
						.join('\n')
			);

			if (!confirmed) return;

			// MBOM ID 기준으로 삭제 (API에서 요구하는 ID)
			const idsToDelete = selectedItems.map((item) => item.mbomId);

			try {
				// 삭제 API 호출 - 배열로 전달
				const result = await deleteMbom(idsToDelete);

				if (result) {
					toast.success(
						`${selectedItems.length}개 투입품이 성공적으로 삭제되었습니다.`
					);
					refetch();
					refetchBomDetail();
					setBomDetailSelectedRows(new Set()); // 선택 초기화
				}
			} catch (apiError) {
				// 배열 삭제 실패 시 개별 삭제 시도
				console.warn('일괄 삭제 실패, 개별 삭제 시도:', apiError);

				let successCount = 0;
				let failCount = 0;

				for (const id of idsToDelete) {
					try {
						await deleteMbom([id]);
						successCount++;
					} catch (individualError) {
						console.error(`ID ${id} 삭제 실패:`, individualError);
						failCount++;
					}
				}

				if (successCount > 0) {
					toast.success(
						`${successCount}개 투입품이 삭제되었습니다.${failCount > 0 ? ` (${failCount}개 실패)` : ''}`
					);
					refetch();
					refetchBomDetail();
					setBomDetailSelectedRows(new Set());
				} else {
					throw new Error('모든 삭제 작업이 실패했습니다.');
				}
			}
		} catch (error) {
			console.error('투입품 삭제 실패:', error);
			toast.error('투입품 삭제 중 오류가 발생했습니다.');
		}
	};

	// 로딩 상태
	if (loading) {
		return (
			<div className="h-full flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-Colors-Brand-700 mx-auto mb-4"></div>
					<p className="text-gray-600">BOM 데이터를 불러오는 중...</p>
				</div>
			</div>
		);
	}

	// 에러 상태
	if (error) {
		return (
			<div className="h-full flex items-center justify-center">
				<div className="text-center">
					<Package className="mx-auto h-16 w-16 text-red-300 mb-4" />
					<h4 className="text-lg font-medium text-red-700 mb-2">
						데이터 로드 실패
					</h4>
					<p className="text-red-500 mb-4">{error}</p>
					<RadixIconButton
						onClick={() => refetch()}
						className="bg-Colors-Brand-700 text-white hover:bg-Colors-Brand-800"
					>
						다시 시도
					</RadixIconButton>
				</div>
			</div>
		);
	}

	return (
		<>
			{/* 완제품 등록 모달 */}
			<RootProductRegistrationModal
				isOpen={isRootProductModalOpen}
				onClose={() => setIsRootProductModalOpen(false)}
				productOptions={productOptions}
				onSubmit={handleRootProductSubmit}
			/>

			{/* 투입품 등록 모달 */}
			<MaterialRegistrationModal
				isOpen={isMaterialModalOpen}
				onClose={() => setIsMaterialModalOpen(false)}
				selectedRootItem={selectedRootItem}
				productOptions={productOptions}
				onSubmit={handleMaterialSubmit}
			/>

			{/* 투입품 수정 모달 */}
			<MaterialEditModal
				isOpen={isMaterialEditModalOpen}
				onClose={() => {
					setIsMaterialEditModalOpen(false);
					setSelectedItemsForEdit([]);
				}}
				selectedRootItem={selectedRootItem}
				selectedItems={selectedItemsForEdit}
				productOptions={productOptions}
				onSubmit={handleMaterialEditSubmit}
			/>

			{/* 메인 레이아웃 */}
			<PageTemplate splitterSizes={[25, 75]} splitterMinSize={[200, 500]}>
				<RootItemsPanel
					rootItems={rootItems}
					selectedRows={selectedRows}
					onRootItemSelect={handleRootItemSelect}
					onRegisterClick={() => setIsRootProductModalOpen(true)}
					setSelectedRows={setSelectedRows}
				/>
				<BomDetailPanel
					selectedRootItem={selectedRootItem}
					bomDetails={bomDetails}
					onMaterialRegisterClick={() => setIsMaterialModalOpen(true)}
					onMaterialEditClick={handleMaterialEdit}
					onMaterialDeleteClick={handleMaterialDelete}
					selectedRows={bomDetailSelectedRows}
					onRowSelectionChange={setBomDetailSelectedRows}
				/>
			</PageTemplate>
		</>
	);
};
