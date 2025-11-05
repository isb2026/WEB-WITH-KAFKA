import React from 'react';
import * as Icons from '@mui/icons-material';

type FontSize = 'inherit' | 'small' | 'medium' | 'large';

interface MaterialIconComponentProps {
	iconName: keyof typeof Icons;
	color?: string;
	fontSize?: string | number;
	className?: string;
}

export const MaterialIconComponent: React.FC<MaterialIconComponentProps> = ({
	iconName,
	color = 'inherit',
	fontSize = '18px',
	className,
}) => {
	const Icon = Icons[iconName];

	if (!Icon) {
		return null; // 아이콘 이름이 잘못된 경우
	}

	return <Icon style={{ color, fontSize }} className={className} />;
};
