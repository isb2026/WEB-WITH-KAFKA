import React from 'react';
import {
	RadixAvatarRoot,
	RadixAvatarImage,
	RadixAvatarFallback,
} from '@repo/radix-ui/components';

const AvatarDemoPage: React.FC = () => {
	return (
		<div className="bg-gray-500 p-8 h-full flex items-center justify-center">
			<div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{/* Basic Avatar */}
				<div className="bg-white p-6 rounded-lg shadow-md text-center">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Avatar</h3>
					<div className="flex justify-center">
						<RadixAvatarRoot className="flex h-16 w-16 select-none items-center justify-center overflow-hidden rounded-full bg-gray-100">
							<RadixAvatarImage
								className="h-full w-full object-cover"
								src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
								alt="User"
							/>
							<RadixAvatarFallback className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-600 text-sm font-medium">
								JD
							</RadixAvatarFallback>
						</RadixAvatarRoot>
					</div>
				</div>

				{/* Large Avatar */}
				<div className="bg-white p-6 rounded-lg shadow-md text-center">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Large Avatar</h3>
					<div className="flex justify-center">
						<RadixAvatarRoot className="flex h-24 w-24 select-none items-center justify-center overflow-hidden rounded-full bg-gray-100 shadow-lg">
							<RadixAvatarImage
								className="h-full w-full object-cover"
								src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
								alt="User"
							/>
							<RadixAvatarFallback className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-600 text-lg font-medium">
								JD
							</RadixAvatarFallback>
						</RadixAvatarRoot>
					</div>
				</div>

				{/* Avatar with Fallback */}
				<div className="bg-white p-6 rounded-lg shadow-md text-center">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Avatar with Fallback</h3>
					<div className="flex justify-center">
						<RadixAvatarRoot className="flex h-16 w-16 select-none items-center justify-center overflow-hidden rounded-full bg-gray-100">
							<RadixAvatarImage
								className="h-full w-full object-cover"
								src="broken-image-url"
								alt="User"
							/>
							<RadixAvatarFallback className="flex h-full w-full items-center justify-center bg-blue-500 text-white text-sm font-medium">
								JD
							</RadixAvatarFallback>
						</RadixAvatarRoot>
					</div>
				</div>

				{/* Square Avatar */}
				<div className="bg-white p-6 rounded-lg shadow-md text-center">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Square Avatar</h3>
					<div className="flex justify-center">
						<RadixAvatarRoot className="flex h-16 w-16 select-none items-center justify-center overflow-hidden rounded-lg bg-gray-100">
							<RadixAvatarImage
								className="h-full w-full object-cover"
								src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
								alt="User"
							/>
							<RadixAvatarFallback className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-600 text-sm font-medium">
								JD
							</RadixAvatarFallback>
						</RadixAvatarRoot>
					</div>
				</div>

				{/* Avatar with Border */}
				<div className="bg-white p-6 rounded-lg shadow-md text-center">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Avatar with Border</h3>
					<div className="flex justify-center">
						<RadixAvatarRoot className="flex h-16 w-16 select-none items-center justify-center overflow-hidden rounded-full bg-gray-100 border-4 border-blue-500">
							<RadixAvatarImage
								className="h-full w-full object-cover"
								src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
								alt="User"
							/>
							<RadixAvatarFallback className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-600 text-sm font-medium">
								JD
							</RadixAvatarFallback>
						</RadixAvatarRoot>
					</div>
				</div>

				{/* Multiple Avatars */}
				<div className="bg-white p-6 rounded-lg shadow-md text-center">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Multiple Avatars</h3>
					<div className="flex justify-center space-x-2">
						<RadixAvatarRoot className="flex h-12 w-12 select-none items-center justify-center overflow-hidden rounded-full bg-gray-100 border-2 border-white shadow-md">
							<RadixAvatarImage
								className="h-full w-full object-cover"
								src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
								alt="User 1"
							/>
							<RadixAvatarFallback className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-600 text-xs font-medium">
								JD
							</RadixAvatarFallback>
						</RadixAvatarRoot>
						<RadixAvatarRoot className="flex h-12 w-12 select-none items-center justify-center overflow-hidden rounded-full bg-gray-100 border-2 border-white shadow-md">
							<RadixAvatarImage
								className="h-full w-full object-cover"
								src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
								alt="User 2"
							/>
							<RadixAvatarFallback className="flex h-full w-full items-center justify-center bg-green-500 text-white text-xs font-medium">
								SM
							</RadixAvatarFallback>
						</RadixAvatarRoot>
						<RadixAvatarRoot className="flex h-12 w-12 select-none items-center justify-center overflow-hidden rounded-full bg-gray-100 border-2 border-white shadow-md">
							<RadixAvatarImage
								className="h-full w-full object-cover"
								src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
								alt="User 3"
							/>
							<RadixAvatarFallback className="flex h-full w-full items-center justify-center bg-purple-500 text-white text-xs font-medium">
								AB
							</RadixAvatarFallback>
						</RadixAvatarRoot>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AvatarDemoPage; 