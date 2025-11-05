import { blackA, green, mauve, violet } from '@radix-ui/colors';
import plugin from 'tailwindcss';

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./src/**/*.{js,ts,jsx,tsx}',
		'../../packages/radix-ui/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				...blackA,
				...green,
				...mauve,
				...violet,
			},
		},
	},
	// darkMode: 'class',

	// 여기에 실제로 사용하는 클래스명을 safelist에 명시해야 Vite + Tailwind가 제거하지 않음
	safelist: [
		'data-[state=active]:text-violet11',
		'data-[state=active]:shadow-current',
		'data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]',
	],
	plugins: [require('tailwind-scrollbar')],
};
