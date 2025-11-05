import React, { ReactNode } from 'react';
import { useResponsive } from '@primes/hooks';
import { SplitterComponent } from '@primes/components/common/Splitter';

export interface ThreePanelTemplateProps {
	className?: string;
	// 좌측 패널
	left: ReactNode;
	// 우측 상단 패널
	rightTop: ReactNode;
	// 우측 하단 패널
	rightBottom: ReactNode;
	// 좌측 패널 설정
	leftPanelWidth?: string;
	leftPanelMinWidth?: number;
	// 우측 상단/하단 패널 설정
	rightTopPanelHeight?: string;
	rightTopPanelMinHeight?: number;
	rightBottomPanelMinHeight?: number;
	// Splitter 설정
	horizontalGutterSize?: number;
	verticalGutterSize?: number;
	// 로딩 및 에러 상태
	isLoading?: boolean;
	error?: Error | null;
	loadingMessage?: string;
	errorMessage?: string;
}

// 로딩 컴포넌트
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

// 에러 컴포넌트
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

export const ThreePanelTemplate: React.FC<ThreePanelTemplateProps> = ({
	left,
	rightTop,
	rightBottom,
	className = '',
	leftPanelWidth = '30%',
	leftPanelMinWidth = 300,
	rightTopPanelHeight = '40%',
	rightTopPanelMinHeight = 200,
	rightBottomPanelMinHeight = 200,
	horizontalGutterSize = 8,
	verticalGutterSize = 8,
	isLoading = false,
	error = null,
	loadingMessage,
	errorMessage,
}) => {
	const { isMobile, isTablet } = useResponsive();

	// 로딩 상태 표시
	if (isLoading) {
		return (
			<div className={`w-full h-full ${className}`}>
				<LoadingState message={loadingMessage} />
			</div>
		);
	}

	// 에러 상태 표시
	if (error) {
		return (
			<div className={`w-full h-full ${className}`}>
				<ErrorState error={error} message={errorMessage} />
			</div>
		);
	}

	const renderContent = () => {
		// 모바일/태블릿: 세로 배치
		if (isMobile || isTablet) {
			return (
				<div className="flex flex-col w-full h-full gap-4">
					{/* 좌측 패널 (모바일에서는 상단) */}
					<div className="w-full h-auto min-h-[300px]">
						{left}
					</div>
					{/* 우측 상단 패널 */}
					<div className="w-full h-auto min-h-[200px]">
						{rightTop}
					</div>
					{/* 우측 하단 패널 */}
					<div className="w-full h-auto min-h-[200px]">
						{rightBottom}
					</div>
				</div>
			);
		}

		// 데스크톱: 3개 패널 분할
		return (
			<div className="w-full h-full flex gap-2">
				{/* 좌측 패널 */}
				<div
					className="flex-shrink-0 overflow-hidden h-full"
					style={{
						width: leftPanelWidth,
						minWidth: leftPanelMinWidth,
					}}
				>
					{left}
				</div>

				{/* 우측 패널 (상단/하단 분할) */}
				<div className="flex-1 overflow-hidden h-full">
					<SplitterComponent
						direction="vertical"
						sizes={[40, 60]}
						minSize={[rightTopPanelMinHeight, rightBottomPanelMinHeight]}
						gutterSize={verticalGutterSize}
					>
						{/* 우측 상단 패널 */}
						<div className="overflow-hidden h-full">
							{rightTop}
						</div>
						{/* 우측 하단 패널 */}
						<div className="overflow-hidden h-full">
							{rightBottom}
						</div>
					</SplitterComponent>
				</div>
			</div>
		);
	};

	return (
		<div className={`w-full h-full ${className}`}>
			{renderContent()}
		</div>
	);
};

export default ThreePanelTemplate; 