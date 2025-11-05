import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import IconButtonDemoPage from './demo/IconButtonDemo';

const codeString = `import React from 'react';
import { RadixIconButton } from '@repo/radix-ui/components';

const IconButtonDemo = () => (
  <>
    <RadixIconButton aria-label="Add">
      <svg width="24" height="24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </RadixIconButton>
    <RadixIconButton aria-label="Edit">
      <svg width="24" height="24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6" />
      </svg>
    </RadixIconButton>
    <RadixIconButton aria-label="Delete">
      <svg width="24" height="24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </RadixIconButton>
  </>
);
`;

const IconButtonDemoWithCodePage: React.FC = () => (
  <div className="min-h-screen w-full bg-gray-50 px-4 py-10">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Icon Button 컴포넌트 예제</h1>
      <p className="text-sm text-gray-500 mb-6">
        아래는 Radix Icon Button 컴포넌트의 사용 예시입니다. Preview 탭에서 결과를, Code 탭에서 코드를 확인할 수 있습니다.
      </p>
      <PreviewCodeTabs
        preview={<IconButtonDemoPage />}
        code={
          <pre className="bg-gray-200 p-4 text-sm rounded overflow-x-auto whitespace-pre-wrap">
            {codeString}
          </pre>
        }
      />
    </div>
  </div>
);

export default IconButtonDemoWithCodePage; 