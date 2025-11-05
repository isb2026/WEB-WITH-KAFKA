import React, { useMemo, useState, useEffect } from 'react';
import { ComboBox, ComboBoxItem } from '@radix-ui/components';
import { usePurchaseMaster } from '@primes/hooks/purchase/purchaseMaster/usePurchaseMaster';

interface PurchaseCodeSelectProps {
	placeholder?: string;
	onChange?: (value: string | null) => void;
	className?: string;
	value?: string | number | null;
	disabled?: boolean;
	searchParams?: Record<string, any>;
}

interface PurchaseCodeOption {
	id?: number;
	purchaseCode?: string;
	purchaseType?: string;
	vendorName?: string;
	isClose?: boolean;
	isApproval?: boolean;
}

export const PurchaseCodeSelectComponent: React.FC<PurchaseCodeSelectProps> = ({
	placeholder = '계획코드를 선택하세요',
	onChange,
	className = 'focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200',
	value = '',
	disabled = false,
	searchParams = {},
}) => {
	// usePurchaseCode 훅 사용 - React Query 기반 데이터 관리
	const { list } = usePurchaseMaster({
		page: 0,
		size: 100,
		...searchParams,
	});

	const { data: response, isLoading, error } = list;
	const [selectedItem, setSelectedItem] = useState<ComboBoxItem | null>(null);

	// API 응답에서 실제 데이터 배열 추출 (안정적인 참조 유지)
	const data = useMemo(() => {
		if (!response) {
			return [];
		}

		// PurchaseCodeListResponse 구조에 맞게 처리
		let extractedData = [];
		if (Array.isArray(response)) {
			extractedData = response;
		} else if (response.content && Array.isArray(response.content)) {
			extractedData = response.content;
		}

		return extractedData;
	}, [response]);

	// 옵션 생성 (useMemo로 최적화)
	const options = useMemo(() => {
		if (!data || !Array.isArray(data) || data.length === 0) {
			return [];
		}

		// 계획코드 기준으로 오름차순 정렬
		const sortedData = [...data].sort((a, b) => {
			return a.purchaseCode.localeCompare(b.purchaseCode);
		});

		return sortedData.map((purchase: any) => {
			const label = `${purchase.purchaseCode}${purchase.itemName ? ` - ${purchase.itemName}` : ''}`;
			
			// Use purchaseCode as the value so it can be used as incomingCode
			return {
				label: label,
				value: purchase.purchaseCode.toString(),
			};
		});
	}, [data]);

	// Set selected item based on current value
	useEffect(() => {
		const stringValue = value !== null && value !== undefined && value !== '' 
			? value.toString() 
			: '';
		
		if (stringValue && options.length > 0) {
			const found = options.find(opt => opt.value === stringValue);
			setSelectedItem(found || null);
		} else {
			setSelectedItem(null);
		}
	}, [value, options]);

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
				placeholder={isLoading ? '로딩 중...' : placeholder}
				disabled={disabled || isLoading}
			/>
		</div>
	);
};
