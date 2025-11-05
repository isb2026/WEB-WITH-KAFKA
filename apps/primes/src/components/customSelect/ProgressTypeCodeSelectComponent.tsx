import React, { useEffect, useState, useRef, useId, useMemo } from 'react';
import { flushSync } from 'react-dom';
import {
	ChevronsUpDown,
	Check,
	X,
	Plus,
	Save,
	X as CloseIcon,
} from 'lucide-react';
import { useCodeFieldQuery } from '@primes/hooks/init/code/useCodeFieldQuery';
import { useCode } from '@primes/hooks';
import { useCreateCode } from '@primes/hooks/init/code/useCreateCode';
import { useCreateCodeGroup } from '@primes/hooks/init/code/useCreateCodeGroup';

interface ComboBoxItem {
	label: string;
	value: string;
}

interface ProgressTypeCodeSelectProps {
	placeholder?: string;
	fieldKey?: string;
	onChange?: (e: any) => void;
	onDataChange?: (data: { code: string; name: string }) => void;
	className?: string;
	value: any;
	disabled?: boolean;
	valueKey?: string;
	labelKey?: string;
	error?: boolean;
}

export const ProgressTypeCodeSelectComponent: React.FC<
	ProgressTypeCodeSelectProps
> = ({
	fieldKey,
	placeholder,
	onChange,
	onDataChange,
	className = 'focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200',
	value,
	disabled,
	valueKey = 'codeValue',
	labelKey = 'codeName',
	error = false,
}) => {
	const uid = useId();
	const rootRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

	// Code data and options
	const { data, refetch } = useCodeFieldQuery(fieldKey ?? '');
	const [options, setOptions] = useState<ComboBoxItem[]>([]);

	// ComboBox state
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState<string>('');
	const [selectedItem, setSelectedItem] = useState<ComboBoxItem | null>(null);
	const [activeIndex, setActiveIndex] = useState<number>(-1);
	const [isComposing, setIsComposing] = useState(false);

	// Modal state
	const [showAddCodeForm, setShowAddCodeForm] = useState(false);
	const [newCodeName, setNewCodeName] = useState('');
	const [newCodeDescription, setNewCodeDescription] = useState('');
	const [isCreatingCode, setIsCreatingCode] = useState(false);

	// CRITICAL FIX: Use ref to prevent state conflicts
	const formStateRef = useRef({ isOpen: false, clickCount: 0 });

	// Get code data for parent selection
	const { list } = useCode();
	const { mutate: createCode } = useCreateCode();
	const { mutate: createCodeGroup } = useCreateCodeGroup();

	// Update options when data changes
	useEffect(() => {
		if (data) {
			const newOptions = data.map((d: any) => ({
				label: d[labelKey],
				value: d[valueKey],
			}));
			setOptions(newOptions);

			// Set selected item based on current value
			if (value) {
				// Try to find by value first (code value)
				let found = newOptions.find(
					(opt: ComboBoxItem) => opt.value === value
				);

				// If not found by value, try to find by label (display name)
				if (!found) {
					found = newOptions.find(
						(opt: ComboBoxItem) => opt.label === value
					);
				}

				setSelectedItem(found || null);
				setQuery(found?.label || '');
			} else {
				setSelectedItem(null);
				setQuery('');
			}
		}
	}, [data, value, labelKey, valueKey]);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return options;
		return options.filter((it) => it.label.toLowerCase().includes(q));
	}, [options, query]);

	// Close on outside click
	useEffect(() => {
		const onDocMouseDown = (e: MouseEvent) => {
			if (!rootRef.current?.contains(e.target as Node)) {
				// Don't close if user might want to add code
				if (query.trim() && filtered.length === 0 && !showAddCodeForm) {
					return;
				}
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', onDocMouseDown);
		return () => document.removeEventListener('mousedown', onDocMouseDown);
	}, [query, filtered.length, showAddCodeForm]);

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
	}, [filtered.length, open]);

	// Keep ref in sync with showAddCodeForm state
	useEffect(() => {
		formStateRef.current.isOpen = showAddCodeForm;
	}, [showAddCodeForm]);

	// Sync display when form value changes externally
	useEffect(() => {
		if (value && options.length > 0) {
			// Try multiple matching strategies
			let foundOption = options.find((opt) => opt.value === value);
			if (!foundOption) {
				foundOption = options.find((opt) => opt.label === value);
			}
			if (!foundOption) {
				foundOption = options.find(
					(opt) => opt.label?.toLowerCase() === value?.toLowerCase()
				);
			}

			if (
				foundOption &&
				(!selectedItem || selectedItem.value !== foundOption.value)
			) {
				setQuery(foundOption.label);
				setSelectedItem(foundOption);
				setOpen(false);
			} else if (!foundOption) {
				// If we can't find the option, show the value anyway
				setQuery(value);
				setSelectedItem(null);
			}
		} else if (!value) {
			setQuery('');
			setSelectedItem(null);
		}
	}, [value, options, selectedItem]);

	function select(item: ComboBoxItem) {
		// Ensure any IME/native composition is committed before we set state
		flushSync(() => {
			if (document.activeElement === inputRef.current) {
				inputRef.current?.blur();
			}
		});
		// Now write controlled state atomically
		flushSync(() => {
			setSelectedItem(item);
			setQuery(item.label);
			setOpen(false);
		});

		if (onChange) {
			onChange(item.value);
		}

		// 추가: 코드와 이름을 함께 전달
		if (onDataChange) {
			onDataChange({
				code: item.value,
				name: item.label,
			});
		}
	}

	// Clear selected value + open list
	function clearSelection() {
		flushSync(() => {
			setSelectedItem(null);
			setQuery('');
			setOpen(true);
			setActiveIndex(0);
		});
		onChange?.('');

		// 추가: 클리어 시에도 콜백 호출
		if (onDataChange) {
			onDataChange({
				code: '',
				name: '',
			});
		}

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
			} else if (query.trim() && !open) {
				// FALLBACK: If user typed something and pressed Enter, use it as value
				e.preventDefault();
				console.log('🔍 Enter pressed with query value:', query.trim());
				onChange?.(query.trim());
				setOpen(false);
			}
		} else if (e.key === 'Escape') {
			setOpen(false);
			if (selectedItem) setQuery(selectedItem.label); // restore committed value
		}
	}

	const handleCancelAddCode = () => {
		formStateRef.current.isOpen = false;
		setShowAddCodeForm(false);
		setNewCodeName('');
		setNewCodeDescription('');
	};

	const handleCreateCode = async () => {
		if (!newCodeName.trim()) return;

		if (isCreatingCode) return;

		setIsCreatingCode(true);

		try {
			if (!list.data || list.data.length === 0) {
				throw new Error(
					'No code groups available. Please wait for groups to load or refresh the page.'
				);
			}

			// Find the target group
			let targetGroup = list.data?.find(
				(group: any) =>
					group.groupCode === 'PRD' ||
					group.groupCode === '002' ||
					group.groupName?.toLowerCase().includes('process') ||
					group.id === 2
			);

			if (!targetGroup) {
				throw new Error(
					'No appropriate code group found for process types.'
				);
			}

			const payload = {
				codeGroupId: targetGroup.id,
				codeName: newCodeName.trim(),
				description: newCodeDescription.trim(),
			};

			// Create the code
			const createResponse = await new Promise((resolve, reject) => {
				createCode(
					{ data: payload },
					{
						onSuccess: (response) => resolve(response),
						onError: (error) => reject(error),
					}
				);
			});

			// Wait for backend processing
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Refetch data
			const refreshedData = await refetch();

			if (refreshedData.data) {
				const newOptions = refreshedData.data.map((d: any) => ({
					label: d[labelKey],
					value: d[valueKey],
				}));
				setOptions(newOptions);

				// Find the newly created code
				const newCodeData = refreshedData.data.find((d: any) => {
					const searchName = newCodeName.trim();
					const codeName = d[labelKey];
					const codeNameAlt = d.codeName;

					return (
						codeName === searchName ||
						codeNameAlt === searchName ||
						codeName?.toLowerCase() === searchName.toLowerCase() ||
						codeNameAlt?.toLowerCase() === searchName.toLowerCase()
					);
				});

				if (newCodeData) {
					const newItem = {
						label: newCodeData[labelKey],
						value: newCodeData[valueKey],
					};

					// Auto-select the newly created code
					select(newItem);
					setQuery(newItem.label);
					setSelectedItem(newItem);
					setOpen(false);

					// Call onChange to update form
					if (onChange) {
						onChange(newItem.value);

						// Additional calls to ensure form processing
						setTimeout(() => onChange(newItem.value), 50);
						setTimeout(() => {
							onChange(newItem.value);
							setQuery(newItem.label);
							setSelectedItem(newItem);
						}, 200);
					}
				} else {
					// Fallback search
					const fallbackCode = refreshedData.data.find((d: any) => {
						const searchName = newCodeName.trim().toLowerCase();
						const codeName = (d[labelKey] || '').toLowerCase();
						const codeNameAlt = (d.codeName || '').toLowerCase();

						return (
							codeName.includes(searchName) ||
							codeNameAlt.includes(searchName) ||
							searchName.includes(codeName) ||
							searchName.includes(codeNameAlt)
						);
					});

					if (fallbackCode) {
						const fallbackItem = {
							label: fallbackCode[labelKey],
							value: fallbackCode[valueKey],
						};
						select(fallbackItem);

						if (onChange) {
							onChange(fallbackItem.value);
							setTimeout(() => {
								onChange(fallbackItem.value);
								setQuery(fallbackItem.label);
								setSelectedItem(fallbackItem);
								setOpen(false);
							}, 150);
						}
					} else {
						// Use typed value as fallback
						setQuery(newCodeName.trim());
						if (onChange) {
							onChange(newCodeName.trim());
						}
					}
				}
			}

			// Close form on success
			setOpen(false);
			setShowAddCodeForm(false);
			setNewCodeName('');
			setNewCodeDescription('');
		} catch (error: any) {
			console.error('Failed to create code:', error);
			// Keep form open on error for retry
		} finally {
			setIsCreatingCode(false);
			formStateRef.current.isOpen = false;
		}
	};

	return (
		<>
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
						onBlur={(e) => {
							// Use setTimeout to allow clicking on Add Code button
							setTimeout(() => {
								// Check if user clicked on Add Code button or form
								if (showAddCodeForm) {
									return;
								}

								// Don't close dropdown if there are no matches and user might want to add code
								if (
									query.trim() &&
									!selectedItem &&
									filtered.length === 0
								) {
									// Keep dropdown open so user can see "Add Code" button
									setOpen(true);
									return;
								}

								// FALLBACK: If user typed something and blurred, use it as value
								if (query.trim() && !selectedItem) {
									onChange?.(query.trim());
								}
							}, 100); // Small delay to allow button clicks
						}}
						onKeyDown={handleKeyDown}
						ref={inputRef}
						placeholder={placeholder}
						disabled={!!disabled}
					/>

					<div
						className="absolute top-1/2 end-1 -translate-y-1/2 flex items-center"
						aria-hidden="true"
					>
						{!disabled && (selectedItem || query) && (
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
					className="absolute z-50 w-full max-h-72 p-1 mt-1 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700 shadow-sm"
					style={{ display: open ? 'block' : 'none' }}
					role="listbox"
					id={`${uid}-listbox`}
				>
					{filtered.map((item, idx) => {
						const isSelected = selectedItem?.value === item.value;
						const isActive = idx === activeIndex;

						return (
							<div
								key={item.value}
								className={`cursor-pointer py-2 px-4 w-full text-sm text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800 ${isActive ? 'bg-gray-100 dark:bg-neutral-800' : ''}`}
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
										className={`shrink-0 size-3.5 text-Colors-Brand-500 dark:text-Colors-Brand-300 ${!isSelected ? 'invisible' : ''}`}
									/>
								</div>
							</div>
						);
					})}
					{/* IMPROVED: Always show "Add Code" when no results, regardless of loading state */}
					{filtered.length === 0 && !showAddCodeForm && (
						<div className="py-2 px-2 text-sm text-center">
							<div className="text-gray-500 dark:text-neutral-400 mb-2">
								{!list.data || list.data.length === 0
									? 'Loading code groups...'
									: query.trim()
										? `No results for "${query}"`
										: 'No codes available'}
							</div>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();

									if (
										!formStateRef.current.isOpen &&
										!isCreatingCode &&
										!showAddCodeForm
									) {
										formStateRef.current.isOpen = true;
										setShowAddCodeForm(true);
										setNewCodeName(query.trim());
										setNewCodeDescription('');
									}
								}}
								onMouseDown={(e) => {
									e.preventDefault(); // Prevent blur from input
									e.stopPropagation();
								}}
								onFocus={() => {
									setOpen(true); // Ensure dropdown stays open
								}}
								disabled={isCreatingCode || showAddCodeForm}
								className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-Colors-Brand-600 bg-Colors-Brand-50 border border-Colors-Brand-200 rounded-md hover:bg-Colors-Brand-100 hover:border-Colors-Brand-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								title={
									isCreatingCode
										? 'Creating code...'
										: showAddCodeForm
											? 'Form is open'
											: !list.data ||
												  list.data.length === 0
												? 'Add new code (will be available when groups load)'
												: 'Add new code'
								}
							>
								<Plus className="w-3 h-3" />
								{isCreatingCode
									? 'Creating...'
									: showAddCodeForm
										? 'Form Open'
										: 'Add Code'}
							</button>
						</div>
					)}

					{showAddCodeForm && (
						<div className="p-3 border-t border-gray-200 dark:border-neutral-700">
							<div className="space-y-2">
								<div>
									<input
										type="text"
										placeholder="Code Name"
										value={newCodeName}
										onChange={(e) =>
											setNewCodeName(e.target.value)
										}
										className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-Colors-Brand-500"
										autoFocus
									/>
								</div>
								<div>
									<input
										type="text"
										placeholder="Description (optional)"
										value={newCodeDescription}
										onChange={(e) =>
											setNewCodeDescription(
												e.target.value
											)
										}
										className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-Colors-Brand-500"
									/>
								</div>
								<div className="flex gap-2 justify-end">
									<button
										type="button"
										onClick={handleCancelAddCode}
										className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1"
									>
										<CloseIcon className="size-3" /> Cancel
									</button>
									<button
										type="button"
										onClick={handleCreateCode}
										disabled={
											!newCodeName.trim() ||
											isCreatingCode ||
											!list.data ||
											list.data.length === 0
										}
										className="px-2 py-1 text-xs bg-Colors-Brand-600 text-white rounded hover:bg-Colors-Brand-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
										title={
											!list.data || list.data.length === 0
												? 'Code groups not loaded'
												: !newCodeName.trim()
													? 'Enter a code name'
													: isCreatingCode
														? 'Creating code...'
														: 'Create new code'
										}
									>
										<Save className="size-3" />
										{isCreatingCode
											? 'Creating...'
											: 'Create'}
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
};
