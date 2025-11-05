import React from 'react';
import { Form } from 'react-bootstrap';

interface TextInputProps {
	type?: 'text' | 'number' | 'email' | 'password' | 'date' | 'month';
	name: string;
	value?: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isInvalid?: boolean;
	placeholder?: string;
	errorMessage?: any;
	[key: string]: any;
}

export const TextInputComponent: React.FC<TextInputProps> = ({
	type = 'text',
	name,
	value,
	onChange,
	isInvalid = false,
	placeholder,
	errorMessage,
	...props
}) => {
	return (
		<>
			<Form.Control
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				isInvalid={isInvalid}
				placeholder={placeholder}
				{...props}
			/>
			{isInvalid && (
				<Form.Control.Feedback type="invalid">
					{errorMessage}
				</Form.Control.Feedback>
			)}
		</>
	);
};
