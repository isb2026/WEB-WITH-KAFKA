import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { fetchBusinessStatus } from '@moornmo/utils/businessAPI';

export const BusinessChecker = () => {
	const [input, setInput] = useState('');
	const [result, setResult] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	const handleCheck = async () => {
		if (!input || input.length !== 10) {
			alert(
				'Please enter a valid 10-digit business registration number.'
			);
			return;
		}

		setLoading(true);
		try {
			const res = await fetchBusinessStatus(input);
			setResult(res);
		} catch (e) {
			alert('Something went wrong. See console.');
		}
		setLoading(false);
	};

	return (
		<div style={{ padding: '2rem', maxWidth: '600px' }}>
			<h2>사업자등록번호 상태조회</h2>
			<input
				type="text"
				value={input}
				placeholder="사업자번호 (10자리 숫자)"
				onChange={(e) => setInput(e.target.value)}
				style={{ padding: '8px', width: '100%', marginBottom: '12px' }}
			/>
			<button onClick={handleCheck} disabled={loading}>
				{loading ? '조회중...' : '조회하기'}
			</button>

			{result && (
				<div style={{ marginTop: '20px' }}>
					<h4>결과:</h4>
					<pre>{JSON.stringify(result, null, 2)}</pre>
				</div>
			)}
		</div>
	);
};
