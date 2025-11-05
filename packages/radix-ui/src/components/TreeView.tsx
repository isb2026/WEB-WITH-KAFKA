import { ChevronRight } from 'lucide-react';
import { useState, ReactNode } from 'react';

// 간단한 클래스 병합 유틸리티
const cn = (...classes: (string | undefined)[]) => {
	return classes.filter(Boolean).join(' ');
};

export type TreeNode = {
	id: string;
	label: string;
	icon?: ReactNode;
	children?: TreeNode[];
	disabled?: boolean;
};

export type TreeViewClassNames = {
	root?: string;
	item?: string;
	trigger?: string;
	content?: string;
	leafItem?: string;
	expandIcon?: string;
	selectedItem?: string;
	selectedLeafItem?: string;
	selectableItem?: string;
	unselectableItem?: string;
	selectableLeafItem?: string;
	unselectableLeafItem?: string;
};

type TreeProps = {
	data: TreeNode[];
	classNames?: TreeViewClassNames;
	defaultExpandIcon?: ReactNode;
	selectedNodeId?: string;
	expandedNodeIds?: string[];
	selectableNodeFilter?: (node: TreeNode) => boolean;
	onNodeClick?: (node: TreeNode) => void;
	onExpandToggle?: (nodeId: string, expanded: boolean) => void;
};

export function TreeView({
	data,
	classNames = {},
	defaultExpandIcon = <ChevronRight className="h-4 w-4" />,
	selectedNodeId,
	expandedNodeIds = [],
	selectableNodeFilter,
	onNodeClick,
	onExpandToggle,
}: TreeProps) {
	return (
		<div className={cn('w-full bg-white', classNames.root)}>
			{data &&
				data.map((node) => (
					<TreeItem
						key={node.id}
						node={node}
						classNames={classNames}
						defaultExpandIcon={defaultExpandIcon}
						selectedNodeId={selectedNodeId}
						expandedNodeIds={expandedNodeIds}
						selectableNodeFilter={selectableNodeFilter}
						onNodeClick={onNodeClick}
						onExpandToggle={onExpandToggle}
					/>
				))}
		</div>
	);
}

type TreeItemProps = {
	node: TreeNode;
	classNames?: TreeViewClassNames;
	defaultExpandIcon?: ReactNode;
	selectedNodeId?: string;
	expandedNodeIds?: string[];
	selectableNodeFilter?: (node: TreeNode) => boolean;
	onNodeClick?: (node: TreeNode) => void;
	onExpandToggle?: (nodeId: string, expanded: boolean) => void;
};

function TreeItem({
	node,
	classNames = {},
	defaultExpandIcon,
	selectedNodeId,
	expandedNodeIds = [],
	selectableNodeFilter,
	onNodeClick,
	onExpandToggle,
}: TreeItemProps) {
	const hasChildren = node.children && node.children.length > 0;
	const isExpanded = expandedNodeIds.includes(node.id);
	const isSelected = selectedNodeId === node.id;
	const isSelectable = selectableNodeFilter
		? selectableNodeFilter(node)
		: true;

	const handleNodeClick = () => {
		if (isSelectable) {
			onNodeClick?.(node);
		}
	};

	const handleExpandClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		const newExpanded = !isExpanded;
		onExpandToggle?.(node.id, newExpanded);
	};

	if (!hasChildren) {
		return (
			<div
				className={cn(
					'flex items-center gap-2 pl-4 py-2 text-sm',
					isSelectable
						? classNames.selectableLeafItem ||
								'hover:bg-gray-50 cursor-pointer text-gray-900'
						: classNames.unselectableLeafItem ||
								'cursor-not-allowed',
					isSelected
						? classNames.selectedLeafItem
						: classNames.leafItem
				)}
				onClick={handleNodeClick}
			>
				{node.icon && (
					<span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
						{node.icon}
					</span>
				)}
				<span className="flex-1">{node.label}</span>
			</div>
		);
	}

	return (
		<div
			className={cn(
				isSelected ? classNames.selectedItem : classNames.item
			)}
		>
			<div
				className={cn(
					'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors',
					isSelectable
						? classNames.selectableItem ||
								'hover:bg-gray-50 cursor-pointer text-gray-900'
						: classNames.unselectableItem || 'cursor-not-allowed',
					classNames.trigger
				)}
				onClick={handleNodeClick}
			>
				<button
					className={cn(
						'flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors',
						classNames.expandIcon
					)}
					onClick={handleExpandClick}
				>
					<span
						className={cn(
							'transition-transform duration-200',
							isExpanded ? 'rotate-90' : ''
						)}
					>
						{defaultExpandIcon}
					</span>
				</button>
				{node.icon && (
					<span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
						{node.icon}
					</span>
				)}
				<span className="flex-1 text-left">{node.label}</span>
			</div>
			{isExpanded && (
				<div className={cn('pl-6', classNames.content)}>
					{node.children?.map((child) => (
						<TreeItem
							key={child.id}
							node={child}
							classNames={classNames}
							defaultExpandIcon={defaultExpandIcon}
							selectedNodeId={selectedNodeId}
							expandedNodeIds={expandedNodeIds}
							selectableNodeFilter={selectableNodeFilter}
							onNodeClick={onNodeClick}
							onExpandToggle={onExpandToggle}
						/>
					))}
				</div>
			)}
		</div>
	);
}
