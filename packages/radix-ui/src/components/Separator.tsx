import * as React from 'react';
import { Separator } from 'radix-ui';

interface RadixSeparatorProps
	extends React.ComponentProps<typeof Separator.Root> {
	className?: string;
}

export const RadixSeparator: React.FC<RadixSeparatorProps> = ({
	className,
	...props
}) => {
	return <Separator.Root className={className} {...props} />;
};
