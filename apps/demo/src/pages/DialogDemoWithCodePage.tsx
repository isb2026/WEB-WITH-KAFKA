import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import DialogDemoPage from './demo/DialogDemo';

const DialogDemoWithCodePage: React.FC = () => {
	const codeString = `
import React, { useState } from 'react';
import {
	RadixDialogRoot,
	RadixDialogTrigger,
	RadixDialogPortal,
	RadixDialogOverlay,
	RadixDialogContent,
	RadixDialogTitle,
	RadixDialogDescription,
	RadixDialogClose,
} from '@repo/radix-ui/components';

const DialogDemo = () => {
	const [open1, setOpen1] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [open3, setOpen3] = useState(false);

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			{/* Basic Dialog */}
			<div className="bg-white p-6 rounded-lg shadow-md text-center">
				<h3 className="text-lg font-semibold mb-4">Basic Dialog</h3>
				<RadixDialogRoot open={open1} onOpenChange={setOpen1}>
					<RadixDialogTrigger asChild>
						<button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
							Open Basic Dialog
						</button>
					</RadixDialogTrigger>
					<RadixDialogPortal>
						<RadixDialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
						<RadixDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg min-w-[400px]">
							<RadixDialogTitle className="text-xl font-semibold mb-2">
								Basic Dialog
							</RadixDialogTitle>
							<RadixDialogDescription className="text-gray-600 mb-4">
								This is a simple dialog with basic styling and functionality.
							</RadixDialogDescription>
							<div className="flex justify-end space-x-2">
								<RadixDialogClose asChild>
									<button className="px-4 py-2 text-gray-600 hover:text-gray-800">
										Cancel
									</button>
								</RadixDialogClose>
								<RadixDialogClose asChild>
									<button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
										Confirm
									</button>
								</RadixDialogClose>
							</div>
						</RadixDialogContent>
					</RadixDialogPortal>
				</RadixDialogRoot>
			</div>

			{/* Warning Dialog */}
			<div className="bg-white p-6 rounded-lg shadow-md text-center">
				<h3 className="text-lg font-semibold mb-4">Warning Dialog</h3>
				<RadixDialogRoot open={open2} onOpenChange={setOpen2}>
					<RadixDialogTrigger asChild>
						<button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">
							Delete Item
						</button>
					</RadixDialogTrigger>
					<RadixDialogPortal>
						<RadixDialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
						<RadixDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg min-w-[400px] border-l-4 border-red-500">
							<RadixDialogTitle className="text-xl font-semibold mb-2 text-red-700">
								⚠️ Delete Confirmation
							</RadixDialogTitle>
							<RadixDialogDescription className="text-gray-600 mb-4">
								Are you sure you want to delete this item? This action cannot be undone.
							</RadixDialogDescription>
							<div className="flex justify-end space-x-2">
								<RadixDialogClose asChild>
									<button className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded">
										Cancel
									</button>
								</RadixDialogClose>
								<RadixDialogClose asChild>
									<button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
										Delete
									</button>
								</RadixDialogClose>
							</div>
						</RadixDialogContent>
					</RadixDialogPortal>
				</RadixDialogRoot>
			</div>

			{/* Success Dialog */}
			<div className="bg-white p-6 rounded-lg shadow-md text-center">
				<h3 className="text-lg font-semibold mb-4">Success Dialog</h3>
				<RadixDialogRoot open={open3} onOpenChange={setOpen3}>
					<RadixDialogTrigger asChild>
						<button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
							Save Changes
						</button>
					</RadixDialogTrigger>
					<RadixDialogPortal>
						<RadixDialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
						<RadixDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg min-w-[400px] border-l-4 border-green-500">
							<RadixDialogTitle className="text-xl font-semibold mb-2 text-green-700">
								✅ Success!
							</RadixDialogTitle>
							<RadixDialogDescription className="text-gray-600 mb-4">
								Your changes have been saved successfully. You can now continue with your work.
							</RadixDialogDescription>
							<div className="flex justify-center">
								<RadixDialogClose asChild>
									<button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
										Continue
									</button>
								</RadixDialogClose>
							</div>
						</RadixDialogContent>
					</RadixDialogPortal>
				</RadixDialogRoot>
			</div>
		</div>
	);
};
  `.trim();

	return (
		<div className="min-h-screen w-full bg-gray-50 px-4 py-10">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					Dialog 컴포넌트 예제
				</h1>
				<p className="text-sm text-gray-500 mb-6">
					아래는 Radix Dialog 컴포넌트의 사용 예시입니다. Preview 탭에서
					결과를, Code 탭에서 코드를 확인할 수 있습니다.
				</p>

				<PreviewCodeTabs
					preview={<DialogDemoPage />}
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

export default DialogDemoWithCodePage; 