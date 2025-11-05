import React from 'react';
import DataPickerComponent from './DatePicker';
import { DateValueType } from 'react-tailwindcss-datepicker';
import { SupportedLocale, DatePickerClassNames, TailwindColor } from '../types';

interface AlternativeMonthPickerProps {
	value?: DateValueType;
	onChange?: (value: DateValueType) => void;
	placeholder?: string;
	className?: string;
	classNames?: DatePickerClassNames;
	disabled?: boolean;
	readOnly?: boolean;
	locale?: SupportedLocale;
	minDate?: Date;
	maxDate?: Date;
	primaryColor?: TailwindColor;
}

// react-tailwindcss-datepicker를 사용하되 월 선택에 최적화
export const AlternativeMonthPicker: React.FC<AlternativeMonthPickerProps> = ({ 
	placeholder = '년월을 선택하세요', 
	locale = 'ko',
	primaryColor = 'violet',
	...props 
}) => {
	return (
		<div className="space-y-1">
			<p className="text-xs text-gray-600">
				💡 월 선택 후 해당 월의 1일이 선택됩니다
			</p>
			<DataPickerComponent
				{...props}
				placeholder={placeholder}
				asSingle={true}
				displayFormat="YYYY-MM"
				showShortcuts={false}
				showFooter={false}
				locale={locale}
				primaryColor={primaryColor}
				classNames={{
					container: 'relative',
					input: 'text-sm border-gray-300 focus:border-Colors-Brand-500 focus:ring-Colors-Brand-200',
					...props.classNames,
				}}
			/>
		</div>
	);
};
