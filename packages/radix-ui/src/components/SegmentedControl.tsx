import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import type { ToggleGroupSingleProps, ToggleGroupMultipleProps, ToggleGroupItemProps } from '@radix-ui/react-toggle-group';
// import React from 'react';

const selectedSegmentClass =
  'data-[state=on]:ring-2 data-[state=on]:ring-blue-500 data-[state=on]:bg-gray-800 data-[state=on]:text-white';
const baseSegmentClass =
  'px-4 py-2 rounded-md transition-colors duration-150 text-sm text-gray-200 bg-transparent hover:bg-gray-800 focus:outline-none';

export const SegmentedControl = ({ children, ...props }: ToggleGroupSingleProps | ToggleGroupMultipleProps) => (
  <div className="bg-[#18181b] rounded-xl p-2 flex justify-center">
    <ToggleGroupPrimitive.Root className="flex gap-x-2" {...props}>
      {children}
    </ToggleGroupPrimitive.Root>
  </div>
);

export const SegmentedControlItem = ({ children, ...props }: ToggleGroupItemProps) => (
  <ToggleGroupPrimitive.Item className={`${baseSegmentClass} ${selectedSegmentClass}`} {...props}>
    {children}
  </ToggleGroupPrimitive.Item>
); 