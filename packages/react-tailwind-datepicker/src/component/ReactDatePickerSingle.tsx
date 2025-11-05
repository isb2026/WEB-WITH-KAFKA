import React from 'react';
import DatePicker from 'react-datepicker';
import { DateValueType } from '../types';
import { SupportedLocale, DatePickerClassNames } from '../types';
import 'react-datepicker/dist/react-datepicker.css';

interface ReactDatePickerSingleProps {
	value?: DateValueType | null;
	onChange?: (value: DateValueType | null) => void;
	placeholder?: string;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	className?: string;
	classNames?: DatePickerClassNames;
	locale?: SupportedLocale;
	minDate?: Date;
	maxDate?: Date;
	showShortcuts?: boolean;
}

// react-datepicker를 사용한 단일 날짜 선택기
export const ReactDatePickerSingle: React.FC<ReactDatePickerSingleProps> = ({
	value,
	onChange,
	placeholder = '날짜를 선택하세요',
	disabled = false,
	readOnly = false,
	required = false,
	className = '',
	classNames,
	locale = 'ko',
	minDate,
	maxDate,
	showShortcuts = false,
}) => {
	const currentDate = value?.startDate ? new Date(value.startDate) : null;

	const handleChange = (date: Date | null) => {
		if (date) {
			onChange?.({
				startDate: date,
				endDate: date,
			});
		} else {
			onChange?.(null);
		}
	};

	const getLocaleString = () => {
		switch (locale) {
			case 'en':
				return 'en-US';
			case 'th':
				return 'th-TH';
			case 'ko':
			default:
				return 'ko-KR';
		}
	};

	// 언어별 년월 표시 텍스트
	const getYearMonthText = (date: Date) => {
		switch (locale) {
			case 'en':
				return date.toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
				});
			case 'th':
				return date.toLocaleDateString('th-TH', {
					year: 'numeric',
					month: 'long',
				});
			case 'ko':
			default:
				return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
		}
	};

	// 커스텀 헤더 렌더링
	const renderCustomHeader = ({
		date,
		decreaseMonth,
		increaseMonth,
		prevMonthButtonDisabled,
		nextMonthButtonDisabled,
	}: {
		date: Date;
		decreaseMonth: () => void;
		increaseMonth: () => void;
		prevMonthButtonDisabled: boolean;
		nextMonthButtonDisabled: boolean;
	}) => (
		<div className="flex items-center justify-between px-3 py-1.5 bg-Colors-Brand-500 text-white rounded-t-lg">
			<button
				onClick={decreaseMonth}
				disabled={prevMonthButtonDisabled}
				className="p-1 hover:bg-Colors-Brand-600 rounded transition-colors flex items-center justify-center w-6 h-6 disabled:opacity-50 disabled:cursor-not-allowed"
				type="button"
				title="이전 월"
			>
				<span className="text-sm font-bold">‹</span>
			</button>
			<span className="font-medium text-sm">
				{getYearMonthText(date)}
			</span>
			<button
				onClick={increaseMonth}
				disabled={nextMonthButtonDisabled}
				className="p-1 hover:bg-Colors-Brand-600 rounded transition-colors flex items-center justify-center w-6 h-6 disabled:opacity-50 disabled:cursor-not-allowed"
				type="button"
				title="다음 월"
			>
				<span className="text-sm font-bold">›</span>
			</button>
		</div>
	);

	// 에러 방지를 위한 안전 장치
	try {
		return (
			<div className={className}>
				<DatePicker
					selected={currentDate}
					onChange={handleChange}
					dateFormat="yyyy-MM-dd"
					placeholderText={placeholder}
					disabled={disabled}
					readOnly={readOnly}
					required={required}
					minDate={minDate}
					maxDate={maxDate}
					locale={getLocaleString()}
					className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Colors-Brand-200 focus:border-Colors-Brand-500 hover:border-Colors-Brand-300 transition-colors ${classNames?.input || ''}`}
					calendarClassName="react-datepicker-custom-datetime z-[99999] shadow-xl border-0"
					popperClassName="z-[99999]"
					wrapperClassName="w-full"
					popperPlacement="bottom-start"
					renderCustomHeader={renderCustomHeader}
				/>
			</div>
		);
	} catch (error) {
		console.error('ReactDatePickerSingle 렌더링 에러:', error);
		// Fallback UI
		return (
			<div className={className}>
				<input
					type="date"
					value={
						currentDate
							? currentDate.toISOString().slice(0, 10)
							: ''
					}
					onChange={(e) => {
						if (e.target.value) {
							const date = new Date(e.target.value);
							handleChange(date);
						} else {
							handleChange(null);
						}
					}}
					placeholder={placeholder}
					disabled={disabled}
					readOnly={readOnly}
					required={required}
					className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Colors-Brand-200 focus:border-Colors-Brand-500 hover:border-Colors-Brand-300 transition-colors ${classNames?.input || ''}`}
				/>
			</div>
		);
	}
};

export default ReactDatePickerSingle;
