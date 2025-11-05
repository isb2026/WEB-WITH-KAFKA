import React, { useState, useEffect } from 'react';
import { ComboBox, ComboBoxItem } from '@repo/radix-ui/components';
import { useItemProgressFieldQuery } from '@primes/hooks/init/itemProgress/useItemProgressFieldQuery';

interface ItemProgressSelectProps {
	fieldKey?: string;
	valueKey?: string;
	labelKey?: string;
	value?: string | null;
	onChange?: (value: string) => void;
	disabled?: boolean;
	placeholder?: string;
	className?: string;
	itemId?: number | string; // itemId 조건 추가
}

interface FieldOption {
	id: number | string;
	value: string;
	progressName?: string;
	[key: string]: any; // 동적 키를 위한 인덱스 시그니처
}

export const ItemProgressSelectComponent: React.FC<ItemProgressSelectProps> = ({
	fieldKey = 'progressName',
	valueKey = 'id',
	labelKey = 'value',
	placeholder,
	onChange,
	className = 'focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200',
	value = '',
	disabled,
	itemId,
}) => {
	// itemId가 있을 때만 쿼리 실행
	const { data, isLoading, error } = useItemProgressFieldQuery(
		fieldKey,
		!!itemId,
		itemId
	);
	const [options, setOptions] = useState<{ label: string; value: string; id?: number | string }[]>(
		[]
	);

	useEffect(() => {
		if (data && Array.isArray(data)) {
			const newOptions = data.map((item: FieldOption) => ({
				label:
					(item[labelKey] as string)?.toString() ||
					item.value ||
					'',
				value:
					(item[valueKey] as string | number)?.toString() ||
					item.id?.toString() ||
					'',
				id: item.id, // 원본 id도 포함
			}));
			setOptions(newOptions);
		} else {
			setOptions([]);
		}
	}, [data, valueKey, labelKey, isLoading, error]);

	const [selectedItem, setSelectedItem] = useState<ComboBoxItem | null>(null);

	const handleChange = (item: ComboBoxItem | null) => {
		setSelectedItem(item);
		onChange?.(item?.value || '');
	};

	// value prop과 selectedItem 동기화
	useEffect(() => {		
		if (value && options.length > 0) {
			const searchValue = value.toString();
			const searchValueNum = Number(value);
			
			// 여러 방법으로 매칭 시도
			const foundItem = 
				options.find((opt) => opt.value === searchValue) ||
				options.find((opt) => opt.value === value) ||
				options.find((opt) => parseInt(opt.value) === searchValueNum) ||
				(searchValueNum ? options.find((opt) => opt.id === searchValueNum) : null) ||
				null;

			setSelectedItem(foundItem);
		} else if (!value) {
			setSelectedItem(null);
		}
	}, [value, options]);

	// itemId가 변경될 때 선택된 값 초기화
	useEffect(() => {
		setSelectedItem(null);
	}, [itemId]);

	const defaultPlaceholder = placeholder || '품목공정을 선택하세요';

	// Handle error state
	if (error) {
		return (
			<div className={className}>
				<ComboBox
					items={[]}
					value={null}
					onChange={() => {}}
					placeholder="품목공정 조회 중 오류가 발생했습니다"
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
