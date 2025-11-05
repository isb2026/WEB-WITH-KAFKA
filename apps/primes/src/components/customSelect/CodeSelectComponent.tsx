import React, { useEffect, useState } from 'react';

import { useCodeFieldQuery } from '@primes/hooks/init/code/useCodeFieldQuery';
import { ComboBox, ComboBoxItem } from '@radix-ui/components';

interface CodeSelectProps {
	placeholder?: string;
	fieldKey?: string;
	onChange?: (e: any) => void;
	onDataChange?: (data: { code: string; name: string }) => void;
	className?: string;
	value: any;
	disabled?: boolean;
	valueKey?: string;
	labelKey?: string;
	error?: boolean;
}

export const CodeSelectComponent: React.FC<CodeSelectProps> = ({
	fieldKey,
	placeholder,
	onChange,
	onDataChange,
	className = 'focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200',
	value,
	disabled,
	valueKey = 'codeValue',
	labelKey = 'codeName',
	error = false,
}) => {
	const { data } = useCodeFieldQuery(fieldKey ?? '');
	const [options, setOptions] = useState<ComboBoxItem[]>([]);
	const [selectedItem, setSelectedItem] = useState<ComboBoxItem | null>(null);

	useEffect(() => {
		if (data) {
			const newOptions = data.map((d: any) => {
				return {
					label: d[labelKey],
					value: d[valueKey],
				};
			});
			setOptions(newOptions);

			// Set selected item based on current value
			if (value) {
				// Try to find by value first (code value)
				let found = newOptions.find(
					(opt: ComboBoxItem) => opt.value === value
				);

				// If not found by value, try to find by label (display name)
				if (!found) {
					found = newOptions.find(
						(opt: ComboBoxItem) => opt.label === value
					);
				}

				setSelectedItem(found || null);
			} else {
				setSelectedItem(null);
			}
		}
	}, [data, value]);

	const handleChange = (item: ComboBoxItem | null) => {
		setSelectedItem(item);
		onChange?.(item?.value || '');

		// 추가: 코드와 이름을 함께 전달
		if (onDataChange) {
			onDataChange({
				code: item?.value || '',
				name: item?.label || '',
			});
		}
	};

	return (
		<div className={className}>
			<ComboBox
				items={options}
				value={selectedItem}
				onChange={handleChange}
				placeholder={placeholder}
				disabled={disabled}
				error={error}
			/>
		</div>
	);
};
