import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import PopoverDemo from './demo/PopoverDemo';

const PopoverDemoWithCodePage: React.FC = () => {
	const codeString = `import React from 'react';
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
`.trim();

	return (
		<div className="min-h-screen w-full bg-gray-50 px-4 py-10">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					Popover 컴포넌트 예제
				</h1>
				<p className="text-sm text-gray-500 mb-6">
					버튼으로 트리거되는 리치 콘텐츠를 표시하는 플로팅
					요소입니다.
				</p>

				<PreviewCodeTabs
					preview={<PopoverDemo />}
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

export default PopoverDemoWithCodePage;
