import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chip, Stack, Box } from '@mui/material';
import { TabComponent } from '@moornmo/components/organisms';
import { ActionButtonComponent } from '@moornmo/components/molecules';

export const TabbarTemplate = ({ locale = 'ko' }) => {
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState<string>('home');

	const handleTabClick = (tab: string) => {
		setSelectedTab(tab);
		navigate(`/${tab}`);
	};

	useEffect(() => {
		const currentPath = window.location.pathname.split('/')[1];
		setSelectedTab(currentPath || 'home');
	}, []);

	return (
		<Stack
			direction="row"
			spacing={1}
			className="mb-2 tabbarTemplate"
			sx={{ justifyContent: 'right' }}
		>
			<ActionButtonComponent locale={locale} />
		</Stack>
	);
};
