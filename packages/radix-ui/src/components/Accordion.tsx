// import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import type {
	AccordionItemProps,
	AccordionTriggerProps,
	AccordionContentProps,
	AccordionSingleProps,
	AccordionMultipleProps,
} from '@radix-ui/react-accordion';

type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

export const RadixAccordionRoot = ({ children, ...props }: AccordionProps) => (
	<Accordion.Root {...props}>{children}</Accordion.Root>
);

export const RadixAccordionItem = ({
	className = '',
	children,
	...props
}: AccordionItemProps) => (
	<Accordion.Item className={className} {...props}>
		{children}
	</Accordion.Item>
);

export const RadixAccordionTrigger = ({
	className = '',
	children,
	...props
}: AccordionTriggerProps) => (
	<Accordion.Trigger className={className} {...props}>
		{children}
	</Accordion.Trigger>
);

export const RadixAccordionContent = ({
	className = '',
	children,
	...props
}: AccordionContentProps) => (
	<Accordion.Content className={className} {...props}>
		{children}
	</Accordion.Content>
);
