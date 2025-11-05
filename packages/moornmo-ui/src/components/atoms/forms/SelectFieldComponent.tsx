import React from 'react';
import { Form } from 'react-bootstrap';

export interface SelectOption {
	label: string;
	value: string | number;
}

export interface SelectFieldProps {
	name: string;
	value: string | number;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	onFocus?: (e: React.FocusEvent<HTMLSelectElement>) => void;
	options?: SelectOption[];
	placeholder?: string;
	isInvalid?: boolean;
	errorMessage?: any;
	[key: string]: any;
}

export const SelectFieldComponent: React.FC<SelectFieldProps> = ({
	name,
	value,
	onChange,
	options,
	placeholder = 'Select...',
	isInvalid = false,
	errorMessage,
	...props
}) => {
	return (
		<>
			<Form.Select
				name={name}
				value={value}
				onChange={onChange}
				isInvalid={isInvalid}
				{...props}
			>
				<option value="">{placeholder}</option>
				{options &&
					options.map((opt, idx) => (
						<option key={idx} value={opt.value}>
							{opt.label}
						</option>
					))}
			</Form.Select>
			{isInvalid && (
				<Form.Control.Feedback type="invalid">
					{errorMessage}
				</Form.Control.Feedback>
			)}
		</>
	);
};
