import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import React from 'react';

export const DropdownMenuRoot = (props: React.ComponentPropsWithRef<typeof DropdownMenu.Root>) => (
  <DropdownMenu.Root {...props}>{props.children}</DropdownMenu.Root>
);

export const DropdownMenuTrigger = (props: React.ComponentPropsWithRef<typeof DropdownMenu.Trigger>) => (
  <DropdownMenu.Trigger {...props} />
);

export const DropdownMenuContent = (props: React.ComponentPropsWithRef<typeof DropdownMenu.Content>) => (
  <DropdownMenu.Content {...props} />
);

export const DropdownMenuItem = (props: React.ComponentPropsWithRef<typeof DropdownMenu.Item>) => (
  <DropdownMenu.Item {...props} />
);

export const DropdownMenuSeparator = (props: React.ComponentPropsWithRef<typeof DropdownMenu.Separator>) => (
  <DropdownMenu.Separator {...props} />
);

export const DropdownMenuSub = (props: React.ComponentPropsWithRef<typeof DropdownMenu.Sub>) => (
  <DropdownMenu.Sub {...props} />
);

export const DropdownMenuSubTrigger = (props: React.ComponentPropsWithRef<typeof DropdownMenu.SubTrigger>) => (
  <DropdownMenu.SubTrigger {...props} />
);

export const DropdownMenuSubContent = (props: React.ComponentPropsWithRef<typeof DropdownMenu.SubContent>) => (
  <DropdownMenu.SubContent {...props} />
);

export const DropdownMenuTriggerIcon = ({
  size = 16,
  color = 'currentColor',
  direction = 'down',
  ...props
}: {
  size?: number | string;
  color?: string;
  direction?: 'down' | 'right' | 'left' | 'up';
} & React.SVGProps<SVGSVGElement>) => {
  let rotate = 0;
  if (direction === 'right') rotate = 90;
  if (direction === 'up') rotate = 180;
  if (direction === 'left') rotate = 270;
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 16 16"
      aria-hidden="true"
      style={{ transform: `rotate(${rotate}deg)` }}
      {...props}
    >
      <path d="M4 6l4 4 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}; 