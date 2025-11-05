'use client';

import { Button, Flex, Text } from '@radix-ui/themes';
import { File, Upload, X } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

// Define props type for the file uploader
type RadixFileUploadProps = {
	className?: string;
	maxFiles?: number;
	maxSize?: number;
	accept?: string;
	multiple?: boolean;
	defaultFiles?: File[];
	onValueChange?: (files: File[]) => void;
	onFileReject?: (file: File, message: string) => void;
};

export const RadixFileUpload = ({
	className = '',
	maxFiles = 2,
	maxSize = 5 * 1024 * 1024, // 5MB default
	accept,
	multiple = true,
	defaultFiles = [],
	onValueChange,
	onFileReject,
}: RadixFileUploadProps) => {
	const [files, setFiles] = React.useState<File[]>(defaultFiles);
	const [isDragging, setIsDragging] = React.useState(false);
	const [hasError, setHasError] = React.useState(false); // New state for error
	const inputRef = React.useRef<HTMLInputElement>(null);

	const processFiles = (selectedFiles: File[]) => {
		const validFiles: File[] = [];
		const currentFiles = [...files];
		let errorOccurred = false;

		for (const file of selectedFiles) {
			if (currentFiles.length + validFiles.length >= maxFiles) {
				onFileReject?.(file, `Maximum ${maxFiles} files allowed`);
				toast.error(`Maximum ${maxFiles} files allowed`, {
					description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
				});
				errorOccurred = true;
				continue;
			}
			if (file.size > maxSize) {
				onFileReject?.(
					file,
					`File size exceeds ${maxSize / 1024 / 1024}MB`
				);
				toast.error(`File size exceeds ${maxSize / 1024 / 1024}MB`, {
					description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
				});
				errorOccurred = true;
				continue;
			}
			if (
				accept &&
				!accept
					.split(',')
					.some(
						(type) =>
							file.type.match(type.trim()) ||
							file.name.endsWith(type.trim())
					)
			) {
				onFileReject?.(
					file,
					`File type not allowed for "${file.name}"`
				);
				toast.error(`File type not allowed`, {
					description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
				});
				errorOccurred = true;
				continue;
			}
			validFiles.push(file);
		}

		if (errorOccurred) {
			setHasError(true);
			// Increase timeout duration to 4 seconds for better visibility
			setTimeout(() => setHasError(false), 4000);
		}

		const updatedFiles = [...currentFiles, ...validFiles];
		setFiles(updatedFiles);
		onValueChange?.(updatedFiles);
		if (inputRef.current) inputRef.current.value = '';
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(event.target.files || []);
		processFiles(selectedFiles);
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragging(false);
		const droppedFiles = Array.from(event.dataTransfer.files);
		processFiles(droppedFiles);
	};

	const handleDelete = (index: number) => {
		const updatedFiles = files.filter((_, i) => i !== index);
		setFiles(updatedFiles);
		onValueChange?.(updatedFiles);
	};

	return (
		<Flex
			direction="column"
			gap="4"
			className={`max-w-md mx-auto ${className}`}
		>
			<div
				className={`border-2 border-dashed rounded-xl  flex flex-col items-center gap-3 text-center transition-all duration-300 ease-in-out hover:bg-gray-100 ${
					isDragging
						? '  scale-105'
						: hasError
							? 'border-red-500'
							: ''
				}`}
				onDrop={handleDrop}
				onDragOver={(e) => {
					e.preventDefault();
					setIsDragging(true);
				}}
				onDragLeave={() => setIsDragging(false)}
			>
				<div className="flex flex-col items-center gap-1">
					<div className="flex items-center justify-center rounded-full border border-mauve-5 bg-mauve-1 mb-1 p-3 transition-colors group-hover:bg-violet-3">
						<Upload className="w-7 h-7 text-mauve-11 group-hover:text-violet-11" />
					</div>
					<p className="font-medium text-sm">
						파일을 여기로 끌어다 놓기
					</p>
					<p className="text-muted-foreground text-xs">
						또는 클릭하여 탐색하세요 (최대 {maxFiles}개 파일, 개당
						최대 {maxSize / 1024 / 1024}MB)
					</p>
				</div>
				<Button
					variant="outline"
					size="2"
					onClick={() => inputRef.current?.click()}
				>
					Browse Files
				</Button>
				<input
					type="file"
					ref={inputRef}
					multiple={multiple}
					accept={accept}
					onChange={handleFileChange}
					className="!hidden"
					aria-label="File upload input"
				/>
			</div>

			{files.length > 0 && (
				<Flex direction="column" gap="2">
					{files.map((file, index) => (
						<Flex
							key={index}
							align="center"
							justify="between"
							gap="3"
							className="border border-mauve-5 bg-mauve-1 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
						>
							<Flex align="center" gap="3" className="flex-1">
								{file.type.startsWith('image/') ? (
									<img
										src={URL.createObjectURL(file)}
										alt={file.name}
										className="w-12 h-12 object-cover rounded"
										onLoad={(e) =>
											URL.revokeObjectURL(
												e.currentTarget.src
											)
										}
									/>
								) : (
									<File className="w-12 h-12 text-mauve-11" />
								)}
								<Flex
									direction="column"
									className="flex-1 min-w-0"
								>
									<Text
										size="2"
										className="text-mauve-12 truncate max-w-[300px]"
									>
										{file.name}
									</Text>
									<Text size="1" className="text-mauve-11">
										{(file.size / 1024 / 1024).toFixed(2)}{' '}
										MB
									</Text>
								</Flex>
							</Flex>
							<Button
								variant="ghost"
								size="1"
								className="ml-auto w-6 h-6 text-mauve-11 hover:text-violet-11 hover:bg-violet-3 rounded-full transition-colors"
								onClick={() => handleDelete(index)}
								aria-label={`Remove ${file.name}`}
							>
								<X className="size-4" />
							</Button>
						</Flex>
					))}
				</Flex>
			)}
		</Flex>
	);
};
