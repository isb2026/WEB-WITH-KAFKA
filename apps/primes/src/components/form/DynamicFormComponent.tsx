import React, { useEffect } from 'react';
import { useForm, Controller, UseFormReturn } from 'react-hook-form'; // UseFormReturn을 임포트합니다.
import { ComboBox, ComboBoxItem } from '@repo/radix-ui/components';
import InputMask from 'react-input-mask';
import { useTranslation } from '@repo/i18n';
import 'react-datepicker/dist/react-datepicker.css';
import {
	RadixCheckboxIndicator,
	RadixCheckboxRoot,
	RadixFileUpload,
	RadixSelect,
	RadixSelectGroup,
	RadixSelectItem,
} from '@repo/radix-ui/components';
import { CodeSelectComponent } from '@primes/components/customSelect/CodeSelectComponent';
import FileUploadComponent from './FileUploadComponent';
import { DateValueType } from '@repo/react-tailwind-datepicker';
import { PrimesDatePicker } from '@primes/components/common/PrimesDatePicker';

export type FormFieldType =
	| 'text'
	| 'number'
	| 'decimal'
	| 'password'
	| 'email'
	| 'tel'
	| 'textarea'
	| 'select'
	| 'selectWithoutSearch'
	| 'checkbox'
	| 'radio'
	| 'date'
	| 'datetime'
	| 'dateMonth'
	| 'fileUpload'
	| 'button'
	| 'inputButton'
	| 'codeSelect'
	| 'divider'
	| 'hidden'
	| 'custom'
	| string; // 다른 커스텀 타입들을 위한 fallback

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
	// Custom 컴포넌트를 위한 속성
	component?: React.ReactNode;
}

export const DynamicForm = ({
	fields,
	onSubmit,
	visibleSaveButton = true,
	submitButtonText = '저장',
	onFormReady,
	otherTypeElements,
	initialData,
	layout = 'single',
}: {
	fields: FormField[];
	onSubmit?: (
		data: Record<string, unknown>,
		event?: React.BaseSyntheticEvent
	) => void; // ✅ unknown으로 타입 변경
	submitButtonText?: string;
	onFormReady?: (methods: UseFormReturn<Record<string, unknown>>) => void; // ✅ unknown으로 타입 변경
	visibleSaveButton?: boolean;
	otherTypeElements?: Record<string, React.ElementType>;
	initialData?: Record<string, unknown>;
	layout?: 'split' | 'single';
}) => {
	const { t } = useTranslation('common');

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
		mode: 'onChange',
	});

	useEffect(() => {
		if (initialData) {
			// Reset form with new initial data
			methods.reset(initialData);

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

	useEffect(() => {
		if (onFormReady) {
			onFormReady(methods);
		}
	}, [onFormReady, methods]);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = methods;

	const renderField = (field: FormField) => {
		const {
			name,
			type,
			options,
			required,
			pattern,
			formatMessage,
			mask,
			maskAutoDetect,
			maxLength,
			minLength,
			label,
			placeholder,
			disabled,
			readOnly,
		} = field;

		const baseError = errors[name] as { message?: string };

		switch (type) {
			case 'number':
				return (
					<div key={name} className="flex items-center mb-4">
						<label className="w-32 text-sm font-medium text-gray-700">
							{label}
							{required && (
								<span className="text-red-400">*</span>
							)}
						</label>
						<div className="flex flex-1 flex-col">
							<div className="relative">
								<input
									type="number"
									min="0"
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
										minLength: minLength && {
											value: minLength,
											message: `${label}은 최소 ${minLength}자 이상 입력해주세요.`,
										},
										maxLength: maxLength && {
											value: maxLength,
											message: `${label}은 최대 ${maxLength}자까지 입력 가능합니다.`,
										},
										min: {
											value: 0,
											message: `${label}은 0 이상의 값을 입력해주세요.`,
										},
									})}
									disabled={disabled}
									readOnly={readOnly}
									placeholder={
										baseError?.message || placeholder
									}
									className={`w-full px-2 py-2 text-sm border rounded-md outline-none focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200 ${
										baseError
											? 'placeholder-red-400 border-red-300 focus:border-red-500 focus:ring-red-200'
											: 'placeholder-gray-500'
									} ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
								/>
							</div>
						</div>
					</div>
				);

			case 'decimal':
				return (
					<div key={name} className="flex items-center mb-4">
						<label className="w-32 text-sm font-medium text-gray-700">
							{label}
							{required && (
								<span className="text-red-400">*</span>
							)}
						</label>
						<div className="flex flex-1 flex-col">
							<div className="relative">
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
										<input
											type="text"
											value={
												(controllerField.value as string) ||
												''
											}
											onChange={(e) => {
												const value = e.target.value;
												// 소수점 입력을 위한 실시간 검증
												if (
													value === '' ||
													/^\d*\.?\d{0,2}$/.test(
														value
													)
												) {
													controllerField.onChange(
														value
													);
												}
											}}
											onBlur={controllerField.onBlur}
											disabled={disabled}
											readOnly={readOnly}
											placeholder={
												baseError?.message ||
												placeholder
											}
											className={`w-full px-2 py-2 text-sm border rounded-md outline-none focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200 ${
												baseError
													? 'placeholder-red-400 border-red-300 focus:border-red-500 focus:ring-red-200'
													: 'placeholder-gray-500'
											} ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
										/>
									)}
								/>
							</div>
						</div>
					</div>
				);

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
							<div className="flex-1 relative">
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
													placeholder={
														baseError?.message ||
														placeholder
													}
													className={`w-full px-2 py-2 text-sm border rounded-md outline-none focus:ring-1 ${
														baseError
															? 'placeholder-red-400 border-red-300 focus:border-red-500 focus:ring-red-200'
															: 'placeholder-gray-500 focus:border-Colors-Brand-500 ring-Colors-Brand-200'
													} ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
												/>
											)}
										</InputMask>
									)}
								/>
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
						<div className="flex flex-1 flex-col relative">
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
								placeholder={baseError?.message || placeholder}
								className={`w-full px-2 py-2 text-sm border rounded-md outline-none focus:ring-1 ${
									baseError
										? 'placeholder-red-400 border-red-300 focus:border-red-500 focus:ring-red-200'
										: 'placeholder-gray-500 focus:border-Colors-Brand-500 ring-Colors-Brand-200'
								} ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
							/>
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
						<div className="flex-1 relative">
							<input
								type="password"
								{...register(name, {
									required:
										required && `${label}는 필수입니다.`,
								})}
								disabled={disabled} // ✅ FormField의 disabled 속성 사용
								readOnly={readOnly} // ✅ FormField의 readOnly 속성 사용
								placeholder={baseError?.message || placeholder}
								className={`w-full px-2 py-2 text-sm border rounded-md outline-none focus:ring-1 ${
									baseError
										? 'placeholder-red-400 border-red-300 focus:border-red-500 focus:ring-red-200'
										: 'placeholder-gray-500 focus:border-Colors-Brand-500 ring-Colors-Brand-200'
								} ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
							/>
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
						<div className="flex-1 relative">
							<Controller
								name={name}
								control={control}
								rules={{
									required:
										required && `${label}는 필수입니다.`,
								}}
								render={(
									{ field: controllerField } // `field` 이름 충돌 방지
								) => {
									// Convert options to ComboBoxItem format
									const comboBoxItems: ComboBoxItem[] =
										options?.map((opt) => ({
											label: opt.label,
											value: opt.value ?? '',
										})) || [];

									// Find selected item based on current value
									const selectedItem =
										comboBoxItems.find(
											(item) =>
												item.value ===
												(controllerField.value as string)
										) || null;

									return (
										<ComboBox
											items={comboBoxItems}
											value={selectedItem}
											onChange={(item) => {
												controllerField.onChange(
													item?.value || ''
												);
											}}
											placeholder={
												baseError?.message ||
												placeholder ||
												'선택하세요'
											}
											disabled={disabled}
											error={!!baseError}
										/>
									);
								}}
							/>
						</div>
					</div>
				);
			case 'selectWithoutSearch':
				return (
					<div key={name} className="flex items-center mb-4">
						<label className="w-32 text-sm  font-medium text-gray-700">
							{label}
							{required && (
								<span className="text-red-400">*</span>
							)}
						</label>
						<div className="flex-1 relative">
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
										placeholder={
											baseError?.message || '선택하세요'
										}
										className={
											baseError
												? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
												: 'focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200'
										}
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
						<div className="flex-1 relative">
							<textarea
								{...register(name, {
									required:
										required && `${label}는 필수입니다.`,
								})}
								disabled={disabled} // ✅ FormField의 disabled 속성 사용
								readOnly={readOnly} // ✅ FormField의 readOnly 속성 사용
								placeholder={baseError?.message || placeholder}
								className={`w-full h-24 px-2 py-2 text-sm border rounded-md outline-none focus:ring-1 ${
									baseError
										? 'placeholder-red-400 border-red-300 focus:border-red-500 focus:ring-red-200'
										: 'placeholder-gray-500 focus:border-Colors-Brand-500 ring-Colors-Brand-200'
								}`}
							/>
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
					</div>
				);

			case 'radio':
				return (
					<div key={name} className="flex items-center mb-4">
						<label className="w-32 text-sm font-medium text-gray-700">
							{label}
							{required && (
								<span className="text-red-400">*</span>
							)}
						</label>
						<div className="flex-1 relative">
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
						</div>
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
						<div className="flex-1 relative">
							<Controller
								name={name}
								control={control}
								rules={{
									required:
										required && `${label}는 필수입니다.`,
								}}
								render={({ field: controllerField }) => {
									useEffect(() => {
										if (
											!controllerField.value &&
											!field.defaultValue
										) {
											// 기본값이 없으면 오늘 날짜를 설정
											const today = new Date();
											const year = today.getFullYear();
											const month = (today.getMonth() + 1)
												.toString()
												.padStart(2, '0');
											const day = today
												.getDate()
												.toString()
												.padStart(2, '0');
											const todayString = `${year}-${month}-${day}`;
											controllerField.onChange(
												todayString
											);
										}
									}, [controllerField, field.defaultValue]);

									return (
										<input
											type="date"
											value={
												(controllerField.value as string) ||
												''
											}
											onChange={controllerField.onChange}
											disabled={disabled}
											readOnly={readOnly}
											className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Colors-Brand-200 focus:border-Colors-Brand-500 hover:border-Colors-Brand-300 transition-colors"
										/>
									);
								}}
							/>
						</div>
					</div>
				);

			case 'datetime':
				return (
					<div key={name} className="flex items-center mb-4">
						<label className="w-32 text-sm font-medium text-gray-700">
							{label}
							{required && (
								<span className="text-red-400">*</span>
							)}
						</label>
						<div className="flex-1 relative">
							<Controller
								name={name}
								control={control}
								rules={{
									required:
										required && `${label}는 필수입니다.`,
								}}
								render={({ field: controllerField }) => {
									useEffect(() => {
										if (
											!controllerField.value &&
											!field.defaultValue
										) {
											// 기본값이 없으면 현재 날짜와 시간을 설정
											const now = new Date();
											const year = now.getFullYear();
											const month = (now.getMonth() + 1)
												.toString()
												.padStart(2, '0');
											const day = now
												.getDate()
												.toString()
												.padStart(2, '0');
											const hours = now
												.getHours()
												.toString()
												.padStart(2, '0');
											const minutes = now
												.getMinutes()
												.toString()
												.padStart(2, '0');
											const nowString = `${year}-${month}-${day}T${hours}:${minutes}`;
											controllerField.onChange(nowString);
										}
									}, [controllerField, field.defaultValue]);

									return (
										<input
											type="datetime-local"
											value={
												(controllerField.value as string) ||
												''
											}
											onChange={controllerField.onChange}
											disabled={disabled}
											readOnly={readOnly}
											className="w-full px-2 py-2 text-sm border rounded-md outline-none focus:border-Colors-Brand-500"
										/>
									);
								}}
							/>
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
						<div className="flex-1 relative">
							<Controller
								name={name}
								control={control}
								rules={{
									required:
										required && `${label}는 필수입니다.`,
								}}
								render={({ field: controllerField }) => {
									useEffect(() => {
										if (initialData && initialData[name]) {
											const value = initialData[
												name
											] as string;
											if (value && value.length === 6) {
												const year = value.substring(
													0,
													4
												);
												const month = value.substring(
													4,
													6
												);
												const formattedValue = `${year}-${month}`;
												controllerField.onChange(
													formattedValue
												);
											}
										} else if (
											!controllerField.value &&
											!field.defaultValue
										) {
											// 기본값이 없으면 현재 월을 설정
											const now = new Date();
											const currentYear =
												now.getFullYear();
											const currentMonth = (
												now.getMonth() + 1
											)
												.toString()
												.padStart(2, '0');
											const currentYearMonth = `${currentYear}-${currentMonth}`;
											controllerField.onChange(
												currentYearMonth
											);
										}
									}, [initialData, name, controllerField]);

									return (
										<PrimesDatePicker
											{...controllerField}
											value={
												controllerField.value
													? {
															startDate: new Date(
																controllerField.value +
																	'-01'
															),
															endDate: new Date(
																controllerField.value +
																	'-01'
															),
														}
													: null
											}
											onChange={(
												newValue: DateValueType | null
											) => {
												if (newValue?.startDate) {
													const date = new Date(
														newValue.startDate
													);
													const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
													controllerField.onChange(
														yearMonth
													);
												} else {
													controllerField.onChange(
														null
													);
												}
											}}
											placeholder={
												placeholder ||
												`${label}를 선택하세요`
											}
											disabled={disabled}
											readOnly={readOnly}
											required={required}
											mode="month-react"
											className="w-full"
										/>
									);
								}}
							/>
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
						<div className="flex flex-1 flex-col relative">
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
								placeholder={baseError?.message || placeholder}
								className={`w-full px-2 py-2 text-sm border rounded-md outline-none focus:ring-1 ${
									baseError
										? 'placeholder-red-400 border-red-300 focus:border-red-500 focus:ring-red-200'
										: 'placeholder-gray-500 focus:border-Colors-Brand-500 ring-Colors-Brand-200'
								} ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
							/>
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
						<div className="flex-1 relative">
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
													placeholder={
														baseError?.message ||
														placeholder
													}
													className={`w-full px-2 py-2 text-sm border rounded-md outline-none focus:ring-1 ${
														baseError
															? 'placeholder-red-400 border-red-300 focus:border-red-500 focus:ring-red-200'
															: 'placeholder-gray-500 focus:border-Colors-Brand-500 ring-Colors-Brand-200'
													} ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
												/>
											)}
										</InputMask>
									);
								}}
							/>
						</div>
					</div>
				);

			case 'button':
				return (
					<div key={name} className="flex items-center mb-4">
						<label className="w-32 text-sm font-medium text-gray-700">
							{label}
						</label>
						<div className="flex-1 relative">
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
							{required && (
								<span className="text-red-400">*</span>
							)}
						</label>
						<div className="flex-1 relative">
							<Controller
								name={name}
								control={control}
								rules={{
									required: required
										? `${label}는 필수입니다.`
										: false,
								}}
								render={({ field: controllerField }) => {
									const baseError = errors[name] as {
										message?: string;
									};

									return (
										<FileUploadComponent
											value={
												controllerField.value as File[]
											}
											onChange={controllerField.onChange}
											error={!!baseError}
											placeholder={
												baseError?.message ||
												placeholder
											}
											disabled={disabled}
											accept="image/*"
											multiple={true}
											maxFiles={10}
											maxFileSize={10}
										/>
									);
								}}
							/>
						</div>
					</div>
				);

			case 'codeSelect':
				return (
					<div key={name} className="flex items-center mb-4">
						<label className="w-32 text-sm font-medium text-gray-700">
							{label}
							{required && (
								<span className="text-red-400">*</span>
							)}
						</label>
						<div className="flex-1 relative">
							<Controller
								name={name}
								control={control}
								rules={{
									required:
										required && `${label}는 필수입니다.`,
								}}
								render={({ field: controllerField }) => (
									<CodeSelectComponent
										fieldKey={field.fieldKey}
										value={controllerField.value as string}
										onChange={(value) => {
											controllerField.onChange(value);
										}}
										placeholder={
											baseError?.message ||
											placeholder ||
											'선택하세요'
										}
										disabled={disabled}
										valueKey={field.valueKey}
										labelKey={field.labelKey}
										className="w-full"
										error={!!baseError}
									/>
								)}
							/>
						</div>
					</div>
				);

			case 'divider':
				return (
					<div key={name} className="mb-4">
						<div className="flex items-center">
							<div className="flex-grow border-t border-gray-300"></div>
							{label && (
								<span className="px-3 text-sm font-medium text-gray-600 bg-white">
									{label}
								</span>
							)}
							<div className="flex-grow border-t border-gray-300"></div>
						</div>
					</div>
				);

			case 'hidden':
				return <input key={name} type="hidden" {...register(name)} />;

			case 'inputButton':
				return (
					<div key={name} className="flex items-center mb-4">
						<label className="w-32 text-sm font-medium text-gray-700">
							{label}
							{required && (
								<span className="text-red-400">*</span>
							)}
						</label>
						<div className="flex flex-1 flex-col relative">
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
									placeholder={
										baseError?.message || placeholder
									}
									disabled={disabled}
									readOnly={readOnly}
									className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-Colors-Brand-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
									onKeyDown={(e) => {
										// Enter키 이벤트 처리
										if (e.key === 'Enter') {
											e.preventDefault();
											const currentValue =
												methods.getValues(
													name
												) as string;
											if (field.onButtonClick) {
												field.onButtonClick(
													currentValue
												);
											}
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

			case 'custom':
				return (
					<div key={name} className="flex items-center mb-4">
						<label className="w-32 text-sm font-medium text-gray-700">
							{label}
							{required && (
								<span className="text-red-400">*</span>
							)}
						</label>
						<div className="flex flex-1 flex-col relative">
							{field.component}
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
					const baseError = errors[name] as { message?: string };

					return (
						<div key={name} className="flex items-center mb-4">
							<label className="w-32 text-sm  font-medium text-gray-700">
								{label}
								{required && (
									<span className="text-red-400">*</span>
								)}
							</label>
							<div className="flex-1 relative">
								<Controller
									name={name}
									control={control}
									rules={{
										required: false,
										validate: required
											? (value: any) => {
													// 값이 비어있는 경우만 에러 처리 (undefined, null, 빈문자열)
													if (
														value === undefined ||
														value === null
													)
														return `${label}는 필수입니다.`;
													if (
														typeof value ===
															'string' &&
														value.trim() === ''
													)
														return `${label}는 필수입니다.`;
													return true;
												}
											: undefined,
										pattern: pattern && {
											value: pattern,
											message:
												formatMessage ||
												`${label} 형식이 올바르지 않습니다.`,
										},
									}}
									render={(
										{ field: controllerField } // `field` 이름 충돌 방지
									) => {
										return (
											<OtherComponent
												field={controllerField}
												methods={methods}
												{...field}
												value={
													controllerField.value as string
												}
												onChange={(value: any) => {
													controllerField.onChange(
														value
													);
												}}
												placeholder={
													baseError?.message ||
													placeholder ||
													'선택하세요'
												}
												disabled={disabled}
												error={!!baseError}
											/>
										);
									}}
								/>
							</div>
						</div>
					);
				}
				return null;
		}
	};

	return (
		<form
			onSubmit={handleSubmit((data, event) => {
				if (onSubmit) {
					onSubmit(data, event);
				}
			})}
		>
			{/* 레이아웃에 따른 필드 렌더링 */}
			{layout === 'split' ? (
				/* 2열 레이아웃: required/optional 필드 구분 */
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* 왼쪽: Required 필드 */}
					<div className="space-y-4">
						{fields
							.filter((field) => field.required === true)
							.map(renderField)}
					</div>

					{/* 오른쪽: Optional 필드 */}
					<div className="space-y-4">
						{fields
							.filter((field) => field.required !== true)
							.map(renderField)}
					</div>
				</div>
			) : (
				/* 단일 레이아웃: 기존 방식 */
				fields.map(renderField)
			)}

			{visibleSaveButton && (
				<div className="text-right mt-4">
					<button
						type="submit"
						className="px-4 py-2 bg-Colors-Brand-700 text-white rounded-md"
					>
						{(() => {
							// Handle translation for common Korean submit button texts
							if (submitButtonText === '수정') {
								return t('search.submitButton.edit');
							}
							if (submitButtonText === '등록') {
								return t('search.submitButton.register');
							}
							if (submitButtonText === '저장') {
								return t('search.submitButton.save', '저장');
							}
							return submitButtonText;
						})()}
					</button>
				</div>
			)}
		</form>
	);
};
