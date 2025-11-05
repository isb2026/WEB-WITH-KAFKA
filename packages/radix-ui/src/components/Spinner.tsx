import { Spinner } from '@radix-ui/themes';
import type { SpinnerProps } from '@radix-ui/themes';

export const RadixSpinner = ({ className = '', ...props }: SpinnerProps) => (
	<Spinner className={className} {...props} />
);
