import React, { useMemo, useState, useEffect } from 'react';
import { ComboBox, ComboBoxItem } from '@radix-ui/components';
import { useCommandProgress } from '@primes/hooks/production/commandProgress/useCommandProgress';
import { CommandProgressDto } from '@primes/types/production/commandProgressTypes';

interface CommandProgressSelectProps {
	value?: string | number | null;
	onChange?: (value: string) => void;
	onCommandProgressChange?: (commandProgress: CommandProgressDto) => void;
	disabled?: boolean;
	placeholder?: string;
	className?: string;
	commandId?: number;
}

export const CommandProgressSelectComponent: React.FC<CommandProgressSelectProps> = ({
	placeholder,
	onChange,
	onCommandProgressChange,
	className = 'focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200',
	value = '',
	disabled,
	commandId,
}) => {
	const { list } = useCommandProgress({
		searchRequest: commandId ? { commandId } : undefined,
		page: 0,
		size: 100,
	});

	const { data: response, isLoading, error } = list;
	const [selectedItem, setSelectedItem] = useState<ComboBoxItem | null>(null);

	// API 응답에서 실제 데이터 배열 추출
	const data = useMemo(() => {
		if (!response || !commandId) return [];

		if (Array.isArray(response)) return response;
		if (response.data?.content && Array.isArray(response.data.content)) {
			return response.data.content;
		}

		return [];
	}, [response, commandId]);

	const options = useMemo(() => {
		if (!data || !Array.isArray(data) || data.length === 0) {
			return [];
		}

		// progressOrder로 정렬
		const sortedData = [...data].sort((a, b) => {
			const aOrder = a.progressOrder || 0;
			const bOrder = b.progressOrder || 0;
			return aOrder - bOrder;
		});

		return sortedData.map((progress: CommandProgressDto) => ({
			label: progress.progressName || `공정 ${progress.progressId}`,
			value: progress.progressId?.toString() || '0',
			progressData: progress,
		}));
	}, [data]);

	// Set selected item based on current value
	useEffect(() => {
		const stringValue = value?.toString() ?? '';
		if (stringValue && options.length > 0) {
			const found = options.find(
				(opt) => opt.value === stringValue || opt.value === stringValue.toString()
			);
			if (found && (!selectedItem || selectedItem.value !== found.value)) {
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
			(opt) => opt.value === item.value || opt.value === item.value.toString()
		);
		if (selectedOption) {
			onChange?.(selectedOption.value);
			if (onCommandProgressChange && selectedOption.progressData) {
				onCommandProgressChange(selectedOption.progressData);
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
					!commandId 
						? '먼저 작업지시를 선택하세요'
						: isLoading 
							? '공정 로딩 중...' 
							: placeholder || '공정을 선택하세요'
				}
				disabled={disabled || isLoading || !commandId}
			/>
		</div>
	);
};

export default CommandProgressSelectComponent;
