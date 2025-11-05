import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ToastoGridComponent } from '@repo/toasto/components/grid';
import { useAccountListQuery } from '@esg/hooks/account/useAccountListQuery';

interface AccountsGridSelectorProps {
	name: string;
	value?: number[];
	onChange?: (value: number[]) => void;
	companyId?: number | null;
	watch?: (name: string) => any;
}

export const AccountsGridSelector: React.FC<AccountsGridSelectorProps> = ({
	name,
	value = [],
	onChange,
	companyId = null,
	watch,
}) => {
	const gridRef = useRef<any>(null);
	const effectiveCompanyId: number | null =
		companyId ?? (watch ? Number(watch('companyId')) || null : null);
	const { data } = useAccountListQuery({
		page: 0,
		size: 100,
		companyId: effectiveCompanyId,
	});

	const rows = useMemo(() => (data as any)?.content || [], [data]);

	// Sync external value into grid checks when value changes
	useEffect(() => {
		try {
			const grid = gridRef.current?.getGridInstance?.();
			if (!grid) return;
			grid.uncheckAll?.();
			if (Array.isArray(value)) {
				rows.forEach((row: any) => {
					if (value.includes(Number(row.id))) {
						const rowKey = grid.getRowKey?.(row.id);
						if (typeof rowKey !== 'undefined') grid.check?.(rowKey);
					}
				});
			}
		} catch {}
	}, [value, rows]);

	const updateSelectionFromGrid = () => {
		try {
			const grid = gridRef.current?.getGridInstance?.();
			const checked = grid?.getCheckedRows?.() || [];
			const next = checked.map((r: any) => Number(r.id)).filter(Boolean);
			onChange?.(next);
		} catch {}
	};

	return (
		<div>
			<ToastoGridComponent
				ref={gridRef}
				data={rows}
				columns={
					[
						{ header: 'ID', name: 'id', width: 80 },
						{ header: '관리항목명', name: 'name', width: 240 },
						{ header: '공급사', name: 'supplier', width: 160 },
					] as any
				}
				gridOptions={
					{
						rowHeaders: ['rowNum', 'checkbox'],
						bodyHeight: 280,
					} as any
				}
				customEvents={{
					check: updateSelectionFromGrid,
					uncheck: updateSelectionFromGrid,
				}}
				singleCheck={false}
			/>
		</div>
	);
};

export default AccountsGridSelector;
