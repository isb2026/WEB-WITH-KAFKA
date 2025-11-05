import { Badge } from '@radix-ui/themes';
import type { BadgeProps } from '@radix-ui/themes';

export const RadixBadgeComponent = ({ children = 'I am badge 😃', ...props }: BadgeProps) => (
  <Badge {...props}>{children}</Badge>
);
