import React, { useMemo } from 'react';
import { ComboBox, ComboBoxItem } from '@radix-ui/components';
import { ItemSearchRequest, ItemDto } from '@primes/types/item';
import { useItem } from '@primes/hooks/init/item/useItem';

interface ItemSelectProps {
	displayFields?: ('itemName' | 'itemSpec')[]; // Removed 'itemNumber' from display options
	displayTemplate?: string;
	placeholder?: string;
	onChange?: (value: string) => void;
	onItemIdChange?: (itemId: number) => void;
	onItemDataChange?: (itemData: {
		itemId: number;
		itemNo?: string;
		itemNumber?: string; // Keep in callback data for logic compatibility
		itemName?: string;
		itemSpec?: string;
	}) => void;
	className?: string;
	value?: string | number | null; // expects itemNo from RHF
	disabled?: boolean;
	searchParams?: Partial<ItemSearchRequest>;
	error?: boolean;
}

type Option = ComboBoxItem & {
	itemNo: number;
	itemId: number;
	itemNumber?: string;
	itemName?: string;
	itemSpec?: string;
	raw: ItemDto;
};

export const ItemSelectComponent: React.FC<ItemSelectProps> = ({
	displayFields = ['itemName'],
	displayTemplate,
	placeholder = '품목을 선택하세요',
	onChange,
	onItemIdChange,
	onItemDataChange,
	className = 'focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200',
	value = '',
	disabled = false,
	searchParams, // do NOT default to {} – keeps reference stable
	error = false,
}) => {
	// Build a stable request object
	const searchRequest = useMemo(
		() => ({
			...(searchParams ?? {}),
			isUse: true,
		}),
		[searchParams]
	);

	const { list } = useItem({
		searchRequest,
		page: 0,
		size: 1000, // Large size to get all items for select
	});

	const { data: response, isLoading } = list;

	// Extract data from paginated response
	const data = useMemo<ItemDto[]>(() => {
		if (!response) return [];
		if (response.content && Array.isArray(response.content)) {
			return response.content as ItemDto[];
		}
		return [];
	}, [response]);

	// Build options with itemNo as the actual value
	const options = useMemo<Option[]>(() => {
		return data.map((item) => {
			let label = '';
			if (displayTemplate) {
				// Keep itemNumber replacement in template for backward compatibility, but don't display it
				label = displayTemplate
					.replace('{itemName}', item.itemName || '')
					.replace('{itemNumber}', item.itemNumber || '')
					.replace('{itemSpec}', item.itemSpec || '')
					.replace('{itemModel}', item.itemModel || '')
					.replace('{itemUnit}', item.itemUnit || '');
			} else {
				const parts = (displayFields ?? ['itemName'])
					.map((f) =>
						f === 'itemName'
							? item.itemName || ''
							: f === 'itemSpec'
								? item.itemSpec || ''
								: ''
					)
					.filter(Boolean);
				label = parts.join(' - ');
			}

			return {
				label: label || item.itemName || `Item ${item.id}`,
				value: item.id.toString(), // 실제 ID를 value로 사용
				itemId: item.id, // 실제 찾은 ID 사용
				itemNo: item.itemNo,
				itemNumber: item.itemNumber,
				itemName: item.itemName,
				itemSpec: item.itemSpec,
				raw: item,
			};
		});
	}, [data, displayFields, displayTemplate]);

	// Derive selected from form value (itemNo) + options
	const selectedItem: ComboBoxItem | null = useMemo(() => {
		const v = value?.toString() ?? '';
		if (!v) return null;
		
		// 여러 방법으로 매칭 시도
		// 1. 문자열로 value 매칭
		let foundItem = options.find((o) => o.value === v);
		if (foundItem) return foundItem;

		// 2. itemNo로 매칭 (숫자)
		const asNumber = Number(v);
		if (!Number.isNaN(asNumber)) {
			foundItem = options.find((o) => o.itemNo === asNumber);
			if (foundItem) return foundItem;
			
			// 3. itemId로 매칭
			foundItem = options.find((o) => o.itemId === asNumber);
			if (foundItem) return foundItem;
		}
		
		return null;
	}, [value, options]);

	const handleChange = (item: ComboBoxItem | null) => {
		if (!item) {
			onChange?.('');
			// Clear callbacks are not called when item is null
			return;
		}

		// RHF field will be itemNo
		onChange?.(item.value);

		const selectedOption = options.find((opt) => opt.value === item.value);

		if (selectedOption) {
			if (onItemIdChange) {
				onItemIdChange(selectedOption.itemId);
			}
			if (onItemDataChange) {
				onItemDataChange({
					itemId: selectedOption.itemId,
					itemNo: selectedOption.itemNo?.toString(),
					itemNumber: selectedOption.itemNumber,
					itemName: selectedOption.itemName,
					itemSpec: selectedOption.itemSpec,
				});
			}
		}
	};

	return (
		<div className={className}>
			<ComboBox
				items={options}
				value={selectedItem}
				onChange={handleChange}
				placeholder={isLoading ? '로딩 중...' : placeholder}
				disabled={disabled || isLoading}
				error={error}
			/>
		</div>
	);
};

export default ItemSelectComponent;
