import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import RadioCardDemo from './demo/RadioCardDemo';

const RadioCardDemoWithCodePage: React.FC = () => {
	const codeString =
		`import { Flex, RadixRadioCard } from '@repo/radix-ui/components';
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
					\`size\` prop을 사용해 크기를 조절할 수 있습니다.
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
`.trim();

	return (
		<div className="min-h-screen w-full bg-gray-50 px-4 py-10">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					Radio Cards 컴포넌트 예제
				</h1>
				<p className="text-sm text-gray-500 mb-6">
					한 번에 하나만 선택할 수 있는 인터랙티브 카드 세트 한 번에
					하나만 선택할 수 있는 인터랙티브 카드 세트입니다.
				</p>

				<PreviewCodeTabs
					preview={<RadioCardDemo />}
					code={
						<pre className="bg-gray-200 p-4 text-sm rounded overflow-x-auto whitespace-pre-wrap">
							{codeString}
						</pre>
					}
				/>
			</div>
		</div>
	);
};

export default RadioCardDemoWithCodePage;
