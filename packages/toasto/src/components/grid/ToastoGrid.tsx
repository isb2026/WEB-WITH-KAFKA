import React, {
	useState,
	useRef,
	useEffect,
	useCallback,
	useImperativeHandle,
	forwardRef,
	useLayoutEffect,
} from 'react';
import Grid from 'tui-grid';
import { GridOptions, GridEventName } from 'tui-grid/types';
import {
	ToastoPaginationComponents,
	PageNationType,
	PaginationRefType,
} from './TuiPagination';
import 'tui-grid/dist/tui-grid.css';
import {
	GridHeader,
	GridDiv,
	StyledGridContainer,
	PageNationContainer,
	PageSizeContainer,
	Container,
} from '../common';
import { makeRowHeaders } from './utils';

export interface BasicToastoGridProps extends Omit<GridOptions, 'el'> {
	gridOptions?: any;
	usePagination?: boolean;
	useSearch?: boolean;
	pageNation?: PageNationType;
	useGridHeaders?: boolean;
	gridHeader?: React.ReactNode;
	singleCheck?: boolean;
	customEvents?: Partial<Record<GridEventName, (e?: any) => void>>;
	onRowCheckChange?: (
		selectedRowId: string | null,
		selectedRowData?: any
	) => void;
	minHeight?: string | null;
}

export interface ToastoGridComponentType {
	getGridInstance: () => Grid | null;
}

export const ToastoGridComponent = forwardRef<
	ToastoGridComponentType | null,
	BasicToastoGridProps
>(
	(
		{
			data,
			columns,
			gridOptions,
			pageNation,
			useSearch,
			usePagination,
			customEvents,
			onRowCheckChange,
			gridHeader,
			minHeight,
			useGridHeaders,
		}: BasicToastoGridProps,
		ref
	) => {
		const gridContainerRef = useRef<HTMLDivElement | null>(null);
		const gridInstanceRef = useRef<Grid | null>(null);
		const pageNationRef = useRef<PaginationRefType | null>(null);
		const [containerHeight, setContainerHeight] = useState<number>(0);

		// 높이 계산 함수
		const calculateContainerHeight = () => {
			if (
				gridContainerRef.current &&
				gridContainerRef.current.parentElement
			) {
				let _height = 0;
				const parentEl = gridContainerRef.current?.parentElement;
				if (parentEl) {
					const childNodes = Array.from(parentEl.childNodes);
					const childElements: HTMLElement[] = childNodes.filter(
						(node): node is HTMLElement =>
							node instanceof HTMLElement
					);
					_height = parentEl.clientHeight || 0;
					childElements.forEach((el: HTMLElement) => {
						if (!el.classList.contains('grid')) {
							const clientHeight = el.clientHeight;
							const marginTop = parseFloat(
								getComputedStyle(el).marginTop
							);
							const marginBottom = parseFloat(
								getComputedStyle(el).marginBottom
							);

							_height -= clientHeight + marginTop + marginBottom;
						}
					});
				}
				// tabbar, navvar calc
				// const navbarEl =
				// 	document.getElementsByClassName('navbar-glass');
				const tabbarTemplateEl =
					document.getElementsByClassName('tabbarTemplate');
				// if (navbarEl) {
				// 	console.log('navbarEl', navbarEl[0]);
				// 	const navbarHeight = navbarEl[0].clientHeight;
				// 	// _height -= navbarHeight;
				// 	const navbarMarginTop = parseFloat(
				// 		getComputedStyle(navbarEl[0]).marginTop
				// 	);
				// 	const navbarMarginBottom = parseFloat(
				// 		getComputedStyle(navbarEl[0]).marginBottom
				// 	);
				// 	_height -=
				// 		navbarHeight + navbarMarginTop + navbarMarginBottom;
				// }
				if (tabbarTemplateEl.length > 0) {
					const tabbarHeight = tabbarTemplateEl[0].clientHeight;
					const tabbarMarginTop = parseFloat(
						getComputedStyle(tabbarTemplateEl[0]).marginTop
					);
					const tabbarMarginBottom = parseFloat(
						getComputedStyle(tabbarTemplateEl[0]).marginBottom
					);

					_height -=
						tabbarHeight + tabbarMarginTop + tabbarMarginBottom;
				}

				if (gridOptions && gridOptions.summary) _height -= 40;
				// 임시 보정: 최소 높이 설정
				// 스크롤방지 가중치
				_height -= 2;
				if (_height > 0) {
					setContainerHeight(_height);
				} else {
					setContainerHeight(100); // 기본값으로 100 설정
				}
			}
		};

		// 컴포넌트가 마운트될 때 높이 계산
		useLayoutEffect(() => {
			if (gridContainerRef.current) {
				calculateContainerHeight();
			}
		}, [gridContainerRef.current]);

		const handleSingleCheck = useCallback(
			(e: any) => {
				if (gridInstanceRef.current) {
					const grid = gridInstanceRef.current;
					const checkedRows = grid.getCheckedRows();

					// Single select behavior
					checkedRows.forEach((row) => {
						if (row.rowKey !== e.rowKey) {
							grid.uncheck(row.rowKey);
						}
					});

					const currentRow = grid.getRow(e.rowKey);
					const selectedId = currentRow?.id ?? null;
					if (onRowCheckChange) {
						onRowCheckChange(
							selectedId ? String(selectedId) : null,
							currentRow
						);
					}
				}
			},
			[onRowCheckChange]
		);

		// 그리드 인스턴스를 생성하거나 갱신
		useLayoutEffect(() => {
			if (containerHeight > 0 && gridContainerRef.current) {
				Grid.applyTheme('clean', {
					row: {
						hover: {
							background: '#e0e0e0',
						},
					},
					cell: {
						normal: {
							background: '#fbfbfb',
							border: '#e0e0e0',
							showVerticalBorder: true,
							showHorizontalBorder: true,
						},
						header: {
							background: '#eee',
							border: '#ccc',
							showVerticalBorder: false,
						},
						rowHeader: {
							showVerticalBorder: true,
							showHorizontalBorder: true,
						},
						editable: {
							background: '#fbfbfb',
						},
						selectedHeader: {
							background: '#d8d8d8',
						},
						focused: {
							border: '#418ed4',
						},
						disabled: {
							text: '#b0b0b0',
						},
					},
				});
				gridInstanceRef.current = new Grid({
					el: gridContainerRef.current,
					data,
					columns,
					...gridOptions,
					rowHeaders: makeRowHeaders(
						gridOptions && gridOptions.rowHeaders
							? gridOptions.rowHeaders
							: [],
						pageNation ? pageNation.page : 1,
						pageNation && pageNation.itemPerpage
							? pageNation.itemPerpage
							: 30
					),
					bodyHeight: containerHeight,
				});

				if (gridInstanceRef.current && customEvents) {
					const grid = gridInstanceRef.current;

					(Object.keys(customEvents) as GridEventName[]).forEach(
						(event) => {
							const handler = customEvents[event];
							if (event === 'check' && gridOptions?.singleCheck) {
								grid.on(event, (e) => {
									handler?.(e);
									handleSingleCheck(e);
								});
							} else {
								handler && grid.on(event, handler);
							}
						}
					);
				} else if (
					gridOptions?.singleCheck &&
					gridInstanceRef.current
				) {
					gridInstanceRef.current.on('check', handleSingleCheck);
				}
			}
			return () => {
				if (gridInstanceRef.current) {
					gridInstanceRef.current.destroy();
				}
			};
		}, [data, columns, gridOptions, containerHeight]);

		// 부모 컴포넌트에서 ref를 통해 Grid 인스턴스를 가져올 수 있게 함
		useImperativeHandle(
			ref,
			() => ({
				getGridInstance: () => gridInstanceRef.current,
				getSelectedRows: () => {
					if (gridInstanceRef.current) {
						return gridInstanceRef.current.getCheckedRows();
					}
					return [];
				},
			}),
			[]
		);

		return (
			<StyledGridContainer $minHeight={minHeight}>
				<GridDiv
					ref={gridContainerRef}
					className="grid"
					// style={{ height: containerHeight }}
				/>
				{/* Pagination */}
				{usePagination && pageNation && (
					<ToastoPaginationComponents
						ref={pageNationRef}
						{...pageNation}
					/>
				)}
			</StyledGridContainer>
		);
	}
);
