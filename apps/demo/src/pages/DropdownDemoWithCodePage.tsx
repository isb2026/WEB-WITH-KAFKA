import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import DropdownDemo from './demo/DropdownDemo';

const codeString = `import React from 'react';
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuTriggerIcon,
} from '@repo/radix-ui/components';

const menuItems = [
  { label: '기초', icon: (<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /></svg>), shortcut: '⌘K→P' },
  { label: '영업', icon: (<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2 4 4 8-8 2 2-10 10z" strokeWidth="2" /></svg>), shortcut: '⌘S' },
  { label: '구매', icon: (<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m4 0h-1v-4h-1" strokeWidth="2" /></svg>), shortcut: '?' },
  { separator: true },
  { label: '원소재', icon: (<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" /></svg>), shortcut: '⌘K→C' },
  { label: '외주', icon: (<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path d="M8 12h8" strokeWidth="2" /></svg>), shortcut: '⌘K→T' },
  { label: '생산', icon: (<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" strokeWidth="2" /></svg>), shortcut: '⌘H' },
  { separator: true },
  { label: '설비', icon: (<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" strokeWidth="2" /></svg>) },
  { label: '금형', icon: (<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><circle cx="12" cy="12" r="4" strokeWidth="2" /></svg>) },
  { label: '품질', icon: (<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" /><path d="M8 12h8" strokeWidth="2" /></svg>) },
  { label: '재고', icon: (<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" strokeWidth="2" /><circle cx="12" cy="12" r="2" strokeWidth="2" /></svg>) },
];

const TriggerIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" aria-hidden="true"><path d="M7 8l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const TriggerMenuIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12M4 6h12M4 14h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export default function DropdownDemo() {
  return (
    <div className="flex justify-center items-center min-h-[300px]">
      <DropdownMenuRoot>
        <DropdownMenuTrigger asChild>
          <button type="button" className="flex items-center w-56 justify-between px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900">
            <span className="flex items-center gap-2">
              <TriggerMenuIcon />
              영업
            </span>
            <TriggerIcon />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={4} align="start" className="w-56 bg-white border rounded-xl shadow-lg py-2 px-1">
          {menuItems.map((item, idx) =>
            item.separator ? (
              <DropdownMenuSeparator key={idx} className="my-1" />
            ) : (
              <DropdownMenuItem key={item.label} className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer text-gray-900 hover:bg-gray-100">
                <span className="flex items-center w-6 justify-center">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.shortcut && (
                  <span className="ml-auto text-xs text-gray-400 font-mono">{item.shortcut}</span>
                )}
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenuRoot>
    </div>
  );
}
`;

const DropdownDemoWithCodePage: React.FC = () => (
	<div className="min-h-screen w-full bg-gray-50 px-4 py-10">
		<div className="max-w-3xl mx-auto">
			<h1 className="text-2xl font-bold text-gray-800 mb-2">
				Dropdown 컴포넌트 예제
			</h1>
			<p className="text-sm text-gray-500 mb-6">
				아래는 Radix Dropdown 컴포넌트의 사용 예시입니다. Preview 탭에서
				결과를, Code 탭에서 코드를 확인할 수 있습니다.
			</p>
			<PreviewCodeTabs
				preview={<DropdownDemo />}
				code={
					<pre className="bg-gray-200 p-4 text-sm rounded overflow-x-auto whitespace-pre-wrap">
						{codeString}
					</pre>
				}
			/>
		</div>
	</div>
);

export default DropdownDemoWithCodePage;
