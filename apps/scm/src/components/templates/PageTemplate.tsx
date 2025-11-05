import React from 'react';
import Split from 'react-split';

interface PageTemplateProps {
	children: React.ReactNode;
	className?: string;
	firstChildWidth?: string;
	splitterSizes?: number[];
	splitterMinSize?: number[];
	splitterGutterSize?: number;
	onSplitChange?: (sizes: number[]) => void;
}

export const PageTemplate: React.FC<PageTemplateProps> = ({
	children,
	className = '',
	firstChildWidth = '50%',
	splitterSizes = [30, 70],
	splitterMinSize = [300, 400],
	splitterGutterSize = 5,
	onSplitChange,
}) => {
	// children이 배열이고 2개인 경우 분할 레이아웃 사용
	if (React.Children.count(children) === 2) {
		return (
			<div className={`w-full h-full ${className}`}>
				<Split
					sizes={splitterSizes}
					minSize={splitterMinSize}
					gutterSize={splitterGutterSize}
					direction="horizontal"
					gutterStyle={() => ({
						backgroundColor: '#e5e7eb',
						cursor: 'col-resize',
					})}
					onDragEnd={(sizes: number[]) => {
						if (onSplitChange) {
							onSplitChange(sizes);
						}
					}}
					className="h-full"
				>
					{React.Children.map(children, (child, index) => (
						<div key={index} className="h-full overflow-auto">
							{child}
						</div>
					))}
				</Split>
			</div>
		);
	}

	// 단일 children인 경우 일반 레이아웃
	return <div className={`w-full ${className}`}>{children}</div>;
};

export default PageTemplate;
