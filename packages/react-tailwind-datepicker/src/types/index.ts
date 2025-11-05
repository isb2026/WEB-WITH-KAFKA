// DateValueType 인터페이스 정의
export interface DateValueType {
	startDate: Date | null;
	endDate: Date | null;
}

export type SupportedLocale = 'ko' | 'en' | 'th';

export type TailwindColor =
	| 'blue'
	| 'orange'
	| 'yellow'
	| 'red'
	| 'purple'
	| 'amber'
	| 'lime'
	| 'green'
	| 'emerald'
	| 'teal'
	| 'cyan'
	| 'sky'
	| 'indigo'
	| 'violet'
	| 'fuchsia'
	| 'pink'
	| 'rose';

export interface DatePickerClassNames {
	container?: string;
	input?: string;
	toggle?: string;
	calendar?: string;
	shortcuts?: string;
	footer?: string;
}

export interface DataPickerComponentProps {
	// Core props
	value?: DateValueType | null;
	onChange?: (value: DateValueType | null) => void;

	// Display props
	placeholder?: string;
	displayFormat?: string;
	separator?: string;

	// Mode props
	asSingle?: boolean;
	useRange?: boolean;

	// Date constraints
	minDate?: Date;
	maxDate?: Date;
	startFrom?: Date;

	// UI props
	showShortcuts?: boolean;
	showFooter?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;

	// Input props
	inputId?: string;
	inputName?: string;

	// Styling props
	className?: string;
	inputClassName?: string;
	containerClassName?: string;
	toggleClassName?: string;
	classNames?: DatePickerClassNames;
	primaryColor?: TailwindColor;

	// Layout props
	popoverDirection?: 'up' | 'down';

	// Internationalization
	i18n?: SupportedLocale;
	locale?: SupportedLocale;
}
