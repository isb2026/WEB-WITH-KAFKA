import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { DateValueType } from '../types';
import { SupportedLocale, DatePickerClassNames } from '../types';
import 'react-datepicker/dist/react-datepicker.css';

interface ReactDatePickerRangeProps {
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

// react-datepicker를 사용한 날짜 범위 선택기
export const ReactDatePickerRange: React.FC<ReactDatePickerRangeProps> = ({
	value,
	onChange,
	placeholder = '기간을 선택하세요',
	disabled = false,
	readOnly = false,
	required = false,
	className = '',
	classNames,
	locale = 'ko',
	minDate,
	maxDate,
}) => {
	const [startDate, setStartDate] = useState<Date | null>(
		value?.startDate ? new Date(value.startDate) : null
	);
	const [endDate, setEndDate] = useState<Date | null>(
		value?.endDate ? new Date(value.endDate) : null
	);

	const handleStartDateChange = (date: Date | null) => {
		setStartDate(date);
		onChange?.({
			startDate: date,
			endDate: endDate,
		});
	};

	const handleEndDateChange = (date: Date | null) => {
		setEndDate(date);
		onChange?.({
			startDate: startDate,
			endDate: date,
		});
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
				<div className="space-y-2">
					<div>
						<label className="block text-xs text-Colors-Brand-600 mb-1 font-medium">
							시작일
						</label>
						<DatePicker
							selected={startDate}
							onChange={handleStartDateChange}
							selectsStart
							startDate={startDate}
							endDate={endDate}
							dateFormat="yyyy-MM-dd"
							placeholderText="시작일"
							disabled={disabled}
							readOnly={readOnly}
							required={required}
							minDate={minDate}
							maxDate={endDate || maxDate}
							locale={getLocaleString()}
							className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Colors-Brand-200 focus:border-Colors-Brand-500 hover:border-Colors-Brand-300 transition-colors ${classNames?.input || ''}`}
							calendarClassName="react-datepicker-custom-datetime z-[99999] shadow-xl border-0"
							popperClassName="z-[99999]"
							wrapperClassName="w-full"
							popperPlacement="bottom-start"
							renderCustomHeader={renderCustomHeader}
						/>
					</div>
					<div>
						<label className="block text-xs text-Colors-Brand-600 mb-1 font-medium">
							종료일
						</label>
						<DatePicker
							selected={endDate}
							onChange={handleEndDateChange}
							selectsEnd
							startDate={startDate}
							endDate={endDate}
							dateFormat="yyyy-MM-dd"
							placeholderText="종료일"
							disabled={disabled}
							readOnly={readOnly}
							required={required}
							minDate={startDate || minDate}
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
				</div>
			</div>
		);
	} catch (error) {
		console.error('ReactDatePickerRange 렌더링 에러:', error);
		// Fallback UI
		return (
			<div className={className}>
				<div className="space-y-2">
					<div>
						<label className="block text-xs text-gray-600 mb-1">
							시작일
						</label>
						<input
							type="date"
							value={
								startDate
									? startDate.toISOString().slice(0, 10)
									: ''
							}
							onChange={(e) => {
								if (e.target.value) {
									const date = new Date(e.target.value);
									handleStartDateChange(date);
								} else {
									handleStartDateChange(null);
								}
							}}
							placeholder="시작일"
							disabled={disabled}
							readOnly={readOnly}
							min={
								minDate
									? minDate.toISOString().slice(0, 10)
									: undefined
							}
							max={
								endDate
									? endDate.toISOString().slice(0, 10)
									: maxDate
										? maxDate.toISOString().slice(0, 10)
										: undefined
							}
							className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Colors-Brand-200 focus:border-Colors-Brand-500 hover:border-Colors-Brand-300 transition-colors ${classNames?.input || ''}`}
						/>
					</div>
					<div>
						<label className="block text-xs text-gray-600 mb-1">
							종료일
						</label>
						<input
							type="date"
							value={
								endDate
									? endDate.toISOString().slice(0, 10)
									: ''
							}
							onChange={(e) => {
								if (e.target.value && startDate) {
									const date = new Date(e.target.value);
									handleEndDateChange(date);
								}
							}}
							placeholder="종료일"
							disabled={disabled}
							readOnly={readOnly}
							min={
								startDate
									? startDate.toISOString().slice(0, 10)
									: undefined
							}
							max={
								maxDate
									? maxDate.toISOString().slice(0, 10)
									: undefined
							}
							className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Colors-Brand-200 focus:border-Colors-Brand-500 hover:border-Colors-Brand-300 transition-colors ${classNames?.input || ''}`}
						/>
					</div>
				</div>
			</div>
		);
	}
};

export default ReactDatePickerRange;
