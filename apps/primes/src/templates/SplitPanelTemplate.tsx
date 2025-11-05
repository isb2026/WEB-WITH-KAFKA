import React, { ReactNode } from 'react';
import { useResponsive } from '@primes/hooks';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';

export interface SplitPanelTemplateProps {
	className?: string;
	// 높이 설정 추가
	height?: string;
	// 좌측 패널 - 데이터그리드용
	left: ReactNode;
	// 우측 패널
	right: ReactNode;
	// 패널 비율 설정
	leftPanelWidth?: string;
	rightPanelWidth?: string;
	// 패널 제목
	leftPanelTitle?: string;
	rightPanelTitle?: string;
	// 액션 버튼 제어
	useCreate?: boolean;
	useEdit?: boolean;
	useRemove?: boolean;
	// 액션 버튼 핸들러
	onCreate?: () => void;
	onEdit?: () => void;
	onRemove?: () => void;
	// 선택된 행이 있는지 확인
	hasSelection?: boolean;
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

export const SplitPanelTemplate: React.FC<SplitPanelTemplateProps> = ({
	left,
	right,
	className = '',
	height = '100%', // 기본값 설정
	leftPanelWidth = '70%',
	rightPanelWidth = '30%',
	leftPanelTitle,
	rightPanelTitle,
	useCreate = false,
	useEdit = false,
	useRemove = false,
	onCreate,
	onEdit,
	onRemove,
	hasSelection = false,
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
					{/* 우측 패널 */}
					<div className="w-full h-auto min-h-[200px]">
						{right}
					</div>
				</div>
			);
		}

		// 데스크톱: 좌우 패널 분할
		return (
			<div className="flex gap-4 h-full">
				{/* 좌측 패널 - 데이터그리드 직접 렌더링 */}
				<div 
					className="border rounded-lg overflow-hidden"
					style={{ width: leftPanelWidth }}
				>
					{left}
				</div>

				{/* 우측 패널 */}
				<div 
					className="border rounded-lg overflow-auto"
					style={{ width: rightPanelWidth }}
				>
					{rightPanelTitle && (
						<div className="px-4 py-2 text-base font-semibold text-gray-800 border-b bg-gray-50 rounded-t-lg flex items-center justify-between">
							<span>{rightPanelTitle}</span>
							<div className="flex items-center gap-1">
								{/* 액션 버튼들 */}
								{(useCreate || useEdit || useRemove) && (
									<ActionButtonsComponent
										useCreate={useCreate}
										useEdit={useEdit}
										useRemove={useRemove}
										create={onCreate}
										edit={onEdit}
										remove={onRemove}
										visibleText={false}
										classNames={{
											container: 'ml-auto',
										}}
									/>
								)}
							</div>
						</div>
					)}
					<div className="p-4 overflow-auto">
						{right}
					</div>
				</div>
			</div>
		);
	};

	return (
		<div 
			className={`w-full ${className}`}
			style={{ height }}
		>
			{renderContent()}
		</div>
	);
};

export default SplitPanelTemplate; 