import React from 'react';
import { DynamicFormComponent } from '@repo/moornmo-ui/components';
import { GroupConfig } from '@repo/moornmo-ui/types';
import { Paper } from '@mui/material';

const formConfigs: GroupConfig[] = [
	{
		fields: [
			{
				name: 'resume',
				label: 'Resume',
				type: 'file',
				span: 12,
				props: {
					required: true,
				},
			},
			{
				name: 'profilePicture',
				label: 'Profile Picture',
				type: 'file',
				span: 12,
				props: {
					required: true,
				},
			},
		],
	},
];

export const FileUploadExamplePage: React.FC = () => {
	const handleFileUpload = async (fieldName: string, file: File) => {
		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			});
			const result = await response.json();
			console.log(`${fieldName} uploaded successfully:`, result);
		} catch (error) {
			console.error(`${fieldName} upload failed:`, error);
		}
	};

	return (
		<Paper className="p-3">
			<DynamicFormComponent
				config={formConfigs}
				cols={12}
				onFileUpload={handleFileUpload}
			/>
		</Paper>
	);
};

export default FileUploadExamplePage;
