// packages/radix-ui/src/components/RadixText.tsx

import * as React from 'react';
import { Heading, type HeadingProps } from '@radix-ui/themes';

export type RadixHeadingProps = HeadingProps & {
	children: React.ReactNode;
};

export const RadixHeading: React.FC<RadixHeadingProps> = ({
	children,
	className,
	...props
}) => {
	return (
		<Heading {...props} className={className}>
			{children}
		</Heading>
	);
};
