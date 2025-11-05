import React, { useState } from 'react';
import { CommentBlock } from '@repo/comment-block';
import { Comment } from '@repo/comment-block/src/types';

interface MoldCommentBlockProps {
	entityId: string;
	entityType:
		| 'mold-order'
		| 'mold-set'
		| 'mold-instance'
		| 'mold-repair'
		| 'mold-location'
		| 'mold-bom';
	className?: string;
}

export const MoldCommentBlock: React.FC<MoldCommentBlockProps> = ({
	entityId,
	entityType,
	className = '',
}) => {
	const [comments, setComments] = useState<Comment[]>([
		// Sample comments for demonstration
		{
			id: '1',
			text: 'Mold order review completed successfully.',
			author: 'Order Team',
			timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
		},
		{
			id: '2',
			text: 'Production order confirmed and scheduled.',
			author: 'Production Manager',
			timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
			replies: [
				{
					id: '2-1',
					text: 'Manufacturing will start next week.',
					author: 'Manufacturing Lead',
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
