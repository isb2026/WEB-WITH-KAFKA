import React from 'react';
import { Form } from 'react-bootstrap';

export interface RadioOption {
	label: string;
	value: string | number;
}

interface RadioGroupProps {
	name: string;
	options: RadioOption[];
	selectedValue: string | number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	inline?: boolean;
	disabled?: boolean;
	[key: string]: any;
}

export const RadioGroupComponent: React.FC<RadioGroupProps> = ({
	name,
	options,
	selectedValue,
	onChange,
	inline = false,
	disabled = false,
	...props
}) => {
	return (
		<>
			{options.map((opt, idx) => (
				<Form.Check
					key={idx}
					type="radio"
					name={name}
					label={opt.label}
					value={opt.value}
					checked={selectedValue === opt.value}
					onChange={onChange}
					inline={inline}
					disabled={disabled}
					{...props}
				/>
			))}
		</>
	);
};
