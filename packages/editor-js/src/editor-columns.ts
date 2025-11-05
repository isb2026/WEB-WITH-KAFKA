import { v4 as uuidv4 } from 'uuid';
import TwoColumnIcon from './icons/two-columns-icon.svg';
import ThreeColumnIcon from './icons/three-columns-icon.svg';
import FourColumnIcon from './icons/four-columns-icon.svg';
import FiveColumnIcon from './icons/five-columns-icon.svg';

interface EditorJsColumnsData {
	cols: any[];
	numberOfColumns?: number;
}

interface EditorJsColumnsConfig {
	EditorJsLibrary: any;
	tools: any;
}

interface EditorJsColumnsConstructor {
	data: EditorJsColumnsData;
	config?: EditorJsColumnsConfig;
	api: any;
	readOnly: boolean;
}

class EditorJsColumns {
	static get enableLineBreaks(): boolean {
		return true;
	}

	static get isReadOnlySupported(): boolean {
		return true;
	}

	private api: any;
	private readOnly: boolean;
	private config: EditorJsColumnsConfig;
	private _CSS: any;
	private _data: EditorJsColumnsData;
	private editors: any[];
	private colWrapper: HTMLDivElement | undefined;
	private numberOfColumns: number;

	constructor({
		data,
		config = { EditorJsLibrary: null, tools: {} },
		api,
		readOnly,
	}: EditorJsColumnsConstructor) {
		this.api = api;
		this.readOnly = readOnly;
		this.config = config || { EditorJsLibrary: null, tools: {} };

		this._CSS = {
			block: this.api.styles.block,
			wrapper: 'ce-editorjsColumns_wrapper',
			column: 'ce-editorjsColumns_col',
		};

		// Initialize data - fix the data structure
		this._data = data || { cols: [] };
		this.numberOfColumns = this._data.numberOfColumns || 2;
		this.editors = [];
		this.colWrapper = undefined;

		// Ensure we have the right number of columns in data
		if (!Array.isArray(this._data.cols)) {
			this._data.cols = [];
		}

		while (this._data.cols.length < this.numberOfColumns) {
			this._data.cols.push({ blocks: [] });
		}

		// Remove excess columns if any
		if (this._data.cols.length > this.numberOfColumns) {
			this._data.cols = this._data.cols.slice(0, this.numberOfColumns);
		}
	}

	get CSS() {
		return {
			settingsButton: this.api.styles.settingsButton,
			settingsButtonActive: this.api.styles.settingsButtonActive,
		};
	}

	async _updateColumns(num: number) {
		// Enforce limits
		if (num < 2) num = 2; // Minimum 2 columns
		if (num > 5) num = 5; // Maximum 5 columns

		if (num === this.numberOfColumns) return;

		// Save current data before updating
		await this.save();

		if (num < this.numberOfColumns) {
			// Reducing columns - confirm with user
			const columnsToRemove = this.numberOfColumns - num;
			const shouldProceed = confirm(
				`This will remove ${columnsToRemove} column${columnsToRemove > 1 ? 's' : ''} and their content. Continue?`
			);

			if (!shouldProceed) return;

			// Remove excess columns
			this._data.cols = this._data.cols.slice(0, num);
		} else {
			// Adding columns - add empty columns
			while (this._data.cols.length < num) {
				this._data.cols.push({ blocks: [] });
			}
		}

		this.numberOfColumns = num;
		this._data.numberOfColumns = num;
		await this._rerender();
	}

	async _rerender() {
		// Destroy existing editors
		this.editors.forEach((editor) => {
			try {
				if (editor && typeof editor.destroy === 'function') {
					editor.destroy();
				}
			} catch (e) {
				console.warn('Error destroying editor:', e);
			}
		});
		this.editors = [];

		if (this.colWrapper) {
			this.colWrapper.innerHTML = '';
			await this._createColumns();
		}
	}

	async _createColumns() {
		if (!this.colWrapper || !this.config.EditorJsLibrary) return;

		const createPromises: Promise<any>[] = [];

		// Calculate equal width for each column
		const columnWidth = `${100 / this.numberOfColumns}%`;

		for (let i = 0; i < this.numberOfColumns; i++) {
			const col = document.createElement('div');
			col.classList.add(this._CSS.column);

			// Set equal width for each column
			col.style.cssText = `
				width: ${columnWidth};
				flex: 0 0 ${columnWidth};
				min-width: 0;
			`;

			const colId = `col-${uuidv4()}`;
			col.id = colId;

			this.colWrapper.appendChild(col);

			// Create editor instance promise
			const createEditor = async () => {
				try {
					const editorConfig = {
						holder: colId,
						tools: this.config.tools || {},
						data: this._data.cols[i] || { blocks: [] },
						readOnly: this.readOnly,
						minHeight: 50,
						placeholder: `Type here...`,
					};

					const instance = new this.config.EditorJsLibrary(
						editorConfig
					);

					// Wait for editor to be ready
					await instance.isReady;
					this.editors[i] = instance;

					return instance;
				} catch (error) {
					console.error(
						`Error creating editor for column ${i}:`,
						error
					);

					// Create a fallback content area
					const fallback = document.createElement('div');
					fallback.contentEditable = 'true';
					fallback.style.cssText = `
            width: 100%;
            min-height: 100px;
            border: 1px solid #ccc;
            padding: 10px;
            border-radius: 4px;
            outline: none;
          `;
					fallback.setAttribute(
						'data-placeholder',
						`Column ${i + 1} (fallback mode)`
					);

					const colElement = document.getElementById(colId);
					if (colElement) {
						colElement.appendChild(fallback);
					}

					return null;
				}
			};

			createPromises.push(createEditor());
		}

		// Wait for all editors to be created
		await Promise.all(createPromises);
	}

	render(): HTMLElement {
		this.colWrapper = document.createElement('div');
		this.colWrapper.classList.add(this._CSS.wrapper);

		// Add inline styles to ensure proper layout
		this.colWrapper.style.cssText = `
      display: flex;
      width: 100%;
      gap: 12px;
      margin: 10px 0;
      min-height: 120px;
    `;

		// Prevent event bubbling issues
		this.colWrapper.addEventListener(
			'paste',
			(event) => {
				event.stopPropagation();
			},
			true
		);

		this.colWrapper.addEventListener('keydown', (event) => {
			// Allow normal editing within columns
			if (event.target !== this.colWrapper) {
				return;
			}

			if (['Enter', 'Tab'].includes(event.key)) {
				event.preventDefault();
				event.stopPropagation();
			}
		});

		// Create columns immediately
		this._createColumns().catch(console.error);

		return this.colWrapper;
	}

	async save(): Promise<EditorJsColumnsData> {
		if (!this.readOnly && this.editors.length > 0) {
			const savedCols: { blocks: any[] }[] = [];

			for (let i = 0; i < this.editors.length; i++) {
				try {
					if (
						this.editors[i] &&
						typeof this.editors[i].save === 'function'
					) {
						const columnData = await this.editors[i].save();
						savedCols.push(columnData);
					} else {
						// Fallback for missing editors
						savedCols.push(this._data.cols[i] || { blocks: [] });
					}
				} catch (error) {
					console.error(`Error saving column ${i}:`, error);
					savedCols.push(this._data.cols[i] || { blocks: [] });
				}
			}

			this._data.cols = savedCols;
		}

		return {
			cols: this._data.cols,
			numberOfColumns: this.numberOfColumns,
		};
	}

	static get toolbox() {
		return [
			{
				// 2 Columns - Clean columns with proper spacing
				icon: `<img src="${TwoColumnIcon}" alt="2 columns" />`,
				title: '2 Columns',
				data: {
					numberOfColumns: 2,
					cols: [{ blocks: [] }, { blocks: [] }],
				},
			},
			{
				// 3 Columns - Evenly spaced columns
				icon: `<img src="${ThreeColumnIcon}" alt="3 columns" />`,
				title: '3 Columns',
				data: {
					numberOfColumns: 3,
					cols: [{ blocks: [] }, { blocks: [] }, { blocks: [] }],
				},
			},
			{
				// 4 Columns - Compact but readable
				icon: `<img src="${FourColumnIcon}" alt="4 columns" />`,
				title: '4 Columns',
				data: {
					numberOfColumns: 4,
					cols: [
						{ blocks: [] },
						{ blocks: [] },
						{ blocks: [] },
						{ blocks: [] },
					],
				},
			},
			{
				// 5 Columns - Maximum density while maintaining clarity
				icon: `<img src="${FiveColumnIcon}" alt="5 columns" />`,
				title: '5 Columns',
				data: {
					numberOfColumns: 5,
					cols: [
						{ blocks: [] },
						{ blocks: [] },
						{ blocks: [] },
						{ blocks: [] },
						{ blocks: [] },
					],
				},
			},
		];
	}

	// Add validation method
	validate(savedData: EditorJsColumnsData): boolean {
		return savedData && Array.isArray(savedData.cols);
	}

	// Add destroy method for cleanup
	destroy() {
		this.editors.forEach((editor) => {
			try {
				if (editor && typeof editor.destroy === 'function') {
					editor.destroy();
				}
			} catch (e) {
				console.warn('Error in destroy:', e);
			}
		});
		this.editors = [];

		if (this.colWrapper) {
			this.colWrapper.innerHTML = '';
		}
	}

	// Add method to handle block focus
	onFocus() {
		// Handle focus events if needed
	}
}

export default EditorJsColumns;
