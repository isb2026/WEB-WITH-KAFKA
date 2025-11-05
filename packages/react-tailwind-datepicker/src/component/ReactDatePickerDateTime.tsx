import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { DateValueType } from '../types';
import { SupportedLocale, DatePickerClassNames } from '../types';
import 'react-datepicker/dist/react-datepicker.css';

// date-fns locales import
import { ko, enUS, th } from 'date-fns/locale';

// Register locales
registerLocale('ko', ko);
registerLocale('en', enUS);
registerLocale('th', th);

interface ReactDatePickerDateTimeProps {
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
}

// react-datepicker를 사용한 날짜시간 선택기 (간단 버전)
export const ReactDatePickerDateTime: React.FC<
	ReactDatePickerDateTimeProps
> = ({
	value,
	onChange,
	placeholder = '날짜와 시간을 선택하세요',
	disabled = false,
	readOnly = false,
	required = false,
	className = '',
	classNames,
	locale = 'ko',
	minDate,
	maxDate,
}) => {
	const currentDate = value?.startDate ? new Date(value.startDate) : null;

	// locale에 따른 날짜 형식 설정
	const getDateFormat = (locale: SupportedLocale) => {
		switch (locale) {
			case 'ko':
				return 'yyyy년 MM월 dd일 HH:mm';
			case 'th':
				return 'dd/MM/yyyy HH:mm';
			case 'en':
			default:
				return 'MM/dd/yyyy HH:mm';
		}
	};

	// locale에 따른 placeholder 설정
	const getPlaceholder = (locale: SupportedLocale) => {
		if (placeholder !== '날짜와 시간을 선택하세요') {
			return placeholder; // 사용자 지정 placeholder가 있으면 그것을 사용
		}

		switch (locale) {
			case 'ko':
				return '날짜와 시간을 선택하세요';
			case 'th':
				return 'เลือกวันที่และเวลา';
			case 'en':
			default:
				return 'Select date and time';
		}
	};

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

	// 에러 방지를 위한 안전 장치
	try {
		return (
			<div className={`primes-datetime-picker ${className}`}>
				<style>
					{`
						.primes-datetime-picker .react-datepicker-custom-datetime {
							border-radius: 8px;
							box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
						}
						.primes-datetime-picker .react-datepicker__header {
							background-color: #8270C2;
							border-bottom: 1px solid #6A53B1;
							border-radius: 8px 8px 0 0;
							padding: 0;
						}
						.primes-datetime-picker .react-datepicker__current-month {
							color: white;
							font-weight: 600;
							margin: 0;
						}
						.primes-datetime-picker .react-datepicker__day-name {
							color: #E3E0F2;
							font-weight: 500;
							font-size: 0.75rem;
						}
						.primes-datetime-picker .react-datepicker__day {
							border-radius: 6px;
							transition: all 0.2s ease;
							font-size: 0.875rem;
						}
						.primes-datetime-picker .react-datepicker__day:hover {
							background-color: #E3E0F2;
							color: #4F3B8A;
						}
						.primes-datetime-picker .react-datepicker__day--selected {
							background-color: #8270C2;
							color: white;
							font-weight: 600;
						}
						.primes-datetime-picker .react-datepicker__time-container {
							border-left: 1px solid #CBC5E7;
						}
						.primes-datetime-picker .react-datepicker__time-list-item {
							transition: all 0.2s ease;
							font-size: 0.875rem;
						}
						.primes-datetime-picker .react-datepicker__time-list-item:hover {
							background-color: #E3E0F2;
							color: #4F3B8A;
						}
						.primes-datetime-picker .react-datepicker__time-list-item--selected {
							background-color: #8270C2;
							color: white;
							font-weight: 600;
						}
					`}
				</style>
				<DatePicker
					selected={currentDate}
					onChange={handleChange}
					dateFormat={getDateFormat(locale)}
					showTimeSelect
					timeFormat="HH:mm"
					timeIntervals={5}
					placeholderText={getPlaceholder(locale)}
					disabled={disabled}
					readOnly={readOnly}
					required={required}
					minDate={minDate}
					maxDate={maxDate}
					locale={locale}
					className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Colors-Brand-200 focus:border-Colors-Brand-500 hover:border-Colors-Brand-300 transition-colors ${classNames?.input || ''}`}
					calendarClassName="react-datepicker-custom-datetime z-[99999] shadow-xl border-0"
					popperClassName="z-[99999]"
					wrapperClassName="w-full"
					popperPlacement="bottom-start"
				/>
			</div>
		);
	} catch (error) {
		console.error('ReactDatePickerDateTime 렌더링 에러:', error);
		// Fallback UI
		return (
			<div className={className}>
				<input
					type="datetime-local"
					value={
						currentDate
							? currentDate.toISOString().slice(0, 16)
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

export default ReactDatePickerDateTime;
