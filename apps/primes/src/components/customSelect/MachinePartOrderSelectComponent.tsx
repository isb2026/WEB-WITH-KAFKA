import React, { useMemo, useState, useEffect } from 'react';
import { ComboBox, ComboBoxItem } from '@radix-ui/components';
import { MachinePartOrder } from '@primes/types/machine';
import { useMachinePartOrder } from '@primes/hooks/machine';

interface MachinePartOrderSelectProps {
	placeholder?: string;
	fieldKey?: string;
	onChange?: (value: string) => void;
	onMachinePartOrderIdChange?: (machinePartOrderId: number) => void;
	className?: string;
	value?: string | null;
	disabled?: boolean;
	// 검색 조건
	searchParams?: Partial<{
		orderCode?: string;
		partName?: string;
		vendorName?: string;
	}>;
}

export const MachinePartOrderSelectComponent: React.FC<MachinePartOrderSelectProps> = ({
	placeholder,
	onChange,
	onMachinePartOrderIdChange,
	className = 'focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200',
	value = '',
	disabled,
	searchParams = {},
}) => {
	const { list } = useMachinePartOrder({
		page: 0,
		size: 100,
	});

	const { data: response, isLoading, error } = list;
	const [selectedItem, setSelectedItem] = useState<ComboBoxItem | null>(null);

	// API 응답에서 실제 데이터 배열 추출
	const data = useMemo(() => {
		if (!response) return [];

		// MachineListResponse 구조에 맞게 처리
		if (Array.isArray(response)) return response;
		if (response.content && Array.isArray(response.content))
			return response.content;

		return [];
	}, [response]);

	// 검색 조건에 따른 필터링
	const filteredData = useMemo(() => {
		if (!data || !Array.isArray(data)) return [];

		return data.filter((machinePartOrder: MachinePartOrder) => {
			// orderCode 필터링
			if (searchParams.orderCode !== undefined && machinePartOrder.orderCode !== searchParams.orderCode) {
				return false;
			}

			// partName 필터링
			if (searchParams.partName !== undefined && machinePartOrder.partName !== searchParams.partName) {
				return false;
			}

			// vendorName 필터링
			if (searchParams.vendorName !== undefined && machinePartOrder.vendorName !== searchParams.vendorName) {
				return false;
			}

			return true;
		});
	}, [data, searchParams]);

	const options = useMemo(() => {
		if (!filteredData || !Array.isArray(filteredData) || filteredData.length === 0) {
			return [];
		}

		const newOptions = filteredData.map((machinePartOrder: MachinePartOrder) => {
			let label: string;

			return {
				label: machinePartOrder.orderCode || `MachinePartOrder ${machinePartOrder.id}`,
				value: machinePartOrder.id?.toString() || '0',
				machinePartOrderId: machinePartOrder.id,
			};
		});

		return newOptions;
	}, [filteredData]);

	// Set selected item based on current value
	useEffect(() => {
		const stringValue = value?.toString() ?? '';
		if (stringValue && options.length > 0) {
			const found = options.find(
				(opt) => opt.value === stringValue || opt.value === stringValue.toString()
			);
			setSelectedItem(found || null);
		} else {
			setSelectedItem(null);
		}
	}, [value, options]);

	const handleChange = (item: ComboBoxItem | null) => {
		setSelectedItem(item);
		onChange?.(item?.value || '');
		
		if (!item) {
			// Clear callbacks are not called when item is null
			return;
		}

		const selectedOption = options.find(
			(opt) => opt.value === item.value || opt.value === item.value.toString()
		);
		if (selectedOption && onMachinePartOrderIdChange) {
			onMachinePartOrderIdChange(selectedOption.machinePartOrderId);
		}
	};

	return (
		<div className={className}>
			<ComboBox
				items={options}
				value={selectedItem}
				onChange={handleChange}
				placeholder={placeholder || '설비 예비부품 발주를 선택하세요'}
				disabled={disabled}
			/>
		</div>
	);
};
