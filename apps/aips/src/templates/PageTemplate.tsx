import React from 'react';
import { TabTemplate, TabItem } from './TabTemplate';
import { useResponsive } from '@primes/hooks';
import { SplitterComponent } from '@primes/components/common/Splitter';

export interface PageTemplateProps {
	children?: React.ReactNode;
	className?: string;
	firstChildWidth?: string;
	tabs?: TabItem[];
	defaultTabValue?: string;
	onTabValueChange?: (value: string) => void;
	// Splitter configuration
	splitterSizes?: number[];
	splitterMinSize?: number | number[];
	splitterGutterSize?: number;
	// Loading and error states
	isLoading?: boolean;
	error?: Error | null;
	loadingMessage?: string;
	errorMessage?: string;
}

// Loading Component
const LoadingState: React.FC<{ message?: string }> = ({
	message = '데이터를 불러오는 중...',
}) => (
	<div className="flex items-center justify-center h-64">
		<div className="text-center">
			<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
			<p className="text-gray-600">{message}</p>
		</div>
	</div>
);

// Error Component
const ErrorState: React.FC<{ error?: Error | null; message?: string }> = ({
	error,
	message = '데이터를 불러오는데 실패했습니다.',
}) => (
	<div className="flex items-center justify-center h-64">
		<div className="text-center">
			<div className="text-red-600 mb-4">⚠️</div>
			<p className="text-gray-600">{message}</p>
			{error?.message && (
				<p className="text-sm text-gray-500 mt-2">{error.message}</p>
			)}
		</div>
	</div>
);

export const PageTemplate: React.FC<PageTemplateProps> = ({
	children,
	className = '',
	firstChildWidth = '50%',
	tabs,
	defaultTabValue,
	onTabValueChange,
	splitterSizes = [30, 70],
	splitterMinSize = [340, 530],
	splitterGutterSize = 5,
	isLoading = false,
	error = null,
	loadingMessage,
	errorMessage,
}) => {
	const childrenArray = React.Children.toArray(children);
	const hasOneChild = childrenArray.length === 1;
	const hasTwoChildren = childrenArray.length === 2;
	const { isMobile, isTablet } = useResponsive();

	// Show loading state
	if (isLoading) {
		return (
			<div className={`w-full ${className}`}>
				<LoadingState message={loadingMessage} />
			</div>
		);
	}

	// Show error state
	if (error) {
		return (
			<div className={`w-full ${className}`}>
				<ErrorState error={error} message={errorMessage} />
			</div>
		);
	}

	const renderContent = () => {
		if (tabs && tabs.length > 0) {
			return (
				<TabTemplate
					tabs={tabs}
					defaultValue={defaultTabValue}
					onValueChange={onTabValueChange}
					className="w-full"
				/>
			);
		}

		if (hasOneChild) {
			return <div className="w-full">{children}</div>;
		}

		if (hasTwoChildren) {
			// Use responsive layout for mobile/tablet, splitter for desktop
			if (isMobile || isTablet) {
				return (
					<div
						className="flex w-full gap-4 h-full"
						style={{
							flexDirection:
								isMobile || isTablet ? 'column' : 'row',
						}}
					>
						<div
							className="w-full md:flex-shrink-0 h-full"
							style={{
								width:
									isMobile || isTablet
										? '100%'
										: firstChildWidth,
							}}
						>
							{childrenArray[0]}
						</div>
						<div className="flex-1 overflow-hidden">
							{childrenArray[1]}
						</div>
					</div>
				);
			}

			// Desktop: Use splitter for resizable panels (default behavior)
			return (
				<SplitterComponent
					direction="horizontal"
					sizes={splitterSizes}
					minSize={splitterMinSize}
					gutterSize={splitterGutterSize}
					height="100%"
				>
					{childrenArray[0]}
					{childrenArray[1]}
				</SplitterComponent>
			);
		}

		return <div className="w-full">{children}</div>;
	};

	return <div className={`w-full ${className}`}>{renderContent()}</div>;
};

export default PageTemplate;
