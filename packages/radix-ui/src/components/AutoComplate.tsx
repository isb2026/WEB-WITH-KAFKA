import React, { useState } from 'react';
import {
	RadixSelect,
	RadixSelectItem,
	RadixSelectProps,
} from './Select';

interface Option {
	label: string;
	value: string;
	disabled?: boolean;
}

interface RadixAutocompleteProps extends Omit<RadixSelectProps, 'children'> {
	options: Option[];
	searchPlaceholder?: string;
	emptyText?: string;
}

export const RadixAutocomplete = ({
	options,
	value,
	onValueChange,
	placeholder = '선택하세요',
	searchPlaceholder = '검색어를 입력하세요',
	emptyText = '일치하는 항목이 없습니다',
	disabled,
	className,
}: RadixAutocompleteProps) => {
	const [search, setSearch] = useState('');

	const hasMatch = options.some((opt) =>
		opt.label.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<RadixSelect
			value={value}
			onValueChange={(val) => {
				onValueChange?.(val);
				setSearch('');
			}}
			placeholder={placeholder}
			className={className}
			disabled={disabled}
		>
			{/* Select 내부 input 필터 */}
			<div className="px-2 py-1">
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder={searchPlaceholder}
					className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none"
					disabled={disabled}
				/>
			</div>

			{/* 항상 동일한 children 배열 유지 → 깜빡임 방지 */}
			{hasMatch ? (
				options.map((opt) => {
					const hidden = !opt.label
						.toLowerCase()
						.includes(search.toLowerCase());

					return (
						<RadixSelectItem
							key={opt.value}
							value={opt.value}
							disabled={opt.disabled}
							className={hidden ? 'hidden' : undefined}
						>
							{opt.label}
						</RadixSelectItem>
					);
				})
			) : (
				<div className="px-3 py-2 text-sm text-gray-500">
					{emptyText}
				</div>
			)}
		</RadixSelect>
	);
};
