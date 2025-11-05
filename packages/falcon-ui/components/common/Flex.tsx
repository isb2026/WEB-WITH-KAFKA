import React, { ElementType, HTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';

interface FlexProps extends HTMLAttributes<HTMLElement> {
	children: ReactNode;
	justifyContent?: string;
	inline?: boolean;
	alignItems?: string;
	alignContent?: string;
	wrap?: string;
	className?: string;
	tag?: ElementType;
	breakpoint?: string;
	direction?: string;
	gap?: string | number;
}

export const Flex: React.FC<FlexProps> = ({
	justifyContent,
	alignItems,
	alignContent,
	inline = false,
	wrap,
	className,
	tag: Tag = 'div',
	children,
	breakpoint,
	direction,
	...rest
}) => {
	return (
		<Tag
			className={classNames(
				{
					[`d-${breakpoint ? breakpoint + '-' : ''}flex`]: !inline,
					[`d-${breakpoint ? breakpoint + '-' : ''}inline-flex`]:
						inline,
					[`flex-${direction}`]: direction,
					[`justify-content-${justifyContent}`]: justifyContent,
					[`align-items-${alignItems}`]: alignItems,
					[`align-content-${alignContent}`]: alignContent,
					[`flex-${wrap}`]: wrap,
				},
				className
			)}
			{...rest}
		>
			{children}
		</Tag>
	);
};
