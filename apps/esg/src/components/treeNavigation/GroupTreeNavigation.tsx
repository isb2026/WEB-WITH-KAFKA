import { useEffect, useRef } from 'react';
import { Building, MapPin, Folder, Network } from 'lucide-react';
import { useTreeUI, BaseTreeNode } from '@repo/moornmo-ui/components';
import { Spinner } from '@repo/moornmo-ui/components';
import { useGroup } from '@esg/hooks/group/useGroup';

export interface GroupTreeNavigationProps {
	// 기존 기능 유지 (하위 호환성)
	onSelected?: (selectedId: string) => void;

	// 새로운 확장 기능 - Node 전체 정보 전달
	onSelectedNode?: (selectedNode: GroupTreeNode) => void;

	onNodeToggle?: (nodeId: number) => void;
	allowTypes?: ('GROUP' | 'COMPANY' | 'WORKPLACE')[];
	countTypes?: ('GROUP' | 'COMPANY' | 'WORKPLACE')[];
	allowSelectedType?: ('GROUP' | 'COMPANY' | 'WORKPLACE')[];
}

export interface GroupTreeNode extends BaseTreeNode {
	name: string;
	companyType: 'COMPANY' | 'GROUP' | 'WORKPLACE';
	companyId: number | string;
}

export const GroupTreeNavigation: React.FC<GroupTreeNavigationProps> = ({
	onSelected,
	onSelectedNode,
	onNodeToggle = () => {},
	allowTypes = ['GROUP', 'COMPANY', 'WORKPLACE'],
	countTypes = [],
	allowSelectedType = ['GROUP', 'COMPANY', 'WORKPLACE'],
}) => {
	const onSelectedRef = useRef(onSelected);
	const onSelectedNodeRef = useRef(onSelectedNode);

	// onSelected 콜백을 ref에 저장하여 의존성 배열에서 제외
	useEffect(() => {
		onSelectedRef.current = onSelected;
	}, [onSelected]);

	// onSelectedNode 콜백을 ref에 저장하여 의존성 배열에서 제외
	useEffect(() => {
		onSelectedNodeRef.current = onSelectedNode;
	}, [onSelectedNode]);

	const { TreeComponent, setTreeData, selectedId, setSelectedId } = useTreeUI(
		{
			data: [],
			getNodeIcon: (node: GroupTreeNode, isOpen?: boolean) => {
				if (node.level === 0) return Network;
				if (node.companyType === 'COMPANY') return Building;
				if (node.companyType === 'WORKPLACE') return MapPin;
				return Folder;
			},
			validateSelect: (node: any) => {
				if (node.id == '1-portfolio' || node.id == '1-classification')
					return false;
				return allowSelectedType.indexOf(node.companyType) != -1;
			},
		}
	);
	const { tree, makeGroupTreeData } = useGroup();

	useEffect(() => {
		if (tree.data) {
			const _treeData: GroupTreeNode[] = makeGroupTreeData(
				tree.data ?? [],
				0,
				allowTypes
			);
			// 루트 노드 항상 펼침 처리
			const openedRoot = _treeData.map((n) => ({ ...n, isOpen: true }));
			setTreeData(openedRoot as any);
		}
	}, [tree.data]);

	useEffect(() => {
		if (selectedId && selectedId != null) {
			// 기존 onSelected 콜백 호출 (하위 호환성)
			if (onSelectedRef.current) {
				onSelectedRef.current(selectedId);
			}

			// 새로운 onSelectedNode 콜백 호출
			if (onSelectedNodeRef.current) {
				// 선택된 노드의 전체 정보 찾기
				const selectedNode = findNodeById(selectedId);
				if (selectedNode) {
					onSelectedNodeRef.current(selectedNode);
				}
			}
		}
	}, [selectedId]);

	// 선택된 ID로 노드 정보를 찾는 헬퍼 함수
	const findNodeById = (nodeId: string | number): GroupTreeNode | null => {
		const searchInTree = (nodes: GroupTreeNode[]): GroupTreeNode | null => {
			for (const node of nodes) {
				if (node.id === nodeId) {
					return node;
				}
				if (node.children && node.children.length > 0) {
					const found = searchInTree(
						node.children as GroupTreeNode[]
					);
					if (found) return found;
				}
			}
			return null;
		};

		// 현재 트리 데이터에서 검색
		const currentTreeData = tree.data
			? makeGroupTreeData(tree.data, 0, allowTypes)
			: [];
		return searchInTree(currentTreeData);
	};

	if (tree.isLoading) {
		return <Spinner />;
	}

	if (tree.error) {
		return (
			<div className="p-3 text-center">
				<div className="text-danger mb-2">
					<i className="fas fa-exclamation-triangle"></i>
				</div>
				<small className="text-muted">
					조직 구조를 불러오는 중 오류가 발생했습니다.
				</small>
			</div>
		);
	}

	return (
		<TreeComponent
			height="100%"
			className="w-100 company-tree-navigation"
		/>
	);
};
