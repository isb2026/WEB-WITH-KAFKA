import React from 'react';
import { useVendorFieldQuery } from '@primes/hooks/init/vendor/useVendorFieldQuery';
import { VendorSearchRequest } from '@primes/types/vendor';
import { ComboBox, ComboBoxItem } from '@radix-ui/components';

interface VendorSelectProps {
	placeholder?: string;
	fieldKey?: string;
	onChange?: (value: string | null, label?: string, vendorData?: { id: number; compName: string }) => void;
	className?: string;
	value?: string | null;
	disabled?: boolean;
	includeVendorType?: string[]; // 추가된 prop
	error?: boolean;
}

interface FieldOption {
	id: number | string;
	value: string;
	label?: string;
}

export const VendorSelectComponent: React.FC<VendorSelectProps> = React.memo(
	({
		fieldKey = 'compName',
		placeholder,
		onChange,
		className = 'focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200',
		value = '',
		disabled,
		includeVendorType,
		error = false,
	}) => {
		// 검색 요청 객체를 안정적으로 메모이제이션
		const vendorSearchRequest: VendorSearchRequest = React.useMemo(() => {
			const request: VendorSearchRequest = {};

			if (includeVendorType && includeVendorType.length > 0) {
				request.compType = includeVendorType[0];
			}

			return request;
		}, [includeVendorType]);

		// 쿼리 키를 안정화하기 위해 JSON.stringify 사용
		const stableSearchRequest = React.useMemo(
			() => JSON.stringify(vendorSearchRequest),
			[vendorSearchRequest]
		);

		const { data } = useVendorFieldQuery(fieldKey, vendorSearchRequest);

		// 옵션 데이터를 메모이제이션으로 최적화
		const options = React.useMemo(() => {
			if (!data) return [];

			return data.map((d: FieldOption) => ({
				label: d.value,
				value: d.value,
			}));
		}, [data]);

			// 핸들러 함수를 메모이제이션으로 최적화
	const handleValueChange = React.useCallback(
		(item: ComboBoxItem | null) => {
			const value = item?.value || '';
			const label = item?.label || '';
			
			// Find the original vendor data
			const vendorData = data?.find((d: FieldOption) => d.value === item?.value);
			const vendorInfo = vendorData ? { id: Number(vendorData.id), compName: vendorData.value } : undefined;
			
			// Check if onChange expects vendorData parameter (for backward compatibility)
			if (onChange) {
				// Try to call with all parameters, but it's safe because vendorData is optional
				onChange(value, label, vendorInfo);
			}
		},
		[onChange, data]
	);

		// 현재 선택된 아이템을 찾는 함수
		const selectedItem = React.useMemo(() => {
			if (!value) return null;
			return (
				options.find(
					(option: ComboBoxItem) => option.value === value
				) || null
			);
		}, [value, options]);

		return (
			<div className={className}>
				<ComboBox
					items={options}
					value={selectedItem}
					onChange={handleValueChange}
					placeholder={placeholder}
					disabled={disabled}
					error={error}
				/>
			</div>
		);
	}
);
