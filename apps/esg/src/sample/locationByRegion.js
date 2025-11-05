// export const initIalLocationByRegion = [
// 	{
// 		group_id: 1,
// 		name: 'East and Southeast Asia',
// 		children: [
// 			{
// 				group_id: 2,
// 				type: 'group',
// 				children: [
// 					{
// 						type: 'group',
// 						group_id: 3,
// 						name: 'China',
// 						children: [
// 							{
// 								type: 'group',
// 								group_id: 5,
// 								name: 'Shandong Sheng',
// 								children: [
// 									{
// 										type: 'location',
// 										name: '운송회사',
// 										location_id: 1,
// 										children: [
// 											{
// 												type: 'account',
// 												name: '운송회사B_트럭',
// 												account_id: 1,
// 											},
// 										],
// 									},
// 								],
// 							},
// 							{
// 								type: 'group',
// 								group_id: 6,
// 								name: 'Shanghai',
// 								children: [],
// 							},
// 						],
// 					},
// 					{
// 						type: 'group',
// 						group_id: 4,
// 						name: 'South Korea',
// 						children: [
// 							{
// 								type: 'group',
// 								group_id: 7,
// 								name: 'Seoul',
// 								children: [
// 									{
// 										type: 'location',
// 										name: '운송회사',
// 										location_id: 2,
// 										children: [
// 											{
// 												type: 'account',
// 												name: '운송회사B_트럭',
// 												account_id: 2,
// 											},
// 										],
// 									},
// 								],
// 							},
// 							{
// 								type: 'group',
// 								group_id: 8,
// 								name: 'Incheon',
// 								children: [
// 									{
// 										type: 'location',
// 										name: '운송회사',
// 										location_id: 3,
// 										children: [
// 											{
// 												type: 'account',
// 												name: '운송회사B_트럭',
// 												account_id: 3,
// 											},
// 										],
// 									},
// 								],
// 							},
// 						],
// 					},
// 				],
// 			},
// 		],
// 	},
// ];
export const initIalLocationByRegion = [
	{
		location_id: 1,
		name: '계열사1',
		type: 'location',
		children: [
			{
				location_id: 2,
				name: '사업장A',
				type: 'location',
				children: [
					{
						type: 'account',
						name: '트럭A',
						account_id: 1,
					},
					{
						type: 'account',
						name: '트럭B',
						account_id: 2,
					},
					{
						type: 'account',
						name: '트럭C',
						account_id: 3,
					},
				],
			},
			{
				location_id: 3,
				name: '사업장B',
				type: 'location',
				children: [
					{
						type: 'account',
						name: '트럭A',
						account_id: 4,
					},
					{
						type: 'account',
						name: '트럭B',
						account_id: 5,
					},
					{
						type: 'account',
						name: '트럭C',
						account_id: 6,
					},
				],
			},
		],
	},
];
