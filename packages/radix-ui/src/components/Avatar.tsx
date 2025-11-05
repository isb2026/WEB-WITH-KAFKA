import * as Avatar from '@radix-ui/react-avatar';
import type {
	AvatarProps,
	AvatarImageProps,
	AvatarFallbackProps,
} from '@radix-ui/react-avatar';

export const RadixAvatarRoot = ({
	className = '',
	children,
	...props
}: AvatarProps) => (
	<Avatar.Root className={className} {...props}>
		{children}
	</Avatar.Root>
);

export const RadixAvatarImage = ({
	className = '',
	children,
	...props
}: AvatarImageProps) => (
	<Avatar.Image className={className} {...props}>
		{children}
	</Avatar.Image>
);

export const RadixAvatarFallback = ({
	className = '',
	children,
	...props
}: AvatarFallbackProps) => (
	<Avatar.Fallback className={className} {...props}>
		{children}
	</Avatar.Fallback>
); 