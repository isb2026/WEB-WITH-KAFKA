import React from 'react';
import { useForm, Controller, UseFormReturn } from 'react-hook-form'; // UseFormReturn을 임포트합니다.
import InputMask from 'react-input-mask';
import 'react-datepicker/dist/react-datepicker.css';
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
	defaultValue?: string | number | boolean | null; // null 허용
	disabled?: boolean;
	readOnly?: boolean;
	fieldKey?: string;
	valueKey?: string;
	labelKey?: string;
	rows?: number; // textarea에 대한 rows 속성 추가
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
	onSubmit?: (data: Record<string, unknown>) => void; // ✅ unknown으로 타입 변경
	submitButtonText?: string;
	onFormReady?: (methods: UseFormReturn<Record<string, unknown>>) => void; // ✅ unknown으로 타입 변경
	visibleSaveButton?: boolean;
	otherTypeElements?: Record<string, React.ElementType>;
	initialData?: Record<string, unknown>;
}) => {
	// fields의 defaultValue를 사용하여 defaultValues 객체를 생성합니다.
	const defaultValues = fields.reduce(
		(acc, field) => {
			if (field.defaultValue !== undefined) {
				// defaultValue가 명시적으로 null도 올 수 있으므로 undefined만 체크
				acc[field.name] = field.defaultValue;
			}
			return acc;
		},
		{} as Record<string, unknown> // ✅ unknown으로 타입 변경
	);

	// initialData가 있으면 defaultValues와 병합
	const finalDefaultValues = initialData
		? { ...defaultValues, ...initialData }
		: defaultValues;

	const methods = useForm({
		defaultValues: finalDefaultValues,
	});

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
			// Field interface에서 직접 disabled와 readOnly를 가져옵니다.
			// 이렇게 하면 Controller의 render prop에서 넘어오는 field 객체와의 이름 충돌을 피할 수 있고,
			// register를 사용하는 input에도 일관되게 적용할 수 있습니다.
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
									render={(
										{ field: controllerField } // `field` 이름 충돌 방지
									) => (
										<InputMask
											mask={mask}
											value={
												controllerField.value as string
											}
											maskChar={null}
											onChange={controllerField.onChange}
											disabled={disabled} // ✅ FormField의 disabled 속성 사용
										>
											{(
												inputProps: React.InputHTMLAttributes<HTMLInputElement>
											) => (
												<input
													{...inputProps}
													placeholder={placeholder}
													className="w-full px-2 py-2 text-sm border rounded-md outline-none placeholder-gray-500 focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200"
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
						<label className="w-32 text-sm  font-medium text-gray-700">
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
								disabled={disabled} // ✅ FormField의 disabled 속성 사용
								readOnly={readOnly} // ✅ FormField의 readOnly 속성 사용
								placeholder={placeholder}
								className="w-full px-2 py-2 text-sm border rounded-md outline-none placeholder-gray-500 focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200"
							/>
							{baseError && (
								<span className="text-red-500 text-sm">
									{baseError.message}
								</span>
							)}
						</div>
					</div>
				);

			case 'password':
				return (
					<div key={name} className="flex items-center mb-4">
						<label className="w-32 text-sm  font-medium text-gray-700">
							{label}
							{required && (
								<span className="text-red-400">*</span>
							)}
						</label>
						<div className="flex-1">
							<input
								type="password"
								{...register(name, {
									required:
										required && `${label}는 필수입니다.`,
								})}
								disabled={disabled} // ✅ FormField의 disabled 속성 사용
								readOnly={readOnly} // ✅ FormField의 readOnly 속성 사용
								placeholder={placeholder}
								className="w-full px-2 py-2 text-sm border rounded-md outline-none placeholder-gray-500 focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200"
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
						<label className="w-32 text-sm  font-medium text-gray-700">
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
								render={(
									{ field: controllerField } // `field` 이름 충돌 방지
								) => (
									<RadixSelect
										value={controllerField.value as string}
										onValueChange={controllerField.onChange}
										placeholder="선택하세요"
										className="focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200"
										disabled={disabled} // ✅ FormField의 disabled 속성 사용
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
						<label className="w-32 pt-2 text-sm  font-medium text-gray-700">
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
								disabled={disabled} // ✅ FormField의 disabled 속성 사용
								readOnly={readOnly} // ✅ FormField의 readOnly 속성 사용
								placeholder={placeholder}
								className="w-full h-24 px-2 py-2 text-sm border rounded-md outline-none placeholder-gray-500 focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200"
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
							render={(
								{ field: controllerField } // `field` 이름 충돌 방지
							) => (
								<RadixCheckboxRoot
									id={name}
									checked={controllerField.value as boolean}
									onCheckedChange={controllerField.onChange}
									disabled={disabled} // ✅ FormField의 disabled 속성 사용
									className="flex size-[18px] appearance-none items-center justify-center rounded bg-white border border-gray-300 hover:bg-Colors-Brand-300 focus:outline-none focus:ring-2 focus:ring-violet-400 data-[state=checked]:bg-violet-600"
								>
									<RadixCheckboxIndicator className="text-white text-sm">
										✓
									</RadixCheckboxIndicator>
								</RadixCheckboxRoot>
							)}
						/>
						<label
							htmlFor={name}
							className="text-sm  font-medium text-gray-700"
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

			case 'radio':
				return (
					<div key={name} className="mb-4">
						<p className="text-sm  font-medium text-gray-700 mb-1">
							{label}
							{required && (
								<span className="text-Colors-Brand-700 ml-1">
									*
								</span>
							)}
						</p>
						<div className="flex gap-4">
							{options?.map((opt, idx) => (
								<label
									key={idx}
									className="flex items-center gap-1"
								>
									<input
										type="radio"
										value={opt.value}
										{...register(name, {
											required:
												required &&
												`${label}는 필수입니다.`,
										})}
										disabled={disabled} // ✅ FormField의 disabled 속성 사용
									/>
									{opt.label}
								</label>
							))}
						</div>
						{baseError && (
							<span className="text-red-500 text-sm">
								{baseError.message}
							</span>
						)}
					</div>
				);

			case 'date':
				return (
					<div key={name} className="flex items-center mb-4">
						<label className="w-32 text-sm  font-medium text-gray-700">
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
								disabled={disabled} // ✅ FormField의 disabled 속성 사용
								readOnly={readOnly} // ✅ FormField의 readOnly 속성 사용
								className="w-full px-2 py-2 text-sm border rounded-md outline-none focus:border-Colors-Brand-500"
							/>
							{baseError && (
								<span className="text-red-500 text-sm">
									{baseError.message}
								</span>
							)}
						</div>
					</div>
				);

			case 'dateMonth':
				return (
					<div key={name} className="flex items-center mb-4">
						<label className="w-32 text-sm  font-medium text-gray-700">
							{label}
							{required && (
								<span className="text-red-400">*</span>
							)}
						</label>
						<div className="flex-1">
							<input
								type="month"
								{...register(name, {
									required:
										required && `${label}는 필수입니다.`,
								})}
								disabled={disabled} // ✅ FormField의 disabled 속성 사용
								readOnly={readOnly} // ✅ FormField의 readOnly 속성 사용
								className="w-full px-2 py-2 text-sm border rounded-md outline-none focus:border-Colors-Brand-500"
							/>
							{baseError && (
								<span className="text-red-500 text-sm">
									{baseError.message}
								</span>
							)}
						</div>
					</div>
				);

			case 'email':
				return (
					<div key={name} className="flex items-center mb-4">
						<label className="w-32 text-sm  font-medium text-gray-700">
							{label}{' '}
							{required && (
								<span className="text-red-400">*</span>
							)}
						</label>
						<div className="flex flex-1 flex-col">
							<input
								type="email"
								{...register(name, {
									required:
										required && `${label}는 필수입니다.`,
									pattern: {
										value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message:
											formatMessage ||
											'올바른 이메일 주소를 입력하세요.',
									},
								})}
								disabled={disabled} // ✅ FormField의 disabled 속성 사용
								readOnly={readOnly} // ✅ FormField의 readOnly 속성 사용
								placeholder={placeholder}
								className="w-full px-2 py-2 text-sm border rounded-md outline-none placeholder-gray-500 focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200"
							/>
							{errors[name] && (
								<span className="text-red-500 text-sm">
									{
										(errors[name] as { message?: string })
											?.message
									}
								</span>
							)}
						</div>
					</div>
				);

			case 'tel':
				return (
					<div key={name} className="flex items-center mb-4">
						<label className="w-32 text-sm  font-medium text-gray-700">
							{label}{' '}
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
									pattern: pattern && {
										value: pattern,
										message:
											formatMessage ||
											`${label} 형식이 올바르지 않습니다.`,
									},
								}}
								render={({ field: controllerField }) => {
									// `field` 이름 충돌 방지
									const getDynamicMask = (value: string) => {
										if (value.startsWith('02'))
											return '99-999-9999';
										if (value.startsWith('0'))
											return '999-9999-9999';
										return '999-9999-9999';
									};

									const maskValue = maskAutoDetect
										? getDynamicMask(
												(controllerField.value as string) ||
													''
											)
										: mask || '';

									return (
										<InputMask
											mask={maskValue}
											value={
												controllerField.value as string
											}
											maskChar={null}
											onChange={controllerField.onChange}
											disabled={disabled} // ✅ FormField의 disabled 속성 사용
										>
											{(inputProps) => (
												<input
													{...inputProps}
													type="tel"
													placeholder={placeholder}
													className="w-full px-2 py-2 text-sm border rounded-md outline-none placeholder-gray-500 focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200"
												/>
											)}
										</InputMask>
									);
								}}
							/>
							{errors[name] && (
								<span className="text-red-500 text-sm">
									{
										(errors[name] as { message?: string })
											?.message
									}
								</span>
							)}
						</div>
					</div>
				);

			case 'button':
				return (
					<div key={name} className="flex items-center mb-4">
						<label className="w-32 text-sm font-medium text-gray-700">
							{label}
						</label>
						<div className="flex-1">
							<button
								type="button"
								onClick={() => {
									// 버튼 클릭 시 특별한 동작을 수행할 수 있도록 이벤트 핸들러 추가
									console.log(
										`${name} 버튼이 클릭되었습니다.`
									);
								}}
								disabled={disabled}
								className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{placeholder || label}
							</button>
						</div>
					</div>
				);

			case 'fileUpload':
				return (
					<div key={name} className="flex items-center mb-4">
						<label className="w-32 text-sm font-medium text-gray-700">
							{label}
						</label>
						<div className="flex-1">
							<RadixFileUpload className="w-full text-sm border rounded-md outline-none placeholder-gray-500 focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200" />
						</div>
					</div>
				);

			default:
				if (otherTypeElements && otherTypeElements[type]) {
					const OtherComponent = otherTypeElements[type];
					return (
						<div key={name} className="flex items-center mb-4">
							<label className="w-32 text-sm  font-medium text-gray-700">
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
									render={(
										{ field: controllerField } // `field` 이름 충돌 방지
									) => (
										<OtherComponent
											{...field}
											value={
												controllerField.value as string
											}
											maskChar={null}
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
									className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-Colors-Brand-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
									onKeyDown={(e) => {
										// Enter키 이벤트 방지
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
									className="px-4 py-2 bg-Colors-Brand-700 text-white rounded-r-lg text-sm hover:bg-Colors-Brand-800 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1 transition-colors border border-l-0 border-Colors-Brand-700"
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
						className="px-4 py-2 bg-Colors-Brand-700 text-white rounded-md"
					>
						{submitButtonText}
					</button>
				</div>
			)}
		</form>
	);
};
