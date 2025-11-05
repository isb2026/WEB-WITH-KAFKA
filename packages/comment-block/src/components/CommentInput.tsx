import React, { useState } from 'react';
import { CommentInputProps } from '../types';

export const CommentInput = ({
	onSubmit,
	placeholder = '댓글을 입력하세요...',
	buttonText = '댓글 작성',
	className = '',
}: CommentInputProps) => {
	const [text, setText] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (text.trim()) {
			onSubmit(text.trim());
			setText('');
		}
	};

	return (
		<form onSubmit={handleSubmit} className={`${className}`}>
			<div className="flex gap-3">
				<div className="flex-shrink-0">
					<div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
						U
					</div>
				</div>
				<div className="flex-1">
					<textarea
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder={placeholder}
						className="w-full px-4 py-1.5 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						rows={1}
					/>
				</div>
				<div>
					<button
						type="submit"
						disabled={!text.trim()}
						className="px-6 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{buttonText}
					</button>
				</div>
			</div>
		</form>
	);
};
