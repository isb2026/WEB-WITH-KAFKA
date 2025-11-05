import React from 'react';

interface BinaryToggleComponentProps {
	value?: string;
	onChange?: (value: string) => void;
	disabled?: boolean;
	falseLabel: string;
	trueLabel: string;
	falseValue?: string;
	trueValue?: string;
}

export const BinaryToggleComponent: React.FC<BinaryToggleComponentProps> = ({
	value,
	onChange,
	disabled = false,
	falseLabel,
	trueLabel,
	falseValue = 'false',
	trueValue = 'true',
}) => {
	// value가 undefined, null, 빈 문자열일 때 기본값 설정
	const currentValue = value === undefined || value === null || value === '' ? falseValue : value;
	const handleToggle = (newValue: string) => {
		if (!disabled && onChange) {
			onChange(newValue);
		}
	};

	return (
		<div className="flex items-center bg-gray-100 rounded-lg p-1 w-fit">
			<button
				type="button"
				onClick={() => handleToggle(falseValue)}
				disabled={disabled}
				className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
					currentValue === falseValue
						? 'bg-white text-gray-900 shadow-sm'
						: 'text-gray-600 hover:text-gray-900'
				} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
			>
				{falseLabel}
			</button>
			<button
				type="button"
				onClick={() => handleToggle(trueValue)}
				disabled={disabled}
				className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
					currentValue === trueValue
						? 'bg-Colors-Brand-600 text-white shadow-sm'
						: 'text-gray-600 hover:text-gray-900'
				} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
			>
				{trueLabel}
			</button>
		</div>
	);
};

export default BinaryToggleComponent; 