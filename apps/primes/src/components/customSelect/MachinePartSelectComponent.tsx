import React, { useMemo, useState, useEffect } from 'react';
import { ComboBox, ComboBoxItem } from '@radix-ui/components';
import { MachinePart } from '@primes/types/machine';
import { useMachinePart } from '@primes/hooks/machine';

interface MachinePartSelectProps {
	value?: string | null;
	onChange?: (value: string) => void;
	onMachinePartIdChange?: (machinePartId: number) => void;
	disabled?: boolean;
	placeholder?: string;
	className?: string;
	showMachinePartStandard?: boolean;
	// 검색 조건
	searchParams?: Partial<{
		isUse?: boolean;
		partName?: string;
		partStandard?: string;
	}>;
}

export const MachinePartSelectComponent: React.FC<MachinePartSelectProps> = ({
	placeholder,
	onChange,
	onMachinePartIdChange,
	className = 'focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200',
	value = '',
	disabled,
	showMachinePartStandard = true,
	searchParams = {},
}) => {
	// useMachine 훅 사용 - React Query 기반 데이터 관리
	const { list } = useMachinePart({
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

		return data.filter((machinePart: MachinePart) => {
			// isUse 필터링
			if (searchParams.isUse !== undefined && Boolean(machinePart.isUse) !== searchParams.isUse) {
				return false;
			}

			// partName 필터링
			if (searchParams.partName !== undefined && machinePart.partName !== searchParams.partName) {
				return false;
			}

			// partStandard 필터링
			if (searchParams.partStandard !== undefined && machinePart.partStandard !== searchParams.partStandard) {
				return false;
			}

			return true;
		});
	}, [data, searchParams]);

	const options = useMemo(() => {
		if (!filteredData || !Array.isArray(filteredData) || filteredData.length === 0) {
			return [];
		}

		const newOptions = filteredData.map((machinePart: MachinePart) => {
			let label: string;

			label = machinePart.partName || '';
			
			if (showMachinePartStandard && machinePart.partStandard) {
				label = `${label} [ ${machinePart.partStandard} ]`;
			}

			return {
				label: label || `MachinePart ${machinePart.id}`,
				value: machinePart.id?.toString() || '0',
				machinePartId: machinePart.id,
			};
		});

		return newOptions;
	}, [filteredData, showMachinePartStandard]);

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
			onChange?.(selectedOption.machinePartId.toString());
			if (onMachinePartIdChange) {
				onMachinePartIdChange(selectedOption.machinePartId);
			}
		}
	};

	return (
		<div className={className}>
			<ComboBox
				items={options}
				value={selectedItem}
				onChange={handleChange}
				placeholder={isLoading ? '로딩 중...' : placeholder || '설비 예비부품을 선택하세요'}
				disabled={disabled || isLoading}
			/>
		</div>
	);
};

export default MachinePartSelectComponent;