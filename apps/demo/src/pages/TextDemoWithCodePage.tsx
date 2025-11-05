import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import TextDemoPage from './demo/TextDemo';

const TextDemoWithCodePage: React.FC = () => {
	const codeString = `<div className="max-w-xl mx-auto w-full flex flex-col">
    {/* 기본 span */}
    <RadixText>This is default span text.</RadixText>

    {/* div 로 변경 */}
    <RadixText as="div">Rendered as div tag.</RadixText>

    {/* label로 변경 */}
    <RadixText as="label" htmlFor="input-field">
        Label Text:
    </RadixText>

    {/* truncate 적용 */}
    <div style={{ width: '250px' }}>
        <RadixText truncate>
            This is a very long text that will be truncated with
            ellipsis if it exceeds the container width. Lorem ipsum
            dolor sit amet.
        </RadixText>
    </div>

    {/* asChild 사용 */}
    <RadixText asChild>
        <a
            href="https://radix-ui.com"
            target="_blank"
            rel="noopener noreferrer"
        >
            Go to Radix UI (asChild)
        </a>
    </RadixText>
</div>`.trim();

	return (
		<div className="min-h-screen w-fullpx-4 py-10">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					Text 컴포넌트 예제
				</h1>
				<p className="text-sm text-gray-500 mb-6">
					아래는 Radix Text 컴포넌트의 사용 예시입니다. Preview 탭에서
					결과를, Code 탭에서 실제 JSX 코드를 확인할 수 있습니다.
				</p>

				<PreviewCodeTabs
					preview={<TextDemoPage />}
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

export default TextDemoWithCodePage;
