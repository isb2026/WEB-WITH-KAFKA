import React from 'react';
import { Form } from 'react-bootstrap';

interface CheckboxProps {
	name: string;
	label: string;
	checked: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	disabled?: boolean;
	[key: string]: any;
}

export const CheckboxComponent: React.FC<CheckboxProps> = ({
	name,
	label,
	checked,
	onChange,
	disabled = false,
	...props
}) => {
	return (
		<Form.Check
			type="checkbox"
			name={name}
			label={label}
			checked={checked}
			onChange={onChange}
			disabled={disabled}
			{...props}
		/>
	);
};
