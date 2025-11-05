import * as React from 'react';
import { Select } from 'radix-ui';
import classnames from 'classnames';
import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from '@radix-ui/react-icons';

interface SelectItemProps {
	children: React.ReactNode;
	className?: string;
	value?: string;
	disabled?: boolean;
	[key: string]: any;
}

export const RadixSelectItem = React.forwardRef<
	HTMLDivElement,
	SelectItemProps
>(({ children, className, value, disabled, ...props }, forwardedRef) => {
	return (
		<Select.Item
			className={classnames(
				'relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none text-gray-700 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet-500 data-[disabled]:text-gray-400 data-[highlighted]:text-white data-[highlighted]:outline-none',
				className
			)}
			value={value}
			disabled={disabled}
			{...props}
			ref={forwardedRef}
		>
			<Select.ItemText>{children}</Select.ItemText>
			<Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
				<CheckIcon />
			</Select.ItemIndicator>
		</Select.Item>
	);
});

RadixSelectItem.displayName = 'RadixSelectItem';

export interface RadixSelectProps {
	placeholder?: string;
	label?: string;
	value?: string;
	onValueChange?: (value: string) => void;
	className?: string;
	children: React.ReactNode;
	disabled?: boolean;
}

export const RadixSelect = ({
	children,
	placeholder,
	value,
	onValueChange,
	className,
	disabled = false,
}: RadixSelectProps) => {
	return (
		<Select.Root
			value={value}
			onValueChange={onValueChange}
			disabled={disabled}
		>
			<Select.Trigger
				className={classnames(
					'inline-flex h-[35px] w-full items-center justify-between gap-[5px] rounded bg-white px-2 text-[14px] leading-none text-gray-700 border border-gray-300 outline-none hover:bg-gray-50',
					disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed',
					className
				)}
			>
				<Select.Value placeholder={placeholder} />
				<Select.Icon className="text-gray-500">
					<ChevronDownIcon />
				</Select.Icon>
			</Select.Trigger>
			<Select.Portal>
				<Select.Content className="overflow-hidden rounded-md bg-white shadow-lg border border-gray-200 z-50">
					<Select.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center bg-white text-gray-700">
						<ChevronUpIcon />
					</Select.ScrollUpButton>
					<Select.Viewport className="p-[5px]">
						{children}
					</Select.Viewport>
					<Select.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center bg-white text-gray-700">
						<ChevronDownIcon />
					</Select.ScrollDownButton>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
};

export const RadixSelectGroup = Select.Group;
export const RadixSelectLabel = Select.Label;
export const RadixSelectSeparator = Select.Separator;
