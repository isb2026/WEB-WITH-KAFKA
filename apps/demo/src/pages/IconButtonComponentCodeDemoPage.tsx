import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import IconButtonComponentDemoPage from './demo/IconButtonComponentDemo';

const codeString = `import React, { useState } from 'react';
import { RadixIconButtonComponent } from '@repo/radix-ui/components';

const IconButtonComponentDemo = () => {
  const [loadingStates, setLoadingStates] = useState([false, false, false, false]);

  const handleClick = (index) => {
    setLoadingStates((prev) => {
      const newStates = [...prev];
      newStates[index] = true;
      return newStates;
    });
    setTimeout(() => {
      setLoadingStates((prev) => {
        const newStates = [...prev];
        newStates[index] = false;
        return newStates;
      });
    }, 5000);
  };

  return (
    <div className="space-y-4">
      {/* Primary button with spinner */}
      <RadixIconButtonComponent 
        loading={loadingStates[0]}
        onClick={() => handleClick(0)}
        className="flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className="ml-2">Add Item</span>
      </RadixIconButtonComponent>

      {/* Secondary button with spinner */}
      <RadixIconButtonComponent 
        loading={loadingStates[1]}
        onClick={() => handleClick(1)}
        className="flex items-center justify-center px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="ml-2">Refresh</span>
      </RadixIconButtonComponent>

      {/* Success button with spinner */}
      <RadixIconButtonComponent 
        loading={loadingStates[2]}
        onClick={() => handleClick(2)}
        className="flex items-center justify-center px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="ml-2">Save</span>
      </RadixIconButtonComponent>

      {/* Icon-only button with spinner */}
      <RadixIconButtonComponent 
        loading={loadingStates[3]}
        onClick={() => handleClick(3)}
        className="flex items-center justify-center p-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Settings"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </RadixIconButtonComponent>
    </div>
  );
};
`;

const IconButtonComponentCodeDemoPage: React.FC = () => (
  <div className="min-h-screen w-full bg-gray-50 px-4 py-10">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Icon Button Component with Spinner</h1>
      <p className="text-sm text-gray-500 mb-6">
        아래는 Radix Icon Button Component with Spinner의 사용 예시입니다. Preview 탭에서 결과를, Code 탭에서 코드를 확인할 수 있습니다.
      </p>
      <PreviewCodeTabs
        preview={<IconButtonComponentDemoPage />}
        code={
          <pre className="bg-gray-200 p-4 text-sm rounded overflow-x-auto whitespace-pre-wrap">
            {codeString}
          </pre>
        }
      />
    </div>
  </div>
);

export default IconButtonComponentCodeDemoPage;
