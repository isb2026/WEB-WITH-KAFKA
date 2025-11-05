import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import DatalistDemoPage from './demo/DatalistDemo';

const codeString = `import React, { useState } from 'react';
import { RadixDatalist } from '@repo/radix-ui/components';

const fruits = ['Apple', 'Banana', 'Cherry', 'Grape', 'Orange', 'Peach', 'Strawberry'];

const DatalistDemo = () => {
  const [value, setValue] = useState('');

  return (
    <>
      <input
        list="fruits"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Choose a fruit..."
      />
      <RadixDatalist id="fruits">
        {fruits.map(fruit => (
          <option value={fruit} key={fruit} />
        ))}
      </RadixDatalist>
      <div>Selected: {value}</div>
    </>
  );
};
`;

const DatalistDemoWithCodePage: React.FC = () => (
  <div className="min-h-screen w-full bg-gray-50 px-4 py-10">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Datalist 컴포넌트 예제</h1>
      <p className="text-sm text-gray-500 mb-6">
        아래는 Radix Datalist 컴포넌트의 사용 예시입니다. Preview 탭에서 결과를, Code 탭에서 코드를 확인할 수 있습니다.
      </p>
      <PreviewCodeTabs
        preview={<DatalistDemoPage />}
        code={
          <pre className="bg-gray-200 p-4 text-sm rounded overflow-x-auto whitespace-pre-wrap">
            {codeString}
          </pre>
        }
      />
    </div>
  </div>
);

export default DatalistDemoWithCodePage; 