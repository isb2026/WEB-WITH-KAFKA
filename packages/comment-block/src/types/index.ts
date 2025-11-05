export interface Comment {
	id: string;
	text: string;
	author: string;
	timestamp: Date | string;
	replies?: Comment[];
}

export interface CommentBlockProps {
	comments?: Comment[];
	onAddComment?: (text: string) => void;
	onReply?: (parentId: string, text: string) => void;
	className?: string;
	placeholder?: string;
	showAvatar?: boolean;
	avatarSize?: 'sm' | 'md' | 'lg';
}

export interface CommentItemProps {
	comment: Comment;
	onReply: (parentId: string, text: string) => void;
	showAvatar?: boolean;
	avatarSize?: 'sm' | 'md' | 'lg';
}

export interface CommentInputProps {
	onSubmit: (text: string) => void;
	placeholder?: string;
	buttonText?: string;
	className?: string;
}
