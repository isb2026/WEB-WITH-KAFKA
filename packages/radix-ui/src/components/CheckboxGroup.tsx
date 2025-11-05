import React from 'react';
import { CheckboxGroup, Flex } from '@radix-ui/themes';

// Define the shape of each item in the checkbox group
type Item = {
	value: string;
	label?: React.ReactNode;
	itemProps?: Omit<
		React.ComponentProps<typeof CheckboxGroup.Item>,
		'value' | 'children'
	>;
};

// Extend CheckboxGroup.Root props, overriding specific props for flexibility
export interface RadixCheckboxGroupProps
	extends Omit<
		React.ComponentProps<typeof CheckboxGroup.Root>,
		'children' | 'defaultValue'
	> {
	/** Which values are checked by default; accepts a single string or an array */
	defaultValue?: string | string[];
	/** Array of { value, label, itemProps } to render */
	items?: Item[];
	/** Wrapper class for the Flex container */
	className?: string;
	/** Layout direction for the Flex container */
	direction?: 'row' | 'column';
	/** Gap between items (passed to Flex) */
	gap?: string;
	/** Use the color type from CheckboxGroup.Root props */
	color?: React.ComponentProps<typeof CheckboxGroup.Root>['color'];
	/** Optional children to allow custom rendering */
	children?: React.ReactNode;
}

export const RadixCheckboxGroup: React.FC<RadixCheckboxGroupProps> = ({
	items = [],
	defaultValue,
	direction = 'row',
	gap = '2',
	className,
	color,
	children,
	...rootProps
}) => {
	// Normalize defaultValue to an array for consistency
	const normalizedDefaultValue =
		typeof defaultValue === 'string' ? [defaultValue] : defaultValue;

	return (
		<CheckboxGroup.Root
			defaultValue={normalizedDefaultValue}
			className={className}
			color={color}
			{...rootProps}
		>
			{children ? (
				children
			) : (
				<Flex gap={gap} direction={direction}>
					{items.map(({ value, label, itemProps = {} }) => (
						<CheckboxGroup.Item
							key={value}
							value={value}
							{...itemProps}
						>
							{label}
						</CheckboxGroup.Item>
					))}
				</Flex>
			)}
		</CheckboxGroup.Root>
	);
};
