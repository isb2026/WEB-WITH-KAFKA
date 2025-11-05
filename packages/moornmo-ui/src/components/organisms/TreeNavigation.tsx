import React, { ReactNode, useState, useCallback } from 'react';
import {
	ChevronRight,
	ChevronDown,
	Folder,
	FolderOpen,
	File,
	Package,
	Clipboard,
	Network,
} from 'lucide-react';
import {
	Box,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Collapse,
	alpha,
} from '@mui/material';

// 1) 공통 노드 형태 정의
export interface BaseTreeNode {
	id: string;
	name: string;
	level: number;
	isOpen?: boolean;
	children?: BaseTreeNode[];
}

// 2) 아이콘 맵
export interface TreeIcons {
	level1?: React.ElementType;
	level2?: React.ElementType;
	level3?: React.ElementType;
	level4?: React.ElementType;
	level5?: React.ElementType;
	folder?: React.ElementType;
	folderOpen?: React.ElementType;
	file?: React.ElementType;
	[key: string]: React.ElementType | undefined;
}

const defaultIcons: TreeIcons = {
	level1: Network,
	level2: Folder,
	level3: File,
	level4: Package,
	level5: Clipboard,
	folder: Folder,
	folderOpen: FolderOpen,
	file: File,
};

// 3) 훅 옵션에 제네릭 T 추가
export interface UseTreeUIOptions<T extends BaseTreeNode> {
	data?: T[];
	icons?: TreeIcons;
	onNodeSelect?: (node: T) => void;
	onNodeToggle?: (nodeId: string) => void;
	showLevelIcons?: boolean;
	expandedByDefault?: boolean;
	getNodeIcon?: (node: T, isOpen?: boolean) => React.ElementType;
	validateSelect?: (node: T) => boolean;
}

// 4) 훅 반환 타입에도 제네릭 T
export interface UseTreeUIResult<T extends BaseTreeNode> {
	TreeComponent: React.FC<{ height?: string; className?: string }>;
	selectedId: string | null;
	setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
	getNodeIcon: (node: T, isOpen?: boolean) => React.ElementType;
	treeData: T[];
	setTreeData: React.Dispatch<React.SetStateAction<T[]>>;
}

// 5) useTreeUI 에도 <T> 선언
export function useTreeUI<T extends BaseTreeNode = BaseTreeNode>(
	options: UseTreeUIOptions<T>
): UseTreeUIResult<T> {
	const {
		data: initialData = [] as T[],
		icons = {},
		onNodeSelect,
		onNodeToggle,
		showLevelIcons = true,
		expandedByDefault = false,
		getNodeIcon: customGetNodeIcon,
		validateSelect,
	} = options;

	const [treeData, setTreeData] = useState<T[]>(() =>
		expandedByDefault
			? initialData.map((node) => ({
					...node,
					isOpen: true,
					children: node.children?.map((child) => ({
						...child,
						isOpen: true,
					})) as T[],
				}))
			: initialData
	);

	const [selectedId, setSelectedId] = useState<string | null>(null);
	const mergedIcons = { ...defaultIcons, ...icons };

	const updateNodeInTree = useCallback(
		(nodes: T[], nodeId: string, updater: (node: T) => T): T[] =>
			nodes.map((node) => {
				if (node.id === nodeId) return updater(node);
				if (node.children) {
					return {
						...node,
						children: updateNodeInTree(
							node.children as T[],
							nodeId,
							updater
						),
					} as T;
				}
				return node;
			}),
		[]
	);

	const handleSelect = useCallback(
		(node: T) => {
			if (validateSelect && !validateSelect(node)) return;
			setSelectedId(node.id);
			onNodeSelect?.(node);
		},
		[onNodeSelect]
	);

	const handleToggle = useCallback(
		(nodeId: string) => {
			setTreeData((prev) =>
				updateNodeInTree(prev, nodeId, (node) => ({
					...node,
					isOpen: !node.isOpen,
				}))
			);
			onNodeToggle?.(nodeId);
		},
		[onNodeToggle, updateNodeInTree]
	);

	const getNodeIcon = useCallback(
		(node: T, isOpen?: boolean): React.ElementType => {
			if (customGetNodeIcon) {
				return customGetNodeIcon(node, isOpen);
			}
			// root always folder
			if (node.level === 1) {
				return isOpen ? mergedIcons.folderOpen! : mergedIcons.folder!;
			}
			if (showLevelIcons) {
				const lvlKey = `level${node.level}`;
				return mergedIcons[lvlKey] || mergedIcons.file!;
			}
			if (node.children && node.children.length > 0) {
				return isOpen ? mergedIcons.folderOpen! : mergedIcons.folder!;
			}
			return mergedIcons.file!;
		},
		[customGetNodeIcon, mergedIcons, showLevelIcons]
	);

	const renderNode = useCallback(
		(node: T, depth = 0): ReactNode => {
			const hasChildren = !!node.children?.length;
			const isSelected = selectedId === node.id;
			const IconCmp = getNodeIcon(node, node.isOpen);
			const paddingLeft = depth * 16 + 12;

			return (
				<Box key={node.id} sx={{ pl: depth * 0.5 }}>
					<ListItem disablePadding>
                        <ListItemButton
							selected={isSelected}
						onClick={() => {
							// Row click toggles expand/collapse for non-root nodes with children
							if (hasChildren && depth > 0) {
								handleToggle(node.id);
							}
							handleSelect(node);
						}}
                            sx={{
                                position: 'relative',
                                py: depth === 0 ? 1 : 0.75,
                                maxHeight: depth === 0 ? 42 : 36,
                                borderRadius: depth === 0 ? 1.5 : 1,
                                backgroundColor:
                                    depth === 0
                                        ? alpha('#1976d2', 0.06)
                                        : isSelected
                                            ? alpha('#1976d2', 0.08)
                                            : 'transparent',
                                border: depth === 0 ? '1px solid rgba(25,118,210,0.15)' : 'none',
                                my: 0.3,
                                transition: 'background-color 0.15s ease-in-out, box-shadow 0.15s',
                                boxShadow: depth === 0 ? 'inset 0 0 0 1px rgba(25,118,210,0.06)' : 'none',
                                '&.Mui-selected': {
                                    backgroundColor: alpha('#1976d2', 0.08),
                                    color: '#1976d2',
                                    '&:hover': {
                                        backgroundColor: alpha('#1976d2', 0.12),
                                    },
                                },
                                '&:hover': {
                                    backgroundColor: depth === 0 ? alpha('#1976d2', 0.1) : alpha('#000', 0.08),
                                },
                            }}
						>
						{hasChildren && (
							depth === 0 ? (
								// Root: keep layout alignment but disable toggle
								<Box
									component="span"
									sx={{
										mr: 0.75,
										ml: -0.5,
										width: 16,
										height: 16,
										display: 'inline-block',
									}}
								/>
							) : (
								<Box
									component="button"
									onClick={(e) => {
										e.stopPropagation();
										handleToggle(node.id);
									}}
									sx={{
										p: 0,
										mr: 0.75,
										ml: -0.5,
										width: 16,
										height: 16,
										backgroundColor: 'transparent',
										border: 'none',
										cursor: 'pointer',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										'&:hover': {
											backgroundColor: 'transparent',
										},
									}}
								>
									{node.isOpen ? (
										<ChevronDown size={12} color="#666" />
									) : (
										<ChevronRight size={12} color="#666" />
									)}
								</Box>
							)
						)}
						{!hasChildren && (
							// spacer to align with rows that have a toggle icon
							<Box
								component="span"
								sx={{
									mr: 0.75,
									ml: -0.5,
									width: 16,
									height: 16,
									display: 'inline-block',
								}}
							/>
						)}
                            <ListItemIcon
								sx={{
                                    minWidth: 14,
                                    mr: 1,
                                    color: depth === 0
                                        ? '#1976d2'
                                        : isSelected
                                            ? '#1976d2'
                                            : node.level === 1
                                                ? '#f57c00'
                                                : '#666',
								}}
							>
								<IconCmp size={16} />
							</ListItemIcon>
                            <ListItemText
								primary={node.name}
								primaryTypographyProps={{
                                    variant: 'body2',
                                    fontWeight: depth === 0 ? 700 : isSelected ? 500 : 400,
                                    fontSize: depth === 0 ? '0.95rem' : '0.875rem',
                                    color: depth === 0 ? '#0d47a1' : isSelected ? '#1976d2' : '#333',
									lineHeight: 1.4,
								}}
							/>
						</ListItemButton>
					</ListItem>
					{hasChildren && (
						<Collapse
							in={node.isOpen}
							timeout={200}
							unmountOnExit
							sx={{
								'& .MuiCollapse-wrapper': {
									ml: 1,
								},
							}}
						>
							<List component="div" disablePadding>
								{node.children!.map((child) =>
									renderNode(child as T, depth + 1)
								)}
							</List>
						</Collapse>
					)}
				</Box>
			);
		},
		[getNodeIcon, handleSelect, handleToggle, selectedId]
	);

	const TreeComponent: React.FC<{ height?: string; className?: string }> = ({
		height = '100%',
		className = '',
	}) => (
		<Box
			sx={{ height, overflow: 'auto', bgcolor: 'white' }}
			className={className}
		>
			<List sx={{ p: 0 }}>
				{treeData.map((node) => renderNode(node))}
			</List>
		</Box>
	);

	return {
		TreeComponent,
		selectedId,
		setSelectedId,
		getNodeIcon,
		treeData,
		setTreeData,
	};
}
