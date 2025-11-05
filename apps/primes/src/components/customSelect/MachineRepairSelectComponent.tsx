import React, { useMemo, useState, useEffect } from 'react';
import { ComboBox, ComboBoxItem } from '@radix-ui/components';
import { MachineRepair } from '@primes/types/machine';
import { useMachineRepair } from '@primes/hooks/machine';

interface MachineRepairSelectProps {
	fieldKey?: string;
	valueKey?: string;
	labelKey?: string;
	value?: string | null;
	onChange?: (value: string) => void;
	onMachineRepairIdChange?: (machineRepairId: number) => void;
	disabled?: boolean;
	placeholder?: string;
	className?: string;
	searchParams?: Partial<{
		subject?: string;
		repairPart?: string;
	}>;
}

export const MachineRepairSelectComponent: React.FC<
	MachineRepairSelectProps
> = ({
	placeholder,
	onChange,
	onMachineRepairIdChange,
	className = 'focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200',
	value = '',
	disabled,
	searchParams = {},
}) => {
	const { list } = useMachineRepair({
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

	const filteredData = useMemo(() => {
		if (!data || !Array.isArray(data)) return [];

		return data.filter((machineRepair: MachineRepair) => {
			if (searchParams.subject !== undefined && machineRepair.subject !== searchParams.subject) {
				return false;
			}

			if (searchParams.repairPart !== undefined && machineRepair.repairPart !== searchParams.repairPart) {
				return false;
			}

			return true;
		});
	}, [data, searchParams]);

	const options = useMemo(() => {
		if (!filteredData || !Array.isArray(filteredData) || filteredData.length === 0) {
			return [];
		}

		const newOptions = filteredData.map((machineRepair: MachineRepair) => {
			let label: string;

			label = machineRepair.subject || '';

			return {
				label: label || `MachineRepair ${machineRepair.id}`,
				value: machineRepair.id?.toString() || '0',
				machineRepairId: machineRepair.id,
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
		
		if (!item) {
			onChange?.('');
			// Clear callbacks are not called when item is null
			return;
		}

		const selectedOption = options.find(
			(opt) => opt.value === item.value || opt.value === item.value.toString()
		);
		if (selectedOption) {
			onChange?.(selectedOption.machineRepairId.toString());
			if (onMachineRepairIdChange) {
				onMachineRepairIdChange(selectedOption.machineRepairId);
			}
		}
	};

	return (
		<div className={className}>
			<ComboBox
				items={options}
				value={selectedItem}
				onChange={handleChange}
				placeholder={isLoading ? '로딩 중...' : placeholder || '설비 수리를 선택하세요'}
				disabled={disabled || isLoading}
			/>
		</div>
	);
};
