import React from 'react';
import { CommentBlockProps, Comment } from '../types';
import { CommentInput } from './CommentInput';
import { CommentItem } from './CommentItem';

export const CommentBlock = ({
	comments = [],
	onAddComment,
	onReply,
	className = '',
	placeholder = '댓글을 입력하세요...',
	showAvatar = true,
	avatarSize = 'md',
}: CommentBlockProps) => {
	const handleAddComment = (text: string) => {
		if (onAddComment) {
			onAddComment(text);
		}
	};

	// Recursive function to find and add reply to any comment in the nested structure
	const findAndAddReply = (
		commentList: Comment[],
		parentId: string,
		replyText: string
	): Comment[] => {
		return commentList.map((comment) => {
			if (comment.id === parentId) {
				// Found the parent comment, add reply
				const newReply: Comment = {
					id: Date.now().toString(),
					text: replyText,
					author: 'User',
					timestamp: new Date(),
				};
				return {
					...comment,
					replies: [...(comment.replies || []), newReply],
				};
			} else if (comment.replies && comment.replies.length > 0) {
				// Search in replies recursively
				return {
					...comment,
					replies: findAndAddReply(
						comment.replies,
						parentId,
						replyText
					),
				};
			}
			return comment;
		});
	};

	const handleReply = (parentId: string, text: string) => {
		if (onReply) {
			onReply(parentId, text);
		} else {
			// If no onReply handler provided, we can still handle it locally
			// This would require state management in the parent component
			console.log('Reply to comment:', parentId, 'Text:', text);
		}
	};

	return (
		<div
			className={`bg-white rounded-lg border border-gray-200 flex flex-col ${className}`}
		>
			{/* Fixed CommentInput at the top */}
			{onAddComment && (
				<div className="flex-shrink-0 border-gray-200 mt-1">
					<CommentInput
						onSubmit={handleAddComment}
						placeholder={placeholder}
						buttonText="댓글 작성"
					/>
				</div>
			)}

			{/* Scrollable comments list */}
			<div className="flex-1 overflow-y-auto">
				<div className="space-y-6">
					{comments.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
						</div>
					) : (
						comments.map((comment) => (
							<CommentItem
								key={comment.id}
								comment={comment}
								onReply={handleReply}
								showAvatar={showAvatar}
								avatarSize={avatarSize}
							/>
						))
					)}
				</div>
			</div>
		</div>
	);
};
