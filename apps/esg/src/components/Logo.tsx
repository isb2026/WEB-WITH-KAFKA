import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import logo from '../assets/img/illustrations/logo_tree.png';

interface LogoProps {
	at?: 'navbar-vertical' | 'navbar-top' | 'auth';
	width?: number;
	className?: string;
}

export const Logo: React.FC<LogoProps> = ({ at = 'auth', className }) => {
	return (
		<Link
			to="/"
			className={classNames('text-decoration-none ', className, {
				'navbar-brand text-left': [
					'navbar-vertical',
					'navbar-top',
				].includes(at),
				'flex-center fw-bolder fs-5': at === 'auth',
			})}
			style={{ width: '100%' }}
		>
			<Box
				display="flex"
				alignItems={'center'}
				py={at === 'navbar-vertical' ? 3 : 0}
				className={classNames({
					'fw-bolder text-primary fs-6': at === 'auth',
				})}
			>
				<Box
					component="img"
					src={logo}
					alt="Logo"
					sx={{
						height: {
							xs: '40px',
							sm: '25px', // 태블릿 세로
							md: '30px', // 태블릿 가로 / 작은 데스크탑
							lg: '30px',
						},
						maxWidth: '100%',
						mr: 2, // margin-right: 8px
					}}
				/>
			</Box>
		</Link>
	);
};
