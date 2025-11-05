declare module 'react-input-mask' {
	import * as React from 'react';

	interface InputMaskProps
		extends React.InputHTMLAttributes<HTMLInputElement> {
		mask: string;
		maskChar?: string | null;
		alwaysShowMask?: boolean;
		beforeMaskedValueChange?: (
			newState: {
				value: string;
				cursor: number | null;
			},
			oldState: {
				value: string;
				cursor: number | null;
			},
			userInput: string,
			maskOptions: any
		) => {
			value: string;
			cursor: number | null;
		};

		children?:
			| React.ReactNode
			| ((
					props: React.InputHTMLAttributes<HTMLInputElement>
			  ) => React.ReactNode);
	}

	const InputMask: React.FC<InputMaskProps>;
	export default InputMask;
}
