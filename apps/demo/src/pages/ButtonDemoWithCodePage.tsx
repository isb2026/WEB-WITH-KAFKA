import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import ButtonDemoPage from './demo/ButtonDemo';

const ButtonDemoWithCodePage: React.FC = () => {
	const codeString = `
import React, { useState } from 'react';
import { RadixButton } from '@repo/radix-ui/components';

const ButtonDemo = () => {
	const [loading, setLoading] = useState(false);

	const handleLoadingClick = () => {
		setLoading(true);
		setTimeout(() => setLoading(false), 2000);
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{/* Default Button */}
			<div className="bg-white p-6 rounded-lg shadow-md text-center">
				<h3 className="text-lg font-semibold mb-4">Default Button</h3>
				<div className="flex justify-center">
					<RadixButton className="bg-blue-600 text-white hover:bg-blue-700">
						Click me
					</RadixButton>
				</div>
			</div>

			{/* Color Variants */}
			<div className="bg-white p-6 rounded-lg shadow-md text-center">
				<h3 className="text-lg font-semibold mb-4">Color Variants</h3>
				<div className="flex flex-col space-y-2">
					<RadixButton className="bg-red-600 text-white hover:bg-red-700">
						Red Button
					</RadixButton>
					<RadixButton className="bg-green-600 text-white hover:bg-green-700">
						Green Button
					</RadixButton>
					<RadixButton className="bg-purple-600 text-white hover:bg-purple-700">
						Purple Button
					</RadixButton>
				</div>
			</div>

			{/* Button with Icons */}
			<div className="bg-white p-6 rounded-lg shadow-md text-center">
				<h3 className="text-lg font-semibold mb-4">With Icons</h3>
				<div className="flex flex-col space-y-2">
					<RadixButton className="bg-blue-600 text-white hover:bg-blue-700">
						<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
						</svg>
						Add Item
					</RadixButton>
					<RadixButton className="bg-gray-600 text-white hover:bg-gray-700">
						<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
						</svg>
						View Details
					</RadixButton>
				</div>
			</div>

			{/* Loading Button */}
			<div className="bg-white p-6 rounded-lg shadow-md text-center">
				<h3 className="text-lg font-semibold mb-4">Loading State</h3>
				<div className="flex justify-center">
					<RadixButton 
						className="bg-blue-600 text-white hover:bg-blue-700"
						loading={loading}
						onClick={handleLoadingClick}
					>
						{loading ? 'Loading...' : 'Click to Load'}
					</RadixButton>
				</div>
			</div>

			{/* Size Variants */}
			<div className="bg-white p-6 rounded-lg shadow-md text-center">
				<h3 className="text-lg font-semibold mb-4">Size Variants</h3>
				<div className="flex flex-col space-y-2">
					<RadixButton className="bg-blue-600 text-white hover:bg-blue-700 h-8 px-3 text-xs">
						Small
					</RadixButton>
					<RadixButton className="bg-blue-600 text-white hover:bg-blue-700 h-10 px-4">
						Default
					</RadixButton>
					<RadixButton className="bg-blue-600 text-white hover:bg-blue-700 h-12 px-6 text-lg">
						Large
					</RadixButton>
				</div>
			</div>
		</div>
	);
};
  `.trim();

	return (
		<div className="min-h-screen w-full bg-gray-50 px-4 py-10">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					Button 컴포넌트 예제
				</h1>
				<p className="text-sm text-gray-500 mb-6">
					아래는 Radix Button 컴포넌트의 사용 예시입니다. Preview 탭에서
					결과를, Code 탭에서 코드를 확인할 수 있습니다.
				</p>

				<PreviewCodeTabs
					preview={<ButtonDemoPage />}
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

export default ButtonDemoWithCodePage; 