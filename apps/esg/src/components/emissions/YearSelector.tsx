import React from 'react';
import {
	Box,
	Typography,
	FormControl,
	Select,
	MenuItem,
	SelectChangeEvent,
} from '@mui/material';
import { Calendar } from 'lucide-react';

interface YearSelectorProps {
	selectedYear: number;
	onYearChange: (year: number) => void;
	disabled?: boolean;
}

export const YearSelector: React.FC<YearSelectorProps> = ({
	selectedYear,
	onYearChange,
	disabled = false,
}) => {
	// 현재 연도부터 과거 10년까지 생성
	const currentYear = new Date().getFullYear();
	const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

	const handleChange = (event: SelectChangeEvent<number>) => {
		onYearChange(event.target.value as number);
	};

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 2,
				p: 2,
				bgcolor: 'white',
				borderRadius: 2,
				border: '1px solid #e0e0e0',
				boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 1,
					color: '#666',
				}}
			>
				<Calendar size={20} />
				<Typography variant="body2" sx={{ fontWeight: 500 }}>
					분석 연도:
				</Typography>
			</Box>
			
			<FormControl size="small" sx={{ minWidth: 120 }}>
				<Select
					value={selectedYear}
					onChange={handleChange}
					disabled={disabled}
					sx={{
						'& .MuiSelect-select': {
							fontWeight: 600,
							color: '#1976d2',
						},
					}}
				>
					{yearOptions.map((year) => (
						<MenuItem key={year} value={year}>
							{year}년
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
};
