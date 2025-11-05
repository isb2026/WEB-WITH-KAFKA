import * as Checkbox from '@radix-ui/react-checkbox';
import type {
	CheckboxProps,
	CheckboxIndicatorProps,
} from '@radix-ui/react-checkbox';

export const RadixCheckboxRoot = ({
	className = '',
	...props
}: CheckboxProps) => <Checkbox.Root className={className} {...props} />;

export const RadixCheckboxIndicator = ({
	className = '',
	...props
}: CheckboxIndicatorProps) => (
	<Checkbox.Indicator className={className} {...props} />
);
