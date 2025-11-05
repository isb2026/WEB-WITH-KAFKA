import { RadixFileUpload } from '@repo/radix-ui/components';
import React from 'react';

const FileUploadDemo: React.FC = () => (
	// Standalone usage
	<div className="py-2 space-y-8">
		<RadixFileUpload
			className="custom-uploader"
			maxFiles={3}
			maxSize={10 * 1024 * 1024}
			accept="image/*,.pdf, .csv, .xls, xlsx"
			onValueChange={(files) => console.log('Files:', files)}
			onFileReject={(file, message) =>
				console.error(message, { description: file.name })
			}
		/>
	</div>
);

export default FileUploadDemo;
