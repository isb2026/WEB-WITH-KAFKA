import { Popover } from '@radix-ui/themes';
import type { PopoverContentOwnProps } from '@radix-ui/themes/components/popover.props';
import type { ReactNode, HTMLAttributes } from 'react';

type RadixPopoverComposableProps = {
	children: ReactNode;
};

const Root = ({ children }: RadixPopoverComposableProps) => (
	<Popover.Root>{children}</Popover.Root>
);

const Trigger = (props: any) => <Popover.Trigger {...props} />;

type ContentProps = PopoverContentOwnProps &
	HTMLAttributes<HTMLDivElement> & {
		className?: string;
		maxWidth?: string | number;
		children?: ReactNode;
		side?: 'top' | 'right' | 'bottom' | 'left';
		align?: 'start' | 'center' | 'end';
		sideOffset?: number;
	};

const Content = ({
	className = '',
	maxWidth = '300px',
	children,
	...props
}: ContentProps) => (
	<Popover.Content className={className} maxWidth={maxWidth} {...props}>
		{children}
	</Popover.Content>
);

export const RadixPopoverComposable = {
	Root,
	Trigger,
	Content,
};
