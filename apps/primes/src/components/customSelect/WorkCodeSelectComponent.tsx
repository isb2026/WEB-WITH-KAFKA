import React, { useMemo, useState, useEffect } from 'react';
import { ComboBox, ComboBoxItem } from '@radix-ui/components';
import { useWorkingMaster } from '@primes/hooks/production';
import { WorkingMaster } from '@primes/types/production';

interface WorkCodeSelectProps {
	value?: string | number | null;
	onChange?: (value: string) => void;
	onWorkingMasterIdChange?: (workingMasterId: number) => void;
	onWorkingMasterChange?: (workingMaster: WorkingMaster) => void;
	disabled?: boolean;
	placeholder?: string;
	className?: string;
	showCommandNo?: boolean;
	hasError?: boolean;
	// 검색 조건
	searchParams?: Partial<{
		workCode?: string;
		commandNo?: string;
		shift?: string;
	}>;
}

export const WorkCodeSelectComponent: React.FC<WorkCodeSelectProps> = ({
	placeholder,
	onChange,
	onWorkingMasterIdChange,
	onWorkingMasterChange,
	className = 'focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200',
	value = '',
	disabled,
	showCommandNo = true,
	searchParams = {},
	hasError = false,
}) => {
	// useWorkingMaster 훅 사용 - React Query 기반 데이터 관리
	const { masterList } = useWorkingMaster({
		searchRequest: {},
		page: 0,
		size: 100,
	});

	const { data: response, isLoading, error } = masterList;
	const [selectedItem, setSelectedItem] = useState<ComboBoxItem | null>(null);

	// API 응답에서 실제 데이터 배열 추출
	const data = useMemo(() => {
		if (!response) return [];

		// WorkingMasterListResponse 구조에 맞게 처리
		if (Array.isArray(response)) return response;
		if (response.content && Array.isArray(response.content))
			return response.content;

		return [];
	}, [response]);

	// 검색 조건에 따른 필터링
	const filteredData = useMemo(() => {
		if (!data || !Array.isArray(data)) return [];

		return data.filter((workCode: WorkingMaster) => {
			// workCode 필터링
			if (
				searchParams.workCode !== undefined &&
				workCode.workCode !== searchParams.workCode
			) {
				return false;
			}

			// commandNo 필터링
			if (
				searchParams.commandNo !== undefined &&
				workCode.commandNo !== searchParams.commandNo
			) {
				return false;
			}

			// status 필터링
			if (
				searchParams.shift !== undefined &&
				workCode.shift !== searchParams.shift
			) {
				return false;
			}

			return true;
		});
	}, [data, searchParams]);

	const options = useMemo(() => {
		if (
			!filteredData ||
			!Array.isArray(filteredData) ||
			filteredData.length === 0
		) {
			return [];
		}

		const newOptions = filteredData.map((workingMaster: WorkingMaster) => {
			let label: string;

			label = workingMaster.workCode || '';

			if (showCommandNo && workingMaster.commandNo) {
				label = `${label} [ ${workingMaster.commandNo} ]`;
			}

			return {
				label: label,
				value: workingMaster.id?.toString() || '0',
				workingMasterId: workingMaster.id,
				workingMaster: workingMaster,
			};
		});

		return newOptions;
	}, [filteredData, showCommandNo]);

	// Set selected item based on current value
	useEffect(() => {
		const stringValue = value?.toString() ?? '';
		if (stringValue && options.length > 0) {
			const found = options.find(
				(opt) =>
					opt.value === stringValue ||
					opt.value === stringValue.toString()
			);
			if (
				found &&
				(!selectedItem || selectedItem.value !== found.value)
			) {
				setSelectedItem(found);
			}
		} else if (selectedItem !== null) {
			setSelectedItem(null);
		}
	}, [value, options]);

	const handleChange = (item: ComboBoxItem | null) => {
		setSelectedItem(item);

		if (!item) {
			onChange?.('');
			return;
		}

		const selectedOption = options.find(
			(opt) =>
				opt.value === item.value || opt.value === item.value.toString()
		);
		if (selectedOption) {
			onChange?.(selectedOption.workingMasterId.toString());
			if (onWorkingMasterIdChange) {
				onWorkingMasterIdChange(selectedOption.workingMasterId);
			}
			if (onWorkingMasterChange && selectedOption.workingMaster) {
				onWorkingMasterChange(selectedOption.workingMaster);
			}
		}
	};

	return (
		<div className={className}>
			<ComboBox
				items={options}
				value={selectedItem}
				onChange={handleChange}
				placeholder={
					isLoading
						? '로딩 중...'
						: placeholder || '작업코드를 선택하세요'
				}
				disabled={disabled || isLoading}
				error={hasError}
			/>
		</div>
	);
};

export default WorkCodeSelectComponent;
