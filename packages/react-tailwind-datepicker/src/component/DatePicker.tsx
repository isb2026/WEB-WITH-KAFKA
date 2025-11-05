import React, { useState, useMemo, useEffect } from 'react';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';
import { DataPickerComponentProps } from '../types';
import { locales, SupportedLocale } from '../locales';

const DataPickerComponent: React.FC<DataPickerComponentProps> = ({
	value: controlledValue,
	onChange,
	placeholder = '날짜를 선택하세요',
	displayFormat = 'YYYY-MM-DD',
	separator = ' ~ ',
	asSingle = false,
	useRange = true,
	minDate,
	maxDate,
	startFrom,
	showShortcuts = true,
	showFooter = true,
	disabled = false,
	readOnly = false,
	required = false,
	inputId,
	inputName,
	className = '',
	inputClassName = '',
	containerClassName = '',
	toggleClassName = '',
	classNames,
	primaryColor = 'purple',
	popoverDirection,
	i18n = 'ko',
	locale,
}) => {
	// 내부 상태 (controlled가 아닐 때 사용)
	const [internalValue, setInternalValue] = useState<DateValueType>({
		startDate: null,
		endDate: null,
	});

	// controlled인지 확인
	const isControlled = controlledValue !== undefined;
	const currentValue = isControlled ? controlledValue : internalValue;

	// 로케일 결정
	const currentLocale: SupportedLocale = locale || i18n;

	// i18n 설정을 위한 configs
	const i18nConfigs = useMemo(() => {
		const selectedLocale = locales[currentLocale];

		return {
			months: selectedLocale.months,
			weekdays: selectedLocale.weekdaysShort,
			shortcuts: showShortcuts
				? {
						today: selectedLocale.shortcuts.today,
						yesterday: selectedLocale.shortcuts.yesterday,
						past: (period: number) => {
							if (period === 7)
								return selectedLocale.shortcuts.last7Days;
							if (period === 30)
								return selectedLocale.shortcuts.last30Days;
							return `지난 ${period}일`;
						},
						currentMonth: selectedLocale.shortcuts.thisMonth,
						pastMonth: selectedLocale.shortcuts.lastMonth,
					}
				: undefined,
			footer: showFooter
				? {
						cancel: selectedLocale.clear,
						apply: selectedLocale.close,
					}
				: undefined,
			// 모달/다이얼로그에서 캘린더가 잘리지 않도록 설정
			// react-tailwindcss-datepicker는 포털을 지원하지 않으므로 CSS로 해결
		};
	}, [currentLocale, showShortcuts, showFooter]);

	const handleChange = (newValue: DateValueType) => {
		if (!isControlled) {
			setInternalValue(newValue);
		}
		onChange?.(newValue);
	};

	// DOM 조작으로 캘린더가 잘리지 않도록 강제 설정
	useEffect(() => {
		const fixDatepickerOverflow = () => {
			// react-tailwindcss-datepicker의 모든 드롭다운 요소 찾기
			const datepickerElements = document.querySelectorAll(
				'[class*="datepicker"], [class*="calendar"], [class*="dropdown"]'
			);

			datepickerElements.forEach((element) => {
				const htmlElement = element as HTMLElement;
				htmlElement.style.overflow = 'visible';
				htmlElement.style.position = 'fixed';
				htmlElement.style.zIndex = '999999';

				// 모든 부모 요소의 overflow도 visible로 설정
				let parent = htmlElement.parentElement;
				while (parent && parent !== document.body) {
					parent.style.overflow = 'visible';
					parent = parent.parentElement;
				}
			});
		};

		// 컴포넌트 마운트 시 실행
		fixDatepickerOverflow();

		// MutationObserver로 DOM 변화 감지
		const observer = new MutationObserver(fixDatepickerOverflow);
		observer.observe(document.body, { childList: true, subtree: true });

		return () => observer.disconnect();
	}, []);

	// 스타일 클래스 조합
	const finalInputClassName = useMemo(() => {
		const baseStyles =
			'px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Colors-Brand-200 focus:border-Colors-Brand-500 ';
		return `${baseStyles} ${classNames?.input || ''} ${inputClassName}`.trim();
	}, [classNames?.input, inputClassName]);

	const finalContainerClassName = useMemo(() => {
		const baseStyles = 'relative overflow-visible'; // overflow-visible 추가로 캘린더가 잘리지 않도록
		return `${baseStyles} ${classNames?.container || ''} ${containerClassName}`.trim();
	}, [classNames?.container, containerClassName]);

	const finalToggleClassName = useMemo(() => {
		const baseStyles =
			'absolute right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed';
		return `${baseStyles} ${classNames?.toggle || ''} ${toggleClassName}`.trim();
	}, [classNames?.toggle, toggleClassName]);

	return (
		// <div className={`${className} ${classNames?.calendar || ''}`.trim()}>
		<Datepicker
			value={currentValue}
			onChange={handleChange}
			placeholder={placeholder}
			displayFormat={displayFormat}
			separator={separator}
			asSingle={asSingle}
			useRange={useRange && !asSingle}
			minDate={minDate}
			maxDate={maxDate}
			startFrom={startFrom}
			showShortcuts={showShortcuts}
			showFooter={showFooter}
			disabled={disabled}
			readOnly={readOnly}
			required={required}
			inputId={inputId}
			inputName={inputName}
			inputClassName={finalInputClassName}
			containerClassName={finalContainerClassName}
			toggleClassName={finalToggleClassName}
			popoverDirection={popoverDirection}
			primaryColor={primaryColor}
			i18n={currentLocale}
			configs={i18nConfigs}
		/>
		// </div>
	);
};

export default DataPickerComponent;
