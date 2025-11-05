import React from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { NodeComponentProps } from '../../types';

interface BaseNodeProps extends NodeComponentProps {
	className?: string;
	isVisible?: boolean;
	children?: React.ReactNode;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
	data,
	isVisible = false,
	className = '',
	children,
}) => {
	return (
		<div
			className={
				'relative flex items-center justify-center text-[12px] select-none ' +
				className
			}
			style={{ background: data?.color || '#fff' }}
		>
			<NodeResizer minWidth={100} minHeight={30} />

			{/* Connection handles */}
			<Handle type="target" position={Position.Left} />
			<Handle type="source" position={Position.Right} />

			{children ?? (
				<span className="px-1 text-black/80 text-sm">
					{data?.label}
				</span>
			)}
		</div>
	);
};
