import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import HeadingDemoPage from './demo/HeadingDemo';

const HeadingDemoWithCodePage: React.FC = () => {
	const codeString = `
				<div className="max-w-xl mx-auto w-full flex flex-col">
	<RadixHeading as="h1">Heading Level 1</RadixHeading>
	<RadixHeading as="h2">Heading Level 2</RadixHeading>
	<RadixHeading as="h3">Heading Level 3</RadixHeading>
	<RadixHeading as="h4">Heading Level 4</RadixHeading>
	<RadixHeading as="h5">Heading Level 5</RadixHeading>
	<RadixHeading as="h6">Heading Level 6</RadixHeading>
</div>`.trim();

	return (
		<div className="min-h-screen w-fullpx-4 py-10">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					Heading 컴포넌트 예제
				</h1>
				<p className="text-sm text-gray-500 mb-6">
					아래는 Radix Heading 컴포넌트의 사용 예시입니다. Preview
					탭에서 결과를, Code 탭에서 실제 JSX 코드를 확인할 수
					있습니다.
				</p>

				<PreviewCodeTabs
					preview={<HeadingDemoPage />}
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

export default HeadingDemoWithCodePage;
