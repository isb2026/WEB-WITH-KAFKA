import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import ListPlugin from '@editorjs/list';
import Table from '@editorjs/table';
import ImageTool from '@editorjs/image';
import Delimiter from '@editorjs/delimiter';
import CodeTool from '@editorjs/code';
import Chart from 'editorjs-chart';
import LinkTool from '@editorjs/link';
import EditorJsColumns from './editor-columns';

export const EditorTools = {
	header: Header,
	list: ListPlugin,
	linkTool: {
		class: LinkTool as any,
		config: {
			endpoint: 'http://localhost:8008/fetchUrl', // Your backend endpoint for url data fetching,
		},
	},
	delimiter: Delimiter,
	code: CodeTool,
	image: {
		class: ImageTool,
		config: {
			endpoints: {
				byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
				byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint for URL uploads
			},
			additionalRequestHeaders: {
				// Add any headers, e.g., for authentication
				Authorization: 'Bearer your-token-here',
			},
			uploader: {
				// Optional: Custom uploader for file uploads
				async uploadByFile(file: File) {
					// Example: Upload to a server
					const formData = new FormData();
					formData.append('image', file);

					const response = await fetch(
						'http://localhost:8008/uploadFile',
						{
							method: 'POST',
							body: formData,
						}
					);

					const data = await response.json();
					return {
						success: 1,
						file: {
							url: data.url, // URL returned by your server
							// Additional fields like width, height, etc.
						},
					};
				},
				// Optional: Custom uploader for URL uploads
				async uploadByUrl(url: string) {
					const response = await fetch(
						'http://localhost:8008/fetchUrl',
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({ url }),
						}
					);

					const data = await response.json();
					return {
						success: 1,
						file: {
							url: data.url,
						},
					};
				},
			},
		},
	},
	table: {
		class: Table as any,
		inlineToolbar: true,
		config: {
			rows: 2,
			cols: 2,
			maxRows: 5,
			maxCols: 5,
			withHeadings: true,
			stretched: false,
		},
	},
	chart: {
		class: Chart as any,
		config: {
			types: ['bar', 'line', 'pie', 'doughnut', 'polarArea', 'radar'],
			defaultType: 'bar',
		},
	},
	columns: {
		class: EditorJsColumns,
		inlineToolbar: true,
		config: {
			EditorJsLibrary: EditorJS,
			tools: {
				header: Header,
				list: ListPlugin,
				table: {
					class: Table,
					inlineToolbar: true,
					config: {
						rows: 2,
						cols: 3,
						maxRows: 5,
						maxCols: 5,
					},
				},
			},
		},
	},
};
