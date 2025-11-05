import React, { useState, useEffect, useRef } from 'react';
import { FloraEditor } from '@repo/flora-editor';
import { useTranslation } from '@repo/i18n';
import { useResponsive, useTheme } from '@primes/hooks';
import { toast } from 'sonner';

// 에디터 데이터 타입
export interface EditorData {
	id?: string;
	content: string;
	progressId: number;
	inspectionType: string;
	createdAt?: Date;
	updatedAt?: Date;
	createdBy?: string;
	updatedBy?: string;
}

// 에디터 props 인터페이스
export interface FormulaEditorProps {
	// 필수 props
	progressId: number;
	inspectionType: string;
	
	// 선택적 props
	title?: string;
	placeholder?: string;
	initialContent?: string;
	editorId?: string;
	
	// 상태 관리
	isLoading?: boolean;
	isReadOnly?: boolean;
	autoSave?: boolean;
	autoSaveInterval?: number; // ms 단위
	
	// 이벤트 핸들러
	onContentChange?: (content: string) => void;
	onSave?: (data: EditorData) => Promise<void>;
	onLoad?: (progressId: number, inspectionType: string) => Promise<EditorData | null>;
	onError?: (error: string) => void;
	
	// 커스터마이징
	className?: string;
	headerClassName?: string;
	editorClassName?: string;
	showHeader?: boolean;
	showSaveButton?: boolean;
	saveButtonText?: string;
	
	// 에디터 설정
	showToolbar?: boolean;
	showStatusBar?: boolean;
	theme?: 'light' | 'dark' | 'auto';
}

// 기본값 정의
const defaultProps: Partial<FormulaEditorProps> = {
	title: '수식 편집기',
	placeholder: '수식, 노트 또는 리치 텍스트 내용을 입력하세요...',
	initialContent: '',
	editorId: '',
	isLoading: false,
	isReadOnly: false,
	autoSave: true,
	autoSaveInterval: 30000, // 30초
	onContentChange: () => {},
	onSave: async () => {},
	onLoad: async () => null,
	onError: () => {},
	className: '',
	headerClassName: '',
	editorClassName: '',
	showHeader: true,
	showSaveButton: true,
	saveButtonText: '저장',
	showToolbar: true,
	showStatusBar: true,
	theme: 'auto',
};

const FormulaEditor: React.FC<FormulaEditorProps> = (props) => {
	// props와 기본값 병합
	const {
		progressId,
		inspectionType,
		title,
		placeholder,
		initialContent,
		editorId,
		isLoading,
		isReadOnly,
		autoSave,
		autoSaveInterval,
		onContentChange,
		onSave,
		onLoad,
		onError,
		className,
		headerClassName,
		editorClassName,
		showHeader,
		showSaveButton,
		saveButtonText,
		showToolbar,
		showStatusBar,
		theme: propTheme,
	} = { ...defaultProps, ...props };

	const { t: tCommon } = useTranslation('common');
	const { isMobile, isTablet, isDesktop } = useResponsive();
	const { theme: systemTheme } = useTheme();
	
	// 상태 관리
	const [content, setContent] = useState<string>(initialContent || '');
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [lastSaved, setLastSaved] = useState<Date | null>(null);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
	
	// refs
	const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
	const lastContentRef = useRef<string>('');

	// 테마 결정 (props > 시스템 > 기본값)
	const editorTheme = propTheme === 'auto' ? systemTheme : propTheme;

	// 초기 데이터 로드
	useEffect(() => {
		const loadInitialData = async () => {
			try {
				if (onLoad) {
					const savedData = await onLoad(progressId, inspectionType);
					if (savedData) {
						setContent(savedData.content);
						lastContentRef.current = savedData.content;
						setLastSaved(savedData.updatedAt || savedData.createdAt || new Date());
						setHasUnsavedChanges(false);
					}
				}
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : '데이터 로드에 실패했습니다.';
				if (onError) {
					onError(errorMessage);
				}
				console.error('FormulaEditor load error:', error);
			}
		};

		if (progressId && inspectionType) {
			loadInitialData();
		}
	}, [progressId, inspectionType, onLoad, onError]);

	// 자동 저장 설정
	useEffect(() => {
		if (autoSave && hasUnsavedChanges) {
			// 기존 타이머 제거
			if (autoSaveTimerRef.current) {
				clearTimeout(autoSaveTimerRef.current);
			}

			// 새 타이머 설정
			autoSaveTimerRef.current = setTimeout(() => {
				handleAutoSave();
			}, autoSaveInterval);
		}

		return () => {
			if (autoSaveTimerRef.current) {
				clearTimeout(autoSaveTimerRef.current);
			}
		};
	}, [content, autoSave, autoSaveInterval, hasUnsavedChanges]);

	// 컴포넌트 언마운트 시 자동 저장
	useEffect(() => {
		return () => {
			if (autoSave && hasUnsavedChanges) {
				handleAutoSave();
			}
		};
	}, []);

	// 내용 변경 핸들러
	const handleContentChange = (newContent: string) => {
		setContent(newContent);
		setHasUnsavedChanges(newContent !== lastContentRef.current);
		if (onContentChange) {
			onContentChange(newContent);
		}
	};

	// 자동 저장 핸들러
	const handleAutoSave = async () => {
		if (!hasUnsavedChanges || isSaving) return;

		try {
			setIsSaving(true);
			if (onSave) {
				await onSave({
					content,
					progressId,
					inspectionType,
					updatedAt: new Date(),
				});
			}
			
			lastContentRef.current = content;
			setLastSaved(new Date());
			setHasUnsavedChanges(false);
			
			// 자동 저장 성공 시 사용자에게 알림 (선택사항)
			console.log('자동 저장 완료');
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : '자동 저장에 실패했습니다.';
			if (onError) {
				onError(errorMessage);
			}
			console.error('FormulaEditor auto-save error:', error);
		} finally {
			setIsSaving(false);
		}
	};

	// 수동 저장 핸들러
	const handleManualSave = async () => {
		if (isSaving) return;

		try {
			setIsSaving(true);
			if (onSave) {
				await onSave({
					content,
					progressId,
					inspectionType,
					updatedAt: new Date(),
				});
			}
			
			lastContentRef.current = content;
			setLastSaved(new Date());
			setHasUnsavedChanges(false);
			
			toast.success('수식이 성공적으로 저장되었습니다.');
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : '저장에 실패했습니다.';
			if (onError) {
				onError(errorMessage);
			}
			toast.error(errorMessage);
		} finally {
			setIsSaving(false);
		}
	};

	// 헤더 렌더링
	const renderHeader = () => {
		if (!showHeader) return null;

		return (
			<div className={`px-2 py-2.5 border-b flex items-center justify-between ${headerClassName || ''}`}>
				<div className="text-base font-bold">
					{title || tCommon('tabs.actions.formulaEditor')}
				</div>
				<div className="flex items-center gap-2">
					{/* 상태 표시 */}
					{hasUnsavedChanges && (
						<div className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
							저장되지 않은 변경사항
						</div>
					)}
					
					{lastSaved && (
						<div className="text-xs text-gray-500">
							마지막 저장: {lastSaved.toLocaleTimeString()}
						</div>
					)}
					
					{/* 저장 버튼 */}
					{showSaveButton && (
						<button
							onClick={handleManualSave}
							disabled={isSaving || !hasUnsavedChanges}
							className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
								isSaving || !hasUnsavedChanges
									? 'bg-gray-100 text-gray-400 cursor-not-allowed'
									: 'bg-blue-500 text-white hover:bg-blue-600'
							}`}
						>
							{isSaving ? '저장 중...' : saveButtonText}
						</button>
					)}
				</div>
			</div>
		);
	};

	// 에디터 렌더링
	const renderEditor = () => {
		if (isLoading) {
			return (
				<div className="flex items-center justify-center h-full">
					<div className="text-gray-500">로딩 중...</div>
				</div>
			);
		}

		return (
			<FloraEditor
				value={content}
				onChange={handleContentChange}
				placeholder={placeholder}
				className={`h-full ${editorClassName || ''}`}
				isDesktop={isDesktop}
				theme={editorTheme}
			/>
		);
	};

	return (
		<div className={`flex flex-col border rounded-lg ${className || ''}`}>
			{renderHeader()}
			<div className={`flex-1 ${editorClassName || ''}`}>
				{renderEditor()}
			</div>
		</div>
	);
};

export default FormulaEditor; 