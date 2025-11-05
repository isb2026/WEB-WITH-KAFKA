import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import SegmentedControlComponentDemoPage from './demo/SegmentedControlComponentDemo';

const codeString = `import React, { useState } from 'react';
import { RadixSegmentedControlRoot, RadixSegmentedControlItem } from '@repo/radix-ui/components';

const SegmentedControlComponentDemo = () => {
  const [singleValue, setSingleValue] = useState('center');
  const [multiValue, setMultiValue] = useState(['bold']);

  return (
    <>
      {/* Single selection */}
      <RadixSegmentedControlRoot
        type="single"
        value={singleValue}
        onValueChange={setSingleValue}
        aria-label="Text alignment"
      >
        <RadixSegmentedControlItem value="left" aria-label="Left aligned">Left</RadixSegmentedControlItem>
        <RadixSegmentedControlItem value="center" aria-label="Center aligned">Center</RadixSegmentedControlItem>
        <RadixSegmentedControlItem value="right" aria-label="Right aligned">Right</RadixSegmentedControlItem>
      </RadixSegmentedControlRoot>
      <div>Selected: {singleValue}</div>

      {/* Multiple selection */}
      <RadixSegmentedControlRoot
        type="multiple"
        value={multiValue}
        onValueChange={setMultiValue}
        aria-label="Formatting"
      >
        <RadixSegmentedControlItem value="bold" aria-label="Bold">Bold</RadixSegmentedControlItem>
        <RadixSegmentedControlItem value="italic" aria-label="Italic">Italic</RadixSegmentedControlItem>
        <RadixSegmentedControlItem value="underline" aria-label="Underline">Underline</RadixSegmentedControlItem>
      </RadixSegmentedControlRoot>
      <div>Selected: {multiValue.join(', ')}</div>
    </>
  );
};
`;

const SegmentedControlComponentCodeDemoPage: React.FC = () => (
  <div className="min-h-screen w-full bg-gray-50 px-4 py-10">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Segmented Control (ToggleGroup) Demo</h1>
      <p className="text-sm text-gray-500 mb-6">
        아래는 Radix Segmented Control(ToggleGroup) 컴포넌트의 사용 예시입니다. Preview 탭에서 결과를, Code 탭에서 코드를 확인할 수 있습니다.
      </p>
      <PreviewCodeTabs
        preview={<SegmentedControlComponentDemoPage />}
        code={
          <pre className="bg-gray-200 p-4 text-sm rounded overflow-x-auto whitespace-pre-wrap">
            {codeString}
          </pre>
        }
      />
    </div>
  </div>
);

export default SegmentedControlComponentCodeDemoPage; 