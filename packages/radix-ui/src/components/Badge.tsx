import { Badge } from '@radix-ui/themes';
import type { BadgeProps } from '@radix-ui/themes';

export const RadixBadge = ({
	className = '',
	children = 'I am badge 😃',
	...props
}: BadgeProps) => (
	<Badge className={className} {...props}>
		{children}
	</Badge>
);
