// import React from 'react';
// packages/radix-ui/src/components/RadixTabs.tsx
import * as Tabs from '@radix-ui/react-tabs';
import type {
	TabsProps,
	TabsListProps,
	TabsTriggerProps,
	TabsContentProps,
} from '@radix-ui/react-tabs';

export const RadixTabsRoot = (props: TabsProps) => (
	<Tabs.Root {...props}>{props.children}</Tabs.Root>
);

export const RadixTabsList = ({ className = '', ...props }: TabsListProps) => (
	<Tabs.List className={className} {...props} />
);

export const RadixTabsTrigger = ({
	className = '',
	...props
}: TabsTriggerProps) => <Tabs.Trigger className={className} {...props} />;

export const RadixTabsContent = ({
	className = '',
	...props
}: TabsContentProps) => <Tabs.Content className={className} {...props} />;
