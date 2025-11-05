import React from 'react';
import { Typography, Button, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';
import { useT } from '@repo/i18n';

export const NotFoundTemplate: React.FC = () => {
	const navigate = useNavigate();
	const t = useT('common');

	const handleGoBack = () => {
		navigate('/'); // Go back Home
	};

	return (
		<Container
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				height: '100%',
				textAlign: 'center',
			}}
		>
			<ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
			<Typography variant="h3" gutterBottom>
				{t('notFound.title')}
			</Typography>
			<Typography variant="body1" sx={{ mb: 3 }}>
				{t('notFound.description')}
			</Typography>
			<Button
				variant="contained"
				color="primary"
				onClick={handleGoBack}
				sx={{ px: 4, py: 1 }}
			>
				{t('notFound.goBack')}
			</Button>
		</Container>
	);
};
