import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import BadgeComponentDemoPage from './demo/BadgeButtonDemo';

const codeString = `import React from 'react';
import { RadixBadgeComponent } from '@repo/radix-ui/components';

const BadgeComponentDemo = () => (
  <div className="flex flex-col gap-4 items-center">
    <RadixBadgeComponent>Default Badge</RadixBadgeComponent>
    <RadixBadgeComponent variant="solid">Solid Badge</RadixBadgeComponent>
    <RadixBadgeComponent variant="outline">Outline Badge</RadixBadgeComponent>
    <RadixBadgeComponent size="2">Large Badge</RadixBadgeComponent>
    <RadixBadgeComponent radius="full">Pill Badge</RadixBadgeComponent>
  </div>
);
`;

const BadgeButtonCodeDemoPage: React.FC = () => (
  <div className="min-h-screen w-full bg-gray-50 px-4 py-10">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Badge Component Demo</h1>
      <p className="text-sm text-gray-500 mb-6">
        아래는 Radix Badge Component의 사용 예시입니다. Preview 탭에서 결과를, Code 탭에서 코드를 확인할 수 있습니다.
      </p>
      <PreviewCodeTabs
        preview={<BadgeComponentDemoPage />}
        code={
          <pre className="bg-gray-200 p-4 text-sm rounded overflow-x-auto whitespace-pre-wrap">
            {codeString}
          </pre>
        }
      />
    </div>
  </div>
);

export default BadgeButtonCodeDemoPage;
