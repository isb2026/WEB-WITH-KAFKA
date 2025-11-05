export const makeRowNumberRenderer = (page: number, pageSize: number) => {
	return class CustomRowNumberRenderer {
		el: HTMLSpanElement;

		constructor(props: any) {
			this.el = document.createElement('span');
			this.render(props);
		}

		getElement() {
			return this.el;
		}

		render(props: any) {
			const { rowKey } = props;
			const index = (page - 1) * pageSize + rowKey + 1;
			this.el.innerHTML = `${index}`;
		}
	};
};
