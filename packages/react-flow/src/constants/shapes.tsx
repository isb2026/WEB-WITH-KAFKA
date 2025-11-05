import React from 'react';
import { ShapeConfig, ShapeKey } from '../types';

const S = 28; // icon size
const SW = 1.6; // stroke width used in screenshot
const common = {
	width: S,
	height: S,
	viewBox: '0 0 28 28',
	'aria-hidden': true,
} as const;

/** All icons: outline only (no fill), stroke = currentColor.
 *  Set color in the button via Tailwind (text-slate-400).
 */
export const SHAPE_CONFIGS: ShapeConfig[] = [
	{
		key: 'circle',
		label: 'circle',
		color: '#4caf50',
		icon: (
			<svg
				{...common}
				xmlns="http://www.w3.org/2000/svg"
				width="40"
				height="40"
				viewBox="0 0 48 48"
			>
				<circle
					cx="24"
					cy="24"
					r="20"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
				/>
			</svg>
		),
	},
	{
		key: 'roundRect',
		label: 'round-rectangle',
		color: '#61a6ff',
		icon: (
			<svg
				{...common}
				xmlns="http://www.w3.org/2000/svg"
				width="36"
				height="36"
				stroke-width="2"
				viewBox="0 0 1025 1024"
			>
				<path
					fill="currentColor"
					d="M768.694 1024h-512q-106 0-181-75t-75-181V256q0-106 75-181t181-75h512q106 0 181 75t75 181v512q0 106-75 181t-181 75zm192-768q0-80-56-136t-136-56h-512q-80 0-136 56t-56 136v512q0 80 56 136t136 56h512q80 0 136-56t56-136V256z"
				/>
			</svg>
		),
	},
	{
		key: 'rect',
		label: 'rectangle',
		color: '#4caf50',
		icon: (
			<svg
				{...common}
				xmlns="http://www.w3.org/2000/svg"
				width="34"
				height="34"
				viewBox="0 0 1024 1024"
			>
				<path
					fill="currentColor"
					d="M0 1024V0h1024v1024H0zM960 64H64v896h896V64z"
				/>
			</svg>
		),
	},
	{
		key: 'hexagon',
		label: 'hexagon',
		color: '#e56a54',
		icon: (
			<svg
				{...common}
				xmlns="http://www.w3.org/2000/svg"
				width="40"
				height="40"
				viewBox="0 0 1024 897"
			>
				<path
					fill="currentColor"
					d="M768 897H256L0 449L256 0h512l256 449zM736 64H288L64 449l224 384h448l224-384z"
				/>
			</svg>
		),
	},
	{
		key: 'diamond',
		label: 'diamond',
		color: '#f5b352',
		icon: (
			<svg
				{...common}
				xmlns="http://www.w3.org/2000/svg"
				width="36"
				height="36"
				viewBox="0 0 16 16"
			>
				<path
					fill="currentColor"
					d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.482 1.482 0 0 1 0-2.098L6.95.435zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"
				/>
			</svg>
		),
	},
	{
		key: 'arrowRect',
		label: 'arrow-rectangle',
		color: '#8f5de7',
		icon: (
			<svg
				fill="#000000"
				height="40px"
				width="40px"
				version="1.1"
				id="Layer_1"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 490.693 490.693"
				transform="rotate(270)"
			>
				<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
				<g
					id="SVGRepo_tracerCarrier"
					stroke-linecap="round"
					stroke-linejoin="round"
				></g>
				<g id="SVGRepo_iconCarrier">
					{' '}
					<g>
						{' '}
						<g>
							{' '}
							<path d="M405.399,0h-320c-5.867,0-10.667,4.8-10.667,10.667V320c0,2.88,1.173,5.547,3.093,7.573l160,160 c4.16,4.16,10.88,4.16,15.04,0l160-160c2.027-2.027,3.093-4.693,3.093-7.573V10.667C416.066,4.8,411.266,0,405.399,0z M394.732,315.627L245.399,464.96L96.066,315.627V21.333h298.667V315.627z"></path>{' '}
						</g>{' '}
					</g>{' '}
				</g>
			</svg>
		),
	},
	{
		key: 'cylinder',
		label: 'cylinder',
		color: '#4da0ff',
		icon: (
			<svg
				fill="#000000"
				height="38px"
				width="38px"
				version="1.1"
				id="Layer_1"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
			>
				<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
				<g
					id="SVGRepo_tracerCarrier"
					stroke-linecap="round"
					stroke-linejoin="round"
				></g>
				<g id="SVGRepo_iconCarrier">
					{' '}
					<g>
						{' '}
						<g>
							{' '}
							<path d="M425.621,38.187C414.763,1.216,272.789,0,256,0S97.237,1.216,86.379,38.187c-0.64,1.387-1.045,2.859-1.045,4.48v426.667 c0,1.621,0.405,3.093,1.045,4.48C97.237,510.784,239.211,512,256,512s158.763-1.216,169.621-38.187 c0.64-1.387,1.045-2.859,1.045-4.48V42.667C426.667,41.045,426.261,39.573,425.621,38.187z M256,21.333 c87.723,0,137.685,13.248,148.075,21.333C393.685,50.752,343.723,64,256,64S118.315,50.752,107.925,42.667 C118.315,34.581,168.277,21.333,256,21.333z M405.333,467.989c-6.101,7.851-56.448,22.677-149.333,22.677 c-93.995,0-144.619-15.211-149.333-21.333V65.429C149.312,84.544,242.603,85.333,256,85.333s106.688-0.789,149.333-19.904V467.989 z"></path>{' '}
						</g>{' '}
					</g>{' '}
				</g>
			</svg>
		),
	},
	{
		key: 'triangle',
		label: 'triangle',
		color: '#3f8cff',
		icon: (
			<svg
				{...common}
				xmlns="http://www.w3.org/2000/svg"
				width="36"
				height="36"
				viewBox="0 0 16 16"
			>
				<path
					fill="currentColor"
					d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016a.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06a.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017a.163.163 0 0 1-.054-.06a.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"
				/>
			</svg>
		),
	},
	{
		key: 'parallelogram',
		label: 'parallelogram',
		color: '#8f5de7',
		icon: (
			<svg
				{...common}
				xmlns="http://www.w3.org/2000/svg"
				width="40"
				height="40"
				viewBox="0 0 256 256"
			>
				<path
					fill="currentColor"
					d="M243.75 48.4A14 14 0 0 0 232 42H88.81A14 14 0 0 0 76 50.25l-64.8 144A14 14 0 0 0 24 214h143.19a14 14 0 0 0 12.81-8.25l64.8-144a14 14 0 0 0-1.05-13.35Zm-9.93 8.42l-64.8 144a2 2 0 0 1-1.83 1.18H24a2 2 0 0 1-1.83-2.82L87 55.18A2 2 0 0 1 88.81 54H232a2 2 0 0 1 1.83 2.82Z"
				/>
			</svg>
		),
	},
	{
		key: 'plus',
		label: 'plus',
		color: '#e56a54',
		icon: (
			<svg
				{...common}
				xmlns="http://www.w3.org/2000/svg"
				width="44"
				height="44"
				viewBox="0 0 72 72"
			>
				<path
					fill="transparent"
					d="M31 31V13h10v18h18v10H41v18H31V41H13V31z"
				/>
				<path
					fill="none"
					stroke="#000"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-miterlimit="10"
					stroke-width="2"
					d="M31 31V13h10v18h18v10H41v18H31V41H13V31z"
				/>
			</svg>
		),
	},
];

export const DEFAULT_NODE_SIZES: Record<ShapeKey, React.CSSProperties> = {
	roundRect: { width: 160, height: 54 },
	rect: { width: 140, height: 64 },
	circle: { width: 90, height: 90 },
	diamond: { width: 120, height: 120 },
	hexagon: { width: 160, height: 64 },
	parallelogram: { width: 170, height: 64 },
	triangle: { width: 140, height: 110 },
	cylinder: { width: 160, height: 120 },
	arrowRect: { width: 200, height: 64 },
	plus: { width: 110, height: 110 },
};
