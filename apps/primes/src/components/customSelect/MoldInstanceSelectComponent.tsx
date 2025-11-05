import React, { useState, useEffect } from 'react';
import { ComboBox, ComboBoxItem } from '@radix-ui/components';
import { useMoldInstanceFieldsQuery } from '@primes/hooks/mold/mold-instance/useMoldInstanceFieldQuery';

interface MoldInstanceSelectProps {
	fieldKey?: string;
	valueKey?: string;
	labelKey?: string;
	value?: string | null;
	onChange?: (value: string) => void;
	onMoldInstanceDataChange?: (data: {
		id: string;
		moldInstanceName: string;
		moldInstanceCode?: string;
		moldCode?: string;
		grade?: string;
		moldLife?: number;
		keepPlace?: string;
		moldInstanceStandard?: string;
		moldLocations?: any[];
	}) => void;
	disabled?: boolean;
	placeholder?: string;
	className?: string;
	searchParams?: any;
}

interface FieldOption {
	id: number | string;
	name: string;
	code?: string;
	disabled?: boolean;
}

export const MoldInstanceSelectComponent: React.FC<MoldInstanceSelectProps> = ({
	placeholder,
	onChange,
	onMoldInstanceDataChange,
	className = 'focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200',
	value = '',
	disabled,
	searchParams,
}) => {
	const [searchTerm, setSearchTerm] = useState('');
	const { data, isLoading, error } = useMoldInstanceFieldsQuery({
		search: searchTerm,
		limit: 50,
		...searchParams,
	});
	
	const [options, setOptions] = useState<ComboBoxItem[]>([]);
	const [selectedItem, setSelectedItem] = useState<ComboBoxItem | null>(null);

	useEffect(() => {
		if (data?.data && Array.isArray(data.data)) {
			const newOptions = data.data
				.filter((item: FieldOption) => !item.disabled) // 비활성화된 항목 제외
				.map((item: FieldOption) => ({
					label: `${item.name}${item.code ? ` (${item.code})` : ''}`,
					value: item.id.toString(),
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
	}, [data, value]);

	const handleChange = (item: ComboBoxItem | null) => {
		setSelectedItem(item);
		onChange?.(item?.value || '');
		
		// 선택된 아이템의 전체 데이터를 onMoldInstanceDataChange로 전달
		if (item && data?.data) {
			const selectedData = data.data.find((option: FieldOption) => option.id.toString() === item.value);
			
			if (selectedData && onMoldInstanceDataChange) {
				onMoldInstanceDataChange({
					id: selectedData.id.toString(),
					moldInstanceName: selectedData.name,
					moldInstanceCode: selectedData.code,
					moldLocations: selectedData.moldLocations,
				});
			}
		}
	};

	const defaultPlaceholder = placeholder || '금형을 선택하세요';

	// Handle error state
	if (error) {
		return (
			<div className={className}>
				<ComboBox
					items={[]}
					value={null}
					onChange={() => {}}
					placeholder="금형 조회 중 오류가 발생했습니다"
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
