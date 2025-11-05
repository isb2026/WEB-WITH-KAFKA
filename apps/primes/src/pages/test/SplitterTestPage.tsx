import React, { ReactNode } from 'react';
import Split, { SplitProps } from 'react-split';
import styled from 'styled-components';
import {
	FileText,
	Code,
	Database,
	Settings,
	BarChart3,
	Users,
	Image,
	Monitor,
} from 'lucide-react';
import {
	SplitterComponent,
	SplitterPanel,
} from '@primes/components/common/Splitter';

interface SplitterTestProps {
	containerRef: React.RefObject<HTMLDivElement>;
	splitRef: React.RefObject<Split>;
	direction: 'horizontal' | 'vertical';
	currentSizes: number[];
	minSize: number | number[];
	gutterSize: number;
	width: string | number;
	height: string | number;
	overflow: string;
	containerSize: { width: number; height: number };
	handleDragEnd: (newSizes: number[]) => void;
	children: ReactNode;
}

interface StyledSplitterProps extends SplitProps {
	width?: string;
	height?: string;
	containerWidth?: number;
	containerHeight?: number;
	direction: 'vertical' | 'horizontal';
	overflow: string;
}

const StyledSplitter = styled(Split)<StyledSplitterProps>`
	display: flex;
	width: ${({ width }: { width?: string }) => width ?? '100%'};
	height: ${({ height }: { height?: string }) => height ?? '100%'};
	flex-direction: ${({
		direction,
	}: {
		direction: 'vertical' | 'horizontal';
	}) => (direction === 'vertical' ? 'column' : 'row')};
	overflow: ${({ overflow }: { overflow: string }) => overflow};
	transition: none !important;

	/* Gutter Styles - Default for horizontal splitters */
	.gutter {
		background: transparent; /* Make background transparent */
		position: relative;
		transition: none !important;
		cursor: col-resize; /* Default cursor for horizontal split */
		z-index: 10;
		visibility: visible; /* Always visible */

		/* Create a smaller centered handle for horizontal split */
		&::before {
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 5px; /* Thin vertical line for horizontal split */
			height: 60px; /* Tall handle for horizontal split */
			background: #d1d5db;
			border-radius: 4px;
			transition: all 0.2s ease; /* Add smooth transition */
		}

		&:hover::before {
			background: #65a7ff;
			width: 7px; /* Thicker on hover */
			height: 80px; /* Taller on hover */
		}

		&:active::before {
			background: #3b82f6;
			width: 8px;
			height: 80px;
		}
	}

	/* Vertical gutter specific styles - Override for vertical splitters */
	&[data-direction='vertical'] .gutter {
		cursor: row-resize; /* Row resize cursor for vertical split */

		&::before {
			width: 60px; /* Wide handle for vertical split */
			height: 5px; /* Thin horizontal line for vertical split */
		}

		&:hover::before {
			width: 80px; /* Wider on hover */
			height: 8px; /* Thicker on hover */
		}

		&:active::before {
			width: 80px;
			height: 8px;
		}
	}

	/* Panel Styles */
	.splitter-panel {
		display: flex;
		flex-direction: column;
		background: #ffffff;
		border-radius: 8px;
		overflow: hidden;
		transition: none !important;

		.panel-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 12px 16px;
			background: #f9fafb;
			border-bottom: 1px solid #e5e7eb;
			min-height: 48px;
			transition: none !important;

			.panel-title {
				font-weight: 600;
				font-size: 14px;
				color: #374151;
			}
		}

		.panel-content {
			flex: 1;
			padding: 16px;
			overflow: auto;
			background: #ffffff;
			transition: none !important;
		}
	}

	/* Loading state */
	&.loading {
		opacity: 0.7;
		pointer-events: none;
	}

	/* Error state */
	&.error {
		border: 2px solid #ef4444;
	}

	/* Success state */
	&.success {
		border: 2px solid #10b981;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.splitter-panel {
			.panel-header {
				padding: 8px 12px;
				min-height: 40px;

				.panel-title {
					font-size: 13px;
				}
			}

			.panel-content {
				padding: 12px;
			}
		}
	}

	/* Container Styles */
	.splitter-container {
		position: relative;
	}
`;

export const SplitterTest: React.FC<SplitterTestProps> = ({
	containerRef,
	splitRef,
	direction,
	currentSizes,
	minSize,
	gutterSize,
	width,
	height,
	overflow,
	containerSize,
	handleDragEnd,
	children,
	...props
}) => {
	return (
		<div
			ref={containerRef}
			className="splitter-container"
			style={{
				width: typeof width === 'number' ? `${width}px` : width,
				height: typeof height === 'number' ? `${height}px` : height,
			}}
		>
			<StyledSplitter
				ref={splitRef}
				direction={direction}
				sizes={currentSizes}
				minSize={minSize}
				gutterSize={gutterSize}
				width={typeof width === 'number' ? `${width}px` : width}
				height={typeof height === 'number' ? `${height}px` : height}
				containerWidth={containerSize.width}
				containerHeight={containerSize.height}
				overflow={overflow}
				snapOffset={0}
				dragInterval={0}
				expandToMin={false}
				onDragEnd={handleDragEnd}
				data-direction={direction}
				{...props}
			>
				{children}
			</StyledSplitter>
		</div>
	);
};

const SplitterTestPage: React.FC = () => {
	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Splitter Component
					</h1>
					<p className="text-gray-600">
						A flexible and responsive splitter component with drag
						and drop functionality
					</p>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
					<div className="p-4 rounded-lg border bg-white border-gray-200">
						<h3 className="font-semibold mb-2">Drag & Drop</h3>
						<p className="text-sm">
							Intuitive mouse drag to resize panels
						</p>
					</div>
					<div className="p-4 rounded-lg border bg-white border-gray-200">
						<h3 className="font-semibold mb-2">Panel Headers</h3>
						<p className="text-sm">
							Clean panel headers with titles
						</p>
					</div>
					<div className="p-4 rounded-lg border bg-white border-gray-200">
						<h3 className="font-semibold mb-2">
							Responsive Design
						</h3>
						<p className="text-sm">
							Works perfectly on all screen sizes
						</p>
					</div>
				</div>

				{/* Examples Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Horizontal Splitter */}
					<div className="space-y-4">
						<h2 className="text-xl font-semibold text-gray-900">
							Horizontal Splitter
						</h2>
						<div className="h-64 border rounded-lg overflow-hidden">
							<SplitterComponent direction="horizontal">
								<SplitterPanel title="Left Panel">
									<div className="space-y-4">
										<h3 className="font-semibold">
											Navigation
										</h3>
										<div className="space-y-2">
											<div className="flex items-center gap-2 text-sm">
												<FileText size={16} />
												<span>Documents</span>
											</div>
											<div className="flex items-center gap-2 text-sm">
												<Code size={16} />
												<span>Code</span>
											</div>
											<div className="flex items-center gap-2 text-sm">
												<Database size={16} />
												<span>Database</span>
											</div>
										</div>
									</div>
								</SplitterPanel>
								<SplitterPanel title="Right Panel">
									<div className="space-y-4">
										<h3 className="font-semibold">
											Content Area
										</h3>
										<p className="text-sm text-gray-600">
											This is the main content area. You
											can resize the panels by dragging
											the gutter.
										</p>
										<div className="bg-gray-100 p-3 rounded">
											<code className="text-xs">
												Drag the gutter to resize
											</code>
										</div>
									</div>
								</SplitterPanel>
							</SplitterComponent>
						</div>
					</div>

					{/* Vertical Splitter */}
					<div className="space-y-4">
						<h2 className="text-xl font-semibold text-gray-900">
							Vertical Splitter
						</h2>
						<div className="h-64 border rounded-lg overflow-hidden">
							<SplitterComponent direction="vertical">
								<SplitterPanel title="Top Panel">
									<div className="space-y-4">
										<h3 className="font-semibold">
											Header Section
										</h3>
										<p className="text-sm text-gray-600">
											This is the top panel. Drag the
											gutter to resize vertically.
										</p>
									</div>
								</SplitterPanel>
								<SplitterPanel title="Bottom Panel">
									<div className="space-y-4">
										<h3 className="font-semibold">
											Main Content
										</h3>
										<div className="bg-gray-100 p-3 rounded">
											<code className="text-xs">
												Drag the gutter to resize
											</code>
										</div>
									</div>
								</SplitterPanel>
							</SplitterComponent>
						</div>
					</div>

					{/* Three Panel Layout */}
					<div className="space-y-4">
						<h2 className="text-xl font-semibold text-gray-900">
							Three Panel Layout
						</h2>
						<div className="h-64 border rounded-lg overflow-hidden">
							<SplitterComponent
								direction="horizontal"
								sizes={[25, 50, 25]}
							>
								<SplitterPanel title="Sidebar">
									<div className="space-y-4">
										<h3 className="font-semibold">
											Navigation
										</h3>
										<div className="space-y-2">
											<div className="flex items-center gap-2 text-sm">
												<Settings size={16} />
												<span>Settings</span>
											</div>
											<div className="flex items-center gap-2 text-sm">
												<BarChart3 size={16} />
												<span>Analytics</span>
											</div>
										</div>
									</div>
								</SplitterPanel>
								<SplitterPanel title="Main Content">
									<div className="space-y-4">
										<h3 className="font-semibold">
											Dashboard
										</h3>
										<p className="text-sm text-gray-600">
											Main content area with three panels.
											Drag the gutters to resize.
										</p>
									</div>
								</SplitterPanel>
								<SplitterPanel title="Details">
									<div className="space-y-4">
										<h3 className="font-semibold">
											Details Panel
										</h3>
										<div className="space-y-2">
											<div className="flex items-center gap-2 text-sm">
												<Users size={16} />
												<span>Users</span>
											</div>
											<div className="flex items-center gap-2 text-sm">
												<Image size={16} />
												<span>Media</span>
											</div>
										</div>
									</div>
								</SplitterPanel>
							</SplitterComponent>
						</div>
					</div>

					{/* Code Editor Layout */}
					<div className="space-y-4">
						<h2 className="text-xl font-semibold text-gray-900">
							Code Editor Layout
						</h2>
						<div className="h-64 border rounded-lg overflow-hidden">
							<SplitterComponent
								direction="vertical"
								sizes={[70, 30]}
							>
								<SplitterPanel title="Code Editor">
									<div className="space-y-4">
										<div className="flex items-center gap-2">
											<Code size={16} />
											<span className="font-semibold">
												main.tsx
											</span>
										</div>
										<div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono">
											<div>
												import React from 'react';
											</div>
											<div>
												import &#123; SplitterComponent
												&#125; from './Splitter';
											</div>
											<div></div>
											<div>
												const App = () =&gt; &#123;
											</div>
											<div> return (</div>
											<div>
												{' '}
												&lt;SplitterComponent&gt;
											</div>
											<div>
												{' '}
												&lt;Panel&gt;Content&lt;/Panel&gt;
											</div>
											<div>
												{' '}
												&lt;/SplitterComponent&gt;
											</div>
											<div> );</div>
											<div>&#125;;</div>
										</div>
									</div>
								</SplitterPanel>
								<SplitterPanel title="Terminal">
									<div className="space-y-4">
										<div className="flex items-center gap-2">
											<Monitor size={16} />
											<span className="font-semibold">
												Terminal
											</span>
										</div>
										<div className="bg-gray-900 text-gray-300 p-3 rounded text-xs font-mono">
											<div>$ npm start</div>
											<div>
												Starting development server...
											</div>
											<div>
												✓ Ready on http://localhost:3000
											</div>
										</div>
									</div>
								</SplitterPanel>
							</SplitterComponent>
						</div>
					</div>

					{/* Before/After Comparison */}
					<div className="space-y-4">
						<h2 className="text-xl font-semibold text-gray-900">
							Before/After Comparison
						</h2>
						<div className="h-64 border rounded-lg overflow-hidden">
							<SplitterComponent
								direction="horizontal"
								sizes={[50, 50]}
							>
								<SplitterPanel title="Before">
									<div className="space-y-4">
										<div className="flex items-center gap-2">
											<Image size={16} />
											<span className="font-semibold">
												Original
											</span>
										</div>
										<div className="bg-gray-200 h-20 rounded flex items-center justify-center">
											<span className="text-gray-500 text-sm">
												Before Image
											</span>
										</div>
									</div>
								</SplitterPanel>
								<SplitterPanel title="After">
									<div className="space-y-4">
										<div className="flex items-center gap-2">
											<Image size={16} />
											<span className="font-semibold">
												Modified
											</span>
										</div>
										<div className="bg-blue-100 h-20 rounded flex items-center justify-center">
											<span className="text-blue-600 text-sm">
												After Image
											</span>
										</div>
									</div>
								</SplitterPanel>
							</SplitterComponent>
						</div>
					</div>
				</div>

				{/* Usage Instructions */}
				<div className="mt-12 p-6 bg-white rounded-lg border border-gray-200">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Usage Instructions
					</h2>
					<div>
						<h3 className="font-semibold mb-2">
							Mouse Interaction
						</h3>
						<ul className="space-y-1 text-sm text-gray-600">
							<li>• Drag the gutter between panels to resize</li>
							<li>• Hover over gutter to see resize cursor</li>
							<li>• Click and drag for precise control</li>
							<li>• Works with touch devices</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SplitterTestPage;
