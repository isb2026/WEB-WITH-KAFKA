import React, { ReactNode, useState, useRef, useLayoutEffect } from 'react';
import Split from 'react-split';
import { SplitterTest } from '@primes/pages/test/SplitterTestPage';

interface SplitterPanelProps {
	children: ReactNode;
	title?: string;
	panelIndex?: number;
}

interface SplitterComponentProps {
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

export const SplitterPanel: React.FC<SplitterPanelProps> = ({
	children,
	title,
}) => {
	return (
		<div className="splitter-panel">
			{title && (
				<div className="panel-header">
					<span className="panel-title">{title}</span>
				</div>
			)}
			<div className="panel-content">{children}</div>
		</div>
	);
};

export const SplitterComponent: React.FC<SplitterComponentProps> = ({
	children,
	direction,
	sizes = [50, 50],
	minSize = 100,
	gutterSize = 4,
	width = '100%',
	height = '100%',
	overflow = 'auto',
	...props
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const splitRef = useRef<Split>(null);
	const [containerSize, setContainerSize] = useState({
		width: 0,
		height: 0,
	});
	const [currentSizes, setCurrentSizes] = useState<number[]>(sizes);

	useLayoutEffect(() => {
		if (containerRef.current) {
			const { clientWidth, clientHeight } = containerRef.current;
			setContainerSize({ width: clientWidth, height: clientHeight });
		}
	}, []);

	const handleDragEnd = (newSizes: number[]) => {
		setCurrentSizes(newSizes);
	};

	return (
		<SplitterTest
			containerRef={containerRef}
			splitRef={splitRef}
			direction={direction}
			currentSizes={currentSizes}
			minSize={minSize}
			gutterSize={gutterSize}
			width={width}
			height={height}
			overflow={overflow}
			containerSize={containerSize}
			handleDragEnd={handleDragEnd}
			children={React.Children.map(children, (child, index) => {
				if (
					React.isValidElement(child) &&
					child.type === SplitterPanel
				) {
					return React.cloneElement(child, {
						...child.props,
						panelIndex: index,
					});
				}
				return child;
			})}
			{...props}
		/>
	);
};
