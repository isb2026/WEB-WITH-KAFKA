import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import TooltipDemoPage from './demo/TooltipDemo';

const codeString = `import React from 'react';
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from '@repo/radix-ui/components';

const TooltipDemo = () => (
  <TooltipProvider>
    <div className="flex flex-col items-center gap-8 py-12">
      <TooltipRoot>
        <TooltipTrigger asChild>
          <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Hover me</button>
        </TooltipTrigger>
        <TooltipContent sideOffset={5} className="bg-white text-gray-900 px-3 py-2 rounded shadow text-sm border">
          Tooltip on button
          <TooltipArrow className="fill-white" />
        </TooltipContent>
      </TooltipRoot>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <span className="underline text-blue-600 cursor-pointer">Hover this text</span>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5} className="bg-white text-gray-900 px-3 py-2 rounded shadow text-sm border">
          Tooltip on text
          <TooltipArrow className="fill-white" />
        </TooltipContent>
      </TooltipRoot>
    </div>
  </TooltipProvider>
);
`;

const TooltipDemoWithCodePage: React.FC = () => (
  <div className="min-h-screen w-full bg-gray-50 px-4 py-10">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Tooltip 컴포넌트 예제</h1>
      <p className="text-sm text-gray-500 mb-6">
        아래는 Radix Tooltip 컴포넌트의 사용 예시입니다. Preview 탭에서 결과를, Code 탭에서 코드를 확인할 수 있습니다.
      </p>
      <PreviewCodeTabs
        preview={<TooltipDemoPage />}
        code={
          <pre className="bg-gray-200 p-4 text-sm rounded overflow-x-auto whitespace-pre-wrap">
            {codeString}
          </pre>
        }
      />
    </div>
  </div>
);

export default TooltipDemoWithCodePage; 