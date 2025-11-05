import * as React from 'react';

export interface VisuallyHiddenInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	/**
	 * Control element reference (for accessibility and focus management)
	 */
	control?: HTMLDivElement | null;
	/**
	 * The input value
	 */
	value?: string;
	/**
	 * Callback for when the value changes
	 */
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	/**
	 * Callback for when the input receives focus
	 */
	onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/**
	 * Callback for when the input loses focus
	 */
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * VisuallyHiddenInput component that renders an input element that is visually hidden
 * but still accessible to screen readers and assistive technologies.
 * 
 * This is commonly used in custom form controls where you need to maintain
 * accessibility while providing a custom visual interface.
 */
export const VisuallyHiddenInput = React.forwardRef<
	HTMLInputElement,
	VisuallyHiddenInputProps
>(({ control, style, ...props }, ref) => {
	return (
		<input
			{...props}
			ref={ref}
			style={{
				// Visually hidden but accessible to screen readers
				position: 'absolute',
				border: 0,
				width: '1px',
				height: '1px',
				padding: 0,
				margin: '-1px',
				overflow: 'hidden',
				clip: 'rect(0, 0, 0, 0)',
				whiteSpace: 'nowrap',
				clipPath: 'inset(50%)',
				// Merge any additional styles
				...style,
			}}
			// Ensure it's still focusable and accessible
			tabIndex={-1}
			aria-hidden="true"
		/>
	);
});

VisuallyHiddenInput.displayName = 'VisuallyHiddenInput';

export default VisuallyHiddenInput; 