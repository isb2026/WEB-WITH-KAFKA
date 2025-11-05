import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import SpinnerDemo from './demo/SpinnerDemo';

const SpinnerDemoWithCodePage: React.FC = () => {
	const codeString =
		`import { RadixSpinner } from '@repo/radix-ui/components';
	import React from 'react';
	
	const SpinnerDemo: React.FC = () => (
		<div className="py-4 space-y-8">
			<div>
				<h2 className="text-xl font-semibold mb-4">Spinner</h2>
				<RadixSpinner />
			</div>
	
			<div>
				<h2 className="text-xl font-semibold mb-2">Size</h2>
				<p className="mb-4 text-gray-600">
					이 컴포넌트는 \`size\` 프로퍼티를 사용하여 크기가 다른 여러 개의
					스피너를 표시합니다.
				</p>
				<div className="flex items-center gap-4">
					{[1, 2, 3].map((_, i) => (
						<RadixSpinner
							key={i}
							size={String(i + 1) as '1' | '2' | '3'}
						/>
					))}
				</div>
			</div>
		</div>
	);
	
	export default SpinnerDemo;
	`.trim();

	return (
		<div className="min-h-screen w-full bg-gray-50 px-4 py-10">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					Spiner 컴포넌트 예제
				</h1>
				<p className="text-sm text-gray-500 mb-6">
					애니메이션 로딩 표시기를 표시합니다.
				</p>

				<PreviewCodeTabs
					preview={<SpinnerDemo />}
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

export default SpinnerDemoWithCodePage;
