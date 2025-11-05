import React, { useMemo, useState, useEffect } from 'react';
import { ComboBox, ComboBoxItem } from '@radix-ui/components';
import { usePlan } from '@primes/hooks/production';

interface PlanSelectProps {
	placeholder?: string;
	onChange?: (value: string | null) => void;
	onPlanDataChange?: (planData: {
		planId: number;
		planCode: string;
	}) => void;
	className?: string;
	value?: string | number | null;
	disabled?: boolean;
	searchParams?: Record<string, any>;
}

interface PlanOption {
	id: number;
	planCode: string;
	accountMon?: string;
	itemName?: string;
	planQuantity?: number;
	status?: string;
}

export const PlanSelectComponent: React.FC<PlanSelectProps> = ({
	placeholder = '계획코드를 선택하세요',
	onChange,
	onPlanDataChange,
	className = 'focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200',
	value = '',
	disabled = false,
	searchParams = {},
}) => {
	// usePlan 훅 사용 - React Query 기반 데이터 관리
	const { list } = usePlan({
		searchRequest: {
			...searchParams,
		},
		page: 0,
		size: 100,
	});

	const { data: response, isLoading, error } = list;
	const [selectedItem, setSelectedItem] = useState<ComboBoxItem | null>(null);

	// API 응답에서 실제 데이터 배열 추출 (안정적인 참조 유지)
	const data = useMemo(() => {
		if (!response) {
			return [];
		}

		// PlanListResponse 구조에 맞게 처리
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
			return a.planCode.localeCompare(b.planCode);
		});

		return sortedData.map((plan: any) => {
			// 라벨: 계획코드와 품목명 표시
			const label = `${plan.planCode}${plan.itemName ? ` - ${plan.itemName}` : ''}`;

			return {
				label: label,
				value: plan.id.toString(),
				planCode: plan.planCode,
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
			
			if (found && onPlanDataChange) {
				onPlanDataChange({
					planId: Number(found.value),
					planCode: (found as any).planCode,
				});
			}
		} else {
			setSelectedItem(null);
		}
	}, [value, options, onPlanDataChange]);

	const handleChange = (item: ComboBoxItem | null) => {
		setSelectedItem(item);
		onChange?.(item?.value || '');
		
		// planCode도 함께 전달
		if (item && onPlanDataChange) {
			const selectedOption = options.find(opt => opt.value === item.value);
			if (selectedOption) {
				onPlanDataChange({
					planId: Number(item.value),
					planCode: (selectedOption as any).planCode,
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
			/>
		</div>
	);
};
