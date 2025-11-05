import React, { useState } from 'react';
import DataPickerComponent from './DatePicker';
import { DateValueType } from 'react-tailwindcss-datepicker';
import { SupportedLocale, DatePickerClassNames, TailwindColor } from '../types';

interface BasePickerProps {
	value?: DateValueType | null;
	onChange?: (value: DateValueType | null) => void;
	placeholder?: string;
	className?: string;
	classNames?: DatePickerClassNames;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	locale?: SupportedLocale;
	minDate?: Date;
	maxDate?: Date;
	primaryColor?: TailwindColor;
	showShortcuts?: boolean;
	showFooter?: boolean;
}

// 간단한 날짜 선택용 (단축키 없음)
export const SimpleDatePicker: React.FC<BasePickerProps> = ({
	placeholder = '날짜 선택',
	locale = 'ko',
	primaryColor = 'purple',
	...props
}) => {
	return (
		<DataPickerComponent
			{...props}
			placeholder={placeholder}
			asSingle={true}
			showShortcuts={false}
			showFooter={false}
			locale={locale}
			primaryColor={primaryColor}
			classNames={{
				container: 'relative z-[9999]',
				...props.classNames,
			}}
		/>
	);
};

// 단일 날짜 선택용 (풀 기능)
export const SingleDatePicker: React.FC<BasePickerProps> = ({
	placeholder = '날짜를 선택하세요',
	locale = 'ko',
	primaryColor = 'purple',
	...props
}) => {
	return (
		<DataPickerComponent
			{...props}
			placeholder={placeholder}
			asSingle={true}
			showShortcuts={true}
			showFooter={true}
			locale={locale}
			primaryColor={primaryColor}
			classNames={{
				container: 'relative z-[9999]',
				...props.classNames,
			}}
		/>
	);
};

// 날짜 범위 선택용
export const DateRangePicker: React.FC<BasePickerProps> = ({
	placeholder = '기간을 선택하세요',
	locale = 'ko',
	primaryColor = 'purple',
	...props
}) => {
	return (
		<DataPickerComponent
			{...props}
			placeholder={placeholder}
			asSingle={false}
			useRange={true}
			showShortcuts={true}
			showFooter={true}
			locale={locale}
			primaryColor={primaryColor}
			classNames={{
				container: 'relative z-[9999]',
				...props.classNames,
			}}
		/>
	);
};

// 네이티브 HTML month input 사용
export const MonthPicker: React.FC<BasePickerProps> = ({
	value,
	onChange,
	placeholder = '년월을 선택하세요',
	disabled = false,
	readOnly = false,
	required = false,
	className = '',
	classNames,
	minDate,
	maxDate,
	...props
}) => {
	// DateValueType을 HTML month input 값으로 변환
	const monthValue = value?.startDate
		? new Date(value.startDate).toISOString().slice(0, 7)
		: '';

	const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value) {
			const date = new Date(e.target.value + '-01');
			onChange?.({
				startDate: date,
				endDate: date,
			});
		} else {
			onChange?.(null);
		}
	};

	return (
		<div className={className}>
			<input
				type="month"
				value={monthValue}
				onChange={handleMonthChange}
				placeholder={placeholder}
				disabled={disabled}
				readOnly={readOnly}
				required={required}
				min={
					minDate
						? new Date(minDate).toISOString().slice(0, 7)
						: undefined
				}
				max={
					maxDate
						? new Date(maxDate).toISOString().slice(0, 7)
						: undefined
				}
				className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Colors-Brand-200 focus:border-Colors-Brand-500 hover:border-Colors-Brand-300 transition-colors ${classNames?.input || ''}`}
			/>
		</div>
	);
};

// 다국어 테스트용 컴포넌트
export const MultiLanguageDatePicker: React.FC<
	BasePickerProps & {
		languages?: SupportedLocale[];
	}
> = ({
	languages = ['ko', 'en', 'th'],
	locale = 'ko',
	primaryColor = 'purple',
	...props
}) => {
	const [currentLang, setCurrentLang] = useState<SupportedLocale>(locale);

	return (
		<div className="space-y-2">
			<div className="flex gap-2 mb-2">
				{languages.map((lang) => (
					<button
						key={lang}
						onClick={() => setCurrentLang(lang)}
						className={`px-2 py-1 text-xs rounded transition-colors ${
							currentLang === lang
								? 'bg-Colors-Brand-500 text-white'
								: 'bg-gray-200 text-gray-700 hover:bg-Colors-Brand-100 hover:text-Colors-Brand-700'
						}`}
					>
						{lang.toUpperCase()}
					</button>
				))}
			</div>
			<DataPickerComponent
				{...props}
				locale={currentLang}
				primaryColor={primaryColor}
				asSingle={true}
				showShortcuts={true}
				showFooter={true}
				classNames={{
					container: 'relative',
					...props.classNames,
				}}
			/>
		</div>
	);
};
