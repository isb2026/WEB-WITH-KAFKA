// packages/radix-ui/src/components/RadixText.tsx

import * as React from 'react';
import { Text, type TextProps } from '@radix-ui/themes';

export type RadixTextProps = TextProps & {
	children: React.ReactNode;
};

export const RadixText = ({
	children,
	className,
	...props
}: RadixTextProps) => {
	return (
		<Text {...props} className={className}>
			{children}
		</Text>
	);
};
