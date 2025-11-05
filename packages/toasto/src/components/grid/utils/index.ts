import { makeRowNumberRenderer } from '../elements';

export const makeRowHeaders = (rows: any[], page: number, pageSize: number) => {
	if (rows.length > 0) {
		let result = rows.map((row) => {
			if (typeof row == 'object') {
				if (row.type == 'rowNum') {
					return {
						type: 'rowNum',
						renderer: {
							type: makeRowNumberRenderer(page, pageSize),
						},
					};
				} else {
					return row;
				}
			} else {
				if (row == 'rowNum') {
					return {
						type: 'rowNum',
						renderer: {
							type: makeRowNumberRenderer(page, pageSize),
						},
					};
				} else if (row == 'checkbox') {
					return {
						type: 'checkbox',
					};
				}
			}
		});
		return result;
	} else {
		return [];
	}
};
