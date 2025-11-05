import React, { useState, useMemo } from 'react';
import {
	TreeView,
	TreeNode,
	TreeViewClassNames,
} from '@repo/radix-ui/components';
import {
	RadixIconButton,
	TooltipProvider,
	TooltipRoot,
	TooltipTrigger,
	TooltipContent,
} from '@repo/radix-ui/components';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';

// TreeNode 타입 확장
interface ExtendedTreeNode extends TreeNode {
	data?: ProcessTreeNodeDto | RootItemDto | RootItemTreeDto | any;
}
import {
	Package,
	Atom,
	ChevronDown,
	Settings,
	Plus,
	Trash2,
	HelpCircle,
} from 'lucide-react';
import { PageTemplate } from '@primes/templates/PageTemplate';
import { DraggableDialog } from '@repo/radix-ui/components';
import {
	MbomCreateRequest,
	ProcessTreeNodeDto,
	RootItemDto,
	RootItemTreeDto,
	ProcessNodeDto,
	InputItemDto,
	ProductInfoDto,
} from '@primes/types/ini/mbom';
import {
	useFullBomTree,
	useMbomCreate,
	useMbomDelete,
	useCanAddRelation,
} from '@primes/hooks/ini/useMbom';
import { useTranslation } from '@repo/i18n';
import { toast } from 'sonner';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { useItem } from '@primes/hooks';
import type { ItemDto } from '@primes/types/item';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { CodeSelectComponent } from '@primes/components/customSelect/CodeSelectComponent';

export const IniItemBomListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();
	const [expandedNodeIds, setExpandedNodeIds] = useState<string[]>([]);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [selectedMaterialRows, setSelectedMaterialRows] = useState<
		Set<string>
	>(new Set());
	const [materialSearchParams, setMaterialSearchParams] = useState<
		Record<string, string>
	>({});
	const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
	const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
	const [openDeleteMaterialDialog, setOpenDeleteMaterialDialog] =
		useState<boolean>(false);
	const [isRootProductModalOpen, setIsRootProductModalOpen] =
		useState<boolean>(false);
	const [openDeleteRootDialog, setOpenDeleteRootDialog] =
		useState<boolean>(false);

	// API 훅 사용 - 전체 BOM 트리 조회
	const { data: fullBomTreeData, loading, error, refetch } = useFullBomTree();
	const { error: createError } = useMbomCreate();

	// 제품 목록 조회 (루트 제품 등록용)
	const { list: itemListData } = useItem({
		page: 0,
		size: 100, // 충분한 수의 제품을 가져옴
		searchRequest: {},
	});

	// 제품 옵션 생성
	const productOptions = useMemo(() => {
		if (!itemListData?.data) return [];

		// 페이지네이션 응답 처리
		const items = itemListData.data.content || itemListData.data;
		if (!Array.isArray(items)) return [];

		return items.map((item: ItemDto) => ({
			label: `${item.itemNumber} - ${item.itemName}`,
			value: item.id.toString(),
		}));
	}, [itemListData]);

	// 루트 제품 등록 폼 스키마
	const rootProductFormSchema: FormField[] = [
		{
			name: 'productId',
			label: '제품 선택',
			type: 'select',
			required: true,
			placeholder: '제품을 선택하세요',
			options: productOptions,
		},
	];

	// 투입품 등록 폼 스키마 (간소화된 버전)
	const materialFormSchema: FormField[] = [
		{
			name: 'itemId',
			label: '투입 자재',
			type: 'select',
			required: true,
			placeholder: '투입할 자재를 선택하세요',
			options: productOptions,
		},
		{
			name: 'inputNum',
			label: '투입량',
			type: 'number',
			required: true,
			defaultValue: 1,
		},
		{
			name: 'inputUnit',
			label: '단위',
			type: 'codeSelect',
			required: true,
			fieldKey: 'PRD-006',
			placeholder: '단위를 선택하세요',
		},
	];

	/**
	 * 전체 BOM 트리를 TreeView용 노드로 변환
	 */
	const convertToTreeNodes = (
		rootItems: RootItemTreeDto[]
	): ExtendedTreeNode[] => {
		return rootItems.map((rootItem) => ({
			id: `root-${rootItem.rootItemId}`,
			label: rootItem.productInfo.itemName,
			icon: <Package className="h-4 w-4 text-blue-600" />,
			disabled: false,
			children: convertProcessesToTreeNodes(
				rootItem.processTree,
				rootItem.rootItemId
			),
			data: {
				...rootItem,
				nodeType: 'ROOT',
				rootItemName: rootItem.productInfo.itemName, // 호환성 유지
			},
		}));
	};

	/**
	 * 공정 목록을 TreeView용 노드로 변환
	 */
	const convertProcessesToTreeNodes = (
		processes: ProcessNodeDto[],
		rootItemId: number
	): ExtendedTreeNode[] => {
		return processes.map((process) => ({
			id: `process-${process.progressId}`,
			label: process.progressName,
			icon: <Settings className="h-4 w-4 text-purple-600" />,
			disabled: false,
			children: convertInputItemsToTreeNodes(
				process.inputItems,
				rootItemId
			),
			data: {
				id: `process-${process.progressId}`,
				label: process.progressName,
				progressId: process.progressId,
				progressName: process.progressName,
				progressOrder: process.progressOrder.toString(),
				progressTypeName: process.progressTypeName,
				nodeType: 'PROCESS',
				path: process.path,
				hasChildren: process.inputItems.length > 0,
				childrenCount: process.inputItemCount,
				rootItemId: rootItemId, // ✅ rootItemId 추가!
				// 투입품을 children으로 변환
				children: process.inputItems.map((item) => ({
					id: `item-${item.mbomId}`,
					label: item.itemName,
					itemId: item.itemId,
					itemName: item.itemName,
					itemNumber: (item.productInfo as any)?.itemNumber, // ProductInfo에서 itemNumber 가져오기
					mbomId: item.mbomId,
					inputNum: item.inputNum,
					inputUnit: item.inputUnit,
					inputUnitCode: item.inputUnitCode,
					nodeType: 'ITEM',
					path: item.path,
					createdBy: item.createdBy,
					createdAt: item.createdAt,
					rootItemId: rootItemId, // ✅ 투입품에도 rootItemId 추가!
				})),
			} as any,
		}));
	};

	/**
	 * 투입품 목록을 TreeView용 노드로 변환
	 */
	const convertInputItemsToTreeNodes = (
		inputItems: InputItemDto[],
		rootItemId: number
	): ExtendedTreeNode[] => {
		return inputItems.map((item) => ({
			id: `item-${item.mbomId}`,
			label: item.itemName,
			icon: <Atom className="h-4 w-4 text-orange-600" />,
			disabled: false,
			children: undefined,
			data: {
				id: `item-${item.mbomId}`,
				label: item.itemName,
				itemId: item.itemId,
				itemName: item.itemName,
				itemNumber: (item.productInfo as any)?.itemNumber,
				itemNo: (item.productInfo as any)?.itemNo,
				itemSpec: (item.productInfo as any)?.itemSpec,
				mbomId: item.mbomId,
				inputNum: item.inputNum,
				inputUnit: item.inputUnit,
				inputUnitCode: item.inputUnitCode,
				nodeType: 'ITEM',
				path: item.path,
				createdBy: item.createdBy,
				createdAt: item.createdAt,
				rootItemId: rootItemId, // ✅ rootItemId 추가!
			} as any,
		}));
	};

	// TreeView 데이터 - 전체 BOM 트리에서 rootItems 사용
	const treeData = React.useMemo(() => {
		if (loading) return [];

		if (error || !fullBomTreeData?.rootItems) {
			// 에러가 있거나 데이터가 없을 때 빈 배열 반환
			return [];
		}

		const convertedTree = convertToTreeNodes(fullBomTreeData.rootItems);
		return convertedTree;
	}, [fullBomTreeData, loading, error]);

	// TreeView 스타일 설정
	const customClassNames: TreeViewClassNames = {
		root: 'space-y-1',
		item: 'transition-colors',
		leafItem: 'hover:text-Colors-Brand-700',
		selectedLeafItem:
			'text-Colors-Brand-600 font-medium bg-Colors-Brand-50 border-l-4 border-Colors-Brand-600',
		selectedItem:
			'text-Colors-Brand-600 font-medium bg-Colors-Brand-50 border-l-4 border-Colors-Brand-600',
		trigger:
			'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer w-full',
		content: 'pl-6 space-y-1',
		// 선택 가능한 노드 스타일
		selectableItem: 'cursor-pointer text-gray-900 transition-colors',
		selectableLeafItem: 'cursor-pointer text-gray-900 transition-colors',
		// 선택 불가능한 노드 스타일 (공정이 아닌 노드들)
		unselectableItem: 'cursor-not-allowed',
		unselectableLeafItem: 'cursor-not-allowed',
	};

	// 노드 클릭 핸들러
	const handleNodeClick = (node: ExtendedTreeNode) => {
		setSelectedNodeId(node.id);

		// 디버깅을 위한 로그 출력
		console.log('🎯 선택된 노드:', {
			nodeId: node.id,
			label: node.label,
			nodeType: node.data?.nodeType,
			rootItemId: node.data?.rootItemId,
			progressId: node.data?.progressId,
			itemId: node.data?.itemId,
			fullNodeData: node.data,
		});
	};

	// 선택된 노드에서 root 아이템 정보 추출
	const getSelectedRootItem = (): RootItemDto | null => {
		if (!selectedNodeId || !treeData) return null;

		// root 노드인지 확인 (root-로 시작하는 ID)
		if (selectedNodeId.startsWith('root-')) {
			// treeData에서 해당 노드 찾기
			const findNodeInTree = (
				nodes: ExtendedTreeNode[]
			): ExtendedTreeNode | null => {
				for (const node of nodes) {
					if (node.id === selectedNodeId) {
						return node;
					}
					if (node.children) {
						const found = findNodeInTree(node.children);
						if (found) return found;
					}
				}
				return null;
			};

			const selectedNode = findNodeInTree(treeData);

			if (selectedNode && selectedNode.data) {
				// RootItemTreeDto에서 RootItemDto로 변환
				const rootItemData = selectedNode.data as any;
				return {
					rootItemId: rootItemData.rootItemId,
					rootItemName:
						rootItemData.productInfo?.itemName ||
						rootItemData.rootItemName,
					processTree: rootItemData.processTree || [],
					totalProcessCount: rootItemData.totalProcessCount || 0,
					totalInputItemCount: rootItemData.totalInputItemCount || 0,
				} as RootItemDto;
			}
		}
		return null;
	};

	// 노드 확장/축소 핸들러
	const handleExpandToggle = (nodeId: string, expanded: boolean) => {
		setExpandedNodeIds((prev) => {
			if (expanded) {
				return [...prev, nodeId];
			} else {
				return prev.filter((id) => id !== nodeId);
			}
		});
	};

	// 선택 가능한 노드 필터 (공정과 루트 제품 선택 가능)
	const selectableNodeFilter = (node: ExtendedTreeNode) => {
		// ID가 process-로 시작하거나 nodeType이 PROCESS인 경우 선택 가능
		const nodeData = node.data as ProcessTreeNodeDto;
		const isProcess =
			node.id.startsWith('process-') || nodeData?.nodeType === 'PROCESS';
		// ID가 root-로 시작하는 경우도 선택 가능 (루트 제품)
		const isRootItem = node.id.startsWith('root-');

		return isProcess || isRootItem;
	};

	// 투입품(자재) 테이블 컬럼 정의
	const materialColumns = useMemo(
		() => [
			{
				accessorKey: 'itemNo',
				header: t('columns.itemNo'),
				size: 150,
				cell: ({ getValue }: { getValue: () => string }) => {
					const value = getValue();
					return value || '-';
				},
			},
			{
				accessorKey: 'itemNumber',
				header: t('columns.itemNumber'),
				size: 150,
				cell: ({ getValue }: { getValue: () => string }) => {
					const value = getValue();
					return value || '-';
				},
			},
			{
				accessorKey: 'itemName',
				header: t('columns.itemName'),
				size: 200,
				cell: ({ getValue }: { getValue: () => string }) => {
					const value = getValue();
					return value || '-';
				},
			},
			{
				accessorKey: 'itemSpec',
				header: t('columns.itemSpec'),
				size: 200,
				cell: ({ getValue }: { getValue: () => string }) => {
					const value = getValue();
					return value || '-';
				},
			},
			{
				accessorKey: 'inputNum',
				header: '투입량',
				size: 120,
				align: 'center',
				cell: ({ getValue }: { getValue: () => number }) => {
					const value = getValue();
					return value ? value.toLocaleString() : '0';
				},
			},
			{
				accessorKey: 'inputUnit',
				header: '단위',
				size: 100,
				align: 'center',
				cell: ({ getValue }: { getValue: () => string }) => {
					const value = getValue();
					return value || '-';
				},
			},
			{
				accessorKey: 'itemName',
				header: t('columns.itemName'),
				size: 200,
				cell: ({ getValue }: { getValue: () => string }) => {
					const value = getValue();
					return value || '-';
				},
			},
		],
		[t]
	);

	// 투입품 검색 필드 정의
	const materialSearchFields = useMemo(
		() => [
			{
				name: 'itemNumber',
				label: t('columns.itemNumber'),
				type: 'text',
				placeholder: '자재코드로 검색',
			},
			{
				name: 'itemName',
				label: t('columns.itemName'),
				type: 'text',
				placeholder: '자재명으로 검색',
			},
			{
				name: 'nodeType',
				label: '노드타입',
				type: 'select',
				placeholder: '노드타입 선택',
				options: [
					{ value: 'ITEM', label: 'ITEM' },
					{ value: 'MATERIAL', label: 'MATERIAL' },
				],
			},
		],
		[t]
	);

	// 투입품 생성 버튼 핸들러
	const handleCreateClick = () => {
		setModalMode('create');
		setSelectedMaterial(null); // 등록 모드에서는 선택된 데이터 초기화
		setIsCreateModalOpen(true);
	};

	// 루트 제품 등록 API 훅
	const { createMbom: createMbomApi } = useMbomCreate();

	// 투입품 삭제 API 훅
	const { deleteMbom: deleteMbomApi, loading: deleteLoading } =
		useMbomDelete();

	// BOM 관계 검증 API 훅
	const { checkCanAddRelation, loading: relationCheckLoading } =
		useCanAddRelation();

	// 루트 제품 등록 버튼 핸들러 (MasterPanel의 Plus 버튼)
	const handleRootProductCreate = () => {
		setIsRootProductModalOpen(true);
	};

	// 루트 제품 삭제 버튼 핸들러
	const handleRootProductDelete = () => {
		const selectedRootItem = getSelectedRootItem();
		if (selectedRootItem) {
			setOpenDeleteRootDialog(true);
		} else {
			toast.warning('삭제할 루트 제품을 선택해주세요.');
		}
	};

	// 루트 제품 삭제 확인 핸들러
	const handleRootProductDeleteConfirm = async () => {
		const selectedRootItem = getSelectedRootItem();
		if (selectedRootItem && selectedRootItem.rootItemId) {
			try {
				const success = await deleteMbomApi([
					Number(selectedRootItem.rootItemId),
				]);
				if (success) {
					toast.success('루트 제품이 삭제되었습니다.');
					setOpenDeleteRootDialog(false);
					setSelectedNodeId(undefined);
					// 트리 데이터 새로고침
					refetch();
				} else {
					throw new Error('루트 제품 삭제 실패');
				}
			} catch (error) {
				console.error('루트 제품 삭제 오류:', error);
				toast.error('루트 제품 삭제에 실패했습니다.');
			}
		} else {
			toast.warning('삭제할 루트 제품 정보가 없습니다.');
		}
	};

	// 투입품 수정 핸들러
	const handleMaterialEdit = () => {
		if (selectedMaterial) {
			setModalMode('edit');
			setIsCreateModalOpen(true);
		} else {
			toast.warning('수정할 투입품을 선택해주세요.');
		}
	};

	// 투입품 삭제 핸들러
	const handleMaterialDelete = () => {
		if (selectedMaterial) {
			setOpenDeleteMaterialDialog(true);
		} else {
			toast.warning('삭제할 투입품을 선택해주세요.');
		}
	};

	// 투입품 삭제 확인 핸들러
	const handleMaterialDeleteConfirm = async () => {
		if (selectedMaterial && selectedMaterial.id) {
			try {
				const success = await deleteMbomApi([
					Number(selectedMaterial.id),
				]);
				if (success) {
					toast.success('투입품이 삭제되었습니다.');
					setOpenDeleteMaterialDialog(false);
					setSelectedMaterial(null);
					// 트리 데이터 새로고침
					refetch();
				} else {
					throw new Error('투입품 삭제 실패');
				}
			} catch (error) {
				console.error('투입품 삭제 오류:', error);
				toast.error('투입품 삭제에 실패했습니다.');
			}
		} else {
			toast.warning('삭제할 투입품 정보가 없습니다.');
		}
	};

	// 루트 제품 등록 폼 컴포넌트
	const RootProductForm = () => {
		const handleSubmit = async (data: Record<string, unknown>) => {
			const productId = Number(data.productId);

			if (!productId) {
				toast.warning('제품을 선택해주세요.');
				return;
			}

			try {
				// 루트 제품의 경우 자기 자신을 참조하므로 특별한 검증은 생략
				// (필요시 나중에 추가 가능)

				// 루트 제품 등록: parentItemId는 null로 설정
				const rootProductRequest: MbomCreateRequest = {
					parentItemId: null, // 루트 제품은 부모가 없음
					itemId: productId,
					inputNum: 1, // 루트 제품의 기본 수량
					inputUnitCode: 'EA', // 기본 단위
				};

				const result = await createMbomApi([rootProductRequest]);

				if (result) {
					toast.success('루트 제품이 등록되었습니다.');
					// 트리 데이터 새로고침
					refetch();
					// 모달 닫기
					setIsRootProductModalOpen(false);
				} else {
					throw new Error('루트 제품 등록 실패');
				}
			} catch (error) {
				console.error('루트 제품 등록 오류:', error);
				toast.error('루트 제품 등록에 실패했습니다.');
			}
		};

		return (
			<div className="space-y-4">
				<DynamicForm
					fields={rootProductFormSchema}
					onSubmit={handleSubmit}
					submitButtonText="등록"
				/>
			</div>
		);
	};

	// 투입품 등록 폼 컴포넌트
	const CreateForm = () => {
		const isEditMode = modalMode === 'edit';

		// 초기 데이터 설정 - 수정 모드일 때만 선택된 데이터 사용
		const initialData = useMemo(() => {
			if (isEditMode && selectedMaterial) {
				return {
					itemId: selectedMaterial.itemId?.toString() || '',
					inputNum: selectedMaterial.inputNum || 1,
					inputUnit: selectedMaterial.inputUnitCode || 'EA', // 단위코드를 단위 필드에 설정
				};
			}
			// 등록 모드에서는 항상 빈 폼으로 시작
			return undefined;
		}, [isEditMode, selectedMaterial]);

		const handleSubmit = async (data: Record<string, unknown>) => {
			try {
				const selectedNode = selectedNodeId
					? findSelectedNode(selectedNodeId)
					: null;
				if (!selectedNode) {
					toast.warning('공정을 선택해주세요.');
					return;
				}

				const selectedNodeData =
					selectedNode.data as ProcessTreeNodeDto;

				// 선택된 단위 코드 가져오기
				const selectedUnitCode = data.inputUnit as string;

				// PROCESS 노드에서 rootItemId와 parentItemId를 찾는 로직
				let rootItemId = selectedNodeData.rootItemId;
				let parentItemId = selectedNodeData.parentItemId;

				console.log('🔍 BOM 등록 - 선택된 노드 분석:', {
					selectedNodeId,
					nodeType: selectedNodeData.nodeType,
					초기_rootItemId: rootItemId,
					초기_parentItemId: parentItemId,
					selectedNodeData: selectedNodeData,
				});

				// PROCESS 노드인 경우 트리를 따라 올라가서 제품 정보 찾기
				if (selectedNodeData.nodeType === 'PROCESS') {
					// 1. rootItemId는 이제 노드 데이터에 직접 포함되어 있음
					if (!rootItemId) {
						console.warn(
							'⚠️ PROCESS 노드에 rootItemId가 없습니다:',
							selectedNodeData
						);
						// 백업으로 첫 번째 루트 아이템 사용
						rootItemId =
							fullBomTreeData?.rootItems?.[0]?.rootItemId || 0;
					}

					// 2. parentItemId 찾기 - PROCESS 노드에서는 공정이 속한 제품의 ID를 사용해야 함
					if (!parentItemId) {
						// PROCESS 노드의 경우 selectedNodeData.itemId는 공정이 속한 제품을 나타낼 가능성이 높음
						// 또는 path를 분석해서 상위 제품 찾기
						if (selectedNodeData.itemId) {
							parentItemId = selectedNodeData.itemId;
						} else {
							// itemId가 없다면 부모 노드에서 제품 찾기
							const parentNode = selectedNodeId
								? findParentProductNode(selectedNodeId)
								: null;
							if (parentNode && parentNode.itemId) {
								parentItemId = parentNode.itemId;
							} else {
								// 마지막 수단으로 루트 제품을 사용
								parentItemId = rootItemId || 0;
							}
						}
					}
				} else {
					// PROCESS가 아닌 경우 (ROOT, ITEM 등) - rootItemId는 이제 노드에 직접 포함됨
					if (!rootItemId) {
						// 선택된 노드가 루트 노드인 경우
						if (
							selectedNodeId &&
							selectedNodeId.startsWith('root-')
						) {
							const rootItemIdFromNode = selectedNodeId.replace(
								'root-',
								''
							);
							rootItemId = parseInt(rootItemIdFromNode) || 0;
						} else {
							console.warn(
								'⚠️ 노드에 rootItemId가 없습니다:',
								selectedNodeData
							);
							// 백업으로 첫 번째 루트 아이템 사용
							rootItemId =
								fullBomTreeData?.rootItems?.[0]?.rootItemId ||
								0;
						}
					}

					if (!parentItemId) {
						parentItemId = selectedNodeData.itemId || 0;
					}
				}

				// BOM 구조에서 투입품 등록 시 (API 스키마 업데이트):
				// - parentItemId: 투입품의 부모가 될 제품 ID
				// - itemId: 투입할 자재/부품의 ID
				// - isRoot: 완제품 여부 (false: 투입품)
				// - parentProgressId: 투입될 부모의 공정 ID
				// - itemProgressId: 아이템의 투입공정 ID
				const createRequest: MbomCreateRequest = {
					parentItemId: parentItemId || null,
					itemId: Number(data.itemId), // 투입할 자재/부품의 ID
					isRoot: false, // 투입품이므로 false
					parentProgressId: selectedNodeData.progressId, // 투입될 부모의 공정 ID
					inputNum: Number(data.inputNum),
					itemProgressId: selectedNodeData.progressId, // 아이템의 투입공정 ID (선택적)
					inputUnitCode: selectedUnitCode,
					inputUnit: String(data.inputUnit || 'EA'), // 단위명
				};

				// BOM 관계 검증 (순환 참조 방지) - rootItemId 대신 최상위 아이템 사용
				const rootId =
					rootItemId ||
					fullBomTreeData?.rootItems?.[0]?.rootItemId ||
					0;
				const relationCheck = await checkCanAddRelation(
					rootId,
					createRequest.parentItemId || 0,
					createRequest.itemId
				);

				if (!relationCheck) {
					toast.error(
						'BOM 관계 검증 API 호출에 실패했습니다. 네트워크 연결을 확인해주세요.'
					);
					return;
				}

				if (!relationCheck) {
					const reason =
						relationCheck.reason ||
						'순환 참조가 발생할 수 있습니다.';
					console.warn('🚫 BOM 관계 추가 불가:', reason);
					toast.error(
						`BOM 관계를 추가할 수 없습니다.\n이유: ${reason}`
					);
					return;
				}

				if (isEditMode) {
					// TODO: 수정 API 호출 구현
					console.log('투입품 수정:', createRequest);
					toast.success('투입품이 수정되었습니다.');
				} else {
					const result = await createMbomApi([createRequest]);
					if (result) {
						toast.success('투입품이 등록되었습니다.');
					} else {
						throw new Error('투입품 등록 실패');
					}
				}

				// 성공 시 트리 데이터 새로고침
				refetch();

				// 모달 닫기
				setSelectedMaterial(null);
				setModalMode('create'); // 모드 초기화
				setIsCreateModalOpen(false);
			} catch (error) {
				console.error('BOM 등록 오류:', error);
				toast.error('BOM 등록에 실패했습니다.');
			}
		};

		// 선택된 공정 정보 표시
		const selectedNode = selectedNodeId
			? findSelectedNode(selectedNodeId)
			: null;

		return (
			<div className="space-y-4">
				{/* 공정 정보 표시 */}
				{selectedNode && (
					<div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
						<h4 className="text-sm font-medium text-blue-800 mb-1">
							선택된 공정: {selectedNode.label}
						</h4>
						<p className="text-xs text-blue-600">
							{isEditMode
								? '선택된 투입품을 수정합니다.'
								: '이 공정에 투입할 자재를 선택하고 투입량을 설정하세요.'}
						</p>
						{isEditMode && selectedMaterial && (
							<div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
								<strong>수정 대상:</strong>{' '}
								{selectedMaterial.itemName ||
									selectedMaterial.itemNumber}
							</div>
						)}
					</div>
				)}

				<DynamicForm
					fields={materialFormSchema}
					onSubmit={handleSubmit}
					submitButtonText={
						relationCheckLoading
							? 'BOM 관계 검증 중...'
							: isEditMode
								? '수정'
								: '등록'
					}
					initialData={initialData}
					otherTypeElements={{
						codeSelect: CodeSelectComponent,
					}}
				/>

				{createError && (
					<div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
						{createError}
					</div>
				)}
			</div>
		);
	};

	// 선택된 노드 찾기 함수
	const findSelectedNode = (nodeId: string): ExtendedTreeNode | null => {
		const findInNodes = (
			nodes: ExtendedTreeNode[]
		): ExtendedTreeNode | null => {
			for (const node of nodes) {
				if (node.id === nodeId) return node;
				if (node.children) {
					const found = findInNodes(node.children);
					if (found) return found;
				}
			}
			return null;
		};
		return findInNodes(treeData);
	};

	// PROCESS 노드의 부모 제품 노드를 찾는 함수
	const findParentProductNode = (
		nodeId: string
	): ProcessTreeNodeDto | null => {
		const findNodeWithParent = (
			nodes: ExtendedTreeNode[],
			targetId: string,
			parent: ExtendedTreeNode | null = null
		): ProcessTreeNodeDto | null => {
			for (const node of nodes) {
				if (node.id === targetId) {
					// 현재 노드를 찾았을 때, 부모가 제품인지 확인
					if (parent && parent.data) {
						const parentData = parent.data as ProcessTreeNodeDto;
						if (
							parentData.nodeType === 'PRODUCT' ||
							parentData.nodeType === 'ITEM'
						) {
							return parentData;
						}
						// 부모가 제품이 아니라면 더 위로 올라가서 찾기
						return findParentInTree(parent.id);
					}
					return null;
				}
				if (node.children) {
					const found = findNodeWithParent(
						node.children,
						targetId,
						node
					);
					if (found) return found;
				}
			}
			return null;
		};

		const findParentInTree = (
			currentNodeId: string
		): ProcessTreeNodeDto | null => {
			// 트리를 다시 탐색해서 더 상위의 제품 노드 찾기
			const findProductParent = (
				nodes: ExtendedTreeNode[],
				targetId: string,
				ancestors: ExtendedTreeNode[] = []
			): ProcessTreeNodeDto | null => {
				for (const node of nodes) {
					const newAncestors = [...ancestors, node];
					if (node.id === targetId) {
						// 조상 노드들 중에서 제품 노드 찾기 (가장 가까운 것부터)
						for (let i = newAncestors.length - 2; i >= 0; i--) {
							const ancestor = newAncestors[i];
							const ancestorData =
								ancestor.data as ProcessTreeNodeDto;
							if (
								ancestorData.nodeType === 'PRODUCT' ||
								ancestorData.nodeType === 'ITEM'
							) {
								return ancestorData;
							}
						}
						return null;
					}
					if (node.children) {
						const found = findProductParent(
							node.children,
							targetId,
							newAncestors
						);
						if (found) return found;
					}
				}
				return null;
			};
			return findProductParent(treeData, currentNodeId);
		};

		return findNodeWithParent(treeData, nodeId);
	};

	// 좌측 패널 (Master) - TreeView
	const MasterPanel = () => (
		<div className="h-full flex flex-col bg-white border rounded-lg">
			<div className="p-4 border-b border-gray-200">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-base font-semibold text-gray-800">
							제품 BOM 현황
						</h3>
						{fullBomTreeData && (
							<p className="text-xs text-gray-500 mt-1">
								루트 제품: {fullBomTreeData.rootItemCount}개 |
								전체 BOM: {fullBomTreeData.totalCount}개
							</p>
						)}
					</div>
					<div className="flex items-center gap-2">
						<RadixIconButton
							onClick={handleRootProductCreate}
							className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border`}
							title="루트 제품 등록"
						>
							<Plus size={16} />
						</RadixIconButton>
						<RadixIconButton
							onClick={handleRootProductDelete}
							className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border`}
							title="루트 제품 삭제"
						>
							<Trash2 size={16} />
						</RadixIconButton>
					</div>
				</div>
			</div>

			<div className="flex-1 p-4 overflow-auto">
				{loading ? (
					<div className="flex items-center justify-center h-32">
						<div className="text-gray-500">
							BOM 데이터를 불러오는 중...
						</div>
					</div>
				) : error ? (
					<div className="flex flex-col items-center justify-center h-32 text-red-500">
						<div className="mb-2">⚠️ {error}</div>
						<button
							onClick={refetch}
							className="text-sm text-Colors-Brand-600 hover:text-Colors-Brand-700"
						>
							다시 시도
						</button>
					</div>
				) : (
					<TreeView
						data={treeData}
						classNames={customClassNames}
						defaultExpandIcon={<ChevronDown className="h-4 w-4" />}
						selectedNodeId={selectedNodeId}
						expandedNodeIds={expandedNodeIds}
						selectableNodeFilter={selectableNodeFilter}
						onNodeClick={handleNodeClick}
						onExpandToggle={handleExpandToggle}
					/>
				)}
			</div>
		</div>
	);

	// 우측 패널 (Detail) - 투입품 DataTable
	const DetailPanel = () => {
		const selectedNode = selectedNodeId
			? findSelectedNode(selectedNodeId)
			: null;
		const selectedNodeData = selectedNode?.data;

		// 공정 노드인지 확인 (ID가 process-로 시작하거나 nodeType이 PROCESS인 경우)
		const isProcessNode =
			selectedNode &&
			(selectedNode.id.startsWith('process-') ||
				(selectedNodeData as ProcessTreeNodeDto)?.nodeType ===
					'PROCESS');

		const processData = isProcessNode
			? (selectedNodeData as ProcessTreeNodeDto)
			: null;

		// 실제 API 데이터에서 투입품 가져오기
		const getInputItemsFromApiData = () => {
			if (!selectedNodeId || !fullBomTreeData?.rootItems) return [];

			// selectedNodeId에서 progressId 추출
			const progressId = selectedNodeId.startsWith('process-')
				? parseInt(selectedNodeId.replace('process-', ''))
				: null;

			if (!progressId) return [];

			// 선택된 노드가 속한 올바른 루트 아이템에서 공정 찾기
			const findProcessInCorrectRootItem = (): any[] => {
				// 먼저 선택된 노드가 속한 루트 아이템을 찾기
				for (const rootItem of fullBomTreeData.rootItems) {
					for (const process of rootItem.processTree) {
						if (process.progressId === progressId) {
							// 해당 공정이 이 루트 아이템에 속함을 확인
							return process.inputItems.map((item) => ({
								...item,
								itemNumber: (item.productInfo as any)
									?.itemNumber,
								itemNo: (item.productInfo as any)?.itemNo,
								itemSpec: (item.productInfo as any)?.itemSpec,
								nodeType: 'ITEM', // 모든 inputItems는 ITEM 타입
								rootItemId: rootItem.rootItemId, // 올바른 루트 아이템 ID 추가
							}));
						}
					}
				}
				return [];
			};

			return findProcessInCorrectRootItem();
		};

		const allMaterialChildren = getInputItemsFromApiData();

		// 검색 조건에 따른 필터링
		const materialChildren = useMemo(() => {
			if (
				!materialSearchParams ||
				Object.keys(materialSearchParams).length === 0
			) {
				return allMaterialChildren;
			}
			return allMaterialChildren.filter((material) => {
				const { itemNumber, itemName, nodeType } = materialSearchParams;

				if (
					itemNumber &&
					!material.itemNumber
						?.toLowerCase()
						.includes(itemNumber.toLowerCase())
				) {
					return false;
				}
				if (
					itemName &&
					!material.itemName
						?.toLowerCase()
						.includes(itemName.toLowerCase())
				) {
					return false;
				}
				if (nodeType && material.nodeType !== nodeType) {
					return false;
				}

				return true;
			});
		}, [allMaterialChildren, materialSearchParams]);

		// 하위 노드들의 타입 분석

		// DataTable 설정
		const { table } = useDataTable(
			materialChildren,
			materialColumns,
			10, // 페이지 크기
			Math.ceil(materialChildren.length / 10), // 페이지 수
			0, // 현재 페이지
			materialChildren.length, // 총 요소 수
			() => {} // 페이지 변경 핸들러
		);

		const toggleMaterialRowSelection = (rowId: string) => {
			setSelectedMaterialRows((prev) => {
				const newSet = new Set(prev);
				if (newSet.has(rowId)) {
					newSet.delete(rowId);
					setSelectedMaterial(null);
				} else {
					// 단일 선택만 허용
					newSet.clear();
					newSet.add(rowId);
					// 선택된 투입품 설정
					const rowIndex = parseInt(rowId);
					const selectedMaterialData = materialChildren[rowIndex];
					setSelectedMaterial(selectedMaterialData);
				}
				return newSet;
			});
		};

		return (
			<div className="h-full flex flex-col bg-white border rounded-lg">
				{selectedNode && isProcessNode ? (
					<div className="flex-1 overflow-hidden">
						{allMaterialChildren.length > 0 ? (
							<DatatableComponent
								table={table}
								columns={materialColumns}
								data={materialChildren}
								tableTitle={`${selectedNode.label} - 투입품 목록`}
								rowCount={materialChildren.length}
								useSearch={true}
								usePageNation={materialChildren.length > 10}
								enableSingleSelect={true}
								selectedRows={selectedMaterialRows}
								toggleRowSelection={toggleMaterialRowSelection}
								searchSlot={
									<div className="flex gap-2 ml-auto">
										<SearchSlotComponent
											fields={materialSearchFields}
											onSearch={(searchParams) => {
												setMaterialSearchParams(
													searchParams
												);
											}}
										/>
										<ActionButtonsComponent
											useCreate={true}
											useEdit={true}
											useRemove={true}
											create={handleCreateClick}
											edit={handleMaterialEdit}
											remove={handleMaterialDelete}
											visibleText={false}
										/>
									</div>
								}
							/>
						) : (
							<div className="flex-1 flex items-center justify-center text-gray-500 h-full">
								<div className="text-center">
									<Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
									<h4 className="text-lg font-medium text-gray-700 mb-2">
										투입품이 없습니다
									</h4>
									<p className="text-gray-500 mb-4">
										이 공정에는 등록된 투입품이 없습니다.
									</p>
									<button
										onClick={handleCreateClick}
										className="px-4 py-2 bg-Colors-Brand-600 hover:bg-Colors-Brand-700 text-white rounded-md transition-colors"
									>
										투입품 등록
									</button>
								</div>
							</div>
						)}
					</div>
				) : (
					<div className="flex-1 flex items-center justify-center text-gray-500 h-full">
						<div className="text-center">
							<Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
							<h4 className="text-lg font-medium text-gray-700 mb-2">
								{selectedNode
									? `${selectedNode.label}은(는) 공정이 아닙니다`
									: '공정을 선택하세요'}
							</h4>
							<p className="text-gray-500">
								{selectedNode
									? '투입품 정보를 보려면 공정(보라색 아이콘) 노드를 선택해주세요.'
									: '좌측 트리에서 공정(보라색 아이콘)을 클릭하면 투입품 목록이 표시됩니다.'}
							</p>
						</div>
					</div>
				)}
			</div>
		);
	};

	return (
		<>
			<PageTemplate splitterSizes={[30, 70]} splitterMinSize={[300, 500]}>
				<MasterPanel />
				<DetailPanel />
			</PageTemplate>

			{/* 루트 제품 등록 모달 */}
			<DraggableDialog
				open={isRootProductModalOpen}
				onOpenChange={setIsRootProductModalOpen}
				title="루트 제품 등록"
				content={<RootProductForm />}
			/>

			{/* 투입품 등록/수정 모달 */}
			<DraggableDialog
				open={isCreateModalOpen}
				onOpenChange={(open) => {
					setIsCreateModalOpen(open);
					if (!open) {
						setSelectedMaterial(null);
						setModalMode('create'); // 모달 닫을 때 모드 초기화
					}
				}}
				title={modalMode === 'edit' ? '투입품 수정' : 'BOM 항목 등록'}
				content={<CreateForm />}
			/>

			{/* 투입품 삭제 확인 다이얼로그 */}
			<DeleteConfirmDialog
				isOpen={openDeleteMaterialDialog}
				onOpenChange={setOpenDeleteMaterialDialog}
				onConfirm={handleMaterialDeleteConfirm}
				isDeleting={deleteLoading}
				title="투입품 삭제"
				description={`선택한 투입품 '${selectedMaterial?.itemName || selectedMaterial?.itemNumber}'을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
			/>

			{/* 루트 제품 삭제 확인 다이얼로그 */}
			<DeleteConfirmDialog
				isOpen={openDeleteRootDialog}
				onOpenChange={setOpenDeleteRootDialog}
				onConfirm={handleRootProductDeleteConfirm}
				isDeleting={deleteLoading}
				title="루트 제품 삭제"
				description={(() => {
					const selectedRootItem = getSelectedRootItem();
					const rootItemData = selectedRootItem
						? (treeData.find(
								(node) =>
									node.id ===
									`root-${selectedRootItem.rootItemId}`
							)?.data as any)
						: null;
					const itemNumber = rootItemData?.productInfo?.itemNumber;
					const itemName = selectedRootItem?.rootItemName;
					const displayName = itemNumber
						? `${itemNumber} - ${itemName}`
						: itemName || 'Unknown';
					return `선택한 루트 제품 '${displayName}'을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없으며, 해당 제품의 모든 BOM 정보가 함께 삭제됩니다.`;
				})()}
			/>
		</>
	);
};
