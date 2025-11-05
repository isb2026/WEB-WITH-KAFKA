import { Flex, Switch, Text } from '@radix-ui/themes';
import type { SwitchProps } from '@radix-ui/themes/components/switch';

type RadixSwitchProps = SwitchProps & {
	className?: string;
	label?: string;
};

export const RadixSwitch = ({
	className = '',
	label,
	size = '2',
	color ,
	defaultChecked = false,
	...props
}: RadixSwitchProps & { color?: 'violet' | 'indigo' | 'cyan' | 'orange' | 'crimson' }) => (
	<Flex align="center" gap="2" className={className}>
		<Switch size={size} color={color} defaultChecked={defaultChecked} {...props} />
		{label && (
			<Text as="label" size={size} style={{ userSelect: 'none' }}>
				{label}
			</Text>
		)}
	</Flex>
);
