// BreadcrumbsComponent.tsx
import { Stack, Breadcrumbs, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export interface BreadcrumbsComponentProps {
	items: string[];
}

export const BreadcrumbsComponent: React.FC<BreadcrumbsComponentProps> = ({
	items,
}) => {
	return (
		<Stack spacing={1}>
			<Breadcrumbs
				separator={<NavigateNextIcon fontSize="small" />}
				aria-label="breadcrumb"
			>
				{items.map((item, idx) => (
					<Typography key={idx} color="text.primary">
						{item}
					</Typography>
				))}
			</Breadcrumbs>
		</Stack>
	);
};
