// SplitPane.tsx
import React, { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import Split, { SplitProps } from 'react-split';
import { StyledSplit } from './styled';

interface SplitPanelProps extends SplitProps {
	children: ReactNode;
	direction: 'horizontal' | 'vertical';
	sizes?: number[];
	minSize?: number | number[];
	gutterSize?: number;
	width?: string | number;
	height?: string | number;
	overflow?: string;
	containerHeight?: number;
}

export const SplitPanelComponent: React.FC<SplitPanelProps> = ({
	children,
	direction,
	sizes = [50, 50],
	minSize = 100,
	gutterSize = 1.5,
	width = '100%',
	height = '100%',
	overflow,
	containerHeight,
	...props
}) => {
	// 외부 래퍼 div를 측정하기 위한 ref
	const containerRef = useRef<HTMLDivElement>(null);
	const [containerSize, setContainerSize] = useState({
		width: 0,
		height: 0,
	});

	useLayoutEffect(() => {
		if (containerRef.current) {
			const { clientWidth, clientHeight } = containerRef.current;
			setContainerSize({ width: clientWidth, height: clientHeight });
		}
	}, []);

	return (
		<div
			ref={containerRef}
			style={{
				width: typeof width === 'number' ? `${width}px` : width,
				height: typeof height === 'number' ? `${height}px` : height,
			}}
		>
			<StyledSplit
				split={direction}
				sizes={sizes}
				minSize={minSize}
				gutterSize={gutterSize}
				width={typeof width === 'number' ? `${width}px` : width}
				height={typeof height === 'number' ? `${height}px` : height}
				overflow={overflow ? overflow : 'auto'}
				{...props}
			>
				{children}
			</StyledSplit>
		</div>
	);
};
