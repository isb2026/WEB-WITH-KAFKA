import React, { useEffect, useMemo, useCallback } from 'react';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import './../style.css';
import FroalaEditor from 'react-froala-wysiwyg';

export interface FloraEditorProps {
	value?: string;
	onChange?: (content: string) => void;
	placeholder?: string;
	className?: string;
	config?: Record<string, any>;
	isDesktop?: boolean;
	theme?: string;
}

// 유틸: 개행 <-> <br>
const nlToBr = (text: string) => {
	if (text && text.includes('\n')) {
		return text.replace(/\r?\n/g, '<br>');
	}
	return text;
};
const brToNl = (html: string) =>
	html
		// <p>foo</p><p>bar</p> 같은 구조도 줄바꿈으로 보정
		.replace(/<\/p>\s*<p>/gi, '\n')
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<\/?p>/gi, ''); // 남은 <p> 태그 제거(필요 시)

export const FloraEditor: React.FC<FloraEditorProps> = ({
	value = '',
	onChange,
	placeholder = 'Enter your text here...',
	className = '',
	config = {},
	isDesktop = false,
	theme,
}) => {
	useEffect(() => {
		if (theme === 'dark') {
			// @ts-ignore
			import('froala-editor/css/themes/dark.min.css');
		}
	}, [theme]);

	// value를 에디터 모델용 HTML로 변환
	const modelValue = useMemo(() => nlToBr(value), [value]);

	// 모델이 바뀌면 원래 포맷(텍스트 개행)으로 돌려서 onChange 호출
	const handleModelChange = useCallback(
		(model: string) => {
			onChange?.(brToNl(model));
		},
		[onChange]
	);

	// (선택) Enter 키가 <br>을 넣도록 설정
	const enterBR = (window as any)?.FroalaEditor?.ENTER_BR;
	const groupedToolbarButtons = {
		moreText: {
			buttons: [
				'bold',
				'italic',
				'underline',
				'strikeThrough',
				'subscript',
				'superscript',
				'fontFamily',
				'fontSize',
				'textColor',
				'backgroundColor',
				'clearFormatting',
			],
			buttonsVisible: isDesktop ? 2 : 0,
		},
		moreParagraph: {
			buttons: [
				'alignLeft',
				'alignCenter',
				'alignRight',
				'alignJustify',
				'formatOL',
				'formatUL',
				'paragraphFormat',
				'paragraphStyle',
				'lineHeight',
				'outdent',
				'indent',
				'quote',
			],
			buttonsVisible: isDesktop ? 3 : 0,
		},
		moreRich: {
			buttons: [
				'insertLink',
				'insertImage',
				'insertVideo',
				'insertTable',
				'insertFile',
				'insertHR',
				'emoticons',
				'specialCharacters',
			],
			buttonsVisible: 0,
		},
		moreMisc: {
			buttons: [
				'undo',
				'redo',
				'fullscreen',
				'print',
				'spellChecker',
				'selectAll',
				'help',
				'html',
				'markdown',
			],
			align: 'right',
			buttonsVisible: 2,
		},
	};

	const defaultConfig = {
		theme: theme === 'dark' ? 'dark' : 'default',
		placeholderText: placeholder,
		charCounterCount: false,
		wordCounterCount: false,
		attribution: false,
		enter: enterBR ?? undefined, // <- 선택: Enter 시 <br> 사용
		toolbarButtons: groupedToolbarButtons,
		toolbarButtonsMD: groupedToolbarButtons,
		...config, // 외부 config가 항상 최우선
	};

	const rootClass =
		`flora-editor ${theme === 'dark' ? 'dark-theme' : ''} ${className}`.trim();

	return (
		<div className={rootClass}>
			<FroalaEditor
				key={theme}
				config={defaultConfig}
				model={modelValue} // \n → <br>로 변환된 값
				onModelChange={handleModelChange} // <br>/</p><p> → \n 으로 되돌림
			/>
		</div>
	);
};
