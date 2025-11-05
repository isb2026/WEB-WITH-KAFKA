import React, { useEffect, useState } from 'react';
import { useOrderMasterFieldQuery } from '@primes/hooks/sales/orderMaster/useOrderMasterFieldQuery';
import { ComboBox, ComboBoxItem } from '@radix-ui/components';

interface SalesOrderSelectProps {
	placeholder?: string;
	fieldKey?: string;
	onChange?: (value: string | null) => void;
	className?: string;
	value?: string | null;
	disabled?: boolean;
	valueKeyType?: 'id' | 'value';
}

interface FieldOption {
	id: number | string;
	value: string;
}

export const SalesOrderSelectComponent: React.FC<SalesOrderSelectProps> = ({
	fieldKey = 'orderCode',
	placeholder,
	onChange,
	className = 'focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200',
	value = '',
	disabled,
	valueKeyType = 'id',
}) => {
	const { data } = useOrderMasterFieldQuery(fieldKey);
	const [options, setOptions] = useState<ComboBoxItem[]>([]);
	const [selectedItem, setSelectedItem] = useState<ComboBoxItem | null>(null);

	useEffect(() => {
		if (data) {
			const newOptions = data
				.filter((d: FieldOption) => d.value && d.value.trim() !== '')
				.map((d: FieldOption) => {
					const currentValue =
						valueKeyType === 'id' ? d.id?.toString() || d : d.value;
					return {
						label: d.value,
						value: currentValue,
					};
				});
			setOptions(newOptions);

			// Set selected item based on current value
			if (value) {
				const found = newOptions.find(
					(opt: ComboBoxItem) => opt.value === value
				);
				setSelectedItem(found || null);
			} else {
				setSelectedItem(null);
			}
		}
	}, [data, value]);

	const handleChange = (item: ComboBoxItem | null) => {
		setSelectedItem(item);
		onChange?.(item?.value || '');
	};

	return (
		<div className={className}>
			<ComboBox
				items={options}
				value={selectedItem}
				onChange={handleChange}
				placeholder={placeholder}
				disabled={disabled}
			/>
		</div>
	);
};
