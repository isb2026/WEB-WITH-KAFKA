import React from 'react';
import { Panel } from '@xyflow/react';
import { SHAPE_CONFIGS } from '../constants/shapes';
import { useShapeBar } from '../hooks';

export const ShapeBar: React.FC = () => {
	const { addShape, createDragData } = useShapeBar();

	return (
		<Panel
			position="top-left"
			className="rounded-xl border border-slate-200 bg-white shadow-sm"
		>
			<div className="p-3 grid grid-cols-4 gap-2">
				{SHAPE_CONFIGS.map((shape) => (
					<button
						key={shape.key}
						title={shape.label}
						onClick={() =>
							addShape(shape.key, shape.color, shape.label)
						}
						className="flex items-center justify-center w-9 h-9 rounded-md text-slate-400 hover:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
						draggable
						onDragStart={(e) => {
							if (!createDragData) return;
							e.dataTransfer.setData(
								'application/reactflow',
								createDragData(
									shape.key,
									shape.label,
									shape.color
								)
							);
							e.dataTransfer.effectAllowed = 'move';
						}}
					>
						{shape.icon}
					</button>
				))}
			</div>
		</Panel>
	);
};
