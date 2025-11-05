import React, { useState } from 'react';
import { CommentBlock } from '@repo/comment-block';
import { Comment } from '@repo/comment-block/src/types';

interface ProductionCommentBlockProps {
	entityId: string;
	entityType:
		| 'production-working'
		| 'production-notwork'
		| 'production-plan'
		| 'production-command'
		| 'production-quality'
		| 'production-material';
	className?: string;
}

export const ProductionCommentBlock: React.FC<ProductionCommentBlockProps> = ({
	entityId,
	entityType,
	className = '',
}) => {
	const [comments, setComments] = useState<Comment[]>([
		// Sample comments for demonstration
		{
			id: '1',
			text: 'Production process started successfully.',
			author: 'Production Team',
			timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
		},
		{
			id: '2',
			text: 'Quality check completed for batch #123.',
			author: 'Quality Control',
			timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
			replies: [
				{
					id: '2-1',
					text: 'All parameters within acceptable range.',
					author: 'QC Supervisor',
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
