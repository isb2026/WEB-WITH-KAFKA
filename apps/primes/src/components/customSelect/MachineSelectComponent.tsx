import React, { useMemo } from 'react';
import { ComboBox, ComboBoxItem } from '@radix-ui/components';
import { Machine } from '@primes/types/machine';
import { useMachine } from '@primes/hooks/machine';

interface MachineSelectProps {
	value?: string | number | null;
	onChange?: (value: string) => void;
	onMachineIdChange?: (machineId: number) => void;
	onMachineNameChange?: (machineName: string) => void;
	onMachineDataChange?: (machineData: {
		machineId: number;
		machineCode?: string;
		machineName?: string;
		machineType?: string;
	}) => void;
	disabled?: boolean;
	placeholder?: string;
	className?: string;
	showMachineName?: boolean;
	showMachineType?: boolean;
	error?: boolean;
	// 검색 조건
	searchParams?: Partial<{
		isUse?: boolean;
		isNotwork?: boolean;
		machineType?: string;
		usingGroup?: string;
	}>;
}

type Option = ComboBoxItem & {
	machineId: number;
	machineCode?: string;
	machineName?: string;
	machineType?: string;
	raw: Machine;
};

export const MachineSelectComponent: React.FC<MachineSelectProps> = ({
	placeholder = '설비를 선택하세요',
	onChange,
	onMachineIdChange,
	onMachineNameChange,
	onMachineDataChange,
	className = 'focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200',
	value = '',
	disabled = false,
	showMachineName = true,
	showMachineType = false,
	error = false,
	searchParams, // do NOT default to {} – keeps reference stable
}) => {
	// Build a stable request object
	const searchRequest = useMemo(
		() => ({
			...(searchParams ?? {}),
			isUse: true,
		}),
		[searchParams]
	);

	const { list } = useMachine({
		page: 0,
		size: 100,
		searchRequest,
	});
	const { data: response, isLoading } = list;

	// Normalize response to array
	const data = useMemo<Machine[]>(() => {
		if (!response) return [];
		if (Array.isArray(response)) return response as Machine[];
		if (response.content && Array.isArray(response.content)) {
			return response.content as Machine[];
		}
		return [];
	}, [response]);

	// Build options with machineId as the actual value
	const options = useMemo<Option[]>(() => {
		return data.map((machine) => {
			let label = machine.machineCode || '';
			if (showMachineName && machine.machineName)
				label = `${label} [ ${machine.machineName} ]`;
			if (showMachineType && machine.machineType)
				label = `${label} (${machine.machineType})`;

			return {
				label: label || `Machine ${machine.id}`,
				value: machine.id.toString(), // 실제 ID를 value로 사용
				machineId: machine.id,
				machineCode: machine.machineCode,
				machineName: machine.machineName,
				machineType: machine.machineType,
				raw: machine,
			};
		});
	}, [data, showMachineName, showMachineType]);

	// Derive selected from form value (machineId) + options
	const selectedItem: ComboBoxItem | null = useMemo(() => {
		const v = value?.toString() ?? '';
		if (!v) return null;
		// Match by machineId string
		const byId = options.find((o) => o.value === v);
		if (byId) return byId;

		// Fallback: if someone passes an id by mistake, try matching by id
		const asId = Number(v);
		if (!Number.isNaN(asId)) {
			const byIdNum = options.find((o) => o.machineId === asId);
			if (byIdNum) return byIdNum;
		}
		return null;
	}, [value, options]);

	const handleChange = (item: ComboBoxItem | null) => {
		if (!item) {
			onChange?.('');
			// Clear callbacks are not called when item is null
			return;
		}

		// RHF field will be machineId
		onChange?.(item.value);

		const selectedOption = options.find((opt) => opt.value === item.value);

		if (selectedOption) {
			if (onMachineIdChange) {
				onMachineIdChange(selectedOption.machineId);
			}
			if (onMachineNameChange) {
				onMachineNameChange(selectedOption.machineName || '');
			}
			if (onMachineDataChange) {
				onMachineDataChange({
					machineId: selectedOption.machineId,
					machineCode: selectedOption.machineCode,
					machineName: selectedOption.machineName,
					machineType: selectedOption.machineType,
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

export default MachineSelectComponent;
