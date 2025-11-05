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

export default TooltipDemo; 