import { Button, Popover, Text } from '@radix-ui/themes';
import type { PopoverContentOwnProps } from '@radix-ui/themes/components/popover.props';

type RadixPopoverProps = PopoverContentOwnProps & {
	/** Custom className for the Popover.Content */
	className?: string;
	/** Custom trigger element (defaults to a Button) */
	trigger?: React.ReactNode;
	/** Custom content for the Popover.Content */
	children?: React.ReactNode;
	/** Optional maxWidth for the Popover.Content */
	maxWidth?: string | number;
} & React.HTMLAttributes<HTMLDivElement>;

export const RadixPopover: React.FC<RadixPopoverProps> = ({
	className = '',
	trigger = <Button variant="soft">Popover</Button>,
	children = (
		<Text as="p" trim="both" size="1">
			The quick brown fox jumps over the lazy dog.
		</Text>
	),
	maxWidth = '300px',
	...props
}) => (
	<Popover.Root>
		<Popover.Trigger>{trigger}</Popover.Trigger>
		<Popover.Content className={className} maxWidth={maxWidth} {...props}>
			{children}
		</Popover.Content>
	</Popover.Root>
);
