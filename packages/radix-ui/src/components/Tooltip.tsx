import * as Tooltip from '@radix-ui/react-tooltip';
import React from 'react';

export const TooltipProvider = (props: React.ComponentPropsWithRef<typeof Tooltip.Provider>) => (
  <Tooltip.Provider {...props}>{props.children}</Tooltip.Provider>
);

export const TooltipRoot = (props: React.ComponentPropsWithRef<typeof Tooltip.Root>) => (
  <Tooltip.Root {...props}>{props.children}</Tooltip.Root>
);

export const TooltipTrigger = (props: React.ComponentPropsWithRef<typeof Tooltip.Trigger>) => (
  <Tooltip.Trigger {...props} />
);

export const TooltipContent = (props: React.ComponentPropsWithRef<typeof Tooltip.Content>) => (
  <Tooltip.Content {...props} />
);

export const TooltipArrow = (props: React.ComponentPropsWithRef<typeof Tooltip.Arrow>) => (
  <Tooltip.Arrow {...props} />
); 