// components/organisms/DynamicForm/FieldRenderer.tsx

import React from 'react';
import {
	TextInputComponent,
	SelectFieldComponent,
	CheckboxComponent,
	RadioGroupComponent,
	TextareaComponent,
	StyledSpacer,
} from '../../atoms';
import {
	InputWithButtonComponent,
	DateRangePickerComponent,
	MonthRangePickerComponent,
	PostCodeInput,
} from '../../molecules';

// import { Spacer } from 'components/search/dynamicSearch/styled';
import { FieldRendererProps } from '../../../types';

export const FieldRenderer: React.FC<FieldRendererProps> = ({
	type,
	name,
	props,
	register,
	watch,
	errors,
	setValue,
	getDefaultValue,
	otherTypeElements,
}) => {
	const errorMessage: any | undefined = errors[name]?.message;
	const { ref: _ignore, ...rest } = register(name, props?.validation);
	switch (type) {
		case 'text':
		case 'number':
		case 'email':
		case 'password':
			return (
				<TextInputComponent
					type={type}
					{...rest}
					name={name}
					value={
						watch(name) ||
						getDefaultValue?.(props, name, type) ||
						''
					}
					onChange={(e) => setValue(name, e.target.value)}
					placeholder={props.placeholder}
					disabled={props.disabled}
					isInvalid={!!errors[name]}
					errorMessage={errorMessage}
					{...props}
				/>
			);
		case 'textarea':
			return (
				<TextareaComponent
					{...rest}
					rows={props.rows}
					isInvalid={!!errors[name]}
					errorMessage={errorMessage}
					value={watch(name) || ''}
					onChange={(e) => setValue(name, e.target.value)}
					placeholder={props.placeholder}
					{...props}
				/>
			);
		case 'select':
			return (
				<SelectFieldComponent
					{...rest}
					options={props.options || []}
					isInvalid={!!errors[name]}
					value={watch(name) || ''}
					onChange={(e) => setValue(name, e.target.value)}
					placeholder={props.placeholder}
					errorMessage={errorMessage}
					{...props}
				/>
			);
		case 'checkbox':
			return (
				<CheckboxComponent
					name={name}
					label={props.label}
					checked={watch(name)}
					onChange={(e) => setValue(name, e.target.checked)}
					{...props}
				/>
			);
		case 'radio':
			return (
				<RadioGroupComponent
					name={name}
					options={props.options || []}
					selectedValue={watch(name)}
					onChange={(e) => setValue(name, e.target.value)}
					{...props}
				/>
			);
		case 'btnInput':
			return (
				<InputWithButtonComponent
					name={name}
					value={watch(name) || ''}
					onChange={(e) => setValue(name, e.target.value)}
					onButtonClick={props.onClick}
					placeholder={props.placeholder}
					buttonLabel={props.buttonLabel}
					{...props}
				/>
			);
		case 'date':
			if (
				watch(name) == undefined &&
				getDefaultValue &&
				getDefaultValue(props, name, 'yearMonthDay')
			) {
				const _default_value = getDefaultValue?.(
					props,
					name,
					'yearMonthDay'
				);
				setValue(name, _default_value);
			}
			return (
				<TextInputComponent
					type="date"
					{...rest}
					name={name}
					value={watch(name)}
					onChange={(e) => {
						setValue(name, e.target.value);
					}}
					{...props}
				/>
			);
		case 'yearMonth':
			if (
				watch(name) == undefined &&
				getDefaultValue &&
				getDefaultValue(props, name, 'yearMonthDay')
			) {
				const _default_value = getDefaultValue?.(
					props,
					name,
					'yearMonthDay'
				);
				setValue(name, _default_value);
			}
			return (
				<TextInputComponent
					{...rest}
					type="month"
					value={
						watch(name) ||
						getDefaultValue?.(props, name, 'yearMonth')
					}
					onChange={(e) => setValue(name, e.target.value)}
					name={name}
					{...props}
				/>
			);
		case 'dateRange': {
			const startName = `${name}_start`;
			const endName = `${name}_end`;
			return (
				<DateRangePickerComponent
					{...rest}
					startName={startName}
					endName={endName}
					startValue={watch(startName) || ''}
					endValue={watch(endName) || ''}
					onChange={(key, value) => setValue(key, value)}
				/>
			);
		}
		case 'monthRange': {
			const startName = `${name}_start`;
			const endName = `${name}_end`;
			return (
				<MonthRangePickerComponent
					{...rest}
					startName={startName}
					endName={endName}
					startValue={watch(startName) || ''}
					endValue={watch(endName) || ''}
					onChange={(key, value) => setValue(key, value)}
				/>
			);
		}
		case 'postCode':
			const fieldValue =
				(watch(name) as {
					zipCode?: string;
					roadAddress?: string;
					detailAddress?: string;
				}) ?? {};

			const hasError = !!errors[name];

			return (
				<PostCodeInput
					name={name}
					value={fieldValue}
					errors={
						hasError
							? {
									zipCode: !fieldValue.zipCode
										? errorMessage
										: undefined,
									roadAddress:
										fieldValue.zipCode &&
										!fieldValue.roadAddress
											? errorMessage
											: undefined,
								}
							: undefined
					}
					onChange={(key, val) => {
						const current = watch(name) || {};
						setValue(name, { ...current, [key]: val });
					}}
				/>
			);
		case 'spacing':
			return <StyledSpacer />;
		default:
			if (otherTypeElements && otherTypeElements[type]) {
				const OtherComponent = otherTypeElements[type];
				return (
					<OtherComponent
						name={name}
						value={
							watch(name) ||
							getDefaultValue?.(props, name, type) ||
							''
						}
						onChange={(value: any) => setValue(name, value)}
						setter={setValue}
						watch={watch} // watch 함수 직접 전달
						{...props}
					/>
				);
			}
			return null;
	}
};
