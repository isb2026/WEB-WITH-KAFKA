import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import TabsDemoPage from './demo/TabsDemo';

const TabsDemoWithCodePage: React.FC = () => {
	const codeString = `
<RadixTabsRoot
  defaultValue="tab1"
  className="flex w-full flex-col bg-white shadow-md"
>
  <RadixTabsList
    className="flex border-b border-mauve6"
    aria-label="Demo Tabs"
  >
    {['tab1', 'tab2', 'tab3'].map((tab, index) => (
      <RadixTabsTrigger
        key={tab}
        value={tab}
        className="flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-white px-5 text-[15px] leading-none text-mauve11 outline-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black"
      >
        Tab {index + 1}
      </RadixTabsTrigger>
    ))}
  </RadixTabsList>

  {['tab1', 'tab2', 'tab3'].map((tab, index) => (
    <RadixTabsContent
      key={tab}
      value={tab}
      className="grow p-5 outline-none"
    >
      <p className="text-gray-700 text-sm">
        This is the content for <strong>Tab {index + 1}</strong>.
      </p>
    </RadixTabsContent>
  ))}
</RadixTabsRoot>
  `.trim();

	return (
		<div className="min-h-screen w-full bg-gray-50 px-4 py-10">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					Tabs 컴포넌트 예제
				</h1>
				<p className="text-sm text-gray-500 mb-6">
					아래는 Radix Tabs 컴포넌트의 사용 예시입니다. Preview 탭에서
					결과를, Code 탭에서 코드를 확인할 수 있습니다.
				</p>

				<PreviewCodeTabs
					preview={<TabsDemoPage />}
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

export default TabsDemoWithCodePage;
