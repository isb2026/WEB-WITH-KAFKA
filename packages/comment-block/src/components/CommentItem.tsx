import { useState } from 'react';
import { CommentItemProps } from '../types';
import { CommentInput } from './CommentInput';

export function CommentItem({
	comment,
	onReply,
	showAvatar = true,
	avatarSize = 'md',
}: CommentItemProps) {
	const [showReplyInput, setShowReplyInput] = useState(false);
	const [replyingToId, setReplyingToId] = useState<string | null>(null);

	const formatTimeAgo = (date: Date): string => {
		const now = new Date();
		const diffInHours = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60 * 60)
		);

		if (diffInHours < 1) return '방금 전';
		if (diffInHours < 24) return `${diffInHours}시간 전`;

		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 7) return `${diffInDays}일 전`;

		const diffInWeeks = Math.floor(diffInDays / 7);
		if (diffInWeeks < 4) return `${diffInWeeks}주 전`;

		return date.toLocaleDateString('ko-KR');
	};

	const getAvatarSize = () => {
		switch (avatarSize) {
			case 'sm':
				return 'w-8 h-8';
			case 'lg':
				return 'w-12 h-12';
			default:
				return 'w-10 h-10';
		}
	};

	const getAvatarText = (author: string) => {
		return author === 'System' ? 'S' : 'U';
	};

	const getAvatarColor = (author: string) => {
		return author === 'System' ? 'bg-green-500' : 'bg-blue-500';
	};

	const handleReply = (text: string) => {
		onReply(comment.id, text);
		setShowReplyInput(false);
	};

	const handleReplyToReply = (replyId: string, text: string) => {
		onReply(replyId, text);
		setReplyingToId(null);
	};

	const renderCommentItem = (
		commentItem: any,
		isReply: boolean = false,
		currentLevel: number = 0,
		indentApplied: boolean = false
	) => {
		// Apply one-time indent to the first reply level only.
		const addIndent = isReply && !indentApplied;

		return (
			<div
				className={`${addIndent ? 'pl-12' : ''} ${isReply ? 'mt-3' : ''}`}
				data-level={currentLevel}
			>
				<div className="flex gap-3">
					{showAvatar && (
						<div className="flex-shrink-0">
							<div
								className={`${getAvatarSize()} ${getAvatarColor(
									commentItem.author
								)} rounded-full flex items-center justify-center text-white font-semibold text-sm`}
							>
								{getAvatarText(commentItem.author)}
							</div>
						</div>
					)}

					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-2">
							<span className="font-semibold text-blue-600 text-sm">
								{commentItem.author}
							</span>
							<span className="text-gray-400 text-xs">•</span>
							<span className="text-gray-500 text-xs">
								{formatTimeAgo(
									commentItem.timestamp instanceof Date
										? commentItem.timestamp
										: new Date(commentItem.timestamp)
								)}
							</span>
						</div>

						<div className="text-gray-800 text-sm mb-3 leading-relaxed">
							{commentItem.text}
						</div>

						<div className="flex gap-4">
							<button
								onClick={() => {
									if (isReply) {
										setReplyingToId(
											replyingToId === commentItem.id
												? null
												: commentItem.id
										);
									} else {
										setShowReplyInput(!showReplyInput);
									}
								}}
								className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors"
							>
								Reply
							</button>
						</div>
					</div>
				</div>

				{/* Reply input for main comments */}
				{!isReply && showReplyInput && (
					<div className="mt-3 mb-3">
						<CommentInput
							onSubmit={handleReply}
							placeholder="Reply to this comment..."
							buttonText="Post Reply"
							className="ml-0"
						/>
					</div>
				)}

				{/* Reply input for replies */}
				{isReply && replyingToId === commentItem.id && (
					<div className="mt-3 mb-3">
						<CommentInput
							onSubmit={(text) =>
								handleReplyToReply(commentItem.id, text)
							}
							placeholder="Reply to this reply..."
							buttonText="Post Reply"
							className="ml-0"
						/>
					</div>
				)}

				{/* Nested replies */}
				{commentItem.replies && commentItem.replies.length > 0 && (
					<div className="mt-3">
						{commentItem.replies.map((nestedReply: any) => (
							<div
								key={nestedReply.id}
								className="mb-3 last:mb-0"
							>
								{renderCommentItem(
									nestedReply,
									true, // still a reply
									currentLevel + 1, // level increases, but no extra indent
									indentApplied || addIndent // once applied, stay applied down the branch
								)}
							</div>
						))}
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="mb-4">
			{/* Main comment content */}
			{renderCommentItem(comment, false, 0)}
		</div>
	);
}
