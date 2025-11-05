import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { DynamicSearch } from '@moornmo/components/organisms/DynamicSearchForm';
import { SearchOption, QuickSearchOption } from '@moornmo/types/searchForm';
import { PaperComponent } from '@moornmo/components';

// import QuickSearch from 'components/search/quickSearch';

export interface SearchBarTemplateProps {
	searchConfigs?: SearchOption[];
	searchSubmit: (e?: any) => void;
	initialSearchValues?: Record<string, any>;
	quickSearchAble?: boolean;
	quickSearchConfigs?: QuickSearchOption[];
	quickSearchSubmit?: () => void;
	initialQuickSearchValues?: Record<string, any>;
}

export const SearchBarTemplate: React.FC<SearchBarTemplateProps> = ({
	searchConfigs,
	searchSubmit,
	initialSearchValues,
	quickSearchAble,
	quickSearchConfigs,
	quickSearchSubmit,
	initialQuickSearchValues,
}) => {
	return (
		<PaperComponent
			sx={{
				position: 'relative',
				display: 'flex',
				gap: '10px',
				marginBottom: '10px',
				backgroundColor: 'white',
				padding: '10px',
			}}
			evolution={3}
		>
			{searchConfigs && (
				<DynamicSearch
					config={searchConfigs}
					onSubmit={(e) => {
						searchSubmit(e);
					}}
				/>
			)}

			{quickSearchAble &&
				quickSearchConfigs &&
				quickSearchConfigs.length > 0 && (
					<Box sx={{ width: '200' }}>
						{/* <QuickSearch
							config={quickSearchConfigs}
							onSubmit={quickSearchSubmit}
						/> */}
					</Box>
				)}
		</PaperComponent>
	);
};
