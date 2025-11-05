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

const DialogDemoPage: React.FC = () => {
	const [open1, setOpen1] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [open3, setOpen3] = useState(false);

	return (
		<div className="bg-gray-500 p-8 h-full flex items-center justify-center">
			<div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Basic Dialog */}
				<div className="bg-white p-6 rounded-lg shadow-md text-center">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Dialog</h3>
					<RadixDialogRoot open={open1} onOpenChange={setOpen1}>
						<RadixDialogTrigger asChild>
							<button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
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
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Warning Dialog</h3>
					<RadixDialogRoot open={open2} onOpenChange={setOpen2}>
						<RadixDialogTrigger asChild>
							<button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
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
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Success Dialog</h3>
					<RadixDialogRoot open={open3} onOpenChange={setOpen3}>
						<RadixDialogTrigger asChild>
							<button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
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
		</div>
	);
};

export default DialogDemoPage; 