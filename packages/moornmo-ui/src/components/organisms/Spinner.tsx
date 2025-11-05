import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export const Spinner = () => {
	return (
		<Box
			sx={{
				position: 'absolute',
				zIndex: 9999,
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				display: 'flex',
			}}
		>
			<CircularProgress />
		</Box>
	);
};
