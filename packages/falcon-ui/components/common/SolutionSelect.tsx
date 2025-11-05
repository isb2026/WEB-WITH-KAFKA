import React, { useState } from 'react';
import {
	Menu,
	MenuItem,
	IconButton,
	Tooltip,
	ListItemIcon,
	Typography,
} from '@mui/material';
import { SolutionType } from '../navbar';
import AppsIcon from '@mui/icons-material/Apps';
import SettingsIcon from '@mui/icons-material/Settings';
import InventoryIcon from '@mui/icons-material/Inventory';
import FactoryIcon from '@mui/icons-material/Factory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ChecklistIcon from '@mui/icons-material/Checklist';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import WidgetsIcon from '@mui/icons-material/Widgets';

const solutionIcons: Record<string, React.ReactNode> = {
	ini: <SettingsIcon sx={{ height: 24 }} />,
	aps: <AccountTreeIcon sx={{ height: 24 }} />,
	cmms: <ChecklistIcon sx={{ height: 24 }} />,
	erp: <BusinessCenterIcon sx={{ height: 24 }} />,
	mold: <WidgetsIcon sx={{ height: 24 }} />,
	production: <FactoryIcon sx={{ height: 24 }} />,
	purchase: <ShoppingCartIcon sx={{ height: 24 }} />,
	qms: <ChecklistIcon sx={{ height: 24 }} />,
	sales: <TrendingUpIcon sx={{ height: 24 }} />,
	scm: <InventoryIcon sx={{ height: 24 }} />,
	wms: <WarehouseIcon sx={{ height: 24 }} />,
};

export interface SolutionSelectProps {
	solutions: SolutionType[];
	solution: SolutionType;
	onChange?: (e: any) => void;
}

export const SolutionSelect: React.FC<SolutionSelectProps> = ({
	solutions,
	solution,
	onChange,
}) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleSelect = (selected: SolutionType) => {
		handleClose();
		if (onChange) {
			onChange({ target: { value: selected.name } });
		}
	};

	return (
		<>
			<Tooltip title="Moornmo Solutions">
				<IconButton
					onClick={handleOpen}
					size="small"
					sx={{ mr: 1 }}
					aria-controls={open ? 'solution-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
				>
					<AppsIcon />
				</IconButton>
			</Tooltip>

			<Menu
				anchorEl={anchorEl}
				id="solution-menu"
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				slotProps={{
					paper: {
						elevation: 0,
						sx: {
							overflow: 'visible',
							filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							mt: 1.5,
							py: 1.5,
							minWidth: 290,
							'&::before': {
								content: '""',
								display: 'block',
								position: 'absolute',
								top: 0,
								right: 14,
								width: 10,
								height: 10,
								bgcolor: 'background.paper',
								transform: 'translateY(-50%) rotate(45deg)',
								zIndex: 0,
							},
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				{solutions.map((sol) => (
					<MenuItem
						key={sol.name}
						onClick={() => handleSelect(sol)}
						selected={sol.name === solution.name}
						sx={{
							bgcolor:
								sol.name === solution.name
									? 'action.selected'
									: 'inherit',
							'&:hover': {
								bgcolor: 'action.hover',
							},
						}}
					>
						<ListItemIcon
							sx={{
								bgcolor: '#2C7BE5',
								color: '#fff',
								minWidth: 'max-content !important',
								p: 0.6,
								borderRadius: 2,
							}}
						>
							{solutionIcons[sol.name] || <SettingsIcon />}
						</ListItemIcon>
						<Typography
							sx={{ textTransform: 'capitalize', ml: 1.5 }}
						>
							{sol.name}
						</Typography>
					</MenuItem>
				))}
			</Menu>
		</>
	);
};
