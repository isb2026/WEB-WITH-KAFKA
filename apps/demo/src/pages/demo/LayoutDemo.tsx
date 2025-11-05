import React from 'react';
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

const LayoutDemoPage: React.FC = () => {
  return (
    <div className="bg-gray-500 p-8 h-full flex flex-col items-center justify-center gap-10">
      {/* Structure Example */}
      <RadixContainer className="max-w-2xl mx-auto w-full bg-white p-6 rounded-lg shadow-md">
        <RadixHeader className="text-xl font-bold mb-4">헤더 (RadixHeader)</RadixHeader>
        <RadixNav className="mb-4 text-blue-600">탐색 (RadixNav)</RadixNav>
        <RadixMain className="mb-4">
          <RadixSection className="mb-2 p-2 bg-gray-100 rounded">
          섹션 (RadixSection)
          </RadixSection>
          <RadixArticle className="mb-2 p-2 bg-gray-50 rounded">
          기사 (RadixArticle)
          </RadixArticle>
          <RadixAside className="p-2 bg-gray-200 rounded">
          옆으로 (RadixAside)
          </RadixAside>
        </RadixMain>
        <RadixFooter className="mt-4 text-gray-500">푸터 (RadixFooter)</RadixFooter>
      </RadixContainer>

      {/* Aside + Main Layout Example */}
      <RadixContainer className="flex min-h-[300px] max-w-3xl w-full bg-gray-100 rounded shadow overflow-hidden">
        <RadixAside className="w-56 bg-white border-r p-4">
          <nav>
            <ul className="space-y-2">
              <li><a href="#" className="block px-2 py-1 rounded hover:bg-gray-200">메뉴 1</a></li>
              <li><a href="#" className="block px-2 py-1 rounded hover:bg-gray-200">메뉴 2</a></li>
              <li><a href="#" className="block px-2 py-1 rounded hover:bg-gray-200">메뉴 3</a></li>
            </ul>
          </nav>
        </RadixAside>
        <RadixMain className="flex-1 p-6">
          <h2 className="text-xl font-bold mb-4">주요 내용</h2>
          <p>이곳이 메인 영역입니다. 여기에 무엇이든 넣을 수 있습니다!</p>
        </RadixMain>
      </RadixContainer>
    </div>
  );
};

export default LayoutDemoPage; 