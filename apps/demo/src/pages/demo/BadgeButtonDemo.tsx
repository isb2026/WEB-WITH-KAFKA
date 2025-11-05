import React from 'react';
import { RadixBadgeComponent } from '@repo/radix-ui/components';

const BadgeComponentDemoPage: React.FC = () => {
  return (
    <div className="bg-gray-100 p-8 h-full flex items-center justify-center">
      <div className="max-w-md mx-auto w-full bg-white p-6 rounded-lg shadow-md text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-7">Badge Component Demo</h3>
        <div className="flex flex-col gap-4 items-center">
          <RadixBadgeComponent size="3" className="cursor-pointer">Default Badge</RadixBadgeComponent>
          <RadixBadgeComponent variant="solid" size="3" className="cursor-pointer" >Solid Badge</RadixBadgeComponent>
          <RadixBadgeComponent variant="outline" size="3" className="cursor-pointer">Outline Badge</RadixBadgeComponent>
          <RadixBadgeComponent size="3" className="cursor-pointer">Large Badge</RadixBadgeComponent>
          <RadixBadgeComponent radius="full" size="3" className="cursor-pointer">Pill Badge</RadixBadgeComponent>
        </div>
        <div className="mt-6 text-gray-600 text-sm">
          다양한 Badge 스타일을 확인하세요. (No className, minimal wrapper)
        </div>
      </div>
    </div>
  );
};

export default BadgeComponentDemoPage;
