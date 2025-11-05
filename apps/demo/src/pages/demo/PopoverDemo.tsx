import React from 'react';
import { Button, RadixPopover, Text } from '@repo/radix-ui/components';

const PopoverDemo: React.FC = () => {
	return (
		<div className="py-2 space-y-8">
			{/* Default Popover */}
			<RadixPopover />

			{/* Size Variations */}
			<div>
				<h2 className="text-xl font-semibold mb-2">Size</h2>
				<p className="mb-4 text-gray-600">
					<code>size</code> prop을 사용해 크기를 조절할 수 있습니다.
				</p>
				<div className="flex gap-4 items-center">
					{(['1', '2', '3', '4'] as const).map((size) => (
						<RadixPopover
							key={size}
							size={size}
							maxWidth="400px"
							trigger={
								<Button variant="soft">Open Size {size}</Button>
							}
							children={
								<Text as="p" size={size}>
									The quick brown fox jumps over the lazy dog
									(Size {size}).
								</Text>
							}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default PopoverDemo;
