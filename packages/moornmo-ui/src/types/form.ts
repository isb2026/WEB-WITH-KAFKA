// organisms/DynamicForm/types.ts
import { FieldErrors, useForm } from 'react-hook-form';
import {
	UseFormRegister,
	UseFormWatch,
	UseFormSetValue,
} from 'react-hook-form';

export type FieldType = string;

export interface FieldConfig {
	name?: string;
	type: FieldType;
	label?: string;
	labelWidth?: string | number;
	span?: number;
	watch?: string[]; // 의존성 필드들
	props?: {
		placeholder?: string;
		options?: { label: string; value: string | number | boolean }[];
		required?: boolean;
		is_default?: boolean;
		validation?: {
			required?: string;
			pattern?: { value: RegExp; message: string };
			validate?: (
				value: any,
				formData?: any
			) => true | { type: string; message: string };
			customValidation?: (
				value: any
			) => { type: string; message: string } | null;
		};
		[key: string]: any;
	};
}

export interface GroupConfig {
	title?: string;
	layoutType?: 'group' | 'other' | string;
	fields: FieldConfig[];
}

export interface DynamicFormProps {
	title?: string;
	subtitle?: string;
	config: GroupConfig[];
	initialValues?: Record<string, any>;
	cols?: number;
	spacing?: number;
	onFileUpload?: (fieldName: string, file: File) => void;
}

export interface FieldRendererProps {
	type: string;
	name: string;
	props: Record<string, any>;
	register: UseFormRegister<any>;
	watch: UseFormWatch<any>;
	setValue: UseFormSetValue<any>;
	errors: FieldErrors;
	getDefaultValue?: (props: any, name: string, format: string) => string;
	onFileUpload?: (fieldName: string, file: File) => void;
	otherTypeElements?: Record<string, React.ElementType>;
}
