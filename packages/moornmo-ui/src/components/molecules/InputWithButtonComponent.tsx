import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

interface InputWithButtonProps {
	name: string;
	value: string;
	placeholder?: string;
	buttonLabel?: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onButtonClick?: () => void;
	[key: string]: any;
}

export const InputWithButtonComponent: React.FC<InputWithButtonProps> = ({
	name,
	value,
	placeholder = '',
	buttonLabel = '확인',
	onChange,
	onButtonClick,
	...props
}) => {
	return (
		<InputGroup>
			<Form.Control
				name={name}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				{...props}
			/>
			<Button variant="outline-secondary" onClick={onButtonClick}>
				{buttonLabel}
			</Button>
		</InputGroup>
	);
};
