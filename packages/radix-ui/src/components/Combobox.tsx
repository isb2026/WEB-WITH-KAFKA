import React, { useEffect, useMemo, useRef, useState, useId } from 'react';
import { flushSync } from 'react-dom';
import { ChevronsUpDown, Check, X } from 'lucide-react';

// Options only
export interface ComboBoxItem {
	label: string;
	value: string;
}

export interface ComboBoxProps {
	items: ComboBoxItem[];
	value?: ComboBoxItem | null;
	onChange?: (item: ComboBoxItem | null) => void;
	placeholder?: string;
	notFoundText?: string;
	disabled?: boolean;
	error?: boolean;
	className?: string;
}

export function ComboBox({
	items,
	value,
	onChange,
	placeholder = 'Select & Select',
	notFoundText = 'No results',
	disabled,
	error = false,
	className = '',
}: ComboBoxProps) {
	const uid = useId();
	const rootRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState<string>(value?.label ?? '');
	const [internal, setInternal] = useState<ComboBoxItem | null>(
		value ?? null
	);
	const selected = (value ?? internal) as ComboBoxItem | null;
	const [activeIndex, setActiveIndex] = useState<number>(-1);
	const [isComposing, setIsComposing] = useState(false);

	// Keep internal state in sync with controlled value
	useEffect(() => {
		setInternal(value ?? null);
		setQuery(value?.label ?? '');
	}, [value]);

	// Validate selected item when items change
	useEffect(() => {
		if (!selected) return;

		// Check if the selected item still exists in the new items
		const itemExists = items.some((item) => item.value === selected.value);

		if (!itemExists) {
			// Clear selection if the selected item no longer exists
			setInternal(null);
			setQuery('');
			onChange?.(null);
		}
	}, [items, selected, onChange]);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return items;
		return items.filter(
			(it) => it.label && it.label.toLowerCase().includes(q)
		);
	}, [items, query]);

	// Close on outside click
	useEffect(() => {
		const onDocMouseDown = (e: MouseEvent) => {
			if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener('mousedown', onDocMouseDown);
		return () => document.removeEventListener('mousedown', onDocMouseDown);
	}, []);

	// Keep the active option in view
	useEffect(() => {
		if (!open || activeIndex < 0) return;
		itemRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
	}, [activeIndex, open]);

	// Keep activeIndex valid when the list size changes
	useEffect(() => {
		if (!open) return;
		setActiveIndex((i) =>
			filtered.length ? Math.min(i, filtered.length - 1) : -1
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filtered.length, open]);

	// Reset activeIndex when items change significantly
	useEffect(() => {
		if (!open) return;
		setActiveIndex(0);
	}, [items, open]);

	function select(item: ComboBoxItem) {
		// Ensure any IME/native composition is committed before we set state
		flushSync(() => {
			if (document.activeElement === inputRef.current) {
				inputRef.current?.blur();
			}
		});
		// Now write controlled state atomically
		flushSync(() => {
			setInternal(item);
			setQuery(item.label);
			setOpen(false);
		});
		onChange?.(item);
	}

	// ⬇️ New: clear selected value + open list
	function clearSelection() {
		flushSync(() => {
			setInternal(null);
			setQuery('');
			setOpen(true);
			setActiveIndex(0);
		});
		onChange?.(null);
		inputRef.current?.focus();
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (isComposing) return; // don't act on keys during IME composition

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (!open) {
				setOpen(true);
				setActiveIndex(0);
				return;
			}
			setActiveIndex((i) => {
				const next = i < filtered.length - 1 ? i + 1 : 0;
				return filtered.length ? next : -1;
			});
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (!open) {
				setOpen(true);
				setActiveIndex(filtered.length - 1);
				return;
			}
			setActiveIndex((i) => {
				const prev = i > 0 ? i - 1 : Math.max(filtered.length - 1, -1);
				return filtered.length ? prev : -1;
			});
		} else if (e.key === 'Enter') {
			if (open && activeIndex >= 0 && filtered[activeIndex]) {
				e.preventDefault();
				select(filtered[activeIndex]);
			}
		} else if (e.key === 'Escape') {
			setOpen(false);
			if (selected) setQuery(selected.label); // restore committed value
		}
	}

	return (
		<div className="relative" ref={rootRef}>
			<div className="relative">
				<input
					className={`py-2 ps-2 pe-10 block w-full border rounded sm:text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:text-neutral-400 focus:outline-none focus:ring-1 ${
						error
							? 'border-red-300 focus:border-red-500 focus:ring-red-200 placeholder-red-400 dark:border-red-600'
							: 'border-gray-200 focus:border-Colors-Brand-500 focus:ring-Colors-Brand-200 placeholder-gray-500 dark:border-neutral-700'
					} ${className}`}
					type="text"
					role="combobox"
					aria-expanded={open}
					aria-haspopup="listbox"
					aria-controls={`${uid}-listbox`}
					aria-activedescendant={
						open && activeIndex >= 0
							? `${uid}-option-${activeIndex}`
							: undefined
					}
					aria-autocomplete="list"
					autoComplete="off"
					onCompositionStart={() => setIsComposing(true)}
					onCompositionEnd={(e) => {
						setIsComposing(false);
						setQuery(e.currentTarget.value);
					}}
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setOpen(true);
						setActiveIndex(0);
					}}
					onFocus={() => setOpen(true)}
					onKeyDown={handleKeyDown}
					ref={inputRef}
					placeholder={placeholder}
					disabled={!!disabled}
				/>

				<div
					className="absolute top-1/2 end-1 -translate-y-1/2 flex items-center"
					aria-hidden="true"
				>
					{!disabled && (selected || query) && (
						<div
							role="button"
							aria-label="Clear selection"
							title="Clear"
							tabIndex={0}
							className="p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
							onMouseDown={(e) => e.preventDefault()}
							onClick={clearSelection}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									clearSelection();
								}
							}}
						>
							<X className="shrink-0 size-3.5 text-gray-500 dark:text-neutral-500" />
						</div>
					)}

					<div
						className="p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
						role="button"
						aria-expanded={open}
						aria-label="Toggle options"
						onMouseDown={(e) => {
							e.preventDefault();
							setOpen((o) => !o);
							if (!open) setActiveIndex(0);
						}}
						tabIndex={0}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								setOpen((o) => !o);
								if (!open) setActiveIndex(0);
							}
						}}
					>
						<ChevronsUpDown className="shrink-0 size-3.5 text-gray-500 dark:text-neutral-500" />
					</div>
				</div>
			</div>

			<div
				className="absolute z-50 w-full max-h-72 mt-1 p-1 bg-Colors-Brand-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-lg ring-1 ring-gray-950/5 dark:ring-black/20 overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
				style={{ display: open ? 'block' : 'none' }}
				role="listbox"
				id={`${uid}-listbox`}
			>
				{filtered.map((item, idx) => {
					const isSelected = selected?.value === item.value;
					const isActive = idx === activeIndex;

					return (
						<div
							key={item.value}
							className={`cursor-pointer py-2 px-4 w-full text-sm text-gray-800 hover:bg-white rounded-lg focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800 ${isActive ? 'bg-white dark:bg-neutral-800' : ''}`}
							role="option"
							tabIndex={-1}
							aria-selected={!!isSelected}
							id={`${uid}-option-${idx}`}
							ref={(el) => (itemRefs.current[idx] = el)}
							onMouseEnter={() => setActiveIndex(idx)}
							onMouseDown={(e) => e.preventDefault()} // keep focus; avoids native insertion
							onClick={() => select(item)}
						>
							<div className="flex justify-between items-center w-full">
								<span>{item.label}</span>
								<Check
									className={`shrink-0 size-3.5 text-Colors-Brand-500 dark:text-Colors-Brand-300 ${!isActive ? 'invisible' : ''}`}
								/>
							</div>
						</div>
					);
				})}
				{filtered.length === 0 && (
					<div className="py-2 px-2 text-sm text-center text-gray-500 dark:text-neutral-400">
						{notFoundText}
					</div>
				)}
			</div>
		</div>
	);
}
