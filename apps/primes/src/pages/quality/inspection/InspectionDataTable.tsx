import React, { useMemo, useCallback, memo, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import {
	RadixTabsRoot,
	RadixTabsList,
	RadixTabsTrigger,
	RadixIconButton,
} from '@repo/radix-ui/components';
import { useTranslation } from '@repo/i18n';
import { useResponsive } from '@primes/hooks';
import { CheckingSpecData } from '@primes/types/qms/checkingSpec';
import { ItemProgressDto } from '@primes/types/progress';

// 컬럼 정의 타입
export interface InspectionColumn {
	accessorKey: string;
	header: string;
	size: number;
}

// 탭 정의 타입
export interface InspectionTab {
	value: string;
	label: string;
}

// 액션 버튼 타입
export interface ActionButton {
	icon: React.ReactNode;
	label: string;
	onClick: () => void;
	disabled?: boolean;
	className?: string;
}

// Progress 정보 타입 추가
export interface ProgressInfo {
	progresses: ItemProgressDto[];
	isLoading: boolean;
	error: Error | null;
	hasProgress: boolean;
	totalCount: number;
}

// 테이블 props 인터페이스
export interface InspectionDataTableProps {
	// 필수 props
	data: CheckingSpecData[];
	selectedItemId: number | null;
	progressInfo: ProgressInfo; // 🔧 전체 공정 정보 추가
	activeTab: string;
	setActiveTab: (tab: string) => void;

	// 선택적 props
	columns?: InspectionColumn[];
	tableTitle?: string;
	showActionButtons?: boolean;
	showTableTabs?: boolean;
	showSearch?: boolean;
	showPagination?: boolean;

	// 액션 핸들러
	onAdd?: () => void;
	onDelete?: () => void;
	onRowSelectionChange?: (selectedRows: Set<string>) => void;

	// 커스터마이징
	customActionButtons?: ActionButton[];
	customNoProgressState?: React.ReactNode;
	customNoItemState?: React.ReactNode;

	// 스타일링
	className?: string;
	tableClassName?: string;
	headerOffset?: string;

	// 테이블 설정
	pageSize?: number;
	initialPage?: number;
}

// 기본값 정의
const defaultProps: Partial<InspectionDataTableProps> = {
	columns: [],
	tableTitle: '',
	showActionButtons: true,
	showTableTabs: true,
	showSearch: false,
	showPagination: false,
	onAdd: () => {},
	onDelete: () => {},
	onRowSelectionChange: () => {},
	customActionButtons: [],
	className: '',
	tableClassName: '',
	headerOffset: '600px',
	pageSize: 10,
	initialPage: 1,
};

// 기본 컬럼 정의
const getDefaultColumns = (t: (key: string) => string): InspectionColumn[] => [
	{
		accessorKey: 'checkingName',
		header: t('columns.checkingName'),
		size: 150,
	},
	{
		accessorKey: 'standard',
		header: t('columns.standard'),
		size: 100,
	},
	{
		accessorKey: 'standardUnit',
		header: t('columns.standardUnit'),
		size: 80,
	},
	{
		accessorKey: 'checkPeriod',
		header: t('columns.checkPeriod'),
		size: 100,
	},
	{
		accessorKey: 'sampleQuantity',
		header: t('columns.sampleQuantity'),
		size: 80,
	},
	{
		accessorKey: 'orderNo',
		header: t('columns.order'),
		size: 80,
	},
];

// 메모이제이션된 상태 메시지 컴포넌트들
const DefaultEmptyState = memo(() => (
	<div className="flex flex-col items-center justify-center h-[calc(100vh-210px)] text-center transition-opacity duration-200">
		<div className="text-lg font-medium text-gray-600 mb-2">
			데이터가 없습니다
		</div>
		<div className="text-sm text-gray-500">표시할 데이터가 없습니다.</div>
	</div>
));

const DefaultNoProgressState = memo(() => (
	<div className="flex flex-col items-center justify-center h-[calc(100vh-210px)] text-center transition-opacity duration-200">
		<div className="text-lg font-medium text-gray-600 mb-2">
			제품에 공정이 없습니다
		</div>
		<div className="text-sm text-gray-500">
			선택된 제품에 등록된 공정 정보가 없습니다.
		</div>
	</div>
));

const DefaultNoItemState = memo(() => (
	<div className="flex flex-col items-center justify-center h-[calc(100vh-210px)] text-center transition-opacity duration-200">
		<div className="text-lg font-medium text-gray-600 mb-2">
			품목을 선택해주세요
		</div>
		<div className="text-sm text-gray-500">
			왼쪽에서 검사할 품목을 선택해주세요.
		</div>
	</div>
));

const ProgressLoadingState = memo(() => (
	<div className="flex flex-col items-center justify-center h-[calc(100vh-210px)] text-center transition-opacity duration-200">
		<div className="text-lg font-medium text-gray-600 mb-2">
			공정 정보를 불러오는 중...
		</div>
		<div className="text-sm text-gray-500">잠시만 기다려주세요.</div>
	</div>
));

const ProgressErrorState = memo<{ error: Error }>(({ error }) => (
	<div className="flex flex-col items-center justify-center h-[calc(100vh-210px)] text-center transition-opacity duration-200">
		<div className="text-lg font-medium text-red-600 mb-2">
			공정 정보 로딩 실패
		</div>
		<div className="text-sm text-red-500">{error.message}</div>
	</div>
));

// 메인 컴포넌트 정의
const InspectionDataTable: React.FC<InspectionDataTableProps> = (props) => {
	// props와 기본값 병합
	const {
		data,
		selectedItemId,
		progressInfo,
		activeTab,
		setActiveTab,
		columns,
		tableTitle,
		showActionButtons,
		showTableTabs,
		showSearch,
		showPagination,
		onAdd,
		onDelete,
		onRowSelectionChange,
		customActionButtons,
		customNoProgressState,
		customNoItemState,
		className,
		tableClassName,
		headerOffset,
		pageSize,
		initialPage,
	} = { ...defaultProps, ...props };

	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const { isMobile } = useResponsive();

	// 컬럼 정의 (사용자 정의 또는 기본값)
	const inspectionColumns = useMemo(
		() => columns || getDefaultColumns(t),
		[columns, t]
	);

	// 테이블 설정
	const inspectionTable = useDataTable(
		data,
		inspectionColumns,
		pageSize || 10,
		initialPage || 1,
		0,
		data.length
	);

	// Progress 기반 동적 탭 생성
	const inspectionTabs = useMemo(() => {
		if (!showTableTabs || progressInfo.progresses.length === 0) {
			return [];
		}

		return progressInfo.progresses.map((progress) => ({
			value: `progress_${progress.id}`,
			label: progress.progressName || `공정 ${progress.progressOrder}`,
		}));
	}, [progressInfo.progresses, showTableTabs]);

	// 첫 번째 공정 자동 선택
	useEffect(() => {
		if (
			showTableTabs &&
			progressInfo.progresses.length > 0 &&
			!progressInfo.isLoading &&
			!progressInfo.error
		) {
			const firstProgress = progressInfo.progresses[0];
			const firstProgressTab = `progress_${firstProgress.id}`;

			// activeTab이 비어있거나 유효하지 않은 경우에만 첫 번째 공정으로 설정
			if (
				!activeTab ||
				!progressInfo.progresses.some(
					(p) => `progress_${p.id}` === activeTab
				)
			) {
				setActiveTab(firstProgressTab);
			}
		}
	}, [
		progressInfo.progresses,
		progressInfo.isLoading,
		progressInfo.error,
		showTableTabs,
		// activeTab과 setActiveTab 제거
	]);

	// 행 선택 변경 핸들러를 useCallback으로 메모이제이션
	const handleRowSelectionChange = useCallback(
		(rowId: string) => {
			inspectionTable.toggleRowSelection(rowId);
			onRowSelectionChange?.(inspectionTable.selectedRows);
		},
		[inspectionTable, onRowSelectionChange]
	);

	// 액션 핸들러들을 useCallback으로 메모이제이션
	const handleAdd = useCallback(() => {
		onAdd?.();
	}, [onAdd]);

	const handleDelete = useCallback(() => {
		onDelete?.();
	}, [onDelete]);

	// 상태별 렌더링 로직을 useMemo로 메모이제이션
	const mainContent = useMemo(() => {
		if (!selectedItemId) {
			return customNoItemState || <DefaultNoItemState />;
		}

		// Progress 로딩 중
		if (progressInfo.isLoading) {
			return <ProgressLoadingState />;
		}

		// Progress 에러 발생
		if (progressInfo.error) {
			return <ProgressErrorState error={progressInfo.error} />;
		}

		// Progress가 없는 경우 (로딩 완료 후 확인)
		if (!progressInfo.hasProgress) {
			return customNoProgressState || <DefaultNoProgressState />;
		}

		// 정상 테이블 렌더링
		return (
			<DatatableComponent
				table={inspectionTable.table}
				columns={inspectionColumns}
				data={data}
				tableTitle={
					tableTitle || tCommon('pages.titles.inspectionItems')
				}
				rowCount={data.length}
				useSearch={showSearch}
				usePageNation={showPagination}
				selectedRows={inspectionTable.selectedRows}
				toggleRowSelection={handleRowSelectionChange}
				headerOffset={headerOffset}
				actionButtons={
					showActionButtons ? (
						<div className="flex justify-end gap-2">
							{/* 기본 액션 버튼들 */}
							{onAdd && (
								<RadixIconButton
									onClick={handleAdd}
									className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg ${isMobile ? 'text-xs' : 'text-sm'} items-center border transition-all duration-200 hover:bg-gray-50`}
								>
									<Plus size={14} />
									{tCommon('tabs.actions.add')}
								</RadixIconButton>
							)}

							{onDelete && (
								<RadixIconButton
									onClick={handleDelete}
									disabled={
										inspectionTable.selectedRows.size === 0
									}
									className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg ${isMobile ? 'text-xs' : 'text-sm'} items-center border transition-all duration-200 hover:bg-gray-50 ${inspectionTable.selectedRows.size === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
								>
									<Trash2 size={16} />
									{tCommon('delete')}
								</RadixIconButton>
							)}

							{/* 커스텀 액션 버튼들 */}
							{customActionButtons?.map((button, index) => (
								<RadixIconButton
									key={index}
									onClick={button.onClick}
									disabled={button.disabled}
									className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg ${isMobile ? 'text-xs' : 'text-sm'} items-center border transition-all duration-200 hover:bg-gray-50 ${button.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${button.className || ''}`}
								>
									{button.icon}
									{button.label}
								</RadixIconButton>
							))}
						</div>
					) : undefined
				}
				tableTabs={
					showTableTabs && inspectionTabs.length > 0 ? (
						<RadixTabsRoot
							value={activeTab}
							onValueChange={setActiveTab}
						>
							<RadixTabsList className="inline-flex items-center w-full justify-start">
								{inspectionTabs.map((tab) => (
									<RadixTabsTrigger
										key={tab.value}
										value={tab.value}
										className={`inline-flex border-r gap-2 items-center justify-center whitespace-nowrap ${isMobile ? 'px-2 py-1.5 text-xs' : 'px-4 py-2 text-sm'} font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]`}
									>
										{tab.label}
									</RadixTabsTrigger>
								))}
							</RadixTabsList>
						</RadixTabsRoot>
					) : undefined
				}
			/>
		);
	}, [
		selectedItemId,
		progressInfo.isLoading,
		progressInfo.error,
		progressInfo.hasProgress,
		data.length,
		customNoItemState,
		customNoProgressState,
		inspectionTable.table,
		inspectionColumns,
		tableTitle,
		tCommon,
		showSearch,
		showPagination,
		handleRowSelectionChange,
		headerOffset,
		showActionButtons,
		onAdd,
		onDelete,
		customActionButtons,
		isMobile,
		showTableTabs,
		inspectionTabs,
		activeTab,
		setActiveTab,
	]);

	return (
		<div
			className={`h-full border rounded-lg transition-all duration-200 ${className || ''} ${tableClassName || ''}`}
		>
			<div className="h-full flex flex-col">{mainContent}</div>
		</div>
	);
};

// 메인 컴포넌트를 memo로 감싸서 export
export default memo(InspectionDataTable);
