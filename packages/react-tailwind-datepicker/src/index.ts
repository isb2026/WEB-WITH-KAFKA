// Main component
export { default as DataPickerComponent } from './component/DatePicker';

// Preset components
export {
	MonthPicker,
	SingleDatePicker,
	DateRangePicker,
	SimpleDatePicker,
	MultiLanguageDatePicker,
} from './component/DatePickerPresets';

// React-datepicker based components (recommended)
export { default as ReactDatePickerSingle } from './component/ReactDatePickerSingle';
export { default as ReactDatePickerMonth } from './component/ReactDatePickerMonth';
export { default as ReactDatePickerDateTime } from './component/ReactDatePickerDateTime';
export { default as ReactDatePickerRange } from './component/ReactDatePickerRange';

// Types
export type {
	DateValueType,
	DataPickerComponentProps,
	DatePickerClassNames,
	TailwindColor,
	SupportedLocale,
} from './types';

// Locales
export {
	locales,
	supportedLocales,
	koLocale,
	enLocale,
	thLocale,
} from './locales';
