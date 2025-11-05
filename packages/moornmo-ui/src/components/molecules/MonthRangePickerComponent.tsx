import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

interface MonthRangePickerProps {
	startName: string;
	endName: string;
	startValue: string;
	endValue: string;
	onChange: (field: string, value: string) => void;
	[key: string]: any;
}

export const MonthRangePickerComponent: React.FC<MonthRangePickerProps> = ({
	startName,
	endName,
	startValue,
	endValue,
	onChange,
	...props
}) => {
	return (
		<InputGroup>
			<Form.Control
				type="month"
				name={startName}
				value={startValue}
				onChange={(e) => onChange(startName, e.target.value)}
				{...props}
			/>
			<InputGroup.Text>~</InputGroup.Text>
			<Form.Control
				type="month"
				name={endName}
				value={endValue}
				onChange={(e) => onChange(endName, e.target.value)}
				{...props}
			/>
		</InputGroup>
	);
};
