import React from 'react';
import format from 'string-format';

interface InfoItem {
	label: string;
	value: React.ReactNode;
	template?: string;
}

interface InfoGridClassNames {
	container?: string;
	title?: string;
	grid?: string;
	item?: string;
	label?: string;
	value?: string;
}

interface InfoGridProps<T> {
	title?: string;
	items?: InfoItem[];
	data?: T | null;
	keys?: {
		key: string;
		label: string;
		format?: string;
		template?: string;
	}[];
	columns?: string;
	classNames?: InfoGridClassNames;
	maxHeight?: string; // 최대 높이 props 추가
	systemFields?: string[];
	systemColumns?: string; // 시스템 필드 그리드 컬럼 설정 추가
}

export const InfoGrid = <T extends Record<string, unknown>>({
	title,
	items,
	data,
	keys,
	columns = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
	classNames = {},
	maxHeight = '350px',
	systemFields = [],
	systemColumns = 'grid-cols-4', // 기본값은 4컬럼
}: InfoGridProps<T>) => {
	const {
		container = '',
		title: titleClass = 'px-2 border-b text-base font-bold py-1',
		grid = 'gap-1',
		item: itemClass = 'p-1',
		label = 'text-sm text-gray-500 font-medium',
		value = 'text-base text-black',
	} = classNames;

	// data + keys 기반으로 items 생성
	const allItems: InfoItem[] =
		items ??
		(keys
			? keys.map(({ key, label, template }) => {
					let value = data?.[key] ?? '-';
					if (template) {
						value = format(template, data);
					}
					if (typeof value === 'boolean') {
						value = value ? 'O' : 'X';
					} else if (typeof value === 'number') {
						value = value.toLocaleString();
					} else if (
						typeof value === 'string' &&
						/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(value)
					) {
						const date = new Date(value);
						const year = date.getFullYear();
						const month = ('0' + (date.getMonth() + 1)).slice(-2);
						const day = ('0' + date.getDate()).slice(-2);
						const hours = ('0' + date.getHours()).slice(-2);
						const minutes = ('0' + date.getMinutes()).slice(-2);
						const seconds = ('0' + date.getSeconds()).slice(-2);
						value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
					}
					return {
						label,
						value: value as React.ReactNode,
					};
				})
			: []);

	// 일반 필드와 시스템 필드 분리
	const regularItems = allItems.filter(
		(item) =>
			!systemFields.some(
				(field) =>
					keys?.find((k) => k.key === field)?.label === item.label
			)
	);

	const systemItems = allItems.filter((item) =>
		systemFields.some(
			(field) => keys?.find((k) => k.key === field)?.label === item.label
		)
	);

	return (
		<div className={`${container} flex flex-col h-full`}>
			{title && <h2 className={titleClass}>{title}</h2>}

			{/* 일반 필드들 - 일정한 간격으로 정렬 */}
			<div
				className={`grid px-2 py-0.5 ${columns} ${grid} overflow-y-auto flex-1 content-start`}
				style={{
					...(maxHeight ? { maxHeight } : {}),
					gridAutoRows: 'min-content',
				}}
			>
				{regularItems.map((item, idx) => (
					<div
						key={idx}
						className={`${itemClass} flex flex-col gap-0.5 h-fit`}
					>
						<div
							className={`${label} w-full flex-shrink-0 text-xs flex items-center gap-1`}
						>
							{item.label}
						</div>
						<div
							className={`${value} w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-gray-700 min-h-[24px] flex items-center text-sm`}
						>
							{item.value}
						</div>
					</div>
				))}
			</div>

			{/* 시스템 필드들 - 맨 밑에 고정 */}
			{systemItems.length > 0 && (
				<div
					className={`grid ${systemColumns} px-2 py-1 ${grid} border-t border-gray-100 mt-auto flex-shrink-0`}
				>
					{systemItems.map((item, idx) => (
						<div
							key={idx}
							className={`${itemClass} flex flex-row items-center gap-2`}
						>
							<div
								className={`${label} flex-shrink-0 text-xs min-w-[50px] text-gray-500 flex items-center gap-1`}
							>
								{item.label}
							</div>
							<div
								className={`${value} flex-1 py-0.5 text-gray-600 min-h-[20px] flex items-center text-xs px-1`}
							>
								{item.value}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
