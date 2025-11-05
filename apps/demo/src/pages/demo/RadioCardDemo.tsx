import { Flex, RadixRadioCard } from '@repo/radix-ui/components';
import { useState } from 'react';

export const RadioCardDemo: React.FC = () => {
	const [selectedValue, setSelectedValue] = useState('value_1');

	const cardData = [
		{
			value: 'value_1',
			label: 'Basic',
			description: '8-core CPU, 32GB RAM',
		},
		{
			value: 'value_2',
			label: 'Pro',
			description: '12-core CPU, 64GB RAM',
		},
		{
			value: 'value_3',
			label: 'Ultra',
			description: '16-core CPU, 128GB RAM',
		},
	];

	return (
		<div className="py-2 space-y-8">
			<RadixRadioCard
				value="value"
				label="Radix Radio Card"
				defaultValue={selectedValue}
				onValueChange={setSelectedValue}
			/>
			<div>
				<h2 className="text-xl font-semibold mb-2">Size</h2>
				<p className="mb-4 text-gray-600">
					`size` prop을 사용해 크기를 조절할 수 있습니다.
				</p>

				<Flex gap="4" wrap="wrap" className="items-center">
					{cardData.map((card, index) => (
						<RadixRadioCard
							key={card.value}
							size={index === 0 ? '1' : index === 1 ? '2' : '3'}
							value={card.value}
							label={card.label}
							description={card.description}
							defaultValue={selectedValue}
							onValueChange={setSelectedValue}
						/>
					))}
				</Flex>
			</div>
		</div>
	);
};

export default RadioCardDemo;
