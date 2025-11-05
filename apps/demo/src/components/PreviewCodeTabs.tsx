import React, { useState, useRef } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';
import {
	RadixTabsRoot,
	RadixTabsList,
	RadixTabsTrigger,
	RadixTabsContent,
} from '@repo/radix-ui/components';

type PreviewCodeTabsProps = {
	preview: React.ReactNode;
	code: React.ReactNode;
};

export const PreviewCodeTabs: React.FC<PreviewCodeTabsProps> = ({
	preview,
	code,
}) => {
	const [showCopyIcon, setShowCopyIcon] = useState(false);
	const [copySuccess, setCopySuccess] = useState(false);
	const codeRef = useRef<HTMLDivElement>(null);

	const handleCopy = async () => {
		if (codeRef.current && navigator.clipboard) {
			const textToCopy = codeRef.current.textContent || '';
			await navigator.clipboard.writeText(textToCopy);
			setCopySuccess(true);
			setTimeout(() => setCopySuccess(false), 3000);
		}
	};

	return (
		<RadixTabsRoot defaultValue="preview" className="w-full h-full">
			<RadixTabsList className="flex border-b gap-4 border-gray-200 mb-4 pb-4">
				<RadixTabsTrigger
					value="preview"
					className="px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black outline-none bg-white"
				>
					Preview
				</RadixTabsTrigger>
				<RadixTabsTrigger
					value="code"
					className="px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black outline-none bg-white"
				>
					Code
				</RadixTabsTrigger>
			</RadixTabsList>

			<RadixTabsContent value="preview" className="overflow-y-scroll">
				{preview}
			</RadixTabsContent>
			<RadixTabsContent
				value="code"
				className="relative "
				onMouseEnter={() => setShowCopyIcon(true)}
				onMouseLeave={() => setShowCopyIcon(false)}
			>
				<div className="overflow-y-scroll">
					<div ref={codeRef}>{code}</div>
				</div>
				{showCopyIcon && !copySuccess && (
					<button
						onClick={handleCopy}
						className="absolute top-2 right-2 p-1.5 text-gray-600 bg-white rounded hover:bg-gray-100 shadow-sm transition-colors duration-200 z-10"
						title="Copy code"
					>
						<FaCopy />
					</button>
				)}
				{copySuccess && (
					<div
						className="absolute top-2 right-2 p-1.5 text-green-600 bg-white rounded shadow-sm z-10"
						title="Copied!"
					>
						<FaCheck />
					</div>
				)}
			</RadixTabsContent>
		</RadixTabsRoot>
	);
};
