import * as Dialog from '@radix-ui/react-dialog';
import type {
	DialogProps,
	DialogTriggerProps,
	DialogPortalProps,
	DialogOverlayProps,
	DialogContentProps,
	DialogTitleProps,
	DialogDescriptionProps,
	DialogCloseProps,
} from '@radix-ui/react-dialog';

export const RadixDialogRoot = (props: DialogProps) => (
	<Dialog.Root {...props}>{props.children}</Dialog.Root>
);

export const RadixDialogTrigger = ({ className = '', ...props }: DialogTriggerProps) => (
	<Dialog.Trigger className={className} {...props} />
);

export const RadixDialogPortal = (props: DialogPortalProps) => (
	<Dialog.Portal {...props} />
);

export const RadixDialogOverlay = ({ className = '', ...props }: DialogOverlayProps) => (
	<Dialog.Overlay className={className} {...props} />
);

export const RadixDialogContent = ({ className = '', ...props }: DialogContentProps) => (
	<Dialog.Content className={className} {...props} />
);

export const RadixDialogTitle = ({ className = '', ...props }: DialogTitleProps) => (
	<Dialog.Title className={className} {...props} />
);

export const RadixDialogDescription = ({ className = '', ...props }: DialogDescriptionProps) => (
	<Dialog.Description className={className} {...props} />
);

export const RadixDialogClose = ({ className = '', ...props }: DialogCloseProps) => (
	<Dialog.Close className={className} {...props} />
); 