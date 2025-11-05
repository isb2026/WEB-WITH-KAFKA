import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import LayoutDemoPage from './demo/LayoutDemo';

const codeString = `import React from 'react';
import {
  RadixContainer,
  RadixMain,
  RadixSection,
  RadixHeader,
  RadixFooter,
  RadixNav,
  RadixAside,
  RadixArticle,
} from '@repo/radix-ui/components';

// Structure Example
const StructureExample = () => (
  <RadixContainer>
    <RadixHeader>Header (RadixHeader)</RadixHeader>
    <RadixNav>Navigation (RadixNav)</RadixNav>
    <RadixMain>
      <RadixSection>Section (RadixSection)</RadixSection>
      <RadixArticle>Article (RadixArticle)</RadixArticle>
      <RadixAside>Aside (RadixAside)</RadixAside>
    </RadixMain>
    <RadixFooter>Footer (RadixFooter)</RadixFooter>
  </RadixContainer>
);

// Aside + Main Layout Example
const AsideMainExample = () => (
  <RadixContainer className="flex min-h-[300px] max-w-3xl w-full bg-gray-100 rounded shadow overflow-hidden">
    <RadixAside className="w-56 bg-white border-r p-4">
      <nav>
        <ul className="space-y-2">
          <li><a href="#" className="block px-2 py-1 rounded hover:bg-gray-200">Menu 1</a></li>
          <li><a href="#" className="block px-2 py-1 rounded hover:bg-gray-200">Menu 2</a></li>
          <li><a href="#" className="block px-2 py-1 rounded hover:bg-gray-200">Menu 3</a></li>
        </ul>
      </nav>
    </RadixAside>
    <RadixMain className="flex-1 p-6">
      <h2 className="text-xl font-bold mb-4">Main Content</h2>
      <p>This is the main area. You can put anything here!</p>
    </RadixMain>
  </RadixContainer>
);
`;

const LayoutDemoWithCodePage: React.FC = () => (
  <div className="min-h-screen w-full bg-gray-50 px-4 py-10">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Layout 컴포넌트 예제</h1>
      <p className="text-sm text-gray-500 mb-6">
        아래는 Radix Layout 컴포넌트의 사용 예시입니다. Preview 탭에서 결과를, Code 탭에서 코드를 확인할 수 있습니다.
      </p>
      <PreviewCodeTabs
        preview={<LayoutDemoPage />}
        code={
          <pre className="bg-gray-200 p-4 text-sm rounded overflow-x-auto whitespace-pre-wrap">
            {codeString}
          </pre>
        }
      />
    </div>
  </div>
);

export default LayoutDemoWithCodePage; 