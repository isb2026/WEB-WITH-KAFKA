import React, { useState, useCallback, useMemo } from 'react';
import {
	DataPickerComponent,
	SimpleDatePicker,
	SingleDatePicker,
	DateRangePicker,
	MonthPicker,
	MultiLanguageDatePicker,
	ReactDatePickerMonth,
	ReactDatePickerDateTime,
	DateValueType,
	SupportedLocale,
} from '@repo/react-tailwind-datepicker';

// Primes 프로젝트 전용 DatePicker 인터페이스
interface PrimesDatePickerProps {
	value?: DateValueType | null;
	onChange?: (value: DateValueType | null) => void;
	placeholder?: string;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	className?: string;
	mode?: 'single' | 'range' | 'month' | 'month-react' | 'datetime' | 'simple';
	locale?: SupportedLocale;
	showLanguageToggle?: boolean;
	// react-hook-form 통합을 위한 추가 props
	name?: string;
	onBlur?: () => void;
	ref?: React.Ref<any>;
}

// Primes 브랜드 컬러에 맞춘 기본 스타일
const PRIMES_DATEPICKER_STYLES = {
	container: 'relative w-full overflow-visible',
	input: 'w-full min-w-[200px] text-sm border-gray-300 focus:border-Colors-Brand-500 focus:ring-Colors-Brand-200 hover:border-Colors-Brand-300 transition-colors',
	toggle: 'text-Colors-Brand-500 hover:text-Colors-Brand-600',
	calendar: 'min-w-[320px] z-[99999] shadow-xl border-0',
};

// 언어 전환 버튼 컴포넌트 (메모이제이션)
const LanguageToggle = React.memo<{
	currentLang: SupportedLocale;
	onLanguageChange: (lang: SupportedLocale) => void;
}>(({ currentLang, onLanguageChange }) => {
	const languages: SupportedLocale[] = ['ko', 'en', 'th'];

	return (
		<div className="flex gap-1 mb-2">
			{languages.map((lang) => (
				<button
					key={lang}
					onClick={() => onLanguageChange(lang)}
					className={`px-2 py-1 text-xs rounded transition-colors ${
						currentLang === lang
							? 'bg-Colors-Brand-500 text-white shadow-sm'
							: 'bg-gray-100 text-gray-600 hover:bg-Colors-Brand-100 hover:text-Colors-Brand-700'
					}`}
				>
					{lang.toUpperCase()}
				</button>
			))}
		</div>
	);
});

// Primes 메인 DatePicker 컴포넌트
export const PrimesDatePicker = React.forwardRef<any, PrimesDatePickerProps>(
	(
		{
			value,
			onChange,
			placeholder,
			disabled = false,
			readOnly = false,
			required = false,
			className = '',
			mode = 'single',
			locale = 'ko',
			showLanguageToggle = false,
			name,
			onBlur,
		},
		ref
	) => {
		const [currentLang, setCurrentLang] = useState<SupportedLocale>(locale);

		// 디버깅을 위한 로그
		React.useEffect(() => {
			console.log(
				`[PrimesDatePicker] ${name || 'unnamed'} - value changed:`,
				value
			);
		}, [value, name]);

		const handleChange = useCallback(
			(newValue: DateValueType | null) => {
				console.log(
					`[PrimesDatePicker] ${name || 'unnamed'} - onChange called with:`,
					newValue
				);
				onChange?.(newValue);
			},
			[onChange, name]
		);

		// 공통 props 메모이제이션
		const commonDatePickerProps = useMemo(
			() => ({
				value,
				onChange: handleChange,
				disabled,
				readOnly,
				required,
				locale: currentLang,
				className,
				classNames: PRIMES_DATEPICKER_STYLES,
			}),
			[
				value,
				handleChange,
				disabled,
				readOnly,
				required,
				currentLang,
				className,
			]
		);

		const renderDatePicker = useMemo(() => {
			switch (mode) {
				case 'month':
					// 네이티브 HTML month input
					const monthValue = value?.startDate
						? new Date(value.startDate).toISOString().slice(0, 7)
						: '';

					return (
						<div className={className}>
							<input
								type="month"
								name={name}
								value={monthValue}
								onChange={(e) => {
									if (e.target.value) {
										const date = new Date(
											e.target.value + '-01'
										);
										handleChange({
											startDate: date,
											endDate: date,
										});
									} else {
										handleChange(null);
									}
								}}
								onBlur={onBlur}
								placeholder={placeholder || '년월을 선택하세요'}
								disabled={disabled}
								readOnly={readOnly}
								required={required}
								ref={ref}
								className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Colors-Brand-200 focus:border-Colors-Brand-500 hover:border-Colors-Brand-300 transition-colors"
							/>
						</div>
					);
				case 'month-react':
					return (
						<ReactDatePickerMonth
							{...commonDatePickerProps}
							placeholder={placeholder || '년월을 선택하세요'}
							name={name}
						/>
					);
				case 'datetime':
					return (
						<ReactDatePickerDateTime
							{...commonDatePickerProps}
							placeholder={
								placeholder || '날짜와 시간을 선택하세요'
							}
						/>
					);
				case 'range':
					// react-tailwindcss-datepicker 범위 선택
					return (
						<DateRangePicker
							{...commonDatePickerProps}
							placeholder={placeholder || '기간을 선택하세요'}
							primaryColor="purple"
						/>
					);
				case 'simple':
					// react-tailwindcss-datepicker 간단한 모드
					return (
						<SimpleDatePicker
							{...commonDatePickerProps}
							placeholder={placeholder || '날짜 선택'}
							primaryColor="purple"
						/>
					);
				case 'single':
				default:
					// react-tailwindcss-datepicker 풀 기능
					return (
						<SingleDatePicker
							{...commonDatePickerProps}
							placeholder={placeholder || '날짜를 선택하세요'}
							primaryColor="purple"
						/>
					);
			}
		}, [
			mode,
			value,
			handleChange,
			placeholder,
			disabled,
			readOnly,
			required,
			currentLang,
			className,
			commonDatePickerProps,
			name,
			onBlur,
			ref,
		]);

		// 언어 변경 핸들러 메모이제이션
		const handleLanguageChange = useCallback((lang: SupportedLocale) => {
			setCurrentLang(lang);
		}, []);

		return (
			<div className="space-y-2">
				{showLanguageToggle && (
					<LanguageToggle
						currentLang={currentLang}
						onLanguageChange={handleLanguageChange}
					/>
				)}
				{renderDatePicker}
			</div>
		);
	}
);

// displayName 설정 (디버깅을 위해)
PrimesDatePicker.displayName = 'PrimesDatePicker';

// 자주 사용하는 프리셋들
export const PrimesDatePickerPresets = {
	// 단순 날짜 선택 (가장 많이 사용)
	Simple: (props: Omit<PrimesDatePickerProps, 'mode'>) => (
		<PrimesDatePicker {...props} mode="simple" />
	),

	// 풀 기능 단일 날짜
	Single: (props: Omit<PrimesDatePickerProps, 'mode'>) => (
		<PrimesDatePicker {...props} mode="single" />
	),

	// 년월 선택 (네이티브 HTML)
	Month: (props: Omit<PrimesDatePickerProps, 'mode'>) => (
		<PrimesDatePicker {...props} mode="month" />
	),

	// 년월 선택 (react-datepicker)
	MonthReact: (props: Omit<PrimesDatePickerProps, 'mode'>) => (
		<PrimesDatePicker {...props} mode="month-react" />
	),

	// 날짜 범위
	Range: (props: Omit<PrimesDatePickerProps, 'mode'>) => (
		<PrimesDatePicker {...props} mode="range" />
	),

	// 다국어 테스트용
	MultiLanguage: (
		props: Omit<PrimesDatePickerProps, 'mode' | 'showLanguageToggle'>
	) => (
		<PrimesDatePicker {...props} mode="single" showLanguageToggle={true} />
	),
};

export default PrimesDatePicker;
