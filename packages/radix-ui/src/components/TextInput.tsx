import React from 'react';
import { TextField } from '@radix-ui/themes';
import type {
	RootProps,
	SlotProps,
} from '@radix-ui/themes/components/text-field';

export interface RadixTextInputProps extends RootProps {
	startSlot?: React.ReactNode;
	endSlot?: React.ReactNode;
	className?: string; // 전체 className을 전달받아 처리
	inputProps?: any; // 추가적인 input 속성들을 받기 위한 props
}

export interface RadixTextInputSlotProps extends SlotProps {}

export const RadixTextInput: React.FC<RadixTextInputProps> = ({
	startSlot,
	endSlot,
	className, // className을 받아서 사용
	inputProps,
	children,
	...props
}) => {
	return (
		<TextField.Root
			{...inputProps}
			{...props}
			className={`rt-TextFieldRoot ${className}`} // root에 className 적용
		>
			{startSlot && (
				<TextField.Slot
					side="left"
					className="flex items-center pl-2" // startSlot에 Tailwind 클래스 적용
				>
					{startSlot}
				</TextField.Slot>
			)}
			{endSlot && (
				<TextField.Slot
					side="right"
					className="flex items-center pr-2" // endSlot에 Tailwind 클래스 적용
				>
					{endSlot}
				</TextField.Slot>
			)}
			{children}
		</TextField.Root>
	);
};
