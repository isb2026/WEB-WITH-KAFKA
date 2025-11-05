import { Box, RadioCards } from '@radix-ui/themes';
import type {
	ItemProps as RadioCardsItemProps,
	RootProps as RadioCardsRootProps,
} from '@radix-ui/themes/components/radio-cards';
import { Flex, Text } from '@repo/radix-ui/components';

type RadixRadioCardProps = RadioCardsItemProps & {
	className?: string;
	rootClassName?: string;
	size?: RadioCardsRootProps['size'];
	label: string;
	description?: string;
	disabled?: boolean;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
};

export const RadixRadioCard = ({
	className = '',
	rootClassName = '',
	size = '2',
	value,
	label,
	description,
	disabled = false,
	defaultValue,
	onValueChange,
	children,
	...props
}: RadixRadioCardProps) => (
	<Box maxWidth="600px" className={rootClassName}>
		<RadioCards.Root
			size={size}
			defaultValue={defaultValue}
			onValueChange={onValueChange}
			disabled={disabled}
		>
			<RadioCards.Item
				value={value}
				className={`p-4 ${className}`}
				{...props}
			>
				<Flex direction="column" gap="1" width="100%">
					<Text weight="bold" size={size}>
						{label}
					</Text>
					{description && (
						<Text size={size === '3' ? '2' : '1'}>
							{description}
						</Text>
					)}
					{children}
				</Flex>
			</RadioCards.Item>
		</RadioCards.Root>
	</Box>
);
