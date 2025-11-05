import React, { FC } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Form, InputGroup } from 'react-bootstrap';
import { Button } from '@mui/material';
import { StyledSpacer, StyledCustomSwitch } from '@moornmo/components/atoms';
import { getFormattedDate } from '@repo/utils';

/**
 * FieldRendererProps: 각 필드 타입별 렌더링을 담당합니다.
 */
export interface FieldRendererProps {
	type: string;
	name: string;
	fieldProps?: Record<string, any>;
	value: any;
	formData: Record<string, any>;
	onChange?: (name: string, value: any) => void;
	getDefaultDateValue: (props: any, name: string, format: string) => string;
}

export const SearchFieldRenderer: FC<FieldRendererProps> = ({
	type,
	name,
	fieldProps = {},
	value,
	formData,
	onChange,
	getDefaultDateValue,
}) => {
	switch (type) {
		case 'text':
		case 'number':
		case 'email':
		case 'password':
			return (
				<Form.Control
					type={type}
					autoComplete="off"
					autoCorrect="off"
					spellCheck="false"
					onChange={(e) => {
						const newValue = e.target.value;
						if (onChange) {
							onChange(name, newValue);
						}
					}}
					defaultValue={value}
					{...fieldProps}
				/>
			);

		case 'textarea':
			return (
				<Form.Control
					as="textarea"
					rows={fieldProps.rows || 3}
					autoComplete="off"
					autoCorrect="off"
					spellCheck="false"
					onChange={(e) => {
						const newValue = e.target.value;
						if (onChange) {
							onChange(name, newValue);
						}
					}}
					{...fieldProps}
				/>
			);

		case 'select':
			return (
				<Form.Select
					{...fieldProps}
					onChange={(e) => {
						const newValue = e.target.value;
						if (onChange) {
							onChange(name, newValue);
						}
					}}
					defaultValue={value || ''}
				>
					<option value="">
						{fieldProps.placeholder || 'Select...'}
					</option>
					{fieldProps.options?.map((opt: any, idx: number) => (
						<option key={idx} value={opt.value}>
							{opt.label}
						</option>
					))}
				</Form.Select>
			);

		case 'checkbox':
			return (
				<Form.Check
					type="checkbox"
					label={fieldProps.label}
					defaultChecked={!!value}
					{...fieldProps}
				/>
			);

		case 'radio':
			return (
				<>
					{fieldProps.options?.map((opt: any, idx: number) => (
						<Form.Check
							key={idx}
							type="radio"
							label={opt.label}
							value={opt.value}
							onChange={(e) => {
								const newValue = e.target.value;
								if (onChange) {
									onChange(name, newValue);
								}
							}}
							defaultChecked={value === opt.value}
							{...fieldProps}
						/>
					))}
				</>
			);

		case 'btnInput':
			return (
				<InputGroup className="mb-3">
					<Form.Control
						placeholder={fieldProps.placeholder || ''}
						autoComplete="off"
						autoCorrect="off"
						onChange={(e) => {
							const newValue = e.target.value;
							if (onChange) {
								onChange(name, newValue);
							}
						}}
						spellCheck="false"
						{...fieldProps}
					/>
					<Button variant="outlined">
						{fieldProps.buttonLabel || 'Button'}
					</Button>
				</InputGroup>
			);

		case 'spacing':
			return <StyledSpacer />;

		case 'toggle':
			return (
				<Form.Check
					type="switch"
					label={fieldProps.label}
					onChange={(e) => {
						const newValue = e.target.value;
						if (onChange) {
							onChange(name, newValue);
						}
					}}
					defaultChecked={!!value}
					{...fieldProps}
					as={StyledCustomSwitch}
				/>
			);

		case 'yearMonth': {
			const defaultVal = getDefaultDateValue(
				fieldProps,
				name,
				'yearMonth'
			);
			return (
				<Form.Control
					type="month"
					defaultValue={defaultVal}
					autoComplete="off"
					autoCorrect="off"
					onChange={(e) => {
						const newValue = e.target.value;
						if (onChange) {
							onChange(name, newValue);
						}
					}}
					spellCheck="false"
					name={name}
				/>
			);
		}

		case 'date': {
			const defaultVal = getDefaultDateValue(
				fieldProps,
				name,
				'yearMonthDay'
			);
			return (
				<Form.Control
					type="date"
					defaultValue={defaultVal}
					autoComplete="off"
					autoCorrect="off"
					onChange={(e) => {
						const newValue = e.target.value;
						if (onChange) {
							onChange(name, newValue);
						}
					}}
					spellCheck="false"
					name={name}
				/>
			);
		}

		case 'dateRange': {
			const startKey = `${name}_start`;
			const endKey = `${name}_end`;
			const defaultStart =
				(value && value[startKey]) || getFormattedDate('yearMonthDay');
			const defaultEnd =
				(value && value[endKey]) || getFormattedDate('yearMonthDay');
			return (
				<InputGroup>
					<Form.Control
						type="date"
						defaultValue={defaultStart}
						name={startKey}
						onChange={(e) => {
							const newValue = e.target.value;
							if (onChange) {
								onChange(startKey, newValue);
							}
						}}
					/>
					<InputGroup.Text>~</InputGroup.Text>
					<Form.Control
						type="date"
						defaultValue={defaultEnd}
						name={endKey}
						onChange={(e) => {
							const newValue = e.target.value;
							if (onChange) {
								onChange(endKey, newValue);
							}
						}}
					/>
				</InputGroup>
			);
		}

		case 'monthRange': {
			const startKey = `${name}_start`;
			const endKey = `${name}_end`;
			const defaultStart =
				(value && value[startKey]) || getFormattedDate('yearMonth');
			const defaultEnd =
				(value && value[endKey]) || getFormattedDate('yearMonth');
			return (
				<InputGroup>
					<Form.Control
						type="month"
						defaultValue={defaultStart}
						name={startKey}
						onChange={(e) => {
							const newValue = e.target.value;
							if (onChange) {
								onChange(startKey, newValue);
							}
						}}
					/>
					<InputGroup.Text>~</InputGroup.Text>
					<Form.Control
						type="month"
						defaultValue={defaultEnd}
						name={endKey}
						onChange={(e) => {
							const newValue = e.target.value;
							if (onChange) {
								onChange(endKey, newValue);
							}
						}}
					/>
				</InputGroup>
			);
		}

		default:
			return null;
	}
};
