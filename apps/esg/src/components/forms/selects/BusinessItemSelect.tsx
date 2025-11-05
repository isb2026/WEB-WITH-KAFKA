import React, { useEffect, useMemo } from 'react';
import { SelectFieldComponent, SelectFieldProps } from '@moornmo/components';
import { useBusinessItemCode } from '@esg/hooks/code/useBusinessItemCode';
import { useBusinessTypeCode } from '@esg/hooks/code/useBusinessTypeCode';

export interface BusinessItemSelectProps extends SelectFieldProps {
	name: string;
	value: any;
	onChange: (value: any) => void;
	setter?: any; // DynamicForm에서 전달되는 setValue 함수
	watch?: any; // DynamicForm에서 전달되는 watch 함수
	disabled?: boolean;
	placeholder?: string;
}

export const BusinessItemSelect: React.FC<BusinessItemSelectProps> = ({
	name,
	value,
	onChange,
	setter,
	watch,
	disabled = false,
	placeholder,
	...restProps
}) => {
	// watch 함수로 직접 businessType 값 가져오기 (label이 저장됨)
	const businessTypeLabel = watch ? watch('businessType') : '';

	// 업태 옵션 데이터 가져오기
	const { data: businessTypeOptions = [] } = useBusinessTypeCode();

	// businessType의 label을 통해 code 찾기 (API 호출용)
	const businessTypeCode = useMemo(() => {
		if (!businessTypeLabel || !businessTypeOptions.length) return '';
		const foundOption = businessTypeOptions.find(
			(option) => option.value === businessTypeLabel
		);
		return foundOption ? foundOption.code : '';
	}, [businessTypeLabel, businessTypeOptions]);

	// Hook을 사용한 업종 데이터 조회
	const {
		data: options = [],
		isLoading,
		error,
	} = useBusinessItemCode(businessTypeCode);

	// 업태가 변경되면 업종 값 초기화
	useEffect(() => {
		if (value && !businessTypeCode) {
			console.log('🔍 업종 값 초기화:', name);
			onChange('');
		}
	}, [businessTypeCode, value, onChange]);

	const dynamicPlaceholder = useMemo(() => {
		if (placeholder) return placeholder;

		if (!businessTypeCode) {
			return '먼저 업태를 선택하세요';
		}
		if (isLoading) {
			return '로딩 중...';
		}
		if (error) {
			return '업종 조회 중 오류가 발생했습니다';
		}
		if (options.length === 0) {
			return '업종이 없습니다';
		}
		return '업종을 선택하세요';
	}, [businessTypeCode, isLoading, error, options.length, placeholder]);

	if (error) {
		return (
			<SelectFieldComponent
				name={name}
				value=""
				options={[]}
				onChange={(e) => {
					handleChange(e);
				}}
				disabled
				placeholder="업종 조회 중 오류가 발생했습니다"
				label="업종"
			/>
		);
	}

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedValue = e.target.value;

		// setter (setValue) 우선 사용, 없으면 onChange 사용
		if (setter) {
			setter(name, selectedValue); // 선택된 label 저장
		} else {
			onChange(selectedValue); // 선택된 label 저장
		}
	};

	return (
		<SelectFieldComponent
			name={name}
			value={value}
			options={options}
			onChange={handleChange}
			disabled={disabled || isLoading || !businessTypeCode}
			placeholder={dynamicPlaceholder}
			label="업종"
		/>
	);
};
