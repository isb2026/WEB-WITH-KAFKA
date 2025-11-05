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

interface ReactDatePickerMonthProps {
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
	name?: string;
}

// react-datepicker를 사용한 월별 선택기
export const ReactDatePickerMonth: React.FC<ReactDatePickerMonthProps> = ({
	value,
	onChange,
	placeholder = '년월을 선택하세요',
	disabled = false,
	readOnly = false,
	required = false,
	className = '',
	classNames,
	locale = 'ko',
	minDate,
	name,
	maxDate,
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

	// locale에 따른 날짜 형식 설정
	const getDateFormat = (locale: SupportedLocale) => {
		switch (locale) {
			case 'ko':
				return 'yyyy년 MM월';
			case 'th':
				return 'MM/yyyy';
			case 'en':
			default:
				return 'MM/yyyy';
		}
	};

	// locale에 따른 placeholder 설정
	const getPlaceholder = (locale: SupportedLocale) => {
		if (placeholder !== '년월을 선택하세요') {
			return placeholder; // 사용자 지정 placeholder가 있으면 그것을 사용
		}

		switch (locale) {
			case 'ko':
				return '년월을 선택하세요';
			case 'th':
				return 'เลือกเดือน/ปี';
			case 'en':
			default:
				return 'Select month/year';
		}
	};

	// 언어별 년도 표시 텍스트
	const getYearText = (year: number) => {
		switch (locale) {
			case 'en':
				return `${year}`;
			case 'th':
				return `${year + 543}`; // 태국 불교력
			case 'ko':
			default:
				return `${year}년`;
		}
	};

	// 커스텀 헤더 렌더링
	const renderCustomHeader = ({
		date,
		decreaseYear,
		increaseYear,
	}: {
		date: Date;
		decreaseYear: () => void;
		increaseYear: () => void;
	}) => (
		<div className="flex items-center justify-between px-3 py-1.5 bg-Colors-Brand-500 text-white rounded-t-lg">
			<button
				onClick={decreaseYear}
				className="p-1 hover:bg-Colors-Brand-600 rounded transition-colors flex items-center justify-center w-6 h-6"
				type="button"
				title="이전 년도"
			>
				<span className="text-sm font-bold">‹</span>
			</button>
			<span className="font-medium text-sm">
				{getYearText(date.getFullYear())}
			</span>
			<button
				onClick={increaseYear}
				className="p-1 hover:bg-Colors-Brand-600 rounded transition-colors flex items-center justify-center w-6 h-6"
				type="button"
				title="다음 년도"
			>
				<span className="text-sm font-bold">›</span>
			</button>
		</div>
	);

	return (
		<div className={`primes-month-picker ${className}`}>
			<style>
				{`
					.primes-month-picker .react-datepicker-custom-month {
						border-radius: 8px;
						box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
					}
					.primes-month-picker .react-datepicker__header {
						background-color: #8270C2;
						border-bottom: 1px solid #6A53B1;
						border-radius: 8px 8px 0 0;
					}
					.primes-month-picker .react-datepicker__current-month {
						color: white;
						font-weight: 600;
					}
					.primes-month-picker .react-datepicker__month {
						margin: 12px;
					}
					.primes-month-picker .react-datepicker__month-text {
						display: inline-block;
						width: 3rem;
						margin: 3px;
						padding: 6px;
						border-radius: 6px;
						text-align: center;
						cursor: pointer;
						transition: all 0.2s ease;
						color: #374151;
						font-weight: 500;
						font-size: 0.875rem;
					}
					.primes-month-picker .react-datepicker__month-text:hover {
						background-color: #E3E0F2;
						color: #4F3B8A;
						transform: translateY(-1px);
					}
					.primes-month-picker .react-datepicker__month-text--selected {
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
				showMonthYearPicker
				showFullMonthYearPicker={false}
				placeholderText={getPlaceholder(locale)}
				disabled={disabled}
				readOnly={readOnly}
				required={required}
				minDate={minDate}
				maxDate={maxDate}
				locale={locale}
				name={name}
				className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Colors-Brand-200 focus:border-Colors-Brand-500 hover:border-Colors-Brand-300 transition-colors ${classNames?.input || ''}`}
				calendarClassName="react-datepicker-custom-month z-[99999] shadow-xl border-0"
				popperClassName="z-[99999]"
				wrapperClassName="w-full"
				popperPlacement="bottom-start"
				renderCustomHeader={renderCustomHeader}
			/>
		</div>
	);
};

export default ReactDatePickerMonth;
