import React from 'react';
import { Form } from 'react-bootstrap';

interface TextareaProps {
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	rows?: number;
	placeholder?: string;
	isInvalid?: boolean;
	errorMessage?: any;
	[key: string]: any;
}

export const TextareaComponent: React.FC<TextareaProps> = ({
	name,
	value,
	onChange,
	rows = 3,
	placeholder,
	isInvalid = false,
	errorMessage,
	...props
}) => {
	return (
		<>
			<Form.Control
				as="textarea"
				name={name}
				value={value}
				onChange={onChange}
				rows={rows}
				placeholder={placeholder}
				isInvalid={isInvalid}
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
