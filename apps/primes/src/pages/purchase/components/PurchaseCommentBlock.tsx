import React, { useState } from 'react';
import { CommentBlock } from '@repo/comment-block';
import { Comment } from '@repo/comment-block/src/types';

interface PurchaseCommentBlockProps {
	entityId: string;
	entityType:
		| 'purchase-order'
		| 'incoming-order'
		| 'vendor'
		| 'item-price';
	className?: string;
}

export const PurchaseCommentBlock: React.FC<PurchaseCommentBlockProps> = ({
	entityId,
	entityType,
	className = '',
}) => {
	const [comments, setComments] = useState<Comment[]>([
		// Sample comments for demonstration
		{
			id: '1',
			text: 'Purchase order confirmed and processing started.',
			author: 'Purchase Team',
			timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
		},
		{
			id: '2',
			text: 'Vendor confirmed delivery schedule.',
			author: 'Vendor Management',
			timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
			replies: [
				{
					id: '2-1',
					text: 'Delivery scheduled for next week.',
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
