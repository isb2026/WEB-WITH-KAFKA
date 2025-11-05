import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import DraggableDialogDemo from './demo/DraggableDialogDemo';

const DraggableDialogDemoWithCodePage: React.FC = () => {
	const codeString = `import {
	RadixButton,
	Button,
	DraggableDialog,
} from '@repo/radix-ui/components';
import React, { useState } from 'react';

// DateRangeInput component (unchanged)
const DateRangeInput = ({ start, end }: { start: string; end: string }) => (
	<div className="flex gap-2 w-full">
		<div className="relative w-full">
			<input
				type="date"
				defaultValue={start}
				className="w-full p-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
		<span className="self-center">-</span>
		<div className="relative w-full">
			<input
				type="date"
				defaultValue={end}
				className="w-full p-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
	</div>
);

// FormContent component (unchanged)
const FormContent = () => (
	<div>
		<div className="grid gap-y-6 w-full px-8">
			<div className="grid grid-cols-[120px_1fr] items-center gap-x-4">
				<label className="text-sm text-gray-700">사용자명</label>
				<input
					type="text"
					placeholder="입력해주세요"
					className="w-full p-1.5 border focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
				/>
			</div>
			<div className="grid grid-cols-[120px_1fr] items-center gap-x-4">
				<label className="text-sm text-gray-700">계정아이디</label>
				<input
					type="text"
					placeholder="입력해주세요"
					className="w-full p-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
			<div className="grid grid-cols-[120px_1fr] items-center gap-x-4">
				<label className="text-sm text-gray-700">업체</label>
				<div className="flex gap-2 w-full">
					<select className="w-1/3 p-1.5 border rounded-lg">
						<option># 업체코드</option>
						<option># 업체코드</option>
						<option># 업체코드</option>
						<option># 업체코드</option>
					</select>
					<input
						type="text"
						placeholder="업체명"
						className="w-2/3 p-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>
			<div className="grid grid-cols-[120px_1fr] items-center gap-x-4">
				<label className="text-sm text-gray-700">입사일</label>
				<DateRangeInput start="2025-01-10" end="2025-01-10" />
			</div>
			<div className="grid grid-cols-[120px_1fr] items-center gap-x-4">
				<label className="text-sm text-gray-700">퇴사일</label>
				<DateRangeInput start="2025-01-10" end="2025-01-10" />
			</div>
		</div>
		<div className="flex justify-start mt-8">
			<RadixButton className="bg-[#6A53B1]">검색(F8)</RadixButton>
		</div>
	</div>
);

// InfoContent component (unchanged)
const InfoContent = () => (
	<div className="space-y-4">
		<p>This is an informational dialog with some sample content.</p>
		<ul className="list-disc pl-5">
			<li>Item 1</li>
			<li>Item 2</li>
			<li>Item 3</li>
		</ul>
		<Button className="bg-green-500 text-white hover:bg-green-600">
			Acknowledge
		</Button>
	</div>
);

// SearchResultsContent component (unchanged)
const SearchResultsContent = ({ query }: { query: string }) => (
	<div className="space-y-4">
		<p>
			Search results for: <strong>{query}</strong>
		</p>
		<ul className="list-disc pl-5">
			<li>Result 1 for {query}</li>
			<li>Result 2 for {query}</li>
			<li>Result 3 for {query}</li>
		</ul>
		<div>
			<RadixButton className="bg-[#6A53B1] mt-4">
				알갰입니다😀
			</RadixButton>
		</div>
	</div>
);

const DraggableDialogDemo: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' && searchQuery.trim()) {
			event.preventDefault();
			setIsSearchDialogOpen(true);
		}
	};

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			{/* Example 1: Form Dialog */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold text-gray-800">
					Form Dialog
				</h2>
				<DraggableDialog
					title="품목검색"
					content={<FormContent />}
					trigger={
						<Button className="bg-blue-500 text-white hover:bg-blue-600">
							Open Form Dialog
						</Button>
					}
					defaultPosition={{ x: 0, y: 0 }}
				/>
			</div>

			{/* Example 2: Information Dialog */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold text-gray-800">
					Information Dialog
				</h2>
				<DraggableDialog
					title="Information"
					content={<InfoContent />}
					trigger={
						<Button className="bg-green-500 text-white hover:bg-green-600">
							Open Info Dialog
						</Button>
					}
					defaultPosition={{ x: 100, y: 100 }}
				/>
			</div>

			{/* Example 3: Minimal Dialog */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold text-gray-800">
					Minimal Dialog
				</h2>
				<DraggableDialog
					title="Minimal Dialog"
					content={
						<p>This is a minimal dialog with only text content.</p>
					}
					trigger={
						<Button className="bg-purple-500 text-white hover:bg-purple-600">
							Open Minimal Dialog
						</Button>
					}
					defaultPosition={{ x: 150, y: 150 }}
				/>
			</div>

			{/* Example 4:  Dialog (Press Enter) */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold text-gray-800">
					Search Dialog (Press Enter)
				</h2>
				<input
					type="text"
					placeholder="Type something and press Enter..."
					defaultValue={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onKeyDown={handleKeyDown}
					className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				{isSearchDialogOpen && (
					<DraggableDialog
						title="Search Results"
						content={<SearchResultsContent query={searchQuery} />}
						open={isSearchDialogOpen}
						onOpenChange={setIsSearchDialogOpen}
					/>
				)}
			</div>
		</div>
	);
};

export default DraggableDialogDemo;
`.trim();

	return (
		<div className="min-h-screen w-full bg-gray-50 px-4 py-10">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					Draggable Dialog 컴포넌트 예제
				</h1>
				<p className="text-sm text-gray-500 mb-6"></p>
				기본 창 또는 다른 대화 상자 창에 겹쳐진 창 창에 오버레이되어 그
				아래의 콘텐츠가 비활성 상태로 렌더링됩니다.
				<PreviewCodeTabs
					preview={<DraggableDialogDemo />}
					code={
						<pre className="bg-gray-200 p-4 text-sm rounded overflow-x-auto whitespace-pre-wrap">
							{codeString}
						</pre>
					}
				/>
			</div>
		</div>
	);
};

export default DraggableDialogDemoWithCodePage;
