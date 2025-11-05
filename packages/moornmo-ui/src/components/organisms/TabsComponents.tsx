import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Chip, Stack, Box } from '@mui/material';
import { useTab } from '@moornmo/hooks/useTab';
import { MaterialIconComponent } from '@moornmo/components/atoms';

export const TabComponent = () => {
	const {
		addTab,
		removeTab,
		updateTab,
		setActiveTab,
		clearTabs,
		tabs,
		activeTab,
	} = useTab();
	const navigate = useNavigate();
	const { pathname, search } = useLocation();
	// 탭 클릭 시 activeTab 값을 변경
	const handleTabClick = (tabPath: string) => {
		if (tabPath) {
			setActiveTab(tabPath); // activeTab을 setActiveTab을 통해 변경
			navigate(`${tabPath}`);
		}
	};
	return (
		<Stack direction="row" spacing={2}>
			{tabs.map((tab) =>
				activeTab === tab.path ? (
					<Chip
						key={tab.path}
						color="primary"
						label={tab.name}
						onDelete={() => removeTab(tab.path)}
						onClick={() => handleTabClick(tab.path)} // Tab 클릭 시 activeTab 변경
						sx={{ borderRadius: '8px' }}
						deleteIcon={
							<MaterialIconComponent
								iconName="Close"
								fontSize="small"
							/>
						}
					/>
				) : (
					<Chip
						key={tab.path}
						color="primary"
						variant="outlined"
						label={tab.name}
						onDelete={() => removeTab(tab.path)}
						onClick={() => handleTabClick(tab.path)} // Tab 클릭 시 activeTab 변경
						sx={{ borderRadius: '8px' }}
						deleteIcon={
							<MaterialIconComponent
								iconName="Close"
								fontSize="small"
							/>
						}
					/>
				)
			)}
			<Box sx={{ flexGrow: 1 }} />
		</Stack>
	);
};
