import React, { useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { TextInputComponent } from '@moornmo/components/atoms';

// Add type declaration for window.daum
declare global {
	interface Window {
		daum: {
			Postcode: new (config: {
				oncomplete: (data: {
					zonecode: string;
					roadAddress: string;
				}) => void;
			}) => {
				open: () => void;
			};
		};
	}
}

interface PostCodeInputProps {
	name: string;
	value: {
		zipCode?: string;
		roadAddress?: string;
		detailAddress?: string;
	};
	errors?: {
		zipCode?: string;
		roadAddress?: string;
		detailAddress?: string;
	};
	onChange: (key: string, value: string) => void;
}

export const PostCodeInput: React.FC<PostCodeInputProps> = ({
	name,
	value,
	errors,
	onChange,
}) => {
	const handlePostCodeSearch = () => {
		new window.daum.Postcode({
			oncomplete: (data) => {
				onChange('zipCode', data.zonecode);
				onChange('roadAddress', data.roadAddress);
			},
		}).open();
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
			<Box sx={{ display: 'flex', gap: 1 }}>
				<TextInputComponent
					name={`${name}_zipcode`}
					value={value.zipCode || ''}
					onChange={(e) => onChange('zipCode', e.target.value)}
					placeholder="우편번호"
					isInvalid={!!errors?.zipCode}
					errorMessage={errors?.zipCode}
					style={{ width: '120px', cursor: 'pointer' }}
					readOnly
					onClick={handlePostCodeSearch}
				/>
				<Button variant="contained" onClick={handlePostCodeSearch}>
					우편번호 찾기
				</Button>
			</Box>
			<TextInputComponent
				name={`${name}_road`}
				value={value.roadAddress || ''}
				onChange={(e) => onChange('roadAddress', e.target.value)}
				placeholder="도로명 주소"
				isInvalid={!!errors?.roadAddress}
				errorMessage={errors?.roadAddress}
				readOnly
			/>
			<TextInputComponent
				name={`${name}_detail`}
				value={value.detailAddress || ''}
				onChange={(e) => {
					onChange('detailAddress', e.target.value);
				}}
				placeholder="상세 주소"
				isInvalid={!!errors?.detailAddress}
				errorMessage={errors?.detailAddress}
			/>
		</Box>
	);
};
