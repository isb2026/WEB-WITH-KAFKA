import React, { useCallback, useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import { EditorTools } from './editor-tools';
import { EditorOutputData } from './types';
import { ReportTab } from '@esg/types/report';
import { convertBlocksToEditorData } from './convertBlocksToEditorData';
import './styles.css';
import { debounce } from 'lodash';

interface EditorProps {
	tab: ReportTab; // Changed from report: Report
	onSave?: (data: EditorOutputData) => void;
}

class EditorErrorBoundary extends React.Component<{
	children: React.ReactNode;
}> {
	componentDidCatch(error: Error) {
		console.error('Editor error:', error);
	}

	render() {
		return this.props.children;
	}
}

const Editor: React.FC<EditorProps> = ({ tab, onSave }) => {
	const editorRef = useRef<EditorJS | null>(null);

	const saveEditor = useCallback(async () => {
		if (!editorRef.current) return null;

		try {
			const savedData = await editorRef.current.save();
			const outputData = {
				...savedData,
				time: savedData.time || Date.now(),
			};
			onSave?.(outputData);
			return outputData;
		} catch (error) {
			console.error('Saving failed: ', error);
			return null;
		}
	}, [onSave]);

	const debouncedSave = useCallback(
		debounce(async () => {
			await saveEditor();
		}, 1000),
		[saveEditor]
	);

	useEffect(() => {
		let isMounted = true;

		const initEditor = async () => {
			if (!tab || !isMounted) return;

			// Destroy previous editor if exists
			if (editorRef.current) {
				try {
					editorRef.current.destroy();
				} catch (error) {
					console.warn('Error destroying editor:', error);
				}
				editorRef.current = null;
			}

			// Small delay to ensure DOM is ready
			setTimeout(() => {
				if (!isMounted || !tab) return;
				const editorData = convertBlocksToEditorData(tab.blocks);

				const editorInstance = new EditorJS({
					holder: 'editorjs',
					tools: EditorTools,
					autofocus: true,
					data: editorData,
					onChange: debouncedSave,
					onReady: () => {
						if (isMounted) {
							editorRef.current = editorInstance;
						}
					},
				});
			}, 250);
		};

		initEditor();

		return () => {
			isMounted = false;
			if (editorRef.current) {
				try {
					editorRef.current.destroy();
				} catch (error) {
					console.warn('Error destroying editor:', error);
				}
				editorRef.current = null;
			}
		};
	}, [tab.tabId]);

	return (
		<EditorErrorBoundary>
			<div id="editorjs" className="a4-page" />
		</EditorErrorBoundary>
	);
};

export default Editor;
