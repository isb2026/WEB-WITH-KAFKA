import React from 'react';
import { SelectFieldComponent, SelectFieldProps } from '@moornmo/components';
import { useBusinessTypeCode } from '@esg/hooks/code/useBusinessTypeCode';

export interface BusinessTypeSelectProps extends SelectFieldProps {
	name: string;
	value: any;
	onChange: (value: any) => void;
	setter?: any; // DynamicForm에서 전달되는 setValue 함수
	disabled?: boolean;
	placeholder?: string;
}

export const BusinessTypeSelect: React.FC<BusinessTypeSelectProps> = ({
	name,
	value,
	onChange,
	setter,
	disabled = false,
	placeholder = '업태를 선택하세요',
}) => {
	const { data: options = [], isLoading, error } = useBusinessTypeCode();

	// 업태 선택 핸들러 - 이제 value가 label과 동일하므로 단순함
	const handleChange = (selectedValue: string) => {
		// setter (setValue) 우선 사용, 없으면 onChange 사용
		if (setter) {
			setter(name, selectedValue); // 선택된 label 저장
		} else {
			onChange(selectedValue); // 선택된 label 저장
		}
	};

	if (error) {
		return (
			<SelectFieldComponent
				name={name}
				value=""
				options={[]}
				onChange={() => {}}
				disabled
				placeholder="업태 조회 중 오류가 발생했습니다"
				label="업태"
			/>
		);
	}

	return (
		<SelectFieldComponent
			name={name}
			value={value}
			options={options}
			onChange={(e) => handleChange(e.target.value)}
			disabled={disabled || isLoading}
			placeholder={isLoading ? '로딩 중...' : placeholder}
			label="업태"
		/>
	);
};
