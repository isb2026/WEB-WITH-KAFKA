import React, { useState, useEffect } from 'react';
import { ComboBox, ComboBoxItem } from '@radix-ui/components';
import { useCommandFieldQuery } from '@primes/hooks/production/command/useCommandFieldQuery';

interface ProductionCommandSelectProps {
	fieldKey?: string;
	valueKey?: string;
	labelKey?: string;
	value?: string | null;
	onChange?: (value: string | { commandId: any; commandNo: any; displayValue: string } | null) => void;
	disabled?: boolean;
	placeholder?: string;
	className?: string;
}

interface FieldOption {
	id: number | string;
	value: string;
}

export const ProductionCommandSelectComponent: React.FC<
	ProductionCommandSelectProps
> = ({
	fieldKey = 'commandNo',
	valueKey = 'id',
	labelKey = 'value',
	placeholder,
	onChange,
	className = 'focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200',
	value = '',
	disabled,
}) => {
	const { data, isLoading, error } = useCommandFieldQuery(fieldKey);
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
				const found = newOptions.find((opt) => opt.label === value || opt.value === value);
				setSelectedItem(found || null);
			} else {
				setSelectedItem(null);
			}
		}
	}, [data, valueKey, labelKey, value]);

	const handleChange = (item: ComboBoxItem | null) => {
		setSelectedItem(item);
		if (item && data && Array.isArray(data)) {
			
			// 선택된 항목의 전체 데이터 찾기
			const selectedData = data.find((d: any) => {
				const itemValue = d[valueKey]?.toString() || '';
				return itemValue === item.value;
			});
			
			if (selectedData) {
				const commandNoValue = item.label;
				
				const result = {
					commandId: selectedData.id,
					commandNo: commandNoValue,
					displayValue: item.label,
					...selectedData
				};
				onChange?.(result);
			}
		} else {
			onChange?.(null);
		}
	};

	const defaultPlaceholder = placeholder || '작업지시를 선택하세요';

	// Handle error state
	if (error) {
		return (
			<div className={className}>
				<ComboBox
					items={[]}
					value={null}
					onChange={() => {}}
					placeholder="작업지시 조회 중 오류가 발생했습니다"
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
