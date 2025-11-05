import React, {
	forwardRef,
	useRef,
	useLayoutEffect,
	useState,
	useImperativeHandle,
} from 'react';
import Pagination from 'tui-pagination';

import 'tui-pagination/dist/tui-pagination.css';

import { PageNationContainer, PageSizeContainer, Container } from '../common';

export interface PageNationType {
	totalItems: number;
	itemPerpage?: number;
	visiblePages?: number;
	page: number;
	centerAlign?: boolean;
	pageSize?: number;
	onPageChange: (page: number) => void;
	afterMove?: (page: number) => void;
	berforeMove?: (page: number) => void;
}
export interface PaginationRefType {
	getPaginationInstance: () => Pagination | null;
}

export const ToastoPaginationComponents = forwardRef<
	PaginationRefType | null,
	PageNationType
>(
	(
		{
			totalItems,
			itemPerpage,
			visiblePages,
			page,
			centerAlign,
			onPageChange,
		},
		ref
	) => {
		const paginationRef = useRef<Pagination | null>(null);
		const paginationContainerRef = useRef<HTMLDivElement | null>(null);

		useLayoutEffect(() => {
			if (paginationContainerRef.current) {
				paginationRef.current = new Pagination(
					paginationContainerRef.current,
					{
						totalItems: totalItems,
						itemsPerPage: itemPerpage || 10,
						visiblePages: visiblePages || 5,
						page: page || 1,
						centerAlign: centerAlign || false,
					}
				);

				paginationRef.current.on('beforeMove', (event: any) => {
					const { page } = event;
					if (onPageChange) {
						onPageChange(page);
					}
				});
				paginationRef.current.movePageTo(page);
			}

			return () => {
				if (paginationRef.current) {
					paginationRef.current = null;
				}
			};
		}, [totalItems, itemPerpage, visiblePages, page, centerAlign]);

		useImperativeHandle(
			ref,
			() => ({
				getPaginationInstance: () => {
					return paginationRef.current;
				},
			}),
			[]
		);

		return (
			<PageNationContainer>
				<div
					className="tui-pagination"
					ref={paginationContainerRef}
					style={{
						minHeight: '40px',
						display: 'flex',
						alignItems: 'center',
					}}
				/>
			</PageNationContainer>
		);
	}
);
