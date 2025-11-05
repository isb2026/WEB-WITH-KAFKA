import React from 'react';
import { BaseNode } from './BaseNode';
import { NodeComponentProps } from '../../types';

// Rounded-rectangle (default)
export const RoundRectNode: React.FC<NodeComponentProps> = ({ data, id }) => (
	<BaseNode
		data={data}
		id={id}
		className="rounded-xl shadow-sm border border-black/10"
	/>
);

// Rectangle
export const RectNode: React.FC<NodeComponentProps> = ({ data, id }) => (
	<BaseNode
		data={data}
		id={id}
		className="rounded-[4px] shadow-sm border border-black/10 min-w-[110px] min-h-[56px]"
	/>
);

// Circle
export const CircleNode: React.FC<NodeComponentProps> = ({ data, id }) => (
	<BaseNode
		data={data}
		id={id}
		className="rounded-full shadow-sm border border-black/10 min-w-[80px] min-h-[80px]"
	/>
);

// Diamond
export const DiamondNode: React.FC<NodeComponentProps> = ({ data, id }) => (
	<BaseNode data={data} id={id} className="min-w-[110px] min-h-[110px]">
		<div className="absolute inset-0 flex items-center justify-center">
			<div className="rotate-45 w-full h-full rounded-[6px] border border-black/10 shadow-sm" />
		</div>
		<span className="absolute text-black/80">{data?.label}</span>
	</BaseNode>
);

// Hexagon
export const HexagonNode: React.FC<NodeComponentProps> = ({ data, id }) => (
	<BaseNode data={data} id={id} className="min-w-[140px] min-h-[56px]">
		<div
			className="absolute inset-0"
			style={{
				clipPath:
					'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)',
				border: '1px solid rgba(0,0,0,0.1)',
				borderRadius: 6,
				boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
			}}
		/>
		<span className="absolute text-black/80">{data?.label}</span>
	</BaseNode>
);

// Parallelogram
export const ParallelogramNode: React.FC<NodeComponentProps> = ({
	data,
	id,
}) => (
	<BaseNode data={data} id={id} className="min-w-[150px] min-h-[56px]">
		<div
			className="absolute inset-0"
			style={{
				transform: 'skewX(-20deg)',
				border: '1px solid rgba(0,0,0,0.1)',
				borderRadius: 6,
				boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
			}}
		/>
		<span className="absolute text-black/80">{data?.label}</span>
	</BaseNode>
);

// Triangle
export const TriangleNode: React.FC<NodeComponentProps> = ({ data, id }) => (
	<BaseNode data={data} id={id} className="min-w-[120px] min-h-[90px]">
		<div
			className="absolute left-1/2 -translate-x-1/2 bottom-1"
			style={{
				width: '0',
				height: '0',
				borderLeft: '60px solid transparent',
				borderRight: '60px solid transparent',
				borderTop: `90px solid ${data?.color || '#2196f3'}`,
			}}
		/>
		<span className="absolute top-[45%] -translate-y-1/2 text-black/80">
			{data?.label}
		</span>
	</BaseNode>
);

// Cylinder
export const CylinderNode: React.FC<NodeComponentProps> = ({ data, id }) => (
	<BaseNode data={data} id={id} className="min-w-[140px] min-h-[120px]">
		<svg
			className="absolute inset-0"
			width="100%"
			height="100%"
			viewBox="0 0 140 120"
			preserveAspectRatio="none"
		>
			<defs>
				<linearGradient id="cyl" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0" stopColor="#61a6ff" />
					<stop offset="1" stopColor="#2f86ff" />
				</linearGradient>
			</defs>
			{/* body */}
			<rect
				x="10"
				y="20"
				width="120"
				height="82"
				fill="url(#cyl)"
				rx="12"
			/>
			{/* top ellipse */}
			<ellipse cx="70" cy="20" rx="60" ry="16" fill="#8ec2ff" />
			<ellipse
				cx="70"
				cy="20"
				rx="60"
				ry="16"
				fill="none"
				stroke="rgba(0,0,0,0.2)"
			/>
			{/* bottom ellipse outline */}
			<ellipse
				cx="70"
				cy="102"
				rx="60"
				ry="16"
				fill="none"
				stroke="rgba(0,0,0,0.2)"
			/>
		</svg>
		<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black/80">
			{data?.label}
		</span>
	</BaseNode>
);

// Arrow-rectangle
export const ArrowRectNode: React.FC<NodeComponentProps> = ({ data, id }) => (
	<BaseNode data={data} id={id} className="min-w-[180px] min-h-[56px]">
		<div className="absolute inset-0 flex">
			<div className="grow rounded-l-md border border-black/10 shadow-sm" />
			<div
				className="w-[40px] -ml-[1px] border-t border-b border-black/10 relative"
				style={{ background: data?.color || '#9c27b0' }}
			>
				<div
					className="absolute right-[-20px] top-1/2 -translate-y-1/2"
					style={{
						width: 0,
						height: 0,
						borderTop: '28px solid transparent',
						borderBottom: '28px solid transparent',
						borderLeft: `20px solid ${data?.color || '#9c27b0'}`,
					}}
				/>
			</div>
		</div>
		<span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/80">
			{data?.label}
		</span>
	</BaseNode>
);

// Plus
export const PlusNode: React.FC<NodeComponentProps> = ({ data, id }) => (
	<BaseNode data={data} id={id} className="min-w-[100px] min-h-[100px]">
		<div className="absolute inset-0 flex items-center justify-center">
			<div
				className="absolute w-[30%] h-[80%] rounded-[4px]"
				style={{ background: 'currentColor' }}
			/>
			<div
				className="absolute w-[80%] h-[30%] rounded-[4px]"
				style={{ background: 'currentColor' }}
			/>
		</div>
		<span className="absolute bottom-2 text-black/80">{data?.label}</span>
	</BaseNode>
);
