import React, { useState, useEffect } from 'react';
import { ComboBox, ComboBoxItem } from '@radix-ui/components';
import { useStatementMasterFieldQuery } from '@primes/hooks/sales/statementMaster/useStatementMasterFieldQuery';

interface StatementMasterSelectProps {
	fieldKey?: string;
	valueKey?: string;
	labelKey?: string;
	value?: string | null;
	onChange?: (value: string) => void;
	disabled?: boolean;
	placeholder?: string;
	className?: string;
}

interface FieldOption {
	id: number | string;
	value: string;
}

export const StatementMasterSelectComponent: React.FC<
	StatementMasterSelectProps
> = ({
	fieldKey = 'statementCode',
	valueKey = 'id',
	labelKey = 'value',
	placeholder,
	onChange,
	className = 'focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200',
	value = '',
	disabled,
}) => {
	const { data, isLoading, error } = useStatementMasterFieldQuery(fieldKey);
	const [options, setOptions] = useState<ComboBoxItem[]>([]);
	const [selectedItem, setSelectedItem] = useState<ComboBoxItem | null>(null);

	useEffect(() => {
		if (data && Array.isArray(data)) {
			const newOptions = data.map((item: FieldOption) => ({
				label: item[labelKey as keyof FieldOption]?.toString() || '',
				value: item[valueKey as keyof FieldOption]?.toString() || '',
			}));
			setOptions(newOptions);

			// Set selected item based on current value
			if (value) {
				const found = newOptions.find((opt) => opt.value === value);
				setSelectedItem(found || null);
			} else {
				setSelectedItem(null);
			}
		}
	}, [data, valueKey, labelKey, value]);

	const handleChange = (item: ComboBoxItem | null) => {
		setSelectedItem(item);
		onChange?.(item?.value || '');
	};

	const defaultPlaceholder = placeholder || '명세서를 선택하세요';

	// Handle error state
	if (error) {
		return (
			<div className={className}>
				<ComboBox
					items={[]}
					value={null}
					onChange={() => {}}
					placeholder="명세서 조회 중 오류가 발생했습니다"
					disabled={true}
				/>
			</div>
		);
	}

	return (
		<div className={className}>
			<ComboBox
				items={options}
				value={selectedItem}
				onChange={handleChange}
				placeholder={isLoading ? '로딩 중...' : defaultPlaceholder}
				disabled={disabled || isLoading}
			/>
		</div>
	);
};
