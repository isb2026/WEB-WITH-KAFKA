import React from 'react';
import { useForm, Controller, UseFormReturn } from 'react-hook-form';
import InputMask from 'react-input-mask';
import {
	RadixSelect,
	RadixSelectGroup,
	RadixSelectItem,
	RadixCheckboxIndicator,
	RadixCheckboxRoot,
	RadixFileUpload,
} from '@repo/radix-ui/components';

export type FormFieldType = string;

export interface FormField {
	name: string;
	label: string;
	type: FormFieldType;
	placeholder?: string;
	options?: { label: string; value: string }[];
	required?: boolean;
	pattern?: RegExp;
	formatMessage?: string;
	mask?: string;
	maskAutoDetect?: boolean;
	minLength?: number;
	maxLength?: number;
	defaultValue?: string | number | boolean | null;
	disabled?: boolean;
	readOnly?: boolean;
	fieldKey?: string;
	valueKey?: string;
	labelKey?: string;
	rows?: number;
	// InputButton 타입을 위한 속성들
	buttonText?: string;
	onButtonClick?: (value: string) => void;
	buttonIcon?: React.ReactNode;
	buttonDisabled?: boolean;
}

export const DynamicForm = ({
	fields,
	onSubmit,
	visibleSaveButton = true,
	submitButtonText = '저장',
	onFormReady,
	otherTypeElements,
	initialData,
}: {
	fields: FormField[];
	onSubmit?: (data: Record<string, unknown>) => void;
	submitButtonText?: string;
	onFormReady?: (methods: UseFormReturn<Record<string, unknown>>) => void;
	visibleSaveButton?: boolean;
	otherTypeElements?: Record<string, React.ElementType>;
	initialData?: Record<string, unknown>;
}) => {
	// fields의 defaultValue를 사용하여 defaultValues 객체를 생성
	const defaultValues = fields.reduce(
		(acc, field) => {
			if (field.defaultValue !== undefined) {
				acc[field.name] = field.defaultValue;
			}
			return acc;
		},
		{} as Record<string, unknown>
	);

	// initialData가 있으면 defaultValues와 병합
	const finalDefaultValues = initialData
		? { ...defaultValues, ...initialData }
		: defaultValues;

	const methods = useForm({
		defaultValues: finalDefaultValues,
		mode: 'onChange',
	});

	React.useEffect(() => {
		if (initialData) {
			fields.forEach((field) => {
				if (field.type === 'dateMonth' && initialData[field.name]) {
					const value = initialData[field.name] as string;

					if (value && value.length === 6) {
						const year = value.substring(0, 4);
						const month = value.substring(4, 6);
						const formattedValue = `${year}-${month}`;
						methods.setValue(field.name, formattedValue);
					}
				}
			});
		}
	}, [initialData, fields, methods]);

	if (onFormReady) {
		onFormReady(methods);
	}

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = methods;

	const renderField = (field: FormField) => {
		const {
			name,
			label,
			type,
			placeholder,
			options,
			required,
			pattern,
			formatMessage,
			mask,
			maskAutoDetect,
			maxLength,
			minLength,
			disabled,
			readOnly,
		} = field;

		const baseError = errors[name] as { message?: string };

		switch (type) {
			case 'text':
				if (mask) {
					return (
						<div key={name} className="flex items-center mb-4">
							<label className="w-32 text-sm font-medium text-gray-700">
								{label}
								{required && (
									<span className="text-red-400">*</span>
								)}
							</label>
							<div className="flex-1">
								<Controller
									name={name}
									control={control}
									rules={{
										required:
											required &&
											`${label}는 필수입니다.`,
										pattern: pattern && {
											value: pattern,
											message:
												formatMessage ||
												`${label} 형식이 올바르지 않습니다.`,
										},
									}}
									render={({ field: controllerField }) => (
										<InputMask
											mask={mask}
											value={
												controllerField.value as string
											}
											maskChar={null}
											onChange={controllerField.onChange}
											disabled={disabled}
										>
											{(
												inputProps: React.InputHTMLAttributes<HTMLInputElement>
											) => (
												<input
													{...inputProps}
													placeholder={placeholder}
													className="w-full px-2 py-2 text-sm border rounded-md outline-none placeholder-gray-500 focus:border-blue-500 focus:ring-1 ring-blue-200"
												/>
											)}
										</InputMask>
									)}
								/>
								{baseError && (
									<span className="text-red-500 text-sm">
										{baseError.message}
									</span>
								)}
							</div>
						</div>
					);
				}
				return (
					<div key={name} className="flex items-center mb-4">
						<label className="w-32 text-sm font-medium text-gray-700">
							{label}
							{required && (
								<span className="text-red-400">*</span>
							)}
						</label>
						<div className="flex flex-1 flex-col">
							<input
								{...register(name, {
									required:
										required && `${label}는 필수입니다.`,
									pattern: pattern && {
										value: pattern,
										message:
											formatMessage ||
											`${label} 형식이 올바르지 않습니다.`,
									},
									minLength: minLength && {
										value: minLength,
										message: `${label}은 최소 ${minLength}자 이상 입력해주세요.`,
									},
									maxLength: maxLength && {
										value: maxLength,
										message: `${label}은 최대 ${maxLength}자까지 입력 가능합니다.`,
									},
								})}
								disabled={disabled}
								readOnly={readOnly}
								placeholder={placeholder}
								className="w-full px-2 py-2 text-sm border rounded-md outline-none placeholder-gray-500 focus:border-blue-500 focus:ring-1 ring-blue-200"
							/>
							{baseError && (
								<span className="text-red-500 text-sm">
									{baseError.message}
								</span>
							)}
						</div>
					</div>
				);

			case 'select':
				return (
					<div key={name} className="flex items-center mb-4">
						<label className="w-32 text-sm font-medium text-gray-700">
							{label}
							{required && (
								<span className="text-red-400">*</span>
							)}
						</label>
						<div className="flex-1">
							<Controller
								name={name}
								control={control}
								rules={{
									required:
										required && `${label}는 필수입니다.`,
								}}
								render={({ field: controllerField }) => (
									<RadixSelect
										value={controllerField.value as string}
										onValueChange={controllerField.onChange}
										placeholder="선택하세요"
										className="focus:border-blue-500 focus:ring-1 ring-blue-200"
										disabled={disabled}
									>
										<RadixSelectGroup>
											{options?.map((opt, idx) => (
												<RadixSelectItem
													key={idx}
													value={opt.value ?? ''}
												>
													{opt.label}
												</RadixSelectItem>
											))}
										</RadixSelectGroup>
									</RadixSelect>
								)}
							/>
							{baseError && (
								<span className="ml-2 text-red-500 text-sm">
									{baseError.message}
								</span>
							)}
						</div>
					</div>
				);

			case 'textarea':
				return (
					<div key={name} className="flex items-start mb-4">
						<label className="w-32 pt-2 text-sm font-medium text-gray-700">
							{label}
							{required && (
								<span className="text-red-400">*</span>
							)}
						</label>
						<div className="flex-1">
							<textarea
								{...register(name, {
									required:
										required && `${label}는 필수입니다.`,
								})}
								disabled={disabled}
								readOnly={readOnly}
								placeholder={placeholder}
								rows={field.rows || 3}
								className="w-full px-2 py-2 text-sm border rounded-md outline-none placeholder-gray-500 focus:border-blue-500 focus:ring-1 ring-blue-200"
							/>
							{baseError && (
								<span className="text-red-500 text-sm">
									{baseError.message}
								</span>
							)}
						</div>
					</div>
				);

			case 'checkbox':
				return (
					<div
						key={name}
						className="flex items-center gap-2 mb-4 justify-end w-full"
					>
						<Controller
							name={name}
							control={control}
							rules={{
								required: required && `${label}는 필수입니다.`,
							}}
							render={({ field: controllerField }) => (
								<RadixCheckboxRoot
									id={name}
									checked={controllerField.value as boolean}
									onCheckedChange={controllerField.onChange}
									disabled={disabled}
									className="flex size-[18px] appearance-none items-center justify-center rounded bg-white border border-gray-300 hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 data-[state=checked]:bg-blue-600"
								>
									<RadixCheckboxIndicator className="text-white text-sm">
										✓
									</RadixCheckboxIndicator>
								</RadixCheckboxRoot>
							)}
						/>
						<label
							htmlFor={name}
							className="text-sm font-medium text-gray-700"
						>
							{label}
						</label>
						{baseError && (
							<span className="ml-2 text-red-500 text-sm">
								{baseError.message}
							</span>
						)}
					</div>
				);

			case 'date':
				return (
					<div key={name} className="flex items-center mb-4">
						<label className="w-32 text-sm font-medium text-gray-700">
							{label}
							{required && (
								<span className="text-red-400">*</span>
							)}
						</label>
						<div className="flex-1">
							<input
								type="date"
								{...register(name, {
									required:
										required && `${label}는 필수입니다.`,
								})}
								disabled={disabled}
								readOnly={readOnly}
								className="w-full px-2 py-2 text-sm border rounded-md outline-none focus:border-blue-500"
							/>
							{baseError && (
								<span className="text-red-500 text-sm">
									{baseError.message}
								</span>
							)}
						</div>
					</div>
				);

			case 'number':
				return (
					<div key={name} className="flex items-center mb-4">
						<label className="w-32 text-sm font-medium text-gray-700">
							{label}
							{required && (
								<span className="text-red-400">*</span>
							)}
						</label>
						<div className="flex-1">
							<input
								type="number"
								{...register(name, {
									required:
										required && `${label}는 필수입니다.`,
									min: minLength && {
										value: minLength,
										message: `${label}은 최소 ${minLength} 이상이어야 합니다.`,
									},
									max: maxLength && {
										value: maxLength,
										message: `${label}은 최대 ${maxLength} 이하여야 합니다.`,
									},
								})}
								disabled={disabled}
								readOnly={readOnly}
								placeholder={placeholder}
								className="w-full px-2 py-2 text-sm border rounded-md outline-none placeholder-gray-500 focus:border-blue-500 focus:ring-1 ring-blue-200"
							/>
							{baseError && (
								<span className="text-red-500 text-sm">
									{baseError.message}
								</span>
							)}
						</div>
					</div>
				);

			case 'inputButton':
				return (
					<div key={name} className="flex items-center mb-4">
						<label className="w-32 text-sm font-medium text-gray-700">
							{label}
							{required && (
								<span className="text-red-400">*</span>
							)}
						</label>
						<div className="flex flex-1 flex-col">
							<div className="flex">
								<input
									{...register(name, {
										required:
											required &&
											`${label}는 필수입니다.`,
										pattern: pattern && {
											value: pattern,
											message:
												formatMessage ||
												`${label} 형식이 올바르지 않습니다.`,
										},
									})}
									type="text"
									placeholder={placeholder}
									disabled={disabled}
									readOnly={readOnly}
									className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault();
										}
									}}
								/>
								<button
									type="button"
									onClick={() => {
										const currentValue = methods.getValues(
											name
										) as string;
										if (field.onButtonClick) {
											field.onButtonClick(currentValue);
										}
									}}
									disabled={field.buttonDisabled || disabled}
									className="px-4 py-2 bg-blue-600 text-white rounded-r-lg text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1 transition-colors border border-l-0 border-blue-600"
								>
									{field.buttonDisabled ? (
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
									) : (
										field.buttonIcon
									)}
									{field.buttonDisabled
										? '조회중...'
										: field.buttonText || '조회'}
								</button>
							</div>
							{baseError && (
								<div className="text-red-500 text-xs mt-1">
									{baseError.message}
								</div>
							)}
						</div>
					</div>
				);

			default:
				if (otherTypeElements && otherTypeElements[type]) {
					const OtherComponent = otherTypeElements[type];
					return (
						<div key={name} className="flex items-center mb-4">
							<label className="w-32 text-sm font-medium text-gray-700">
								{label}
								{required && (
									<span className="text-red-400">*</span>
								)}
							</label>
							<div className="flex-1">
								<Controller
									name={name}
									control={control}
									rules={{
										required:
											required &&
											`${label}는 필수입니다.`,
										pattern: pattern && {
											value: pattern,
											message:
												formatMessage ||
												`${label} 형식이 올바르지 않습니다.`,
										},
									}}
									render={({ field: controllerField }) => (
										<OtherComponent
											{...field}
											value={
												controllerField.value as string
											}
											onChange={controllerField.onChange}
											disabled={disabled}
										/>
									)}
								/>
								{baseError && (
									<span className="text-red-500 text-sm">
										{baseError.message}
									</span>
								)}
							</div>
						</div>
					);
				}
				return null;
		}
	};

	return (
		<form
			onSubmit={handleSubmit((data) => {
				if (onSubmit) {
					onSubmit(data);
				}
			})}
		>
			{fields.map(renderField)}
			{visibleSaveButton && (
				<div className="text-right mt-4">
					<button
						type="submit"
						className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
					>
						{submitButtonText}
					</button>
				</div>
			)}
		</form>
	);
};

export default DynamicForm;
