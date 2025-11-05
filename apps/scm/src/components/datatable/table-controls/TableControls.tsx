import React from 'react';

export interface TableControlsProps {
	tableTitle?: string;
	rowCount?: number;
	actionButtons?: React.ReactNode;
	searchSlot?: React.ReactNode;
	useSearch?: boolean;
	children?: React.ReactNode;
}

export const TableControls: React.FC<TableControlsProps> = ({
	tableTitle,
	rowCount = 0,
	actionButtons,
	searchSlot,
	useSearch = false,
	children,
}) => {
	return (
		<div className="flex items-center justify-between p-3 border-b bg-gray-50">
			{/* 좌측: 액션 버튼들 */}
			<div className="flex items-center gap-3">
				{actionButtons && (
					<div className="flex gap-2">{actionButtons}</div>
				)}
				{children}
			</div>

			{/* 우측: 검색 및 컨트롤 */}
			<div className="flex items-center gap-4">
				{/* 아이템 수 뱃지 */}
				{useSearch && (
					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-600">총</span>
						<span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
							{rowCount}개
						</span>
						<span className="text-sm text-gray-600">항목</span>
					</div>
				)}

				{/* 검색 영역 */}
				{searchSlot}

				{/* 테이블 컨텍스트 메뉴 (향후 확장 예정) */}
				<div className="flex items-center gap-2">
					<button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
};

export default TableControls;
