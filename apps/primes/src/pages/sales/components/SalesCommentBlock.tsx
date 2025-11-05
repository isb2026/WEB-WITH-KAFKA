import React, { useState } from 'react';
import { CommentBlock, Comment } from '@repo/comment-block';

interface SalesCommentBlockProps {
	entityId: string;
	entityType:
		| 'order'
		| 'estimate'
		| 'statement'
		| 'delivery'
		| 'shipment'
		| 'shipping-request'
		| 'tax-invoice';
	className?: string;
}

export const SalesCommentBlock: React.FC<SalesCommentBlockProps> = ({
	entityId,
	entityType,
	className = '',
}) => {
	const [comments, setComments] = useState<Comment[]>([
		// Sample comments for demonstration
		{
			id: '1',
			text: 'Order confirmed and processing started.',
			author: 'Sales Team',
			timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
		},
		{
			id: '2',
			text: 'Customer requested expedited shipping.',
			author: 'Customer Service',
			timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
			replies: [
				{
					id: '2-1',
					text: 'Expedited shipping approved and scheduled.',
					author: 'Logistics',
					timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
				},
			],
		},
	]);

	const handleAddComment = (text: string) => {
		const newComment: Comment = {
			id: Date.now().toString(),
			text,
			author: 'Current User', // This would come from user context
			timestamp: new Date(),
		};
		setComments((prev) => [newComment, ...prev]);
	};

	const handleReply = (parentId: string, text: string) => {
		const newReply: Comment = {
			id: Date.now().toString(),
			text,
			author: 'Current User', // This would come from user context
			timestamp: new Date(),
		};

		const addReplyToComment = (commentList: Comment[]): Comment[] => {
			return commentList.map((comment) => {
				if (comment.id === parentId) {
					return {
						...comment,
						replies: [...(comment.replies || []), newReply],
					};
				} else if (comment.replies && comment.replies.length > 0) {
					return {
						...comment,
						replies: addReplyToComment(comment.replies),
					};
				}
				return comment;
			});
		};

		setComments((prev) => addReplyToComment(prev));
	};

	return (
		<div className={`h-full flex flex-col ${className}`}>
			<div className="flex-1 overflow-y-auto">
				<CommentBlock
					comments={comments}
					onAddComment={handleAddComment}
					onReply={handleReply}
					placeholder={`Add a comment about this ${entityType}...`}
					showAvatar={true}
					avatarSize="md"
					className="border-0 shadow-none h-full"
				/>
			</div>
		</div>
	);
};
